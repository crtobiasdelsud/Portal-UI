'use client'
import { useEffect, useState } from "react"
import styles from "./Banner.module.scss"
import BannerDisplay from "./BannerDisplay"

// Reserva el slot gris brevemente para darle chance al fetch y evitar saltos
// de layout. Si pasado este tiempo no llegó imagen, el banner se desmonta.
const EMPTY_GRACE_MS = 700

/**
 * View pura — recibe el banner ya resuelto. La capa de datos vive en cada app
 * (portal: async server con backendFetch, CMS: client useEffect).
 */
export default function BannerView({ banner, isAmp = false }) {
  if (isAmp) {
    const ampImagen = banner?.imagen ?? banner?.imagenHorizontal ?? banner?.imagenVertical
    const url = ampImagen?.url
    const isVideo = url && /\.(mp4|webm|ogg)(\?|$)/i.test(url)
    if (!url) return null
    return (
      <div className="banner">
        {isVideo
          ? <amp-video src={url} width="640" height="360" layout="responsive" autoplay loop muted />
          : <img src={url} alt={ampImagen.alt ?? banner.nombre ?? ''} className="banner__img" />
        }
      </div>
    )
  }

  const hasImage = banner?.imagen?.url || banner?.imagenHorizontal?.url || banner?.imagenVertical?.url

  const [showEmpty, setShowEmpty] = useState(true)
  useEffect(() => {
    if (hasImage) { setShowEmpty(true); return }
    const t = setTimeout(() => setShowEmpty(false), EMPTY_GRACE_MS)
    return () => clearTimeout(t)
  }, [hasImage])

  if (!hasImage && !showEmpty) return null

  return (
    <div className={`${styles.banner}${!banner ? ` ${styles.empty}` : ''}`}>
      {hasImage
        ? <BannerDisplay banner={banner} />
        : <div className={styles.placeholder} aria-hidden="true" />
      }
    </div>
  )
}
