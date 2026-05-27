import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import styles from './SeguiLeyendo.module.scss'

function SeguiLeyendoCard({ article }) {

  const { Link } = useAdapters()
  const { titulo, slug } = article
  const href = slug ? `/${slug}` : '#'

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.link}>
        {titulo}
      </Link>
    </article>
  )
}

export default function SeguiLeyendo({ titulo, articles = [], getSlotProps }) {

  const { Link } = useAdapters()
  if (!articles.length) return null

  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{titulo || 'Seguí leyendo'}</span>
      </div>
      <ul className={styles.list}>
        {articles.map((article, i) => (
          <li key={article.id ?? i} className={styles.item} {...(getSlotProps?.(i) ?? {})}>
            <SeguiLeyendoCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  )
}
