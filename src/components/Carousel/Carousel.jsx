'use client'

import { useState } from 'react'
import AspectImage from '../UI/AspectImage/AspectImage.jsx'
import styles from './Carousel.module.scss'

/**
 * Carrusel de imágenes con navegación manual (flechas + puntos).
 *
 * La primera imagen del array es la principal. Cada slide muestra la imagen
 * en aspecto 16:9 y, si tiene, su epígrafe como franja negra inferior.
 *
 * @param {object} props
 * @param {{ url: string, alt?: string, epigrafe?: string }[]} props.images
 * @param {object}  [props.focalPoint]   - { x, y, zoom } aplicado a todas.
 * @param {string}  [props.aspect]       - '16:9' | '4:3'.
 * @param {boolean} [props.fill]         - true → ocupa el contenedor posicionado
 *                                         padre (uso en el hero). false → genera
 *                                         su propia caja con aspect-ratio.
 * @param {boolean} [props.showEpigrafe] - false → oculta la franja de epígrafe.
 * @param {'bottom'|'top'} [props.dotsPosition]
 * @param {boolean} [props.priority] - true → la primera imagen carga con
 *        prioridad alta (LCP). El resto carga al navegar a su slide.
 */
export default function Carousel({
  images = [],
  focalPoint,
  aspect = '16:9',
  fill = false,
  showEpigrafe = true,
  dotsPosition = 'bottom',
  priority = false,
}) {
  const [index, setIndex] = useState(0)

  if (!images.length) return null

  const total = images.length
  const safeIndex = index < total ? index : 0
  const current = images[safeIndex]
  const go = (delta) => setIndex((i) => (((i + delta) % total) + total) % total)

  const rootClass = fill ? `${styles.carousel} ${styles.fill}` : styles.carousel
  const dotsClass = dotsPosition === 'top'
    ? `${styles.dots} ${styles.dotsTop}`
    : styles.dots

  return (
    <div className={rootClass}>
      <div className={styles.viewport}>
        <AspectImage
          src={current.url}
          alt={current.alt ?? ''}
          aspect={aspect}
          fill={fill}
          focalPoint={focalPoint}
          priority={priority && safeIndex === 0}
        />
        {showEpigrafe && current.epigrafe && (
          <p className={styles.epigrafe}>{current.epigrafe}</p>
        )}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(-1)}
            aria-label="Imagen anterior"
          >
            <span aria-hidden="true">&lsaquo;</span>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(1)}
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
                  i === safeIndex
                    ? `${styles.dot} ${styles.dotActive}`
                    : styles.dot
                }
                onClick={() => setIndex(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === safeIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
