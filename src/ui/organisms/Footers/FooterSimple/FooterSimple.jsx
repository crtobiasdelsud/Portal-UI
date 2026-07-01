'use client'

import styles from "./FooterSimple.module.scss"
import { useSiteConfig, useCategories, useComputed, useInfoPages } from '../../../../context/SiteConfigContext.jsx'
import { hexToCssFilter } from '../../../../utils/colorContrast.js'
import Icon from '../../../atoms/Icon/Icon.jsx'
import IconSmall from '../../../atoms/IconSmall/IconSmall.jsx'
import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'

const FIXED_LINKS = [
  { label: 'Contáctanos', href: '/contacto' },
  { label: 'RSS',         href: '/rss'      },
  { label: 'Staff',       href: '/staff'    },
]

function formatFecha() {
  return new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function FooterSimple({ isAmp = false }) {

  const { Link } = useAdapters()
  const { slots, theme } = useSiteConfig()
  const categories = useCategories()
  const infoPages  = useInfoPages()
  const { footerTextColor } = useComputed()
  const s = slots?.footer?.settings ?? {}
  const slogan = slots?.header?.settings?.slogan ?? ''
  const headerSocial = slots?.header?.settings?.social ?? {}
  const {
    logoUrl, iconUrl, logoAlt, siteName,
    logoWidth, logoHeight,
    legal = {}, links = [], copyright,
  } = s
  const social = { ...headerSocial, ...(s.social ?? {}) }

  // Colores propios del footer (footer.settings) con fallback al theme global
  const footerBg     = s.backgroundColor ?? theme.secondary ?? '#0D1333'
  const footerText   = s.textColor ?? footerTextColor ?? theme.textColor ?? '#ffffff'
  const footerAccent = s.primaryColor ?? theme.primary ?? footerBg
  const footerFont   = s.fontFamily

  const inlineStyle = {
    color: footerText,
    ...(footerFont && { fontFamily: footerFont }),
    '--primary-color':        footerAccent,
    '--secondary-color':      footerBg,
    '--text-color':           footerText,
    '--social-hover-filter':  footerAccent ? hexToCssFilter(footerAccent) : 'none',
  }

  const logoEl = (logoUrl || iconUrl) && (
    <div className={isAmp ? 'footer-simple__logo-wrap' : styles.logoWrap}>
      {isAmp
        ? <a href="/amp"><img src={logoUrl || iconUrl} alt={logoAlt || siteName} className="footer-simple__logo-img" /></a>
        : <Link href="/"><img src={logoUrl || iconUrl} alt={logoAlt || siteName} className={styles.logoImg} {...(logoWidth && logoHeight ? { width: logoWidth, height: logoHeight } : {})} /></Link>
      }
    </div>
  )

  const sloganEl = slogan && <p className={styles.slogan}>{slogan}</p>

  const socialEl = (
    <div className={styles.social}>
      {social.facebook  && <IconSmall src="/icons/facebook.svg"  href={social.facebook}  label="Facebook"  />}
      {social.instagram && <IconSmall src="/icons/instagram.svg" href={social.instagram} label="Instagram" />}
      {social.tiktok    && <IconSmall src="/icons/tiktok.svg"    href={social.tiktok}    label="TikTok"    />}
      {social.youtube   && <IconSmall src="/icons/youtube.svg"   href={social.youtube}   label="YouTube"   />}
    </div>
  )

  const navEl = categories.length > 0 && (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {categories.map(cat => (
          <li key={cat.id}>
            {isAmp
              ? <a href={cat.slug ? (cat.slug.startsWith('/') ? cat.slug : `/${cat.slug}`) : '#'} className={styles.navLink}>{cat.label}</a>
              : <Link href={cat.slug ? (cat.slug.startsWith('/') ? cat.slug : `/${cat.slug}`) : '#'} className={styles.navLink}>{cat.label}</Link>
            }
          </li>
        ))}
      </ul>
    </nav>
  )

  const legalEl = (
    <div className={styles.legal}>
      {legal.owner && (
        <p className={styles.legalRow}>Propietario: <strong>{legal.owner}</strong></p>
      )}
      {legal.director && (
        <p className={styles.legalRow}>Director: <strong>{legal.director}</strong></p>
      )}
      {legal.edition && (
        <p className={styles.legalRow}>Edición: <strong>{legal.edition}</strong></p>
      )}
      <p className={styles.legalRow}>Fecha: <strong>{formatFecha()}</strong></p>
      {legal.dnda && (
        <p className={styles.legalRow}>DNDA: <strong>{legal.dnda}</strong></p>
      )}
      {legal.address && (
        <p className={styles.legalRow}>Domicilio legal: <strong>{legal.address}</strong></p>
      )}
    </div>
  )

  const allLinks = [
    ...infoPages.map(({ titulo, slug }) => ({ label: titulo, href: `/info/${slug}` })),
    ...FIXED_LINKS,
  ]

  const staticLinksEl = allLinks.length > 0 && (
    <div className={styles.staticLinks}>
      {allLinks.map(({ label, href }, i) => (
        <span key={href} className={styles.staticItem}>
          {i > 0 && <span className={styles.staticSep}>/</span>}
          {isAmp
            ? <a href={href} className={styles.staticLink}>{label}</a>
            : <Link href={href} className={styles.staticLink}>{label}</Link>
          }
        </span>
      ))}
    </div>
  )

  const bottomBarContent = [
    legal.website  && legal.website,
    legal.email    && `Contacto: ${legal.email}`,
    legal.phone    && `Teléfonos: ${legal.phone}`,
    legal.whatsapp && `Whatsapp: ${legal.whatsapp}`,
    legal.email    && `Email: ${legal.email}`,
  ].filter(Boolean).join(' – ')

  const bottomEl = bottomBarContent && (
    <div className={styles.bottomBar}>{bottomBarContent}</div>
  )

  if (isAmp) {
    // Markup AMP dedicado con clases fijas `footer-simple__*` (las del partial
    // SCSS compilado a amp-custom) y <amp-img> — NO clases de CSS module, que en
    // AMP no existen. Misma estructura que el footer real: fila de 2 columnas
    // (izq logo+slogan+legal / der categorías + redes+links) y barra inferior.
    const catHref = (slug) => (slug ? (slug.startsWith('/') ? slug : `/${slug}`) : '#')
    // Sin `style` inline: AMP lo prohíbe. Los colores del footer llegan por las
    // vars globales --footer-bg/--footer-text/--footer-accent (ver _document.jsx).
    return (
      <footer className="footer-simple">
        <div className="footer-simple__main">

          <div className="footer-simple__left">
            {(logoUrl || iconUrl) && (
              <div className="footer-simple__logo-wrap">
                <a href="/" aria-label={`Ir a inicio - ${siteName ?? ''}`}>
                  <amp-img src={logoUrl || iconUrl} alt={logoAlt || siteName} class="footer-simple__logo-img" layout="fixed-height" height="53" />
                </a>
              </div>
            )}
            {slogan && <p className="footer-simple__slogan">{slogan}</p>}
            <div className="footer-simple__legal">
              {legal.owner    && <p className="footer-simple__legal-row">Propietario: <strong>{legal.owner}</strong></p>}
              {legal.director && <p className="footer-simple__legal-row">Director: <strong>{legal.director}</strong></p>}
              {legal.edition  && <p className="footer-simple__legal-row">Edición: <strong>{legal.edition}</strong></p>}
              <p className="footer-simple__legal-row">Fecha: <strong>{formatFecha()}</strong></p>
              {legal.dnda     && <p className="footer-simple__legal-row">DNDA: <strong>{legal.dnda}</strong></p>}
              {legal.address  && <p className="footer-simple__legal-row">Domicilio legal: <strong>{legal.address}</strong></p>}
            </div>
          </div>

          <div className="footer-simple__right">
            {categories.length > 0 && (
              <nav className="footer-simple__nav">
                <ul className="footer-simple__nav-list">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <a href={catHref(cat.slug)} className="footer-simple__nav-link">{cat.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="footer-simple__social-row">
              <div className="footer-simple__social">
                {social.facebook  && <a href={social.facebook}  aria-label="Facebook"  className="footer-simple__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/facebook.svg"  alt="Facebook"  width="22" height="22" layout="fixed" /></a>}
                {social.instagram && <a href={social.instagram} aria-label="Instagram" className="footer-simple__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/instagram.svg" alt="Instagram" width="22" height="22" layout="fixed" /></a>}
                {social.tiktok    && <a href={social.tiktok}    aria-label="TikTok"    className="footer-simple__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/tiktok.svg"    alt="TikTok"    width="22" height="22" layout="fixed" /></a>}
                {social.youtube   && <a href={social.youtube}   aria-label="YouTube"   className="footer-simple__social-link" target="_blank" rel="noopener noreferrer"><amp-img src="/icons/youtube.svg"   alt="YouTube"   width="22" height="22" layout="fixed" /></a>}
              </div>
              {allLinks.length > 0 && (
                <div className="footer-simple__links">
                  {allLinks.map(({ label, href }, i) => (
                    <span key={href} className="footer-simple__link-item">
                      {i > 0 && <span className="footer-simple__link-sep">/</span>}
                      <a href={href} className="footer-simple__link">{label}</a>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {bottomBarContent && (
          <div className="footer-simple__bottom">{bottomBarContent}</div>
        )}
      </footer>
    )
  }

  return (
    <div className={styles.fullcontainer} style={inlineStyle}>
      <footer className={styles.container}>

      {/* ── MAIN: izq (logo+slogan+legal) | der (nav + social+links) ── */}
      <div className={styles.mainRow}>
        <div className={styles.leftCol}>
          {logoEl}
          {legalEl}
        </div>
        <div className={styles.rightCol}>
          {navEl}
          <div className={styles.socialRow}>
            {socialEl}
            {staticLinksEl}
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

     
    </footer>
    <div className={styles.bottom}>
          {bottomEl}
    </div>
    </div>
  )
}
