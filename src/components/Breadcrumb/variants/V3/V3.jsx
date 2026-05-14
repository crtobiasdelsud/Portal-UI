import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import shared from '../../Breadcrumb.module.scss'
import s from './V3.module.scss'

export default function V3({ items, isAmp, inlineStyle }) {
  const { Link } = useAdapters()
  const Anchor = ({ href, children, className }) =>
    isAmp
      ? <a href={href} className={className}>{children}</a>
      : <Link href={href} className={className}>{children}</Link>

  return (
    <nav className={`${shared.breadcrumb} ${s.root}`} style={inlineStyle} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className={shared.item}>
            {i > 0 && <span className={shared.sep} aria-hidden="true">{'>'}</span>}
            {isLast
              ? <span className={`${shared.current} ${s.current}`}>{item.label}</span>
              : <Anchor href={item.href} className={`${shared.link} ${s.link}`}>{item.label}</Anchor>
            }
          </span>
        )
      })}
    </nav>
  )
}
