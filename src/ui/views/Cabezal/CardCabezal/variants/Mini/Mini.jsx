import styles from '../../CardCabezal.module.scss'
import { useAdapters } from '../../../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../../../atoms/AspectImage/AspectImage.jsx'
import Tooltip from '../../../../../atoms/ToolTip/ToolTip.jsx'
import { volantaWithStop } from '../../../../../../utils/volanta.js'

/**
 * Card "mini": versión reducida para grillas densas (tipo `mini`). Imagen 16:9
 * + volanta + título completo (sin recortar). El tamaño chico recién aplica en
 * desktop; en mobile la grilla apila a 1 columna y se ve como las demás.
 */
export default function Mini({ article }) {
  const { Link } = useAdapters()
  const { titulo, volanta, imagen, slug, focalPoint } = article
  const href = slug ? `/${slug}` : '#'

  return (
    <Tooltip text={titulo}>
      <article className={`${styles.card} ${styles.mini}`}>
        {imagen?.url && (
          <Link href={href} className={styles.imgLink}>
            <AspectImage
              src={imagen.url}
              alt={imagen.alt ?? titulo ?? ''}
              aspect="16:9"
              focalPoint={focalPoint}
              variants={imagen.variants ?? null}
              sizes="(min-width: 1024px) 240px, (min-width: 768px) 33vw, 100vw"
            />
          </Link>
        )}
        <div className={styles.body}>
          <div className={styles.header}>
            {volanta && <span className={styles.volanta}>{volantaWithStop(volanta)}</span>}
            {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
          </div>
        </div>
      </article>
    </Tooltip>
  )
}
