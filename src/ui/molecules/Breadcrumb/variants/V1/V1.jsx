import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import shared from '../../Breadcrumb.module.scss'
import s from './V1.module.scss'

function buildHref(item) {
  if (item.href) return item.href
  const slug = item.label?.toLowerCase().trim().replace(/\s+/g, '-')
  return slug === 'inicio' ? '/' : `/${slug}`
}

export default function V1({ items, isAmp, inlineStyle }) {
  const { Link } = useAdapters()
  const Anchor = ({ href, children, className }) =>
    isAmp
      ? <a href={href} className={className}>{children}</a>
      : <Link href={href} className={className}>{children}</Link>

  return (
    <nav className={`${shared.breadcrumb} ${s.root}`} style={inlineStyle} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const href = buildHref(item)
        return (
          <span key={i} className={shared.item}>
            {i > 0 && <span className={shared.sep} aria-hidden="true">{'>'}</span>}
            <Anchor
              href={href}
              className={isLast
                ? `${shared.current} ${s.current}`
                : `${shared.link} ${s.link}`}
            >
              {item.label}
            </Anchor>
          </span>
        )
      })}
    </nav>
  )
}
