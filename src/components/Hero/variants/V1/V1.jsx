import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../UI/AspectImage/AspectImage.jsx'
import styles from '../../Hero.module.scss'

export default function V1({ article, important = false, inlineStyle }) {
  const { Link } = useAdapters()

  return (
    <article style={inlineStyle} className={`${styles.container} ${important ? styles.important : ''}`}>
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
          {article.copete && (
            <p
              className={styles.copete}
              dangerouslySetInnerHTML={{ __html: article.copete }}
            />
          )}
          {article.autor?.nombre && (
            <span className={styles.autor}>Por {article.autor.nombre}</span>
          )}
        </div>
      </Link>
    </article>
  )
}
