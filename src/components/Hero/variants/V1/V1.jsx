import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import { useAuthorDisplay } from '../../../../utils/authorDisplay.js'
import { sanitizeInlineHtml } from '../../../../utils/sanitizeHtml.js'
import AspectImage from '../../../UI/AspectImage/AspectImage.jsx'
import styles from '../../Hero.module.scss'

export default function V1({ article, important = false, inlineStyle }) {
  const { Link } = useAdapters()
  const { displayName } = useAuthorDisplay(article.autor, article.publicarComoOrg)

  return (
    <article style={inlineStyle} className={`${styles.container} ${important ? styles.important : ''}`}>
      <Link href={article.slug ? `/${article.slug}` : '#'} className={styles.link}>
        {article.imagen?.url && (
          <AspectImage
            src={article.imagen.url}
            alt={article.imagen.alt ?? ''}
            aspect="16:9"
            focalPoint={article.focalPoint}
            className={styles.media}
            variants={article.imagen?.variants ?? null}
            sizes="(max-width: 768px) 100vw, 66vw"
            priority={important}
          />
        )}
        <div className={styles.body}>
          <h2 className={styles.headline}>
            {article.volanta && <span className={styles.category}>{article.volanta}. </span>}
            {article.titulo}
          </h2>
          {article.copete && (
            <div
              className={styles.copete}
              dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(article.copete) }}
            />
          )}
          {displayName && (
            <span className={styles.autor}>Por {displayName}</span>
          )}
        </div>
      </Link>
    </article>
  )
}
