import Icon from '../../../../atoms/Icon/Icon.jsx'
import shared from '../../ShareBlock.module.scss'
import s from './V1.module.scss'

export default function V1({ isAmp, inlineStyle, networks, v, borderLeft = false }) {
  const containerCls = isAmp
    ? `share-block share-block--${v}${borderLeft ? ' share-block--bordered' : ''}`
    : `${shared.container} ${s.root}${borderLeft ? ` ${shared.borderLeft}` : ''}`

  return (
    <div className={containerCls} style={inlineStyle}>
      <span className={isAmp ? 'share-block__label' : shared.label}>
        Compartí esta nota:
      </span>
      <div className={isAmp ? 'share-block__icons' : shared.icons}>
        {networks.map(({ key, Glyph, label, href, tooltip }) => {
          // Links externos (http) → pestaña nueva. `mailto:` queda en la misma.
          const external = (href ?? '').startsWith('http')
          return isAmp
            ? (
              <a
                key={key}
                href={href ?? '#'}
                className="share-block__icon-link"
                aria-label={label}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <Glyph className="share-block__icon" />
              </a>
            ) : (
              <Icon key={key} glyph={<Glyph />} label={label} href={href ?? '#'} tooltipText={tooltip} newTab={external} />
            )
        })}
      </div>
    </div>
  )
}
