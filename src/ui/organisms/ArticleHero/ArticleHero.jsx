'use client'

import styles from './ArticleHero.module.scss'
import { useTheme } from '../../../context/SiteConfigContext.jsx'
import AspectImage from '../../atoms/AspectImage/AspectImage.jsx'
import Carousel from '../../molecules/Carousel/Carousel.jsx'
import V0 from './variants/V0/V0'
import V0Tablet from './variants/V0Tablet/V0Tablet'
import V0Desktop from './variants/V0Desktop/V0Desktop'

const VARIANTS = { '0': V0 }

export default function ArticleHero({ titulo, volanta, copete, imagen, imagenes, imagenEpigrafe, focalPoint, isAmp = false, extras = null, hideImageOnDesktop = false }) {
  const theme   = useTheme()
  const variant = String(theme.articleHero ?? 0)

  const inlineStyle = isAmp ? {} : {
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
      // AMP no permite <img>: usamos <amp-img layout="fill"> dentro del
      // wrap (position:relative + aspect-ratio). object-fit lo da el CSS.
      ImgEl = (
        <amp-img
          src={slides[0].url}
          alt={titulo ?? ''}
          class="article-hero__img"
          layout="fill"
        >
          {/* Placeholder si la imagen falla (AMP no deja colapsar el hueco). */}
          <div fallback="" className="article-hero__img-fallback">Imagen no disponible</div>
        </amp-img>
      )
    } else if (slides.length > 1) {
      ImgEl = (
        <Carousel
          images={slides.map((s) => ({ url: s.url, alt: titulo ?? '', epigrafe: s.epigrafe, variants: s.variants ?? null, focalPoint: s.focalPoint ?? null }))}
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

  const MobileVariant = VARIANTS[variant] ?? V0

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

  // Las 3 variantes se rinden a la vez (se togglean por CSS), pero solo UNA
  // puede emitir <h1> o el DOM tendría 3 <h1> idénticos (malo para SEO). Como
  // Google indexa mobile-first, el <h1> real va en la variante mobile (la
  // visible para el crawler); tablet/desktop usan <p> — visualmente idéntico
  // por las clases compartidas.
  //
  // Con `hideImageOnDesktop` la imagen del hero solo se ve en mobile (tablet y
  // desktop la ocultan por CSS), así que pasarle `ImgEl` a esas variantes deja
  // 2 <img eager fetchpriority=high> muertos en el DOM. Se les pasa null para
  // que ni se materialicen.
  const heroImgFor = (variantVisible) => (hideImageOnDesktop && !variantVisible ? null : ImgEl)

  return (
    <>
      <div className={styles.mobileOnly}>
        <MobileVariant {...sharedProps} titleTag="h1" ImgEl={heroImgFor(true)} />
      </div>
      <div className={styles.tabletOnly}>
        <V0Tablet {...sharedProps} titleTag="p" ImgEl={heroImgFor(false)} />
      </div>
      <div className={styles.desktopUp}>
        <V0Desktop {...sharedProps} titleTag="p" ImgEl={heroImgFor(false)} />
      </div>
    </>
  )
}
