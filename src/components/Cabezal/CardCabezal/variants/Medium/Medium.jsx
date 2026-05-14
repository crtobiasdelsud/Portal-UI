import styles from '../../CardCabezal.module.scss'
import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../../UI/AspectImage/AspectImage.jsx'
import Tooltip from '../../../../UI/ToolTip/ToolTip.jsx'

export default function Medium({ article }) {

  const { Link } = useAdapters()
  const { titulo, volanta, imagen, slug, autor, focalPoint } = article
  const href = slug ? `/${slug}` : '#'

  return (
   <Tooltip text={titulo}>
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
        <div className={styles.header}>
          {volanta && <span className={styles.volanta}>{volanta}.</span>}
          {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
        </div>
        {autor?.nombre && <span className={styles.autor}>Por {autor.nombre}</span>}
      </div>
    </article>
    </Tooltip>
  )
}
