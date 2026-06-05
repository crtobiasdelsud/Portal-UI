"use client"

import { cloneElement, useEffect, useRef, useState } from "react"
import styles from './HeaderSwitch.module.scss'
import { DrawerProvider } from '../DrawerContext/DrawerContext'
import LivePlayerHost from '../LivePlayerHost/LivePlayerHost'

export default function HeaderSwitch({ mobile, desktop, desktopCompact, hasLive = false, liveUrl, takeover = false }) {
  const [scrolled, setScrolled] = useState(false)
  // El <header> mobile es `position: fixed` (ver HeaderSimpleMobile.scss).
  // Medimos su altura real con ResizeObserver y la inyectamos como `height`
  // inline en el slot para reservar espacio en el flujo del documento.
  //
  // El estado se inicializa con una ESTIMACIÓN del alto del header ya en SSR
  // (no en 0): ~91px sin LiveBanner (dateTimeBar 27 + topRow 64) y ~176px con
  // LiveBanner (≈ +85px del banner colapsado). Así el slot reserva el espacio
  // desde el primer paint y `main` no salta al hidratar (CLS). El ResizeObserver
  // afina el valor exacto después — y como es un valor (no un min-height fijo),
  // al cerrar/colapsar el banner la altura baja sin dejar hueco.
  const [mobileHeight, setMobileHeight] = useState(hasLive ? 176 : 91)
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
          className={`${styles.mobileSlot} ${takeover ? styles.mobileSlotTakeover : ''}`}
          style={{ height: takeover ? 0 : mobileHeight }}
        >
          {takeover ? cloneElement(mobile, { scrolled }) : mobile}
        </div>
        {liveUrl && <LivePlayerHost liveUrl={liveUrl} />}
      </DrawerProvider>

      <DrawerProvider>
        <div className={`${styles.desktopSlot} ${scrolled ? styles.hidden : ''} ${takeover ? styles.desktopSlotTakeover : ''}`}>
          {desktop}
        </div>
        <div className={`${styles.desktopCompactSlot} ${takeover && !scrolled ? styles.compactHiddenTakeover : ''}`}>
          {desktopCompact}
        </div>
        {liveUrl && <LivePlayerHost liveUrl={liveUrl} />}
      </DrawerProvider>
    </>
  )
}
