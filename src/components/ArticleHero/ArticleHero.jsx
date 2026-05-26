'use client'

import styles from './ArticleHero.module.scss'
import { useTheme } from '../../context/SiteConfigContext.jsx'
import AspectImage from '../../components/UI/AspectImage/AspectImage.jsx'
import Carousel from '../Carousel/Carousel.jsx'
import V0 from './variants/V0/V0'
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'
import V3 from './variants/V3/V3'
import V4 from './variants/V4/V4'
import V5 from './variants/V5/V5'
import V0Tablet from './variants/V0Tablet/V0Tablet'
import V0Desktop from './variants/V0Desktop/V0Desktop'

const VARIANTS = { '0': V0, '1': V1, '2': V2, '3': V3, '4': V4, '5': V5 }

export default function ArticleHero({ titulo, volanta, copete, imagen, imagenes, imagenEpigrafe, focalPoint, isAmp = false, extras = null, hideImageOnDesktop = false }) {
  const theme   = useTheme()
  const variant = String(theme.articleHero ?? 1)

  const inlineStyle = isAmp ? {} : {
    fontFamily:          theme.fontFamily,
    '--primary-color':   theme.primary,
    '--surface-color':   theme.surface,
    '--secondary-color': theme.secondary,
  }

  const ExtrasEl = (!isAmp && extras) ? <div className={styles.extras}>{extras}</div> : null

  // Slides del carrusel: `imagenes` (array) tiene prioridad; si no, se arma
  // con la imagen única + su epígrafe. La primera es la principal.
  const slides = (Array.isArray(imagenes) && imagenes.length > 0)
    ? imagenes
    : (imagen ? [{ url: imagen, epigrafe: imagenEpigrafe }] : [])

  // El hero se ve solo en mobile/tablet (en desktop se oculta con
  // hideImageOnDesktop), así que ocupa ~todo el ancho del viewport.
  const heroSizes = '100vw'

  let ImgEl = null
  if (slides.length > 0) {
    if (isAmp) {
      // AMP no ejecuta JS de cliente: muestra sólo la imagen principal.
      // fetchpriority alta → es la imagen LCP del artículo.
      ImgEl = (
        <img
          src={slides[0].url}
          alt={titulo ?? ''}
          className="article-hero__img"
          fetchPriority="high"
        />
      )
    } else if (slides.length > 1) {
      ImgEl = (
        <Carousel
          images={slides.map((s) => ({ url: s.url, alt: titulo ?? '', epigrafe: s.epigrafe, variants: s.variants ?? null }))}
          focalPoint={focalPoint}
          sizes={heroSizes}
          fill
          priority
        />
      )
    } else {
      // Una sola imagen: epígrafe como overlay sutil sobre el borde inferior.
      // `priority` → imagen LCP, carga con prioridad alta.
      ImgEl = (
        <>
          <AspectImage src={slides[0].url} alt={titulo ?? ''} aspect="16:9" fill={true} focalPoint={focalPoint} variants={slides[0].variants ?? null} sizes={heroSizes} priority />
          {slides[0].epigrafe && <p className={styles.epigrafe}>{slides[0].epigrafe}</p>}
        </>
      )
    }
  }

  const imgWrapClass = isAmp
    ? 'article-hero__img-wrap'
    : `${styles.imgWrap}${hideImageOnDesktop ? ` ${styles.imgHiddenDesktop}` : ''}`

  const imgOnlyClass = (!isAmp && hideImageOnDesktop) ? styles.imgHiddenDesktop : undefined
  const noImgMod     = (!isAmp && hideImageOnDesktop) ? ` ${styles.noImgDesktop}` : ''

  const MobileVariant = VARIANTS[variant] ?? V1

  const sharedProps = {
    isAmp,
    inlineStyle,
    titulo,
    volanta,
    copete,
    ImgEl,
    ExtrasEl,
    imgWrapClass,
    imgOnlyClass,
    noImgMod,
  }

  if (isAmp) return <MobileVariant {...sharedProps} />

  return (
    <>
      <div className={styles.mobileOnly}>
        <MobileVariant {...sharedProps} />
      </div>
      <div className={styles.tabletOnly}>
        <V0Tablet {...sharedProps} />
      </div>
      <div className={styles.desktopUp}>
        <V0Desktop {...sharedProps} />
      </div>
    </>
  )
}
