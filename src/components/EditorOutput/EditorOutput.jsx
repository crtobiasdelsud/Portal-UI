'use client'

import { useEffect, useRef, useState } from 'react'
import styles from "./EditorOutput.module.scss"
import { useTheme } from '../../context/SiteConfigContext.jsx'
import { buildSrcSet, resolveImageSrc } from '../../utils/imageVariants.js'

/**
 * Iframe de embed con auto-resize por postMessage.
 *
 * Instagram (y algunos otros) postean al window padre un mensaje
 * `{ type: 'MEASURE', details: { height } }` con el alto real del
 * contenido. Lo escuchamos y ajustamos el iframe al tamaño exacto,
 * eliminando el hueco vacío debajo del comment box.
 *
 * Si nunca llega el mensaje (servicios que no postean, o iframe no listo)
 * queda el `height` del style por default — sin scroll, sólo con espacio
 * de más en el peor caso.
 */
function EmbedIframe({ src, service, style }) {
  const ref = useRef(null)
  const [autoHeight, setAutoHeight] = useState(null)

  useEffect(() => {
    // Servicios que se sabe que postean MEASURE: Instagram. (Twitter usa
    // su propio widgets.js para inyectar; nuestro iframe directo no recibe
    // MEASURE de Twitter. TikTok tampoco postea altura.)
    if (service !== 'instagram') return

    function handleMessage(event) {
      if (typeof event.origin !== 'string' || !event.origin.includes('instagram.com')) return
      if (event.source !== ref.current?.contentWindow) return

      let data = event.data
      if (typeof data === 'string') {
        try { data = JSON.parse(data) } catch { return }
      }
      const h = data?.type === 'MEASURE' ? data?.details?.height : null
      if (typeof h === 'number' && h > 0) setAutoHeight(Math.ceil(h))
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [service])

  const finalStyle = autoHeight != null ? { ...style, height: autoHeight } : style
  return <iframe ref={ref} src={src} style={finalStyle} allowFullScreen />
}

// Fixed class names for AMP (no CSS Modules hashing)
const ampCls = {
  body:             "eo-body",
  paragraph:        "eo-paragraph",
  h1: "eo-h1", h2: "eo-h2", h3: "eo-h3",
  h4: "eo-h4", h5: "eo-h5", h6: "eo-h6",
  listUl:           "eo-list-ul",
  listOl:           "eo-list-ol",
  quote:            "eo-quote",
  image:            "eo-image",
  imageWrap:        "eo-image-wrap",
  epigrafe:         "eo-image-epigrafe",
  delimiter:        "eo-delimiter",
  code:             "eo-code",
  pullquote:        "eo-pullquote",
  pullquoteOpen:    "eo-pullquote-open",
  pullquoteClose:   "eo-pullquote-close",
  authorBlock:      "eo-author-block",
  related:          "eo-related",
  relatedTitle:     "eo-related-title",
  relatedItem:      "eo-related-item",
  relatedImg:       "eo-related-img",
  relatedInfo:      "eo-related-info",
  relatedVolanta:   "eo-related-volanta",
  relatedItemTitle: "eo-related-item-title",
}

// Sync renderer — works in App Router and Pages Router (AMP)
export function EditorBlocks({ data, isAmp = false }) {
  if (!data?.blocks?.length) return null
  const cls = isAmp ? ampCls : styles
  return (
    <div className={cls.body}>
      {data.blocks.map((block, i) => (
        <Block key={i} block={block} cls={cls} isAmp={isAmp} />
      ))}
    </div>
  )
}

// Client component — injects theme CSS vars from context
export default function EditorOutput({ data }) {
  const theme = useTheme()

  if (!data?.blocks?.length) return null

  const cssVars = {
    "--eo-primary":  theme.primary,
    "--eo-accent":   theme.accent,
    "--eo-bg":       theme.background,
    "--eo-font":     theme.fontFamily,
  }

  return (
    <div className={styles.body} style={cssVars}>
      {data.blocks.map((block, i) => (
        <Block key={i} block={block} cls={styles} isAmp={false} />
      ))}
    </div>
  )
}

function renderListItem(item) {
  if (typeof item === 'string') return item
  return item.content ?? ''
}

function Block({ block, cls, isAmp }) {
  switch (block.type) {
    case "paragraph":
      return <p className={cls.paragraph} dangerouslySetInnerHTML={{ __html: block.data.text }} suppressHydrationWarning />

    case "header": {
      const Tag = `h${block.data.level}`
      const clsKey = `h${block.data.level}`
      return <Tag className={cls[clsKey]} dangerouslySetInnerHTML={{ __html: block.data.text }} suppressHydrationWarning />
    }

    case "list": {
      const Tag = block.data.style === "ordered" ? "ol" : "ul"
      const listCls = block.data.style === "ordered" ? cls.listOl : cls.listUl
      return (
        <Tag className={listCls}>
          {block.data.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: renderListItem(item) }} suppressHydrationWarning />
          ))}
        </Tag>
      )
    }

    case "checklist":
      return (
        <ul className={cls.listUl}>
          {block.data.items.map((item, i) => (
            <li key={i}>
              {!isAmp && <input type="checkbox" defaultChecked={item.checked} disabled />}
              <span dangerouslySetInnerHTML={{ __html: item.text }} suppressHydrationWarning />
            </li>
          ))}
        </ul>
      )

    case "quote":
      return (
        <blockquote className={cls.quote} suppressHydrationWarning>
          <p dangerouslySetInnerHTML={{ __html: block.data.text }} suppressHydrationWarning />
          {block.data.caption && <cite dangerouslySetInnerHTML={{ __html: block.data.caption }} suppressHydrationWarning />}
        </blockquote>
      )

    case "image": {
      const src      = block.data.url || block.data.file?.url
      const alt      = block.data.altText || block.data.caption || ""
      const epigrafe = block.data.epigrafe
      // Variantes WebP + dimensiones que ahora persiste el ImageTool del CMS.
      // Imágenes legacy no las traen → degrada a `<img src>` plano (igual que antes).
      const variants = block.data.variants || block.data.file?.variants || null
      const w        = block.data.width  || block.data.file?.width  || null
      const h        = block.data.height || block.data.file?.height || null
      const srcSet   = buildSrcSet(variants)
      const imgSrc   = srcSet ? resolveImageSrc(variants, src, 'large') : src
      return (
        <figure className={cls.image}>
          <div className={cls.imageWrap}>
            {isAmp
              ? <amp-img
                  src={src}
                  alt={alt}
                  width={w || 1200}
                  height={h || 675}
                  layout="responsive"
                />
              : <img
                  src={imgSrc}
                  alt={alt}
                  // width/height intrínsecos → el navegador reserva espacio por
                  // el aspect-ratio y evita CLS, aunque el CSS lo muestre a 100%.
                  {...(w && h ? { width: w, height: h } : {})}
                  {...(srcSet ? { srcSet, sizes: "(max-width: 768px) 100vw, 800px" } : {})}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "auto" }}
                />
            }
            {epigrafe && <p className={cls.epigrafe}>{epigrafe}</p>}
          </div>
        </figure>
      )
    }

    case "embed": {
      if (isAmp) return null  // AMP doesn't allow arbitrary iframes
      const { service, embed, width, height, caption } = block.data

      // Tamaños por servicio: a los iframes cross-origin no se les puede medir
      // el contenido, así que les damos altos generosos para que el embed se
      // renderice completo SIN scroll interno.
      //  - Videos (YouTube/Vimeo/Codepen) → 16:9 responsive (videos siempre encajan).
      //  - Instagram / TikTok / resto → respetar el `height` que vino del bloque
      //    (Editor.js lo setea según el servicio); si no hay, fallback alto
      //    suficiente para cubrir el embed típico. Sin maxHeight ni aspect-ratio
      //    forzado, así el iframe crece tanto como necesite.
      const VIDEO_SERVICES = ["youtube", "vimeo", "codepen"]
      const isVideo = VIDEO_SERVICES.includes(service)

      // Altos por defecto por servicio. Instagram se auto-ajusta vía
      // postMessage en `EmbedIframe`, así que el default sólo aplica hasta
      // que llegue el MEASURE — lo dejamos un poco apretado para minimizar
      // el flash de hueco vacío en el primer paint.
      const MIN_HEIGHT = {
        instagram: 800,
        tiktok: 800,
        twitter: 700,
        reddit: 700,
        facebook: 700,
        imgur: 600,
        pinterest: 700,
      }

      // Anchos máximos por servicio: el contenido del iframe se diseña para
      // un ancho específico (IG ≈540, TikTok portrait ≈360). Sin tope, el
      // iframe se estira a 100% de la columna y el contenido queda a la
      // izquierda con espacio vacío al lado. Con `margin: 0 auto` el iframe
      // se centra dentro de la columna del artículo.
      const MAX_WIDTH = {
        instagram: 540,
        tiktok: 360,
        twitter: 600,
        reddit: 600,
        facebook: 600,
        imgur: 600,
        pinterest: 540,
      }

      let iframeStyle
      if (isVideo) {
        iframeStyle = { width: "100%", aspectRatio: "16 / 9", border: 0, display: "block" }
      } else {
        const floor = MIN_HEIGHT[service]
        const h = floor ? Math.max(height || 0, floor) : (height || 700)
        const maxW = MAX_WIDTH[service]
        iframeStyle = {
          width: "100%",
          maxWidth: maxW || width || "100%",
          height: h,
          border: 0,
          display: "block",
          margin: "0 auto",
        }
      }

      return (
        <figure className={cls.embed} data-service={service}>
          <EmbedIframe src={embed} service={service} style={iframeStyle} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    }

    case "attaches": {
      const href  = block.data.url || block.data.file?.url
      const label = block.data.name || block.data.title || block.data.file?.name || "Archivo adjunto"
      if (!href) return null

      const isVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(href)
      const isPdf   = /\.pdf(\?|$)/i.test(href)

      if (isVideo) {
        return (
          <figure className={cls.attachVideo}>
            <video controls playsInline className={cls.attachVideoEl}>
              <source src={href} />
            </video>
            {label && <figcaption>{label}</figcaption>}
          </figure>
        )
      }

      if (isPdf && !isAmp) {
        return (
          <figure className={cls.attachPdf}>
            <iframe src={href} className={cls.attachPdfEl} title={label} />
            <figcaption>
              <a href={href} target="_blank" rel="noopener noreferrer">📄 {label}</a>
            </figcaption>
          </figure>
        )
      }

      return (
        <a className={cls.attaches} href={href} target="_blank" rel="noopener noreferrer" download>
          📎 {label}
        </a>
      )
    }

    case "delimiter":
      return <hr className={cls.delimiter} />

    case "code":
      return <pre className={cls.code}><code>{block.data.code}</code></pre>

    case "table": {
      const rows = block.data.content || []
      return (
        <table className={cls.table}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  block.data.withHeadings && i === 0
                    ? <th key={j} dangerouslySetInnerHTML={{ __html: cell }} suppressHydrationWarning />
                    : <td key={j} dangerouslySetInnerHTML={{ __html: cell }} suppressHydrationWarning />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    case "warning":
      return (
        <div className={cls.warning}>
          {block.data.title && <strong>{block.data.title}</strong>}
          <p>{block.data.message}</p>
        </div>
      )

    case "raw":
      if (isAmp) return null  // arbitrary HTML not allowed in AMP
      return <div className={cls.raw} dangerouslySetInnerHTML={{ __html: block.data.html }} suppressHydrationWarning />

    case "pullquote": {
      const { variant, text, color, align } = block.data
      const hasClose = variant !== "2"
      // color === '' → el CSS cae a var(--primary-color, #af0437).
      // align ausente (bloques viejos) → default 'center'. `data-align` mueve
      // todo el bloque (comillas + texto); `--pq-text-align` alinea el texto.
      const pqStyle = { "--pq-text-align": align || "center" }
      if (color) pqStyle["--eo-pullquote-color"] = color
      if (isAmp) {
        return (
          <div className={cls.pullquote} style={pqStyle} data-align={align || "center"}>
            <span className={cls.pullquoteOpen}>&ldquo;</span>
            <p dangerouslySetInnerHTML={{ __html: text }} suppressHydrationWarning />
            {hasClose && <span className={cls.pullquoteClose}>&rdquo;</span>}
          </div>
        )
      }
      const pullCls = [cls.pullquote, cls[`pullquoteV${variant}`]].filter(Boolean).join(" ")
      return (
        <div className={pullCls} style={pqStyle} data-align={align || "center"}>
          <span className={cls.pullquoteOpen}>&ldquo;</span>
          <p dangerouslySetInnerHTML={{ __html: text }} suppressHydrationWarning />
          {hasClose && <span className={cls.pullquoteClose}>&rdquo;</span>}
        </div>
      )
    }

    case "authorBlock": {
      const { variant, name, date, time, photo } = block.data
      const dateTime = [date, time].filter(Boolean).join(" - ")
      if (isAmp) {
        return (
          <div className={cls.authorBlock}>
            {photo && <amp-img src={photo} alt={name} width="48" height="48" layout="fixed" />}
            <div>
              <div>Por <strong>{name}</strong></div>
              {dateTime && <div>{dateTime}</div>}
            </div>
          </div>
        )
      }
      const isDark = variant === "2" || variant === "3"
      return (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 16px", margin: "1rem 0",
          borderLeft: "3px solid var(--eo-primary, #B1043F)",
          background: isDark ? "#1a1f36" : "#f5f5f5",
          color: isDark ? "#fff" : "#444",
        }}>
          {photo && <img src={photo} alt={name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />}
          <div>
            <div style={{ fontSize: "0.85rem" }}>Por <strong>{name}</strong></div>
            {dateTime && <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>{dateTime}</div>}
          </div>
        </div>
      )
    }

    case "relatedArticles": {
      const { articles } = block.data
      if (!articles?.length) return null
      return (
        <div className={cls.related}>
          <p className={cls.relatedTitle}>Lee además</p>
          {articles.map((a) => (
            <a key={a.id} href={`/${a.slug || a.id}`} className={cls.relatedItem}>
              {a.image && (isAmp
                ? <amp-img src={a.image} alt={a.title} class={cls.relatedImg} width="80" height="60" layout="fixed" />
                : <img src={a.image} alt={a.title} className={cls.relatedImg} width={80} height={60} loading="lazy" decoding="async" />
              )}
              <div className={cls.relatedInfo}>
                {a.volanta && <span className={cls.relatedVolanta}>{a.volanta}</span>}
                <span className={cls.relatedItemTitle}>{a.title}</span>
              </div>
            </a>
          ))}
        </div>
      )
    }

    default:
      return null
  }
}
