'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSpeech } from '../../context/SpeechContext.jsx'
import styles from './SpeechPlayerBar.module.scss'

export default function SpeechPlayerBar() {
  const [mounted, setMounted] = useState(false)
  const { playing, paused, progress, meta, pause, resume, stop, seekTo } = useSpeech()

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || (!playing && !paused)) return null

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1))
    seekTo(ratio)
  }

  return createPortal(
    <div className={styles.bar} role="region" aria-label="Reproductor de nota">

      {/* Título */}
      <span className={styles.titulo}>{meta.titulo}</span>

      {/* Play / Pause */}
      <button
        className={styles.playBtn}
        onClick={playing ? pause : resume}
        aria-label={playing ? 'Pausar' : 'Continuar'}
      >
        {playing
          ? <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          : <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
        }
      </button>

      {/* Cerrar */}
      <button className={styles.closeBtn} onClick={stop} aria-label="Detener lectura">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/>
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
