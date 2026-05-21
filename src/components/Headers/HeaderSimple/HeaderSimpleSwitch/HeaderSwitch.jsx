"use client"

import { useEffect, useRef, useState } from "react"
import styles from './HeaderSwitch.module.scss'
import { DrawerProvider } from '../DrawerContext/DrawerContext'

export default function HeaderSwitch({ mobile, desktop, desktopCompact }) {
  const [scrolled, setScrolled] = useState(false)
  // El <header> mobile es `position: fixed` (ver HeaderSimpleMobile.scss).
  // Medimos su altura real con ResizeObserver y la inyectamos como `height`
  // inline en el slot para reservar espacio en el flujo del documento.
  const [mobileHeight, setMobileHeight] = useState(0)
  const mobileWrapperRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const wrapper = mobileWrapperRef.current
    if (!wrapper) return
    const header = wrapper.querySelector('header')
    if (!header) return

    const update = () => setMobileHeight(header.offsetHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <DrawerProvider>
        <div
          ref={mobileWrapperRef}
          className={styles.mobileSlot}
          style={mobileHeight ? { height: mobileHeight } : undefined}
        >
          {mobile}
        </div>
      </DrawerProvider>

      <DrawerProvider>
        <div className={`${styles.desktopSlot} ${scrolled ? styles.hidden : ''}`}>
          {desktop}
        </div>
        <div className={styles.desktopCompactSlot}>
          {desktopCompact}
        </div>
      </DrawerProvider>
    </>
  )
}
