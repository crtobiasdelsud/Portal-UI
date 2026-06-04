'use client'

import { resolveLogoSrc } from "../_headerUtils"
import { useCategories } from '../../../../context/SiteConfigContext.jsx'

export default function HeaderSimpleAmp({ settings = {} }) {
  const {
    siteName, logoUrl, logo, logoAlt,
    primaryColor, social = {}, searchEnabled,
  } = settings

  const resolvedLogo = resolveLogoSrc(logoUrl, logo)
  const categories   = useCategories()

  return (
    <header className="header-simple">
      <div className="header-simple__top-row">

        <div className="header-simple__brand">
          {resolvedLogo ? (
            <a href="/" aria-label={`Ir a inicio - ${siteName}`}>
              <amp-img src={resolvedLogo.src ?? resolvedLogo} alt={logoAlt || siteName} class="header-simple__logo-img" layout="fixed-height" height="30" />
            </a>
          ) : logoUrl ? (
            <a href="/" aria-label={`Ir a inicio - ${siteName}`}>
              <amp-img src={logoUrl} alt={logoAlt || siteName} class="header-simple__logo-img" layout="fixed-height" height="30" />
            </a>
          ) : (
            <span className="header-simple__logo">{siteName}</span>
          )}
        </div>

        <button
          className="header-simple__burger"
          on="tap:amp-nav-sidebar.toggle"
          aria-label="Menú de navegación"
        >
          <svg viewBox="0 0 24 24" className="header-simple__burger-icon">
            <path d="M0 4h24M0 12h24M0 20h24" stroke="var(--primary-color)" strokeWidth="2" />
          </svg>
        </button>

        <amp-sidebar id="amp-nav-sidebar" layout="nodisplay" side="left">
          <div className="amp-sidebar__header">
            <button on="tap:amp-nav-sidebar.close" className="amp-sidebar__close" aria-label="Cerrar menú">✕</button>
          </div>

          {searchEnabled && (
            <div className="amp-sidebar__search">
              <input type="search" placeholder="Buscar..." className="amp-sidebar__search-input" />
            </div>
          )}

          <nav>
            <ul className="amp-sidebar__nav">
              {categories.map((cat) => (
                <li key={cat.id} className="amp-sidebar__nav-item">
                  {cat.subcategories?.length ? (
                    <details className="amp-sidebar__sub-menu">
                      <summary className="amp-sidebar__nav-link-summary">
                        {cat.label}
                        <span className="amp-sidebar__arrow">›</span>
                      </summary>
                      <ul className="amp-sidebar__sub-list">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <a href={sub.slug ? (sub.slug.startsWith('/') ? sub.slug : `/${sub.slug}`) : '#'} className="amp-sidebar__sub-link">{sub.label}</a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <a href={cat.slug ? (cat.slug.startsWith('/') ? cat.slug : `/${cat.slug}`) : '#'} className="amp-sidebar__nav-link">{cat.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="amp-sidebar__social">
            <span className="amp-sidebar__social-label">Seguinos en:</span>
            <div className="amp-sidebar__social-icons">
              {social.facebook  && <a href={social.facebook}  aria-label="Facebook"  className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/facebook.svg"  alt="Facebook"  width="24" height="24" layout="fixed" /></a>}
              {social.twitter   && <a href={social.twitter}   aria-label="X"         className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/x.svg"         alt="X"         width="24" height="24" layout="fixed" /></a>}
              {social.instagram && <a href={social.instagram} aria-label="Instagram" className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/instagram.svg" alt="Instagram" width="24" height="24" layout="fixed" /></a>}
              {social.youtube   && <a href={social.youtube}   aria-label="YouTube"   className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/youtube.svg"   alt="YouTube"   width="24" height="24" layout="fixed" /></a>}
              {social.tiktok    && <a href={social.tiktok}    aria-label="TikTok"    className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/tiktok.svg"    alt="TikTok"    width="24" height="24" layout="fixed" /></a>}
            </div>
          </div>
        </amp-sidebar>

      </div>
    </header>
  )
}
