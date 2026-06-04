import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../UI/AspectImage/AspectImage.jsx'
import { volantaWithStop } from '../../../../utils/volanta.js'
import styles from './LeeAdemas.module.scss'

function LeeAdemasCard({ article }) {

  const { Link } = useAdapters()
  const { titulo, volanta, imagen, slug, focalPoint } = article
  const href = slug ? `/${slug}` : '#'

  return (
    <article className={styles.card}>
      {imagen?.url && (
        <Link href={href} className={styles.imgLink}>
          <AspectImage
            src={imagen.url}
            alt={imagen.alt ?? titulo ?? ''}
            aspect="16:9"
            focalPoint={focalPoint}
          />
        </Link>
      )}
      <div className={styles.body}>
        <Link href={href} className={styles.header}>
          {volanta && <span className={styles.volanta}>{volantaWithStop(volanta)} </span>}
          {titulo  && <span className={styles.titulo}>{titulo}</span>}
        </Link>
      </div>
    </article>
  )
}

export default function LeeAdemas({ articles = [], getSlotProps }) {

  const { Link } = useAdapters()
  const items = articles.slice(0, 2)
  if (!items.length) return null

  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Lee además</span>
      </div>
      <ul className={styles.list}>
        {items.map((article, i) => (
          <li key={article.id ?? i} className={styles.item} {...(getSlotProps?.(i) ?? {})}>
            <LeeAdemasCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  )
}
