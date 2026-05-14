import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import shared from '../../AuthorBlock.module.scss'
import s from './V3.module.scss'

export default function V3({ isAmp, inlineStyle, displayName, authorSlug, dateStr, ampDate, v }) {
  const { Link } = useAdapters()
  if (isAmp) {
    return (
      <div className={`author-block author-block--${v}`} style={inlineStyle}>
        <div className="author-block__info">
          <span className="author-block__name">Por <strong>{displayName}</strong></span>
          {ampDate && <span className="author-block__date">{ampDate}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={`${shared.container} ${s.root}`} style={inlineStyle}>
      <span className={`${shared.name} ${s.name}`}>
        Por{' '}
        {authorSlug
          ? <Link href={`/autor/${authorSlug}`}><strong>{displayName}</strong></Link>
          : <strong>{displayName}</strong>
        }
      </span>
      {dateStr && <span className={`${shared.date} ${s.date}`}>{dateStr}</span>}
    </div>
  )
}
