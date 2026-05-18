import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import styles from './Etiquetas.module.scss'

// View pura: muestra las etiquetas/tags del artículo en curso.
// A diferencia de LoQueSeLee, no hay fetch: la data layer le pasa los `tags`
// que ya vienen resueltos en el artículo (`/api/portal/articles/:id` los incluye).
// Cada tag enlaza a la pantalla de etiqueta ya existente: /etiqueta/{slug}.
export default function Etiquetas({ tags = [] }) {
  const { Link } = useAdapters()

  // Acepta los dos shapes del backend:
  //   - article.tags      → { id, name, slug }
  //   - article.etiquetas → { slug, nombre }
  const items = (Array.isArray(tags) ? tags : [])
    .map((t) => ({ slug: t?.slug, name: t?.name ?? t?.nombre }))
    .filter((t) => t.slug && t.name)
  if (items.length === 0) return null

  return (
    <section className={styles.container} aria-label="Temas del artículo">
      <span className={styles.label}>
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M17.1 0H1.9A1.906 1.906 0 0 0 0 1.9V19l3.8-3.8h13.3a1.906 1.906 0 0 0 1.9-1.9V1.9A1.906 1.906 0 0 0 17.1 0Zm0 13.3H3.8l-1.9 1.9V1.9h15.2Z"
          />
          <path
            fill="currentColor"
            d="m11.87 6.826-.194 1.64H13.1v1.469h-1.606l-.216 1.7H9.729l.216-1.7h-1.4l-.216 1.7H6.78l.216-1.7H5.561V8.466h1.617l.194-1.64H5.937V5.36h1.617l.216-1.7h1.549l-.216 1.7h1.4l.216-1.7h1.55l-.217 1.7h1.437v1.469Zm-1.549 0h-1.4l-.194 1.64h1.4Z"
          />
        </svg>
        Temas
      </span>
      <ul className={styles.list}>
        {items.map((tag) => (
          <li key={tag.id ?? tag.slug} className={styles.item}>
            <Link href={`/etiqueta/${tag.slug}`} className={styles.tag}>
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
