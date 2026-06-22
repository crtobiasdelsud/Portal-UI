import styles from '../../CardCabezal.module.scss'
import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import { useAuthorDisplay } from '../../../../../utils/authorDisplay.js'
import { sanitizeInlineHtml } from '../../../../../utils/sanitizeHtml.js'
import AspectImage from '../../../../UI/AspectImage/AspectImage.jsx'
import Tooltip from '../../../../UI/ToolTip/ToolTip.jsx'
import { volantaWithStop } from '../../../../../utils/volanta.js'

export default function FeaturedHorizontal({ article }) {

  const { Link } = useAdapters()
  const { titulo, volanta, copete, imagen, slug, autor, publicarComoOrg, focalPoint } = article
  const href = slug ? `/${slug}` : '#'
  const { displayName } = useAuthorDisplay(autor, publicarComoOrg)

  return (
<Tooltip text={titulo}>
    <article className={`${styles.card} ${styles.featuredHorizontal}`}>
      {imagen?.url && (
        <Link href={href} className={styles.imgLinkHoriz}>
          <AspectImage
            src={imagen.url}
            alt={imagen.alt ?? titulo ?? ''}
            aspect="16:9"
            focalPoint={focalPoint}
            variants={imagen.variants ?? null}
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </Link>
      )}
      <div className={styles.body}>
        <div className={styles.header}>
          {volanta && <span className={styles.volanta}>{volantaWithStop(volanta)}</span>}
          {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
        </div>
        {copete && <div className={styles.copete} dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(copete) }} />}
        {displayName && <span className={styles.autor}>Por {displayName}</span>}
      </div>
    </article>
    </Tooltip>
  )
}
