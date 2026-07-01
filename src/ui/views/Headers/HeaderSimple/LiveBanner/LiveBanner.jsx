'use client'

import { useRef, useEffect } from 'react'
import { ensureContrast } from '../../../../../utils/colorContrast.js'
import { useDrawer } from '../DrawerContext/DrawerContext'
import styles from './LiveBanner.module.scss'

function getYouTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1)
    }
  } catch {}
  return null
}

// Este componente ya NO monta el iframe. El iframe vive una sola vez en
// <LivePlayerHost> (singleton por DrawerProvider) y se posiciona sobre el
// anchor del banner visible. Acá sólo renderizamos la UI (badge, título,
// botones) y un <div> "anchor" del tamaño del preview, que el host usa como
// referencia para colocar el iframe encima.
export default function LiveBanner({ liveUrl, liveTitle, secondaryColor, priority = 0 }) {
  const {
    liveDismissed, setLiveDismissed,
    liveExpanded:  expanded, setLiveExpanded: setExpanded,
    liveStarted,   setLiveStarted,
    liveMuted:     muted,    setLiveMuted:    setMuted,
    registerLiveAnchor, unregisterLiveAnchor,
  } = useDrawer()
  const anchorRef = useRef(null)

  const videoId = getYouTubeId(liveUrl)

  // La primera vez que se expande arranca la reproducción "para siempre":
  // a partir de ahí el iframe queda montado aunque se colapse, así el live
  // no se corta. Sólo vuelve a la preview si se recarga la página.
  useEffect(() => {
    if (expanded && !liveStarted) setLiveStarted(true)
  }, [expanded, liveStarted, setLiveStarted])

  // Sólo registramos el anchor con su prioridad. El host (LivePlayerHost)
  // elige el de mayor prioridad que esté visible.
  useEffect(() => {
    if (!liveStarted) return
    const el = anchorRef.current
    if (!el) return
    registerLiveAnchor(el, priority)
    return () => unregisterLiveAnchor(el)
  }, [liveStarted, priority, registerLiveAnchor, unregisterLiveAnchor])

  if (!liveUrl || liveDismissed) return null

  const bg       = secondaryColor || '#0D1333'
  const txtColor = ensureContrast('#ffffff', bg)
  // mqdefault (320x180, 16:9, ~12 KiB) alcanza de sobra para el preview chico
  // (~146x82) incluso en retina. maxresdefault eran ~135 KiB para nada.
  const thumbSrc = videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null

  const toggleSound = () => setMuted(v => !v)

  return (
    <div
      className={`${styles.banner} ${expanded ? styles.expanded : ''}`}
      style={{ background: bg, color: txtColor }}
    >

      <div className={styles.preview}>
        {liveStarted ? (
          <div ref={anchorRef} className={styles.frame} aria-hidden="true" />
        ) : thumbSrc ? (
          <img
            src={thumbSrc}
            alt={liveTitle || 'Preview en vivo'}
            className={styles.frame}
            width={320}
            height={180}
            loading="lazy"
            style={{ objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
          />
        ) : null}
      </div>

      <div className={styles.info}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          EN VIVO
        </span>
        {liveTitle && <p className={styles.title}>{liveTitle}</p>}
      </div>

      <div className={styles.actions}>
        {expanded && (
          <button
            type="button"
            className={styles.btn}
            onClick={toggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            aria-pressed={!muted}
            style={{ color: txtColor }}
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          className={styles.btn}
          onClick={() => setExpanded(v => !v)}
          aria-label={expanded ? 'Contraer preview' : 'Expandir preview'}
          aria-pressed={expanded}
          style={{ color: txtColor }}
        >
          {expanded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
              <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          )}
        </button>

        <button
          className={styles.btn}
          onClick={() => setLiveDismissed(true)}
          aria-label="Cerrar"
          style={{ color: txtColor }}
        >
          ✕
        </button>
      </div>

    </div>
  )
}
