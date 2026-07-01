"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import styles from "./DolarTicker.module.scss"
import arrowBackBlack from "./arrow_back_ios_black.svg"
import arrowBackWhite from "./arrow_back_ios_white.svg"
import arrowUpward    from "./arrow_upward.svg"
import arrowDownward  from "./arrow_downward.svg"
import { useTheme } from '../../../context/SiteConfigContext.jsx'
import { useAdapters } from '../../../adapters/AdaptersContext.jsx'

const AUTO_INTERVAL = 3500 // ms entre cambios automáticos

export default function DolarTicker() {

  const { Image } = useAdapters()
  const theme = useTheme()
  const [data, setData]   = useState([])
  const [index, setIndex] = useState(0)
  const [dir, setDir]     = useState('next') // 'next' | 'prev'
  const [animKey, setAnimKey] = useState(0)
  const intervalRef = useRef(null)

  // Modo oscuro retirado: el ticker es siempre el clásico (claro / v1), sin
  // importar theme.dolar (configs viejas o theme global quedan en claro).
  const v = '1'
  const isLight = v === '1'
  const navIcon = isLight ? arrowBackBlack : arrowBackWhite

  useEffect(() => {
    fetch("/api/dolar")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
  }, [])

  const startAutoPlay = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDir('next')
      setAnimKey((k) => k + 1)
      setIndex((i) => (i + 1) % data.length)
    }, AUTO_INTERVAL)
  }, [data.length])

  useEffect(() => {
    if (!data.length) return
    startAutoPlay()
    return () => clearInterval(intervalRef.current)
  }, [data.length, startAutoPlay])

  if (!data.length) return (
    <div className={`${styles.container} ${styles[`v${v}`]}`}>
      <div className={styles.mobile}>
        <button className={styles.nav} disabled aria-label="Anterior">
          <Image src={navIcon} alt="" width={16} height={16} className={styles.flipped} />
        </button>
        <div className={styles.mobileItem}>
          <span className={styles.name}>DÓLAR</span>
        </div>
        <button className={styles.nav} disabled aria-label="Siguiente">
          <Image src={navIcon} alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  )

  const go = (direction) => {
    setDir(direction)
    setAnimKey((k) => k + 1)
    setIndex((i) =>
      direction === 'next'
        ? (i + 1) % data.length
        : (i - 1 + data.length) % data.length
    )
    startAutoPlay() // reinicia el timer al tocar
  }

  const current = data[index]
  const trendIcon = current.variacion >= 0 ? arrowUpward : arrowDownward
  const trendClass = current.variacion >= 0 ? styles.up : styles.down

  const inlineStyle = isLight
    ? { backgroundColor: theme.background ?? '#ffffff', color: theme.textColor ?? '#1a1a1a' }
    : { backgroundColor: theme.secondary  ?? '#0D1333', color: '#ffffff' }

  return (
    <div className={`${styles.container} ${styles[`v${v}`]}`} style={inlineStyle}>

      {/* Mobile: carrusel */}
      <div className={styles.mobile}>
        <button className={styles.nav} onClick={() => go('prev')} aria-label="Anterior">
          <Image src={navIcon} alt="" width={16} height={16} className={styles.flipped} />
        </button>

        <div className={styles.mobileTrack}>
          <div
            key={animKey}
            className={`${styles.mobileItem} ${dir === 'next' ? styles.slideNext : styles.slidePrev}`}
          >
            <span className={styles.name}>DOLAR {current.nombre}</span>
            <div className={styles.priceWrap}>
              <span className={styles.price}>{current.venta}</span>
              <Image src={trendIcon} alt={current.variacion >= 0 ? 'sube' : 'baja'} width={17} height={17} className={`${styles.trendIcon} ${trendClass}`} />
            </div>
          </div>
        </div>

        <button className={styles.nav} onClick={() => go('next')} aria-label="Siguiente">
          <Image src={navIcon} alt="" width={16} height={16} />
        </button>
      </div>

      {/* Desktop: infinite marquee */}
      <div className={styles.desktop}>
        <span className={styles.label}>DÓLARES</span>
        <div className={styles.desktopMarquee}>
          <div className={styles.desktopTrack}>
            {[...data, ...data].map((d, i) => (
              <div key={i} className={styles.desktopItem}>
                <span className={styles.name}>{d.nombre}</span>
                <div className={styles.deskContainer}>
                  <span className={styles.price}>{d.venta}</span>
                  <Image
                    src={d.variacion >= 0 ? arrowUpward : arrowDownward}
                    alt={d.variacion >= 0 ? 'sube' : 'baja'}
                    width={12} height={12}
                    className={d.variacion >= 0 ? styles.up : styles.down}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
