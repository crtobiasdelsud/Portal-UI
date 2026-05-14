import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import styles from './Carrusel.module.scss'
import Tooltip from '../../../../UI/ToolTip/ToolTip.jsx'

export default function CarruselCard({ article }) {

  const { Link } = useAdapters()
  const { titulo, imagen, slug, autor } = article
  const href = slug ? `/${slug}` : '#'

  return (
    <Tooltip text={titulo}>
    <article className={styles.card}>
      {imagen?.url && (
        <Link href={href} className={styles.imgLink}>
          <img
            src={imagen.url}
            alt={imagen.alt ?? titulo ?? ''}
            className={styles.img}
          />
        </Link>
      )}
      <div className={styles.body}>
        {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
        {autor?.nombre && <span className={styles.autor}>Por {autor.nombre}</span>}
      </div>
      {autor?.avatar && (
        <div className={styles.authorAvatarWrap}>
          <img
            src={autor.avatar}
            alt={autor.nombre ?? ''}
            className={styles.authorAvatar}
          />
        </div>
      )}
    </article>
    </Tooltip>
  )
}
