import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import { useAuthorDisplay } from '../../../../../utils/authorDisplay.js'
import AspectImage from '../../../../atoms/AspectImage/AspectImage.jsx'
import { volantaWithStop } from '../../../../../utils/volanta.js'
import styles from './LoQueSeLee.module.scss'

// View pura: recibe el artículo ya resuelto.
// La data layer (Cabezal del portal o CMS) se encarga de fetchear
// /api/portal/articles/trending?categoria=X y filtrar por excludeId.
export default function LoQueSeLee({ article }) {
  const { Link } = useAdapters()
  // El hook va antes del early-return para no violar las reglas de hooks; null-safe
  // porque `article` puede ser null (ver guard debajo).
  const { displayName } = useAuthorDisplay(article?.autor, article?.publicarComoOrg)

  if (!article) return null

  const { titulo, volanta, imagen, slug, focalPoint } = article
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
                variants={imagen.variants ?? null}
                sizes="(min-width: 1024px) 360px, 100vw"
              />
            </Link>
          )}

          <div className={styles.body}>
            <Link href={href} className={styles.textLink}>
              {volanta && <span className={styles.volanta}>{volantaWithStop(volanta)} </span>}
              {titulo  && <span className={styles.titulo}>{titulo}</span>}
            </Link>
            {displayName && (
              <span className={styles.autor}>Por {displayName}</span>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
