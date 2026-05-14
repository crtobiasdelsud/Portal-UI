'use client'

import styles from './ArticleHero.module.scss'
import { useTheme } from '../../context/SiteConfigContext.jsx'
import AspectImage from '../../components/UI/AspectImage/AspectImage.jsx'
import V0 from './variants/V0/V0'
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'
import V3 from './variants/V3/V3'
import V4 from './variants/V4/V4'
import V5 from './variants/V5/V5'
import V0Tablet from './variants/V0Tablet/V0Tablet'
import V0Desktop from './variants/V0Desktop/V0Desktop'

const VARIANTS = { '0': V0, '1': V1, '2': V2, '3': V3, '4': V4, '5': V5 }

export default function ArticleHero({ titulo, volanta, copete, imagen, focalPoint, isAmp = false, extras = null, hideImageOnDesktop = false }) {
  const theme   = useTheme()
  const variant = String(theme.articleHero ?? 1)

  const inlineStyle = isAmp ? {} : {
    fontFamily:          theme.fontFamily,
    '--primary-color':   theme.primary,
    '--surface-color':   theme.surface,
    '--secondary-color': theme.secondary,
  }

  const ExtrasEl = (!isAmp && extras) ? <div className={styles.extras}>{extras}</div> : null

  const ImgEl = imagen
    ? isAmp
      ? <img src={imagen} alt={titulo ?? ''} className="article-hero__img" />
      : <AspectImage src={imagen} alt={titulo ?? ''} aspect="16:9" fill={true} focalPoint={focalPoint} />
    : null

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
