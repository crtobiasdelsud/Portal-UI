'use client'

import HeaderSwitch from "./HeaderSwitch"
import HeaderSimpleMobile from "../HeaderSimpleMobile/HeaderSimpleMobile"
import HeaderSimpleDesktop from "../HeaderSimpleDesktop/HeaderSimpleDesktop"
import HeaderSimpleDesktopCompact from "../HeaderSimpleDesktopCompact/HeaderSimpleDesktopCompact"
import HeaderSimpleAmp from "../HeaderSimpleAmp/HeaderSimpleAmp"
import { DrawerProvider } from '../DrawerContext/DrawerContext'
import { useCategories, useSiteConfig } from '../../../../context/SiteConfigContext.jsx'
import { useOptionalAdapters } from '../../../../adapters/AdaptersContext.jsx'

export default function HeaderSimpleSwitch({ settings = {}, isAmp = false, forceMode, takeover: takeoverProp }) {
  if (isAmp) return <HeaderSimpleAmp settings={settings} />

  const categories = useCategories()

  // Modo "takeover": en la home, si hay un hero marcado como importante, el header
  // se vuelve transparente y flota sobre el hero full-screen. En el flow normal se
  // auto-detecta acá; el preview del CMS (forceMode) lo fuerza con `takeoverProp`
  // porque usa un contexto/pathname propios.
  const { slots } = useSiteConfig()
  const pathname  = useOptionalAdapters()?.pathname
  const takeover  = takeoverProp ?? (
    pathname === '/' &&
    (slots?.main?.grid?.blocks ?? []).some((b) =>
      (b.components ?? []).some((c) => c.type === 'HERO_BLOCK' && c.settings?.important)
    )
  )

  // forceMode lo usa el preview del CMS para mostrar una sola variant a la vez.
  // CategoriesBar/MenuDrawer dependen de DrawerProvider, así que también
  // hay que envolver acá (en el flow normal lo envuelve HeaderSwitch).
  if (forceMode === 'mobile') {
    return (
      <DrawerProvider>
        <HeaderSimpleMobile settings={settings} categories={categories} takeover={takeover} />
      </DrawerProvider>
    )
  }
  if (forceMode === 'desktop') {
    return (
      <DrawerProvider>
        <HeaderSimpleDesktop settings={settings} categories={categories} takeover={takeover} />
      </DrawerProvider>
    )
  }

  return (
    <HeaderSwitch
      hasLive={!!settings.liveUrl}
      liveUrl={settings.liveUrl}
      takeover={takeover}
      mobile={
        <HeaderSimpleMobile settings={settings} categories={categories} takeover={takeover} />
      }
      desktop={
        <HeaderSimpleDesktop settings={settings} categories={categories} takeover={takeover} />
      }
      desktopCompact={
        <HeaderSimpleDesktopCompact settings={settings} categories={categories} />
      }
    />
  )
}
