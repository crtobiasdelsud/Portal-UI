import style from "./Icon.module.scss"
import Tooltip from "../ToolTip/ToolTip"

function buildTooltip(label, href) {
  try {
    const handle = new URL(href).pathname.replace(/^\//, '').split('/')[0]
    return handle ? `${label} · @${handle}` : label
  } catch {
    return label
  }
}

export default function Icon({ src, label, href, tooltipText }) {
  const maskStyle = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
  }

  const icon = <span style={maskStyle} aria-hidden="true" className={style.icon} />

  if (href) {
    return (
      <Tooltip text={tooltipText ?? buildTooltip(label, href)}>
        <a
          className={style.container}
          href={href}
          aria-label={label}
        >
          {icon}

          <span className={style.srOnly}>
            {label}
          </span>
        </a>
      </Tooltip>
    )
  }

  return icon
}
