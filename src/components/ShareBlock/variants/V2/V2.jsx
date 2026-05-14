import Icon from '../../../UI/Icon/Icon.jsx'
import shared from '../../ShareBlock.module.scss'
import s from './V2.module.scss'

export default function V2({ isAmp, inlineStyle, networks, v }) {
  const containerCls = isAmp ? `share-block share-block--${v}` : `${shared.container} ${s.root}`

  return (
    <div className={containerCls} style={inlineStyle}>
      <span className={isAmp ? 'share-block__label' : shared.label}>
        Compartí esta nota:
      </span>
      <div className={isAmp ? 'share-block__icons' : shared.icons}>
        {networks.map(({ key, src, label, href, tooltip }) => (
          isAmp
            ? (
              <a key={key} href={href ?? '#'} className="share-block__icon-link" aria-label={label}>
                <img src={src} alt={label} className="share-block__icon" />
              </a>
            ) : (
              <Icon key={key} src={src} label={label} href={href ?? '#'} tooltipText={tooltip} />
            )
        ))}
      </div>
    </div>
  )
}
