import styles from '../../CardCabezal.module.scss'
import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../../UI/AspectImage/AspectImage.jsx'
import Tooltip from '../../../../UI/ToolTip/ToolTip.jsx'
import { volantaWithStop } from '../../../../../utils/volanta.js'

export default function Ranked({ article, rank, rankVariant }) {

  const { Link } = useAdapters()
  const { titulo, volanta, imagen, slug, autor, focalPoint } = article
  const href = slug ? `/${slug}` : '#'
  const variantClass = rankVariant && rankVariant !== 'ranking' ? (styles[rankVariant] ?? '') : ''

  return (
<Tooltip text={titulo}>
    <article className={`${styles.card} ${styles.ranked} ${variantClass}`}>
      {imagen?.url && (
        <Link href={href} className={styles.imgLink}>
          <AspectImage
            src={imagen.url}
            alt={imagen.alt ?? titulo ?? ''}
            aspect="16:9"
            focalPoint={focalPoint}
            variants={imagen.variants ?? null}
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
          />
        </Link>
      )}
      <div className={styles.body}>
        <div className={styles.header}>
          {volanta && <span className={styles.volanta}>{volantaWithStop(volanta)}</span>}
          {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
        </div>
        {rank != null && <span className={styles.rank}>{rank}</span>}
      </div>
    </article>
    </Tooltip>
  )
}
