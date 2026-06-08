'use client'

// Tooltip DESACTIVADO (ni mobile ni desktop).
// El componente solo renderiza children, sin envoltorio ni listeners.
// Para reactivarlo, descomentar el bloque de abajo y borrar este passthrough.
export default function Tooltip({ children }) {
  return children
}

/* --- Implementación original (desactivada) ---
import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from "./ToolTip.module.scss"

export default function Tooltip({ text, children, delay = 800 }) {
  const [pos, setPos] = useState({ visible: false, x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const show = useCallback((e) => {
    const x = e.clientX
    const y = e.clientY
    timerRef.current = setTimeout(() => {
      setPos({ visible: true, x, y })
    }, delay)
  }, [delay])

  const move = useCallback((e) => {
    setPos(p => p.visible ? { ...p, x: e.clientX, y: e.clientY } : p)
  }, [])

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    setPos(p => ({ ...p, visible: false }))
  }, [])

  if (isTouch) return children

  return (
    <>
      <div
        className={styles.wrapper}
        onMouseEnter={show}
        onMouseMove={move}
        onMouseLeave={hide}
      >
        {children}
      </div>
      {pos.visible && typeof document !== 'undefined' && createPortal(
        <div
          className={styles.floatingTip}
          style={{ top: pos.y - 12, left: pos.x }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  )
}
--- fin implementación original --- */
