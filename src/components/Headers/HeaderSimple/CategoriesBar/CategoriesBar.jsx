'use client'

import { useState } from 'react'
import styles from './CategoriesBar.module.scss'
import MenuDrawer from '../MenuDrawer/MenuDrawer'
import { useDrawer } from '../DrawerContext/DrawerContext'

export default function CategoriesBar({
  categories = [],
  primaryColor,
  textColor,
  backgroundColor,
  social,
  secondaryColor,
  resolvedLogo,
  logoUrl,
  iconUrl,
  siteName,
  logoAlt,
  searchEnabled,
  embedUrl,
  embedIcon,
}) {

  const { Link } = useAdapters()
  const { openWithSearch } = useDrawer()
  const [startIndex, setStartIndex] = useState(0)
  const [dir, setDir] = useState('next')
  const [animKey, setAnimKey] = useState(0)

  const go = (direction) => {
    if (!categories.length) return
    setDir(direction)
    setAnimKey(k => k + 1)
    setStartIndex(i =>
      direction === 'next'
        ? (i + 1) % categories.length
        : (i - 1 + categories.length) % categories.length
    )
  }

  const orderedCats = categories.length
    ? [...categories.slice(startIndex), ...categories.slice(0, startIndex)]
    : []

  const barStyle = {
    backgroundColor,
    '--primary-color': primaryColor,
    '--text-color': textColor,
  }

  return (
    <div className={styles.bar} style={barStyle}>
      <MenuDrawer
        categories={categories}
        social={social}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        textColor={textColor}
        resolvedLogo={resolvedLogo}
        logoUrl={logoUrl}
        iconUrl={iconUrl}
        siteName={siteName}
        logoAlt={logoAlt}
        searchEnabled={searchEnabled}
        embedUrl={embedUrl}
        embedIcon={embedIcon}
        renderPortal={false}
      />
      {searchEnabled && (
        <button className={styles.searchBtn} aria-label="Buscar" onClick={openWithSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}
      <div className={styles.containerNav}>
        <button className={styles.scrollBtn} onClick={() => go('prev')} aria-label="Anterior">
          <img src="/icons/arrow_back_ios.svg" alt="" style={{ transform: 'rotate(180deg)' }} />
        </button>

        <nav
          key={animKey}
          className={`${styles.nav} ${dir === 'next' ? styles.slideNext : styles.slidePrev}`}
        >
          {orderedCats.flatMap((cat, i) => [
            <Link key={cat.id} href={cat.slug} className={styles.link}>
              {cat.label.toUpperCase()}
            </Link>,
            i < orderedCats.length - 1
              ? <span key={`dot-${cat.id}`} className={styles.dot} aria-hidden="true" />
              : null,
          ]).filter(Boolean)}
        </nav>

        <button className={styles.scrollBtn} onClick={() => go('next')} aria-label="Siguiente">
          <img src="/icons/arrow_back_ios.svg" alt="" />
        </button>
      </div>
    </div>
  )
}
