'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import AspectImage from '../UI/AspectImage/AspectImage.jsx'
import styles from './Carousel.module.scss'

const RATIOS = { '16:9': '16/9', '4:3': '4/3' }

// Una sola "copia fantasma" a cada lado alcanza cuando se ve 1 slide a la vez.
// Mismo principio que Cabezal/Carrusel: al llegar al clon teleportamos al real
// equivalente sin que el usuario lo perciba.
const CLONE_COUNT = 1

/**
 * Carrusel de imágenes con scroll-snap nativo + flechas + puntos.
 *
 * El track usa `overflow-x: scroll` con `scroll-snap-type: x mandatory`, lo
 * que da swipe nativo en iOS/Android sin librerías externas. Las flechas y
 * los puntos disparan `scrollBy` y `setScrollLeft` sobre ese mismo track.
 *
 * @param {object} props
 * @param {{ url: string, alt?: string, epigrafe?: string, variants?: object }[]} props.images
 * @param {object}  [props.focalPoint]   - { x, y, zoom } aplicado a todas.
 * @param {string}  [props.aspect]       - '16:9' | '4:3'.
 * @param {string}  [props.sizes]        - hint de tamaño para el srcset.
 * @param {boolean} [props.fill]         - true → ocupa el contenedor padre
 *                                         posicionado (uso en el hero).
 * @param {boolean} [props.showEpigrafe] - false → oculta el epígrafe.
 * @param {'bottom'|'top'} [props.dotsPosition]
 * @param {boolean} [props.priority]     - true → la primera imagen es LCP.
 */
