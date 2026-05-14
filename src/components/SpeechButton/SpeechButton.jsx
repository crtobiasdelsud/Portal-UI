'use client'

import { useEffect, useState } from 'react'
import { useSpeech } from '../../context/SpeechContext.jsx'
import styles from './SpeechButton.module.scss'

const IconHeadphones = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2.5C5.85833 2.5 2.5 5.85833 2.5 10V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H7.5V10.8333H4.16667V10C4.16667 6.775 6.775 4.16667 10 4.16667C13.225 4.16667 15.8333 6.775 15.8333 10V10.8333H12.5V17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V10C17.5 5.85833 14.1417 2.5 10 2.5Z" fill="currentColor"/>
  </svg>
)

const IconPause = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1.66675C5.40002 1.66675 1.66669 5.40008 1.66669 10.0001C1.66669 14.6001 5.40002 18.3334 10 18.3334C14.6 18.3334 18.3334 14.6001 18.3334 10.0001C18.3334 5.40008 14.6 1.66675 10 1.66675ZM9.16669 13.3334H7.50002V6.66675H9.16669V13.3334ZM12.5 13.3334H10.8334V6.66675H12.5V13.3334Z" fill="currentColor"/>
  </svg>
)

const IconPlay = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1.66675C5.40002 1.66675 1.66669 5.40008 1.66669 10.0001C1.66669 14.6001 5.40002 18.3334 10 18.3334C14.6 18.3334 18.3334 14.6001 18.3334 10.0001C18.3334 5.40008 14.6 1.66675 10 1.66675ZM8.33335 13.7501V6.25008L13.3334 10.0001L8.33335 13.7501Z" fill="currentColor"/>
  </svg>
)

export default function SpeechButton({ titulo, copete, cuerpo, imagen }) {
  const [supported, setSupported] = useState(false)
  const { playing, paused, play, pause, resume, meta } = useSpeech()

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  if (!supported) return null

  const isThisNote = meta.titulo === titulo
  const isPlaying  = playing && isThisNote
  const isPaused   = paused  && isThisNote

  const handleClick = () => {
    if (isPlaying) { pause(); return }
    if (isPaused)  { resume(); return }
    play({ titulo, copete, cuerpo, imagen })
  }

  const icon  = isPlaying ? <IconPause /> : isPaused ? <IconPlay /> : <IconHeadphones />
  const label = isPlaying ? 'Pausar' : isPaused ? 'Reproducir' : 'Escuchar nota'

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.btn}
        onClick={handleClick}
        aria-label={label}
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </button>
    </div>
  )
}
