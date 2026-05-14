import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../UI/AspectImage/AspectImage.jsx'
import styles from './LoQueSeLee.module.scss'

// View pura: recibe el artículo ya resuelto.
// La data layer (Cabezal del portal o CMS) se encarga de fetchear
// /api/portal/articles/trending?categoria=X y filtrar por excludeId.
export default function LoQueSeLee({ article }) {
  const { Link } = useAdapters()

  if (!article) return null

  const { titulo, volanta, imagen, slug, autor, focalPoint } = article
  const href = slug ? `/${slug}` : '#'

  return (
    <section className={styles.container}>
      <div className={styles.containerBorder}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Lo que se lee ahora</span>
        </div>

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
            <Link href={href} className={styles.textLink}>
              {volanta && <span className={styles.volanta}>{volanta}. </span>}
              {titulo  && <span className={styles.titulo}>{titulo}</span>}
            </Link>
            {autor?.nombre && (
              <span className={styles.autor}>Por {autor.nombre}</span>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
