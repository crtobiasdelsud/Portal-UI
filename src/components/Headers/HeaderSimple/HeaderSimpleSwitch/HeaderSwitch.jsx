"use client"

import { useEffect, useState } from "react"
import styles from './HeaderSwitch.module.scss'
import { DrawerProvider } from '../DrawerContext/DrawerContext'

export default function HeaderSwitch({ mobile, desktop, desktopCompact }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <DrawerProvider>
        <div className={styles.mobileSlot}>{mobile}</div>
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
