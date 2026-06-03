'use client'

import styles from "./ArticleCard.module.scss"
import { IMAGE_SIZES } from "../../../constants/imageSizes.js"
import { useTheme } from "../../../context/SiteConfigContext.jsx"
import { useAdapters } from "../../../adapters/AdaptersContext.jsx"
import AspectImage from "../../UI/AspectImage/AspectImage.jsx"
import Tooltip from "../../UI/ToolTip/ToolTip.jsx"

function buildTooltip(article) {
  const author = article.autor?.nombre
  const category = article.volanta

  return [
    category,
    article.titulo,
    author ? `· ${author}` : null
  ]
    .filter(Boolean)
    .join(' ')
}

export default function ArticleCard({
  article,
  size = "full",
  imageSizes = {},
  compact = false,
  showAvatar = true
}) {
  const theme = useTheme()
  const { Image } = useAdapters()

  const primaryColor = theme.primary
  const textColor = theme.textColor
  const surfaceColor = theme.surface
  const fontFamily = theme.fontFamily

  if (!article) return null

  const sizes = { ...IMAGE_SIZES, ...imageSizes }
  const dims = sizes[size]

  const isSmall = !!dims

  const inlineStyle = {
    backgroundColor: surfaceColor,
    fontFamily,
    '--primary-color': primaryColor,
    '--text-color': textColor,
  }

  return (
    <Tooltip text={buildTooltip(article)}>
      <article
        style={inlineStyle}
        className={styles.container}
      >
        <a
          rel="canonical"
          href={article.slug}
          className={isSmall ? styles.linkSmall : styles.link}
        >
          {article.imagen?.url && (
            <AspectImage
              src={article.imagen.url}
              alt={article.imagen.alt ?? ''}
              aspect="16:9"
              focalPoint={article.focalPoint}
            />
          )}

          <div
            className={`${styles.body} ${
              compact ? styles.bodyCompact : ''
            }`}
          >
            <p className={styles.headline}>
              <span className={styles.category}>
                {article.volanta}.
              </span>
              {' '}
              {article.titulo}
            </p>

            {article.autor?.nombre && (
              <span
                className={`${styles.autor} ${
                  compact ? styles.autorCompact : ''
                }`}
              >
                Por {article.autor.nombre}
              </span>
            )}
          </div>
        </a>

        {showAvatar && article.autor?.avatar && (
          <div className={styles.authorAvatarWrap}>
            <Image
              src={article.autor.avatar}
              alt={article.autor.nombre ?? ''}
              width={100}
              height={100}
              className={styles.authorAvatar}
            />
          </div>
        )}
      </article>
    </Tooltip>
  )
}
