'use client'

import styles from './NotaDestacada.module.scss'
import { useTheme } from '../../../context/SiteConfigContext.jsx'
import { useAuthorDisplay } from '../../../utils/authorDisplay.js'
import { volantaWithStop } from '../../../utils/volanta.js'
import AspectImage from '../../atoms/AspectImage/AspectImage.jsx'

/**
 * Widget "Nota destacada" — una sola nota con imagen, volanta + título,
 * descripción (copete) y autor. Vista pura: recibe la `article` ya resuelta
 * (la capa de datos vive en cada app, vía `/api/portal/articles`).
 *
 * Props:
 *   - article: nota resuelta ({ titulo, volanta, copete, autor, imagen, slug, publicarComoOrg })
 *   - settings: { showImage, showCopete } (del bloque del site-config)
 */
export default function NotaDestacadaView({ article, settings = {} }) {
  const theme = useTheme()
  const { displayName, avatarSrc } = useAuthorDisplay(article?.autor, article?.publicarComoOrg)

  if (!article) return null

  const showImage = settings.showImage !== false
  const showCopete = settings.showCopete !== false

  const inlineStyle = {
    backgroundColor: theme.surface,
    '--primary-color': theme.primary,
    '--secondary-color': theme.secondary,
    '--accent-color': theme.accent,
    '--surface-color': theme.surface,
    '--text-color': theme.textColor,
  }

  return (
    <section className={styles.container} style={inlineStyle}>
      <a href={article.slug ? `/${article.slug}` : '#'} className={styles.link}>
        {showImage && article.imagen?.url && (
          <div className={styles.media}>
            <AspectImage
              src={article.imagen.url}
              alt={article.imagen.alt ?? ''}
              aspect="1:1"
              focalPoint={article.focalPoint}
            />
          </div>
        )}

        <div className={styles.body}>
          <h3 className={styles.headline}>
            {article.volanta && (
              <span className={styles.volanta}>{volantaWithStop(article.volanta)}</span>
            )}
            {article.volanta && ' '}
            <span className={styles.titulo}>{article.titulo}</span>
          </h3>

          {showCopete && article.copete && (
            <p className={styles.copete}>{article.copete}</p>
          )}

          {displayName && (
            <div className={styles.autor}>
              {avatarSrc && (
                <img className={styles.avatar} src={avatarSrc} alt={displayName} width={28} height={28} loading="lazy" />
              )}
              <span className={styles.autorName}>Por {displayName}</span>
            </div>
          )}
        </div>
      </a>
    </section>
  )
}
