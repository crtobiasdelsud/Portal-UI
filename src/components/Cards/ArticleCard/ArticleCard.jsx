'use client'

import styles from "./ArticleCard.module.scss"
import { IMAGE_SIZES } from "../../../constants/imageSizes.js"
import { useTheme } from "../../../context/SiteConfigContext.jsx"
import { useAdapters } from "../../../adapters/AdaptersContext.jsx"
import { useAuthorDisplay } from "../../../utils/authorDisplay.js"
import AspectImage from "../../UI/AspectImage/AspectImage.jsx"
import Tooltip from "../../UI/ToolTip/ToolTip.jsx"

function buildTooltip(article, authorName) {
  const author = authorName
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
  // null-safe: el guard `if (!article)` está más abajo, pero el hook debe correr
  // antes del early-return (reglas de hooks).
  const { displayName, avatarSrc } = useAuthorDisplay(article?.autor, article?.publicarComoOrg)

  const primaryColor = theme.primary
  const textColor = theme.textColor
  const surfaceColor = theme.surface

  if (!article) return null

  const sizes = { ...IMAGE_SIZES, ...imageSizes }
  const dims = sizes[size]

  const isSmall = !!dims

  const inlineStyle = {
    backgroundColor: surfaceColor,
    '--primary-color': primaryColor,
    '--text-color': textColor,
  }

  return (
    <Tooltip text={buildTooltip(article, displayName)}>
      <article
        style={inlineStyle}
        className={styles.container}
      >
        <a
          href={article.slug ? `/${article.slug}` : '#'}
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

            {displayName && (
              <span
                className={`${styles.autor} ${
                  compact ? styles.autorCompact : ''
                }`}
              >
                Por {displayName}
              </span>
            )}
          </div>
        </a>

        {showAvatar && avatarSrc && (
          <div className={styles.authorAvatarWrap}>
            <Image
              src={avatarSrc}
              alt={displayName ?? ''}
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
