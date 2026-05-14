'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const SpeechCtx = createContext(null)

const strip = (html) => (html ?? '').replace(/<[^>]+>/g, '').trim()

function extractText(titulo, copete, cuerpo) {
  const parts = []
  if (titulo) parts.push(titulo)
  if (copete) parts.push(copete)
  const blocks = cuerpo?.blocks
  if (!Array.isArray(blocks)) return parts.join('. ')
  blocks.forEach((block) => {
    if (!block?.data) return
    switch (block.type) {
      case 'paragraph':
      case 'header': {
        const t = strip(block.data.text)
        if (t) parts.push(t)
        break
      }
      case 'list':
      case 'checklist':
        block.data.items?.forEach((item) => {
          const t = strip(typeof item === 'string' ? item : item?.content ?? item?.text ?? '')
          if (t) parts.push(t)
        })
        break
      case 'quote':
      case 'pullquote': {
        const t = strip(block.data.text)
        if (t) parts.push(t)
        break
      }
      case 'warning':
        if (block.data.title) parts.push(strip(block.data.title))
        if (block.data.message) parts.push(strip(block.data.message))
        break
      default:
        break
    }
  })
  return parts.join('. ')
}

export function SpeechProvider({ children }) {
  const [playing, setPlaying]   = useState(false)
  const [paused, setPaused]     = useState(false)
  const [progress, setProgress] = useState(0)
  const [meta, setMeta]         = useState({ titulo: '', imagen: null })

  const utterRef  = useRef(null)
  const textRef   = useRef('')
  const charRef   = useRef(0)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  const startFrom = useCallback((charIndex) => {
    window.speechSynthesis.cancel()
    const slice = textRef.current.slice(charIndex)
    if (!slice) return

    const utter = new SpeechSynthesisUtterance(slice)
    const voices = window.speechSynthesis.getVoices()
    const esVoice = voices.find((v) => v.lang.startsWith('es'))
    if (esVoice) utter.voice = esVoice
    utter.rate = 1

    utter.onboundary = (e) => {
      const abs = charIndex + (e.charIndex ?? 0)
      charRef.current = abs
      setProgress(abs / textRef.current.length)
    }
    utter.onend  = () => { setPlaying(false); setPaused(false); setProgress(0); charRef.current = 0 }
    utter.onerror = () => { setPlaying(false); setPaused(false) }

    utterRef.current = utter
    setTimeout(() => window.speechSynthesis.speak(utter), 100)
    setPlaying(true)
    setPaused(false)
  }, [])

  const play = useCallback(({ titulo, copete, cuerpo, imagen }) => {
    const text = extractText(titulo, copete, cuerpo)
    console.log('[Speech] voz cargada:', window.speechSynthesis.getVoices().find(v => v.lang.startsWith('es'))?.name ?? 'default')
    console.log('[Speech] texto completo:', text)
    textRef.current = text
    charRef.current = 0
    setMeta({ titulo, imagen: imagen ?? null })
    setProgress(0)
    startFrom(0)
  }, [startFrom])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setPlaying(false)
    setPaused(true)
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    setPlaying(true)
    setPaused(false)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setPlaying(false)
    setPaused(false)
    setProgress(0)
    charRef.current = 0
  }, [])

  // Salta ±10% del texto total
  const skip = useCallback((direction) => {
    const delta = Math.floor(textRef.current.length * 0.10) * direction
    const newPos = Math.max(0, Math.min(charRef.current + delta, textRef.current.length - 1))
    charRef.current = newPos
    startFrom(newPos)
  }, [startFrom])

  // Click en la barra de progreso — ratio 0..1
  const seekTo = useCallback((ratio) => {
    const pos = Math.floor(ratio * textRef.current.length)
    charRef.current = pos
    startFrom(pos)
  }, [startFrom])

  return (
    <SpeechCtx.Provider value={{ playing, paused, progress, meta, play, pause, resume, stop, skip, seekTo }}>
      {children}
    </SpeechCtx.Provider>
  )
}

export const useSpeech = () => useContext(SpeechCtx)
