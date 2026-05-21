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
            <a href="/amp" aria-label={`Ir a inicio - ${siteName}`}>
              <img src={resolvedLogo.src ?? resolvedLogo} alt={logoAlt || siteName} className="header-simple__logo-img" />
            </a>
          ) : logoUrl ? (
            <a href="/amp" aria-label={`Ir a inicio - ${siteName}`}>
              <img src={logoUrl} alt={logoAlt || siteName} className="header-simple__logo-img" />
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
                            <a href={sub.slug} className="amp-sidebar__sub-link">{sub.label}</a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <a href={cat.slug} className="amp-sidebar__nav-link">{cat.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="amp-sidebar__social">
            <span className="amp-sidebar__social-label">Seguinos en:</span>
            <div className="amp-sidebar__social-icons">
              {social.facebook  && <a href={social.facebook}  aria-label="Facebook"  className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><img src="/icons/facebook.svg"  alt="Facebook"  /></a>}
              {social.twitter   && <a href={social.twitter}   aria-label="X"         className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><img src="/icons/x.svg"         alt="X"         /></a>}
              {social.instagram && <a href={social.instagram} aria-label="Instagram" className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><img src="/icons/instagram.svg" alt="Instagram" /></a>}
              {social.youtube   && <a href={social.youtube}   aria-label="YouTube"   className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><img src="/icons/youtube.svg"   alt="YouTube"   /></a>}
              {social.tiktok    && <a href={social.tiktok}    aria-label="TikTok"    className="amp-sidebar__social-link" target="_blank" rel="noopener noreferrer"><img src="/icons/tiktok.svg"    alt="TikTok"    /></a>}
            </div>
          </div>
        </amp-sidebar>

      </div>
    </header>
  )
}
