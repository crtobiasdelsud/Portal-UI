'use client'
import { useRef, useState, useEffect } from 'react'
import { useAdapters } from '../../adapters/AdaptersContext.jsx'
import styles from './Banner.module.scss'

/*
 * Banner dimensions (always fluid: maxWidth + aspectRatio, never fixed px):
 *   horizontal → 970 × 180  (leaderboard)
 *   vertical   → 300 × 600  (skyscraper)
 *
 * Mode priority:
 *   vertical  → siempre vertical
 *   horizontal (o sin tipo) → horizontal si contenedor ≥ 480px, sino vertical
 *
 * Carga diferida: la media (que puede ser un GIF de varios MB) NO se descarga
 * en el render inicial. Recién se monta cuando el banner se acerca al viewport
 * (IntersectionObserver con rootMargin). Hasta que termina de cargar se ve un
 * preview (skeleton) y la media hace fade-in al estar lista.
 */

const MODES = {
  horizontal: { width: 970, height: 180 },
  vertical:   { width: 300, height: 600 },
}

// Distancia antes de entrar al viewport a la que se empieza a cargar la media.
const LAZY_ROOT_MARGIN = '400px'

function getMode(containerWidth, posicionImagen) {
  if (posicionImagen === 'vertical') return 'vertical'
  if (window.innerWidth < 768) return 'horizontal'
  return containerWidth >= 480 ? 'horizontal' : 'vertical'
}

function pickImage(mode, banner) {
  const h = banner.imagenHorizontal?.url ? banner.imagenHorizontal : null
  const v = banner.imagenVertical?.url   ? banner.imagenVertical   : null
  const g = banner.imagen?.url           ? banner.imagen           : null

  if (mode === 'vertical') return v ?? h ?? g
  return h ?? v ?? g
}

export default function BannerDisplay({ banner }) {
  const { fetcher } = useAdapters()
  const outerRef      = useRef(null)
  const impressionFired = useRef(false)
  const [mode, setMode] = useState(
    banner?.posicionImagen === 'vertical' ? 'vertical' : 'horizontal'
  )
  const [ready, setReady]   = useState(false)
  const [near, setNear]     = useState(false)   // banner cerca del viewport → cargar media
  const [loaded, setLoaded] = useState(false)   // media pesada ya descargada

  useEffect(() => {
    if (!outerRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      setMode(getMode(entry.contentRect.width, banner?.posicionImagen))
      setReady(true)
    })
    obs.observe(outerRef.current)
    return () => obs.disconnect()
  }, [banner?.posicionImagen])

  // Carga diferida: dispara la descarga de la media cuando el banner se acerca
  // al viewport. Mientras tanto sólo se ve el preview (skeleton).
  useEffect(() => {
    if (!outerRef.current || near) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: LAZY_ROOT_MARGIN }
    )
    io.observe(outerRef.current)
    return () => io.disconnect()
  }, [near])

  // Impresión: se dispara cuando el banner entra al viewport por primera vez
  useEffect(() => {
    if (!banner?.id || !outerRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !impressionFired.current) {
          impressionFired.current = true
          fetcher(`/api/portal/banners/${banner.id}/track`, {
            method: 'POST',
            body: JSON.stringify({ tipo: 'vista' }),
          }).catch(() => {})
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(outerRef.current)
    return () => io.disconnect()
  }, [banner?.id, fetcher])

  const cfg    = MODES[mode] ?? MODES.horizontal
  const imagen = pickImage(mode, banner)
  if (!imagen?.url) return null

  const url     = imagen.url
  const alt     = imagen.alt ?? banner.nombre ?? ''
  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(url)

  const slotStyle = {
    width: '100%',
    maxWidth: `${cfg.width}px`,
    aspectRatio: `${cfg.width} / ${cfg.height}`,
  }

  const destino = banner.urlDestino ?? banner.url_destino ?? null

  const handleClick = () => {
    if (!banner?.id) return
    fetcher(`/api/portal/banners/${banner.id}/track`, {
      method: 'POST',
      body: JSON.stringify({ tipo: 'click' }),
    }).catch(() => {})
  }

  const mediaClass = `${styles.media}${loaded ? ` ${styles.mediaLoaded}` : ''}`

  // La media recién se monta cuando `near` es true (carga diferida).
  const media = !near
    ? null
    : isVideo
      ? (
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          className={mediaClass}
          onLoadedData={() => setLoaded(true)}
        />
      )
      : (
        <img
          src={url}
          alt={alt}
          className={mediaClass}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      )

  return (
    <div ref={outerRef} className={styles.outer}>
      {ready
        ? (
          <div className={styles.slot} style={slotStyle}>
            {/* Preview: skeleton mientras la media pesada todavía no cargó. */}
            {!loaded && <div className={styles.preview} aria-hidden="true" />}
            {destino
              ? <a href={destino} target="_blank" rel="noopener noreferrer" className={styles.link} onClick={handleClick}>{media}</a>
              : media
            }
          </div>
        )
        : <div className={styles.skeleton} aria-hidden="true" />
      }
    </div>
  )
}
