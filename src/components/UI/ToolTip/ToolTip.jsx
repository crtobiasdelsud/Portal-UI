'use client'

import { useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from "./ToolTip.module.scss"

export default function Tooltip({ text, children, delay = 800 }) {
  const [pos, setPos] = useState({ visible: false, x: 0, y: 0 })
  const timerRef = useRef(null)

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
