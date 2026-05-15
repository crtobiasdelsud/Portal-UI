'use client'

import styles from "./Hero.module.scss"
import { useTheme } from "../../context/SiteConfigContext.jsx"
import { useAdapters } from "../../adapters/AdaptersContext.jsx"
import AspectImage from "../UI/AspectImage/AspectImage.jsx"

export default function HeroView({ article, important = false }) {
  const theme = useTheme()
  const { Link } = useAdapters()
  const surfaceColor = theme.surface
  const primaryColor = theme.primary
  const textColor = theme.textColor
  const fontFamily = theme.fontFamily

  const inlineStyle = {
    backgroundColor: surfaceColor,
    fontFamily,
    '--primary-color': primaryColor,
    '--text-color': textColor,
    '--surface-color': surfaceColor,
  }

  return (
    <article style={inlineStyle} className={`${styles.container} ${important ? styles.important : ""}`}>
      <Link href={article.slug} className={styles.link}>
        {article.imagen?.url && (
          <AspectImage
            src={article.imagen.url}
            alt={article.imagen.alt ?? ''}
            aspect="16:9"
            focalPoint={article.focalPoint}
            className={styles.media}
          />
        )}
        <div className={styles.body}>
          <p className={styles.headline}>
            {article.volanta && <span className={styles.category}>{article.volanta}. </span>}
            {article.titulo}
          </p>
          <p className={styles.copete}> {article.copete}</p>
          {article.autor?.nombre && (
            <span className={styles.autor}>Por {article.autor.nombre}</span>
          )}
        </div>
      </Link>
    </article>
  )
}
