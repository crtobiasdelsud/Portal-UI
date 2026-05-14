'use client'

import { ensureContrast } from '../../../../utils/colorContrast.js'
import { useDrawer } from '../DrawerContext/DrawerContext'
import styles from './LiveBanner.module.scss'

function toEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=0`
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=0`
    }
  } catch {}
  return url
}

export default function LiveBanner({ liveUrl, liveTitle, secondaryColor }) {
  const { liveDismissed, setLiveDismissed } = useDrawer()

  if (!liveUrl || liveDismissed) return null

  const bg       = secondaryColor || '#0D1333'
  const txtColor = ensureContrast('#ffffff', bg)
  const embedUrl = toEmbedUrl(liveUrl)

  return (
    <div className={styles.banner} style={{ background: bg, color: txtColor }}>

      <div className={styles.preview}>
        <iframe
          src={embedUrl}
          className={styles.frame}
          allowFullScreen
          allow="autoplay"
          tabIndex={-1}
          title="Preview en vivo"
        />
      </div>

      <div className={styles.info}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          EN VIVO
        </span>
        {liveTitle && <p className={styles.title}>{liveTitle}</p>}
      </div>

      <div className={styles.actions}>
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
          aria-label="Ver en pantalla completa"
          style={{ color: txtColor }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </a>
        <button
          className={styles.btn}
          onClick={() => setLiveDismissed(true)}
          aria-label="Cerrar"
          style={{ color: txtColor }}
        >
          ✕
        </button>
      </div>

    </div>
  )
}
