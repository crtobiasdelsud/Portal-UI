import styles from "./Banner.module.scss"
import BannerDisplay from "./BannerDisplay"

/**
 * View pura — recibe el banner ya resuelto. La capa de datos vive en cada app
 * (portal: async server con backendFetch, CMS: client useEffect).
 */
export default function BannerView({ banner, isAmp = false }) {
  if (isAmp) {
    const ampImagen = banner?.imagen ?? banner?.imagenHorizontal ?? banner?.imagenVertical
    const url = ampImagen?.url
    const isVideo = url && /\.(mp4|webm|ogg)(\?|$)/i.test(url)
    return (
      <div className={`banner${banner ? '' : ' banner--empty'}`}>
        {url
          ? isVideo
            ? <amp-video src={url} width="640" height="360" layout="responsive" autoplay loop muted />
            : <img src={url} alt={ampImagen.alt ?? banner.nombre ?? ''} className="banner__img" />
          : <div className="banner__placeholder" />
        }
      </div>
    )
  }

  const hasImage = banner?.imagen?.url || banner?.imagenHorizontal?.url || banner?.imagenVertical?.url

  return (
    <div className={`${styles.banner}${!banner ? ` ${styles.empty}` : ''}`}>
      {hasImage
        ? <BannerDisplay banner={banner} />
        : <div className={styles.placeholder} aria-hidden="true" />
      }
    </div>
  )
}
