import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import shared from '../../AuthorBlock.module.scss'
import s from './V1.module.scss'

export default function V1({ isAmp, inlineStyle, displayName, authorSlug, publicationDate, avatarSrc, showAvatar, v }) {
  const { Link } = useAdapters()
  if (isAmp) {
    return (
      <div className={`author-block author-block--${v}`} style={inlineStyle}>
        {showAvatar && (
          <amp-img src={avatarSrc} alt={displayName ?? ''} width="64" height="64" layout="fixed" class="author-block__avatar" />
        )}
        <div className="author-block__info">
          <span className="author-block__name">Por <strong>{displayName}</strong></span>
          {publicationDate && (
            <time className="author-block__date" dateTime={publicationDate.dateTime}>
              {publicationDate.label}
            </time>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${shared.container} ${s.root}`} style={inlineStyle}>
      {showAvatar && (
        <img src={avatarSrc} alt={displayName ?? ''} className={shared.avatar} />
      )}
      <div className={shared.info}>
        <span className={`${shared.name} ${s.name}`}>
          
          {authorSlug
            ? <Link href={`/autor/${authorSlug}`}><strong>{displayName}</strong></Link>
            : <strong>Por{' '} {displayName}</strong>
          }
        </span>
        {publicationDate && (
          <time className={`${shared.date} ${s.date}`} dateTime={publicationDate.dateTime}>
            {publicationDate.label}
          </time>
        )}
      </div>
    </div>
  )
}
