'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import styles from './Carrusel.module.scss'
import CarruselCard from '../../CardCabezal/variants/Carrusel/Carrusel'

const CLONE_COUNT = 3

export default function Carrusel({ titulo, verMasUrl, articles, getSlotProps }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef  = useRef(null)
  const isJumping = useRef(false)

  const getSlideWidth = () => {
    const s = trackRef.current?.children[0]
    return s ? s.getBoundingClientRect().width + 30 : 0
  }

  // Índice del hijo cuyo borde izquierdo está más cerca del borde izquierdo del track
  const getSnappedIndex = (track) => {
    const trackLeft = track.getBoundingClientRect().left
    let best = 0
    let bestDist = Infinity
    Array.from(track.children).forEach((child, i) => {
      const dist = Math.abs(child.getBoundingClientRect().left - trackLeft)
      if (dist < bestDist) { bestDist = dist; best = i }
    })
    return best
  }

  const getRealIndex = (childIdx) => {
    const raw = childIdx - CLONE_COUNT
    return ((raw % articles.length) + articles.length) % articles.length
  }

  // Teleportar desde zona de clones al slide real equivalente, usando BCR (no píxeles calculados)
  const wrapIfNeeded = useCallback(() => {
    if (isJumping.current) return
    const track = trackRef.current
    if (!track) return

    const snapped = getSnappedIndex(track)
    let target = null

    if (snapped < CLONE_COUNT) {
      target = track.children[snapped + articles.length]
    } else if (snapped >= CLONE_COUNT + articles.length) {
      target = track.children[snapped - articles.length]
    }

    if (!target) return

    const delta = target.getBoundingClientRect().left - track.children[snapped].getBoundingClientRect().left

    isJumping.current = true
    const prevSnap = track.style.scrollSnapType
    const prevBehavior = track.style.scrollBehavior
    // En WebKit (iOS) el snap mandatory y el scroll-behavior:smooth del CSS pelean
    // contra scrollBy({behavior:'instant'}) → glitch. Los apagamos para el salto.
    track.style.scrollSnapType = 'none'
    track.style.scrollBehavior = 'auto'
    track.scrollLeft += delta            // salto directo, no scrollBy
    void track.offsetWidth               // reflow: asienta la posición antes de re-snap
    track.style.scrollSnapType = prevSnap // re-snap mientras behavior sigue 'auto' (sin animar)
    void track.offsetWidth
    track.style.scrollBehavior = prevBehavior
    requestAnimationFrame(() => { isJumping.current = false })
  }, [articles.length])

  // Al montar: posicionarse en el primer slide real (saltar leading clones)
  useEffect(() => {
    requestAnimationFrame(() => {
      const track = trackRef.current
      const firstReal = track?.children[CLONE_COUNT]
      if (!firstReal) return
      const delta = firstReal.getBoundingClientRect().left - track.getBoundingClientRect().left
      const prevBehavior = track.style.scrollBehavior
      track.style.scrollBehavior = 'auto'
      track.scrollLeft += delta
      track.style.scrollBehavior = prevBehavior
    })
  }, [])

  // scrollend dispara el wrap tras asentar la animación — inmune al redondeo de snap
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if ('onscrollend' in HTMLElement.prototype) {
      track.addEventListener('scrollend', wrapIfNeeded)
      return () => track.removeEventListener('scrollend', wrapIfNeeded)
    }

    // Fallback para navegadores sin scrollend
    let timer
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(wrapIfNeeded, 150) }
    track.addEventListener('scroll', onScroll)
    return () => { track.removeEventListener('scroll', onScroll); clearTimeout(timer) }
  }, [wrapIfNeeded])

  const handleScroll = useCallback(() => {
    if (isJumping.current) return
    const track = trackRef.current
    if (!track) return
    setActiveIndex(getRealIndex(getSnappedIndex(track)))
  }, [articles.length])

  const prev = () => {
    const sw = getSlideWidth()
    trackRef.current?.scrollBy({ left: -sw, behavior: 'smooth' })
  }

  const next = () => {
    const sw = getSlideWidth()
    trackRef.current?.scrollBy({ left: sw, behavior: 'smooth' })
  }

  const goToIndex = (index) => {
    const track = trackRef.current
    if (!track) return
    const target = track.children[CLONE_COUNT + index]
    if (!target) return
    const delta = target.getBoundingClientRect().left - track.getBoundingClientRect().left
    track.scrollBy({ left: delta, behavior: 'smooth' })
    setActiveIndex(index)
  }

  return (
    <section className={styles.container}>
      {titulo && (
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          {verMasUrl && <a href={verMasUrl} className={styles.verMas}>VER MÁS</a>}
        </div>
      )}

      <div className={styles.trackWrapper}>
        <button className={`${styles.arrow} ${styles.arrowPrev}`} onClick={prev} aria-label="Anterior">
          ‹
        </button>

        <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
          {articles.slice(-CLONE_COUNT).map((article, i) => (
            <div key={`clone-start-${i}`} className={styles.slide} aria-hidden="true">
              <CarruselCard article={article} />
            </div>
          ))}

          {articles.map((article, i) => (
            <div key={article.id ?? i} className={styles.slide} {...(getSlotProps?.(i) ?? {})}>
              <CarruselCard article={article} />
            </div>
          ))}

          {articles.slice(0, CLONE_COUNT).map((article, i) => (
            <div key={`clone-end-${i}`} className={styles.slide} aria-hidden="true">
              <CarruselCard article={article} />
            </div>
          ))}
        </div>

        <button className={`${styles.arrow} ${styles.arrowNext}`} onClick={next} aria-label="Siguiente">
          ›
        </button>
      </div>

      {articles.length > 1 && (
        <div className={styles.dots}>
          {articles.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => goToIndex(i)}
              aria-label={`Paso ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
