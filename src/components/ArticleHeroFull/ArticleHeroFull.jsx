'use client'

import styles from './ArticleHeroFull.module.scss'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'

export default function ArticleHeroFull({ titulo, copete, imagen, focalPoint, categoria }) {
  const { config } = useSiteConfig()
  const siteName = config?.slots?.header?.settings?.siteName ?? ''

  const objPos = focalPoint
    ? `${focalPoint.x ?? 50}% ${focalPoint.y ?? 50}%`
    : 'center center'

  return (
    <div className={styles.hero}>
      {imagen && (
        <img
          src={imagen}
          alt={titulo ?? ''}
          className={styles.img}
          style={{ objectPosition: objPos }}
        />
      )}
      <div className={styles.gradient} />
      <div className={styles.content}>
        {categoria && (
          <div className={styles.breadcrumb}>
            {siteName && <span>{siteName}</span>}
            {siteName && <span className={styles.sep}>&rsaquo;</span>}
            <a href={`/${categoria.slug}`}>{categoria.nombre ?? categoria.slug}</a>
          </div>
        )}
        <h1 className={styles.titulo}>{titulo}</h1>
        {copete && <p className={styles.copete}>{copete}</p>}
      </div>
    </div>
  )
}
