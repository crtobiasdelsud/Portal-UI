'use client'

import { hexToCssFilter } from '../../../../utils/colorContrast.js'
import styles from "./HeaderSimpleMobile.module.scss"
import MenuDrawer from "../MenuDrawer/MenuDrawer"
import LiveBanner from "../LiveBanner/LiveBanner"
import { resolveLogoSrc } from "../_headerUtils"
import DateTime from '../../../../components/DateTime/DateTime.jsx'
import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import { useCategories } from '../../../../context/SiteConfigContext.jsx'

export default function HeaderSimpleMobile({ settings = {}, categories: propCategories }) {
  const { Link, Image } = useAdapters()
  const categoriesFromCtx = useCategories()
  const {
    siteName, logoUrl, iconUrl, logoAlt, logo,
    primaryColor, secondaryColor, backgroundColor, textColor,
    social = {}, searchEnabled,
    embedUrl, embedIcon,
    liveUrl, liveTitle,
  } = settings

  const resolvedLogo = resolveLogoSrc(logoUrl, logo)
  const categories   = propCategories ?? categoriesFromCtx

  const inlineStyle = {
    backgroundColor,
    borderBottomColor: primaryColor,
    '--primary-color':       primaryColor,
    '--text-color':          textColor,
    '--social-hover-filter': primaryColor ? hexToCssFilter(primaryColor) : 'none',
  }

  return (
    <header className={styles.containerInFixed} style={inlineStyle}>
      <div className={styles.dateTimeBar}>
        <DateTime part="date" />
        <DateTime part="time" />
      </div>

      <div className={styles.topRow}>

        <div className={styles.brandCol}>
          <div className={styles.brand}>
            {resolvedLogo ? (
              <Link href="/" aria-label={`Ir a inicio - ${siteName}`}>
                <Image src={resolvedLogo} alt={logoAlt || siteName} className={styles.logoImg} width={188} height={60} />
              </Link>
            ) : logoUrl ? (
              <Link href="/" aria-label={`Ir a inicio - ${siteName}`}>
                <img src={logoUrl} alt={logoAlt || siteName} className={styles.logoImg} />
              </Link>
            ) : (
              <span className={styles.logo} style={{ color: primaryColor }}>{siteName}</span>
            )}
          </div>
        </div>

        <div className={styles.centerCol} />

        <div className={styles.socialCol}>
          <MenuDrawer
            fullscreen
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
          />
        </div>

      </div>

      <LiveBanner
        liveUrl={liveUrl}
        liveTitle={liveTitle}
        secondaryColor={secondaryColor}
      />
    </header>
  )
}
