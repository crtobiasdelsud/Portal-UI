import { useAdapters } from '../../../../../../adapters/AdaptersContext.jsx'
import { useAuthorDisplay } from '../../../../../../utils/authorDisplay.js'
import AspectImage from '../../../../../atoms/AspectImage/AspectImage.jsx'
import styles from './Carrusel.module.scss'
import Tooltip from '../../../../../atoms/ToolTip/ToolTip.jsx'

export default function CarruselCard({ article }) {

  const { Link } = useAdapters()
  const { titulo, imagen, slug, autor, publicarComoOrg, focalPoint } = article
  const href = slug ? `/${slug}` : '#'
  const { displayName, avatarSrc } = useAuthorDisplay(autor, publicarComoOrg)

  return (
    <Tooltip text={titulo}>
    <article className={styles.card}>
      {imagen?.url && (
        <Link href={href} className={styles.imgLink}>
          <AspectImage
            src={imagen.url}
            alt={imagen.alt ?? titulo ?? ''}
            fill
            focalPoint={focalPoint}
            variants={imagen.variants ?? null}
          />
        </Link>
      )}
      <div className={styles.body}>
        {titulo && <Link href={href} className={styles.titulo}>{titulo}</Link>}
        {displayName && <span className={styles.autor}>Por {displayName}</span>}
      </div>
      {avatarSrc && (
        <div className={styles.authorAvatarWrap}>
          <img
            src={avatarSrc}
            alt={displayName ?? ''}
            className={styles.authorAvatar}
          />
        </div>
      )}
    </article>
    </Tooltip>
  )
}
