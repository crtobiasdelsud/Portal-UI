'use client'

import { useState, useRef, useEffect } from 'react'
import { ensureContrast } from '../../../../utils/colorContrast.js'
import { useDrawer } from '../DrawerContext/DrawerContext'
import styles from './LiveBanner.module.scss'

function getYouTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1)
    }
  } catch {}
  return null
}

function buildEmbedSrc(url, { autoplay, mute }) {
  const id = getYouTubeId(url)
  if (!id) return url
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    mute:     mute     ? '1' : '0',
    enablejsapi: '1',
    rel:        '0',
    playsinline:'1',
  })
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

let ytApiPromise = null
function loadYouTubeAPI() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (ytApiPromise) return ytApiPromise
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return ytApiPromise
}

export default function LiveBanner({ liveUrl, liveTitle, secondaryColor }) {
  const { liveDismissed, setLiveDismissed } = useDrawer()
  const [expanded, setExpanded] = useState(false)
  const [muted, setMuted]       = useState(true)
  const iframeRef = useRef(null)
  const playerRef = useRef(null)

  const videoId = getYouTubeId(liveUrl)

  useEffect(() => {
    if (!videoId || !iframeRef.current) return
    let cancelled = false

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !iframeRef.current || !YT?.Player) return
      try {
        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            onReady: (e) => {
              try { e.target.mute() } catch {}
              setMuted(true)
            },
          },
        })
      } catch {}
    })

    return () => {
      cancelled = true
      try { playerRef.current?.destroy?.() } catch {}
      playerRef.current = null
    }
  }, [videoId])

  if (!liveUrl || liveDismissed) return null

  const bg       = secondaryColor || '#0D1333'
  const txtColor = ensureContrast('#ffffff', bg)
  const src      = buildEmbedSrc(liveUrl, { autoplay: true, mute: true })

  const toggleSound = () => {
    const p = playerRef.current
    if (!p) return
    try {
      if (muted) {
        p.unMute()
        if (typeof p.setVolume === 'function') p.setVolume(100)
        setMuted(false)
      } else {
        p.mute()
        setMuted(true)
      }
    } catch {}
  }

  return (
    <div
      className={`${styles.banner} ${expanded ? styles.expanded : ''}`}
      style={{ background: bg, color: txtColor }}
    >

      <div className={styles.preview}>
        <iframe
          ref={iframeRef}
          src={src}
          className={styles.frame}
          allowFullScreen
          allow="autoplay; encrypted-media"
          tabIndex={expanded ? 0 : -1}
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
        {expanded && (
          <button
            type="button"
            className={styles.btn}
            onClick={toggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            aria-pressed={!muted}
            style={{ color: txtColor }}
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          className={styles.btn}
          onClick={() => setExpanded(v => !v)}
          aria-label={expanded ? 'Contraer preview' : 'Expandir preview'}
          aria-pressed={expanded}
          style={{ color: txtColor }}
        >
          {expanded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
              <line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          )}
        </button>

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
