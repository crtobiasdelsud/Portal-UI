'use client'

import styles from './ArticleHeroFull.module.scss'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Carousel from '../Carousel/Carousel.jsx'
import AspectImage from '../UI/AspectImage/AspectImage.jsx'

export default function ArticleHeroFull({ titulo, copete, imagen, imagenes, imagenEpigrafe, focalPoint, categoria }) {
  const { config } = useSiteConfig()
  const siteName = config?.slots?.header?.settings?.siteName ?? ''

  // Slides del carrusel: `imagenes` (array) tiene prioridad; si no, la imagen
  // única. La primera es la principal.
  const slides = (Array.isArray(imagenes) && imagenes.length > 0)
    ? imagenes
    : (imagen ? [{ url: imagen, epigrafe: imagenEpigrafe }] : [])

  const single = slides.length === 1 ? slides[0] : null

  // Hero a pantalla casi completa → la imagen ocupa todo el ancho del viewport.
  // `sizes="100vw"` deja que el navegador baje la variante responsive justa
  // (ver AspectImage / ADR-0002) en vez del original a tamaño completo.
  const heroSizes = '100vw'

  return (
    <div className={styles.hero}>
      {slides.length > 1 ? (
        <Carousel
          images={slides.map((s) => ({ url: s.url, alt: titulo ?? '', variants: s.variants ?? null }))}
          focalPoint={focalPoint}
          sizes={heroSizes}
          fill
          showEpigrafe={false}
          dotsPosition="top"
          priority
        />
      ) : single ? (
        <AspectImage
          src={single.url}
          alt={titulo ?? ''}
          className={styles.img}
          fill
          focalPoint={focalPoint}
          variants={single.variants ?? null}
          sizes={heroSizes}
          priority
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
        {copete && <div className={styles.copete} dangerouslySetInnerHTML={{ __html: copete }} />}
      </div>
    </div>
  )
}