export default function Carousel({
  images = [],
  focalPoint,
  aspect = '16:9',
  fill = false,
  showEpigrafe = true,
  dotsPosition = 'bottom',
  priority = false,
  sizes,
}) {
  const total = images.length
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef(null)
  const isJumping = useRef(false)

  const getRealIndex = useCallback((childIdx) => {
    if (!total) return 0
    const raw = childIdx - CLONE_COUNT
    return ((raw % total) + total) % total
  }, [total])

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

  // Teleportar de un clon al real equivalente, sin que el usuario lo note.
  // En WebKit (iOS) el snap mandatory y el scroll-behavior:smooth pelean con
  // scrollBy({behavior:'instant'}) → glitch. Los apagamos durante el salto.
  const wrapIfNeeded = useCallback(() => {
    if (isJumping.current) return
    const track = trackRef.current
    if (!track || total < 2) return

    const snapped = getSnappedIndex(track)
    let target = null
    if (snapped < CLONE_COUNT) {
      target = track.children[snapped + total]
    } else if (snapped >= CLONE_COUNT + total) {
      target = track.children[snapped - total]
    }
    if (!target) return

    const delta =
      target.getBoundingClientRect().left -
      track.children[snapped].getBoundingClientRect().left

    isJumping.current = true
    const prevSnap = track.style.scrollSnapType
    const prevBehavior = track.style.scrollBehavior
    track.style.scrollSnapType = 'none'
    track.style.scrollBehavior = 'auto'
    track.scrollLeft += delta
    void track.offsetWidth
    track.style.scrollSnapType = prevSnap
    void track.offsetWidth
    track.style.scrollBehavior = prevBehavior
    requestAnimationFrame(() => { isJumping.current = false })
  }, [total])

  // Al montar: posicionarse en el primer slide real (saltar el leading clone).
  useEffect(() => {
    if (total < 2) return
    requestAnimationFrame(() => {
      const track = trackRef.current
      const firstReal = track?.children[CLONE_COUNT]
      if (!firstReal) return
      const delta =
        firstReal.getBoundingClientRect().left -
        track.getBoundingClientRect().left
      const prevBehavior = track.style.scrollBehavior
      track.style.scrollBehavior = 'auto'
      track.scrollLeft += delta
      track.style.scrollBehavior = prevBehavior
    })
  }, [total])

  // scrollend dispara el wrap recién cuando el scroll se asienta. Fallback con
  // debounce para navegadores que aún no lo implementan.
  useEffect(() => {
    if (total < 2) return
    const track = trackRef.current
    if (!track) return

    if ('onscrollend' in HTMLElement.prototype) {
      track.addEventListener('scrollend', wrapIfNeeded)
      return () => track.removeEventListener('scrollend', wrapIfNeeded)
    }

    let timer
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(wrapIfNeeded, 150)
    }
    track.addEventListener('scroll', onScroll)
    return () => {
      track.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [wrapIfNeeded, total])

  const handleScroll = useCallback(() => {
    if (isJumping.current) return
    const track = trackRef.current
    if (!track) return
    setActiveIndex(getRealIndex(getSnappedIndex(track)))
  }, [getRealIndex])

  const getSlideWidth = () => {
    const s = trackRef.current?.children[0]
    return s ? s.getBoundingClientRect().width : 0
  }

  const prev = () => {
    const sw = getSlideWidth()
    trackRef.current?.scrollBy({ left: -sw, behavior: 'smooth' })
  }
  const next = () => {
    const sw = getSlideWidth()
    trackRef.current?.scrollBy({ left: sw, behavior: 'smooth' })
  }
  const goToIndex = (idx) => {
    const track = trackRef.current
    if (!track) return
    const target = track.children[CLONE_COUNT + idx]
    if (!target) return
    const delta =
      target.getBoundingClientRect().left -
      track.getBoundingClientRect().left
    track.scrollBy({ left: delta, behavior: 'smooth' })
    setActiveIndex(idx)
  }

  if (!total) return null

  const rootClass = fill ? `${styles.carousel} ${styles.fill}` : styles.carousel
  const dotsClass = dotsPosition === 'top'
    ? `${styles.dots} ${styles.dotsTop}`
    : styles.dots

  // En modo fill el padre define el alto. Sin fill, el viewport pone su propio
  // aspect-ratio (cada slide hereda height: 100%).
  const viewportStyle = fill
    ? undefined
    : { aspectRatio: RATIOS[aspect] ?? RATIOS['16:9'] }

  // Caso 1 imagen: sin scroll, sin clones, sin controles. Salida temprana.
  if (total === 1) {
    const only = images[0]
    return (
      <div className={rootClass}>
        <div className={styles.viewport} style={viewportStyle}>
          <AspectImage
            src={only.url}
            alt={only.alt ?? ''}
            aspect={aspect}
            fill
            focalPoint={focalPoint}
            variants={only.variants ?? null}
            sizes={sizes}
            priority={priority}
          />
          {showEpigrafe && only.epigrafe && (
            <p className={styles.epigrafe}>{only.epigrafe}</p>
          )}
        </div>
      </div>
    )
  }

  const leadClones = images.slice(-CLONE_COUNT)
  const tailClones = images.slice(0, CLONE_COUNT)

  const renderSlide = (img, key, isPriority, isClone) => (
    <div
      key={key}
      className={styles.slide}
      aria-hidden={isClone ? 'true' : undefined}
    >
      <AspectImage
        src={img.url}
        alt={img.alt ?? ''}
        aspect={aspect}
        fill
        focalPoint={focalPoint}
        variants={img.variants ?? null}
        sizes={sizes}
        priority={isPriority}
      />
      {showEpigrafe && img.epigrafe && (
        <p className={styles.epigrafe}>{img.epigrafe}</p>
      )}
    </div>
  )

  return (
    <div className={rootClass}>
      <div className={styles.viewport} style={viewportStyle}>
        <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
          {leadClones.map((img, i) =>
            renderSlide(img, `clone-start-${i}`, false, true),
          )}
          {images.map((img, i) =>
            renderSlide(img, img.url ?? `slide-${i}`, priority && i === 0, false),
          )}
          {tailClones.map((img, i) =>
            renderSlide(img, `clone-end-${i}`, false, true),
          )}
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={prev}
          aria-label="Imagen anterior"
        >
          <span aria-hidden="true">&lsaquo;</span>
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={next}
          aria-label="Imagen siguiente"
        >
          <span aria-hidden="true">&rsaquo;</span>
        </button>

        <div className={dotsClass}>
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={
                i === activeIndex
                  ? `${styles.dot} ${styles.dotActive}`
                  : styles.dot
              }
              onClick={() => goToIndex(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
              aria-current={i === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
