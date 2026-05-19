'use client'

import styles from "./EditorOutput.module.scss"
import { useTheme } from '../../context/SiteConfigContext.jsx'
import { useAdapters } from '../../adapters/AdaptersContext.jsx'

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
  const { Image } = useAdapters()
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
      const src    = block.data.url || block.data.file?.url
      const alt    = block.data.altText || block.data.caption || ""
      const credit = block.data.authorCredits || block.data.caption
      return (
        <figure className={cls.image}>
          {isAmp
            ? <img src={src} alt={alt} />
            : <Image
                src={src}
                alt={alt}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, 800px"
                style={{ width: "100%", height: "auto" }}
              />
          }
          {credit && <figcaption>{credit}</figcaption>}
        </figure>
      )
    }

    case "embed":
      if (isAmp) return null  // AMP doesn't allow arbitrary iframes
      return (
        <figure className={cls.embed}>
          <iframe
            src={block.data.embed}
            width={block.data.width || "100%"}
            height={block.data.height || 400}
            frameBorder="0"
            allowFullScreen
          />
          {block.data.caption && <figcaption>{block.data.caption}</figcaption>}
        </figure>
      )

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
      const { variant, text } = block.data
      const hasClose = variant !== "2"
      if (isAmp) {
        return (
          <div className={cls.pullquote}>
            <span className={cls.pullquoteOpen}>&ldquo;</span>
            <p>{text}</p>
            {hasClose && <span className={cls.pullquoteClose}>&rdquo;</span>}
          </div>
        )
      }
      const pullCls = [cls.pullquote, cls[`pullquoteV${variant}`]].filter(Boolean).join(" ")
      return (
        <div className={pullCls}>
          <span className={cls.pullquoteOpen}>&ldquo;</span>
          <p>{text}</p>
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
            {photo && <img src={photo} alt={name} />}
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
              {a.image && <img src={a.image} alt={a.title} className={cls.relatedImg} />}
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
