'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSpeech } from '../../context/SpeechContext.jsx'
import styles from './SpeechPlayerBar.module.scss'

export default function SpeechPlayerBar() {
  const [mounted, setMounted] = useState(false)
  const { playing, paused, progress, meta, pause, resume, stop, skip, seekTo } = useSpeech()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || (!playing && !paused)) return null

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1))
    seekTo(ratio)
  }

  return createPortal(
    <div className={styles.bar} role="region" aria-label="Reproductor de nota">

      <button className={styles.closeBtn} onClick={stop} aria-label="Detener lectura">✕</button>

      {/* Thumbnail */}
      <div className={styles.thumb}>
        {meta.imagen
          ? <img src={meta.imagen} alt="" className={styles.thumbImg} />
          : <span className={styles.thumbIcon}>🔊</span>
        }
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.titulo}>{meta.titulo}</span>
        <span className={styles.subtitle}>{playing ? 'Escuchando nota...' : 'En pausa'}</span>
      </div>

      {/* Equalizer */}
      <div className={`${styles.eq} ${!playing ? styles.eqPaused : ''}`} aria-hidden="true">
        <span className={styles.eqBar} />
        <span className={styles.eqBar} />
        <span className={styles.eqBar} />
        <span className={styles.eqBar} />
      </div>

      {/* Skip back */}
      <button className={styles.skipBtn} onClick={() => skip(-1)} aria-label="Retroceder">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
        </svg>
      </button>

      {/* Play / Pause */}
      <button
        className={styles.playBtn}
        onClick={playing ? pause : resume}
        aria-label={playing ? 'Pausar' : 'Continuar'}
      >
        {playing
          ? <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
        }
      </button>

      {/* Skip forward */}
      <button className={styles.skipBtn} onClick={() => skip(1)} aria-label="Adelantar">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M6 18l8.5-6L6 6v12zm2.5-6L15 6v12z" style={{display:'none'}}/>
          <path d="M16 6h-2v12h2zm-3.5 6L4 6v12z"/>
        </svg>
      </button>

      {/* Progress bar */}
      <div
        className={styles.progressTrack}
        onClick={handleProgressClick}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        title="Click para saltar a esa parte"
      >
        <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
      </div>

    </div>,
    document.body
  )
}
