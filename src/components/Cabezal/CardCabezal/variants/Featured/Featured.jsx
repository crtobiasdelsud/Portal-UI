import styles from '../../CardCabezal.module.scss'
import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import { useAuthorDisplay } from '../../../../../utils/authorDisplay.js'
import AspectImage from '../../../../UI/AspectImage/AspectImage.jsx'
import Tooltip from '../../../../UI/ToolTip/ToolTip.jsx'
import { volantaWithStop } from '../../../../../utils/volanta.js'

export default function Featured({ article, large }) {

  const { Link } = useAdapters()
  const { titulo, volanta, copete, imagen, slug, autor, publicarComoOrg, focalPoint } = article
  const href = slug ? `/${slug}` : '#'
  const { displayName } = useAuthorDisplay(autor, publicarComoOrg)

  return (
 <Tooltip text={titulo}>
    <article className={`${styles.card} ${styles.featured} ${large ? styles.featuredLarge : ''}`}>
      {imagen?.url && (
        <Link href={href} className={`${styles.imgLink} ${styles.imgLinkFill}`}>
          <AspectImage
            src={imagen.url}
            alt={imagen.alt ?? titulo ?? ''}
            aspect="16:9"
            fill
            focalPoint={focalPoint}
            variants={imagen.variants ?? null}
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        </Link>
      )}
      <div className={styles.body}>
        <div className={styles.header}>
          {volanta && <span className={styles.volanta}>{volantaWithStop(volanta)}</span>}
          {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
        </div>
        {displayName && <span className={styles.autor}>Por {displayName}</span>}
      </div>
    </article>
    </Tooltip>
  )
}
