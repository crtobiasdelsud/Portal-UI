import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import { useAuthorDisplay } from '../../../../utils/authorDisplay.js'
import AspectImage from '../../../UI/AspectImage/AspectImage.jsx'
import s from './V3.module.scss'

export default function V3({ article, important = false, inlineStyle }) {
  const { Link } = useAdapters()
  const { displayName } = useAuthorDisplay(article.autor, article.publicarComoOrg)

  return (
    <article style={inlineStyle} className={`${s.container} ${important ? s.important : ''}`}>
      <Link href={article.slug ? `/${article.slug}` : '#'} className={s.link}>
        <div className={s.imgWrap}>
          {article.imagen?.url && (
            <div className={s.mediaBox}>
              <AspectImage
                src={article.imagen.url}
                alt={article.imagen.alt ?? ''}
                fill
                focalPoint={article.focalPoint}
                variants={article.imagen?.variants ?? null}
                sizes="(max-width: 768px) 100vw, 66vw"
                priority={important}
              />
            </div>
          )}
          <div className={s.gradient} aria-hidden="true" />
          <div className={s.overlay}>
            {article.volanta && <p className={s.volanta}>{article.volanta}</p>}
            <h2 className={s.headline}>{article.titulo}</h2>
          </div>
        </div>

        {displayName && (
          <span className={s.autor}>Por {displayName}</span>
        )}
      </Link>
    </article>
  )
}
