'use client'

import { useBanners } from '../../../context/SiteConfigContext.jsx'
import BannerDisplay from '../../molecules/Banner/BannerDisplay.jsx'
import styles from './ArticleSidebar.module.scss'

export default function ArticleSidebar({ children, hasWidgets = false }) {
  const banners = useBanners()
  const banner  = banners?.[0]

  if (!hasWidgets && !banner) return null

  const hasImage = banner?.imagen?.url || banner?.imagenVertical?.url || banner?.imagenHorizontal?.url

  return (
    <aside className={styles.sidebar}>
      {hasWidgets
        ? <div className={styles.widgetList}>{children}</div>
        : <div className={styles.sticky}>
            {hasImage
              ? <BannerDisplay banner={banner} />
              : <div className={styles.placeholder} />
            }
          </div>
      }
    </aside>
  )
}
