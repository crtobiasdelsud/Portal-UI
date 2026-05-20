'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../../../../components/UI/Icon/Icon.jsx'
import Tooltip from '../../../../components/UI/ToolTip/ToolTip.jsx'
import { ensureContrast, hexToCssFilter } from '../../../../utils/colorContrast.js'
import styles from './MenuDrawer.module.scss'
import { useDrawer } from '../DrawerContext/DrawerContext'
import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'

export default function MenuDrawer({
  categories = [],
  social = {},
  primaryColor,
  secondaryColor,
  textColor,
  resolvedLogo,
  logoUrl,
  iconUrl,
  siteName,
  logoAlt,
  searchEnabled,
  fullscreen = false,
  embedUrl,
  embedIcon,
  renderPortal = true,
}) {

  const { Link, Image } = useAdapters()
  const { open, setOpen, focusSearch, setFocusSearch } = useDrawer()
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (open && focusSearch && searchRef.current) {
      const id = setTimeout(() => {
        searchRef.current?.focus()
        setFocusSearch(false)
      }, 50)
      return () => clearTimeout(id)
    }
  }, [open, focusSearch])

  // No usamos client-side router — el form nativo `action="/search"` navega
  // sin acoplarse a next/navigation o react-router. Mantenemos onSubmit sólo
  // para cerrar el drawer antes de la navegación.
  const handleSearch = () => setOpen(false)

  const bgColor = secondaryColor || '#0D1333'
  const drawerText = ensureContrast(textColor || '#ffffff', bgColor)
  const subTextColor = drawerText === '#ffffff' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'
  const separatorColor = drawerText === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

  const drawerStyle = {
    backgroundColor: bgColor,
    color: drawerText,
    '--drawer-text': drawerText,
    '--drawer-sub': subTextColor,
    '--drawer-separator': separatorColor,
    '--primary-color': primaryColor,
    '--social-hover-filter': primaryColor ? hexToCssFilter(primaryColor) : 'none',
  }

  const toggle = (slug) => setExpanded(prev => prev === slug ? null : slug)

  return (
    <>
      <button
        className={styles.hamburger}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}>
          <span style={{ backgroundColor: primaryColor }} />
          <span style={{ backgroundColor: primaryColor }} />
          <span style={{ backgroundColor: primaryColor }} />
        </span>
      </button>

      {mounted && renderPortal && createPortal(
        <>
          {open && (
            <div className={styles.overlay} onClick={() => setOpen(false)} aria-hidden="true" />
          )}

          <div
            className={`${styles.drawer} ${fullscreen ? styles.drawerFullscreen : styles.drawerSidebar} ${open ? styles.drawerOpen : ''}`}
            style={drawerStyle}
            aria-hidden={!open}
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerLogo}>
                {iconUrl ? (
                  <img src={iconUrl} alt={logoAlt || siteName} width={40} height={40} className={styles.logoImg} />
                ) : resolvedLogo ? (
                  <Image src={resolvedLogo} alt={logoAlt || siteName} width={40} height={40} className={styles.logoImg} />
                ) : logoUrl ? (
                  <img src={logoUrl} alt={logoAlt || siteName} className={styles.logoImg} />
                ) : (
                  <span className={styles.logoInitials} style={{ backgroundColor: primaryColor, color: drawerText }}>
                    {siteName?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            {searchEnabled && (
              <form className={styles.searchWrap} action="/search" method="get" role="search" onSubmit={handleSearch}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchRef}
                  type="search"
                  name="q"
                  placeholder="Buscar"
                  className={styles.searchInput}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ color: drawerText }}
                />
              </form>
            )}

            <nav className={styles.nav}>
              <ul className={styles.navList}>
                {categories.map(cat => (
                  <li key={cat.id} className={styles.navItem}>
                    {cat.subcategories?.length ? (
                      <>
                        <Tooltip text={cat.label}>
                          <button
                            className={styles.navBtn}
                            onClick={() => toggle(cat.slug)}
                            aria-expanded={expanded === cat.slug}
                          >
                            {cat.label}
                            <span className={`${styles.arrow} ${expanded === cat.slug ? styles.arrowOpen : ''}`}>˄</span>
                          </button>
                        </Tooltip>
                        {expanded === cat.slug && (
                          <ul className={styles.subList}>
                            {cat.subcategories.map(sub => (
                              <li key={sub.id}>
                                <Link
                                  href={sub.slug}
                                  className={styles.subLink}
                                  style={{ color: subTextColor }}
                                  onClick={() => setOpen(false)}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Tooltip text={cat.label}>
                        <Link
                          href={cat.slug}
                          className={styles.navLink}
                          onClick={() => setOpen(false)}
                        >
                          {cat.label}
                        </Link>
                      </Tooltip>
                    )}
                  </li>
                ))}
                {embedUrl && (
                  <li className={styles.navItem}>
                    <Tooltip text="Pagina recomendada">
                      <Link
                        href="/embed"
                        className={styles.navLink}
                        onClick={() => setOpen(false)}
                      >
                        Pagina recomendada
                      </Link>
                    </Tooltip>
                  </li>
                )}
              </ul>
            </nav>

            <div className={styles.social}>
              <span className={styles.socialLabel} style={{ color: subTextColor }}>Seguinos en:</span>
              <div className={styles.socialIcons}>
                {social.facebook  && <Icon src="/icons/facebook.svg"  href={social.facebook}  label="Facebook"  newTab />}
                {social.twitter   && <Icon src="/icons/x.svg"         href={social.twitter}   label="X"         newTab />}
                {social.instagram && <Icon src="/icons/instagram.svg" href={social.instagram} label="Instagram" newTab />}
                {social.tiktok    && <Icon src="/icons/tiktok.svg"    href={social.tiktok}    label="TikTok"    newTab />}
                {social.youtube   && <Icon src="/icons/youtube.svg"   href={social.youtube}   label="YouTube"   newTab />}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
