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

export default function Icon({ src, glyph, label, href, tooltipText, newTab = false }) {
  // Dos modos de render del ícono:
  //   - `glyph`: SVG inline (React node). Recolorea vía `fill="currentColor"`.
  //   - `src`:   ruta a un .svg, usado como `mask-image` (modo legacy).
  const icon = glyph
    ? <span aria-hidden="true" className={style.glyph}>{glyph}</span>
    : <span
        aria-hidden="true"
        className={style.icon}
        style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
      />

  if (href) {
    return (
      <Tooltip text={tooltipText ?? buildTooltip(label, href)}>
        <a
          className={style.container}
          href={href}
          aria-label={label}
          {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}
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
