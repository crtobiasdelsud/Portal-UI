'use client'

import styles from './ArticleHeroFull.module.scss'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Carousel from '../Carousel/Carousel.jsx'

export default function ArticleHeroFull({ titulo, copete, imagen, imagenes, imagenEpigrafe, focalPoint, categoria }) {
  const { config } = useSiteConfig()
  const siteName = config?.slots?.header?.settings?.siteName ?? ''

  const objPos = focalPoint
    ? `${focalPoint.x ?? 50}% ${focalPoint.y ?? 50}%`
    : 'center center'

  // Slides del carrusel: `imagenes` (array) tiene prioridad; si no, la imagen
  // única. La primera es la principal.
  const slides = (Array.isArray(imagenes) && imagenes.length > 0)
    ? imagenes
    : (imagen ? [{ url: imagen, epigrafe: imagenEpigrafe }] : [])

  const single = slides.length === 1 ? slides[0] : null

  return (
    <div className={styles.hero}>
      {slides.length > 1 ? (
        <Carousel
          images={slides.map((s) => ({ url: s.url, alt: titulo ?? '' }))}
          focalPoint={focalPoint}
          fill
          showEpigrafe={false}
          dotsPosition="top"
          priority
        />
      ) : single ? (
        <img
          src={single.url}
          alt={titulo ?? ''}
          className={styles.img}
          style={{ objectPosition: objPos }}
          decoding="async"
          loading="eager"
          fetchPriority="high"
        />
      ) : null}
      <div className={styles.gradient} />
      {single && single.epigrafe && (
        <p className={styles.epigrafe}>{single.epigrafe}</p>
      )}
      <div className={styles.content}>
        {categoria && (
          <div className={styles.breadcrumb}>
            {siteName && <span>{siteName}</span>}
            {siteName && <span className={styles.sep}>&rsaquo;</span>}
            {categoria.parent && (
              <>
                <a href={`/${categoria.parent.slug}`}>{categoria.parent.nombre ?? categoria.parent.slug}</a>
                <span className={styles.sep}>&rsaquo;</span>
              </>
            )}
            <a href={`/${categoria.slug}`}>{categoria.nombre ?? categoria.slug}</a>
          </div>
        )}
        <h1 className={styles.titulo}>{titulo}</h1>
        {copete && <p className={styles.copete}>{copete}</p>}
      </div>
    </div>
  )
}
