'use client'

import { useDrawer } from '../DrawerContext/DrawerContext'
import styles from './HeaderSimpleDesktopCompact.module.scss'

export default function SearchTrigger() {
  const { openWithSearch } = useDrawer()

  return (
    <button className={styles.searchBtn} aria-label="Buscar" onClick={openWithSearch}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  )
}
