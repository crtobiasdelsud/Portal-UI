'use client'

import Icon from '../../../../components/UI/Icon/Icon.jsx'
import { hexToCssFilter } from '../../../../utils/colorContrast.js'
import styles from "./HeaderSimpleDesktop.module.scss"
import MenuDrawer from "../MenuDrawer/MenuDrawer"
import CategoriesBar from "../CategoriesBar/CategoriesBar"
import LiveBanner from "../LiveBanner/LiveBanner"
import { resolveLogoSrc } from "../_headerUtils"
import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import { useCategories } from '../../../../context/SiteConfigContext.jsx'

export default function HeaderSimpleDesktop({ settings = {}, categories: propCategories }) {
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
    <header className={styles.container} style={inlineStyle}>
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

        <div className={styles.socialCol}>
          <div className={styles.social} style={{ display: 'flex' }}>
            {social.facebook  && <Icon src="/icons/facebook.svg"  href={social.facebook}  label="Facebook"  />}
            {social.twitter   && <Icon src="/icons/x.svg"         href={social.twitter}   label="X"         />}
            {social.instagram && <Icon src="/icons/instagram.svg" href={social.instagram} label="Instagram" />}
             {social.tiktok    && <Icon src="/icons/tiktok.svg"    href={social.tiktok}    label="TikTok"    />}
            {social.youtube   && <Icon src="/icons/youtube.svg"   href={social.youtube}   label="YouTube"   />}
           
           
          </div>
        </div>

      </div>

      <CategoriesBar
        categories={categories}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        textColor={textColor}
        backgroundColor={backgroundColor}
        social={social}
        resolvedLogo={resolvedLogo}
        logoUrl={logoUrl}
        iconUrl={iconUrl}
        siteName={siteName}
        logoAlt={logoAlt}
        searchEnabled={searchEnabled}
        embedUrl={embedUrl}
        embedIcon={embedIcon}
      />

      <LiveBanner
        liveUrl={liveUrl}
        liveTitle={liveTitle}
        secondaryColor={secondaryColor}
      />
    </header>
  )
}
