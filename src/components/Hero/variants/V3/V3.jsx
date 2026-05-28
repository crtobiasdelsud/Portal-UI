import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import AspectImage from '../../../UI/AspectImage/AspectImage.jsx'
import s from './V3.module.scss'

export default function V3({ article, important = false, inlineStyle }) {
  const { Link } = useAdapters()

  return (
    <article style={inlineStyle} className={`${s.container} ${important ? s.important : ''}`}>
      <Link href={article.slug} className={s.link}>
        <div className={s.imgWrap}>
          {article.imagen?.url && (
            <div className={s.mediaBox}>
              <AspectImage
                src={article.imagen.url}
                alt={article.imagen.alt ?? ''}
                fill
                focalPoint={article.focalPoint}
                priority
              />
            </div>
          )}
          <div className={s.gradient} aria-hidden="true" />
          <div className={s.overlay}>
            {article.volanta && <p className={s.volanta}>{article.volanta}</p>}
            <h2 className={s.headline}>{article.titulo}</h2>
          </div>
        </div>

        {article.autor?.nombre && (
          <span className={s.autor}>Por {article.autor.nombre}</span>
        )}
      </Link>
    </article>
  )
}
