'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const SpeechCtx = createContext(null)

const STORAGE_KEY = 'portal-ui:speech'

// ── Persistencia en sessionStorage ────────────────────────────────────────────
// Permite que la barra sobreviva a un remount del provider (navegación SPA).

const readSession = () => {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') }
  catch { return null }
}

const updateSession = (patch) => {
  try {
    const cur = readSession() || {}
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...cur, ...patch }))
  } catch { /* sessionStorage no disponible */ }
}

const clearSession = () => {
  try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
}

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

  const utterRef    = useRef(null)
  const textRef     = useRef('')
  const charRef     = useRef(0)
  const lastSaveRef = useRef(0)     // throttle de escritura a sessionStorage
  const mountedRef  = useRef(true)  // false tras desmontar este provider

  // ── Restaura el estado tras un remount del provider ─────────────────────────
  // Antes este efecto cancelaba el audio en CADA desmontaje, lo que rompía la
  // navegación SPA. Ahora solo cancela al cerrar/recargar la pestaña de verdad.
  useEffect(() => {
    const saved = readSession()
    if (saved?.text) {
      textRef.current = saved.text
      charRef.current = saved.charIndex || 0
      setMeta({ titulo: saved.titulo || '', imagen: saved.imagen || null })
      setProgress(saved.progress || 0)
      // El audio del navegador no sobrevive a un remount de React: cancelamos
      // la utterance huérfana y dejamos la barra en pausa para que el usuario
      // retome desde la posición guardada (resume() re-arranca solo).
      window.speechSynthesis?.cancel()
      setPlaying(false)
      setPaused(true)
    }

    const onUnload = () => {
      window.speechSynthesis?.cancel()
      clearSession()
    }
    window.addEventListener('beforeunload', onUnload)
    return () => {
      mountedRef.current = false
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [])

  const startFrom = useCallback((charIndex) => {
    window.speechSynthesis.cancel()
    const slice = textRef.current.slice(charIndex)
    if (!slice) return

    const utter = new SpeechSynthesisUtterance(slice)
    const voices = window.speechSynthesis.getVoices()
    const esVoice = voices.find((v) => v.lang.startsWith('es'))
    if (esVoice) utter.voice = esVoice
    utter.rate = 1

    // Ignora eventos de utterances viejas (tras un skip/seek) o de un provider
    // ya desmontado. Sin esto, un cancel() deliberado disparaba onend → y onend
    // borraba la sesión, cerrando la barra en la siguiente navegación.
    const isStale = () => !mountedRef.current || utterRef.current !== utter

    utter.onboundary = (e) => {
      if (isStale()) return
      const abs = charIndex + (e.charIndex ?? 0)
      charRef.current = abs
      const p = abs / textRef.current.length
      setProgress(p)
      // Persiste el avance, pero como máximo cada 1.5s para no saturar.
      const now = Date.now()
      if (now - lastSaveRef.current > 1500) {
        lastSaveRef.current = now
        updateSession({ charIndex: abs, progress: p })
      }
    }
    utter.onend = () => {
      if (isStale()) return   // fue un cancel() deliberado, NO un fin de lectura
      setPlaying(false); setPaused(false); setProgress(0)
      charRef.current = 0
      clearSession()
    }
    utter.onerror = () => {
      if (isStale()) return
      setPlaying(false); setPaused(false)
    }

    utterRef.current = utter
    setTimeout(() => window.speechSynthesis.speak(utter), 100)
    setPlaying(true)
    setPaused(false)
  }, [])

  const play = useCallback(({ titulo, copete, cuerpo, imagen }) => {
    const text = extractText(titulo, copete, cuerpo)
    textRef.current = text
    charRef.current = 0
    setMeta({ titulo, imagen: imagen ?? null })
    setProgress(0)
    updateSession({
      titulo, imagen: imagen ?? null,
      text, charIndex: 0, progress: 0, status: 'playing',
    })
    startFrom(0)
  }, [startFrom])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setPlaying(false)
    setPaused(true)
    updateSession({ status: 'paused', charIndex: charRef.current })
  }, [])

  const resume = useCallback(() => {
    // Si la utterance sigue viva en el navegador, simplemente la reanudamos.
    // Si no (p. ej. tras un remount), re-arrancamos desde la posición guardada.
    if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setPlaying(true)
      setPaused(false)
    } else {
      startFrom(charRef.current)
    }
    updateSession({ status: 'playing' })
  }, [startFrom])

  const stop = useCallback(() => {
    utterRef.current = null   // su onend quedará marcado como "stale" → no re-procesa
    window.speechSynthesis.cancel()
    setPlaying(false)
    setPaused(false)
    setProgress(0)
    charRef.current = 0
    clearSession()
  }, [])

  // Salta ±10% del texto total
  const skip = useCallback((direction) => {
    const delta = Math.floor(textRef.current.length * 0.10) * direction
    const newPos = Math.max(0, Math.min(charRef.current + delta, textRef.current.length - 1))
    charRef.current = newPos
    updateSession({ charIndex: newPos, status: 'playing' })
    startFrom(newPos)
  }, [startFrom])

  // Click en la barra de progreso — ratio 0..1
  const seekTo = useCallback((ratio) => {
    const pos = Math.floor(ratio * textRef.current.length)
    charRef.current = pos
    updateSession({ charIndex: pos, status: 'playing' })
    startFrom(pos)
  }, [startFrom])

  return (
    <SpeechCtx.Provider value={{ playing, paused, progress, meta, play, pause, resume, stop, skip, seekTo }}>
      {children}
    </SpeechCtx.Provider>
  )
}

export const useSpeech = () => useContext(SpeechCtx)
