'use client'

import HeaderSwitch from "./HeaderSwitch"
import HeaderSimpleMobile from "../HeaderSimpleMobile/HeaderSimpleMobile"
import HeaderSimpleDesktop from "../HeaderSimpleDesktop/HeaderSimpleDesktop"
import HeaderSimpleDesktopCompact from "../HeaderSimpleDesktopCompact/HeaderSimpleDesktopCompact"
import HeaderSimpleAmp from "../HeaderSimpleAmp/HeaderSimpleAmp"
import { DrawerProvider } from '../DrawerContext/DrawerContext'
import { useCategories, useSiteConfig } from '../../../../context/SiteConfigContext.jsx'
import { useOptionalAdapters } from '../../../../adapters/AdaptersContext.jsx'

export default function HeaderSimpleSwitch({ settings = {}, isAmp = false, forceMode }) {
  if (isAmp) return <HeaderSimpleAmp settings={settings} />

  const categories = useCategories()

  // Modo "takeover": en la home, si hay un hero marcado como importante, el header
  // se vuelve transparente y flota sobre el hero full-screen. Se detecta acá (no
  // en el flow del CMS, que usa forceMode y un contexto sin slots.main).
  const { slots } = useSiteConfig()
  const pathname  = useOptionalAdapters()?.pathname
  const takeover  =
    pathname === '/' &&
    (slots?.main?.grid?.blocks ?? []).some((b) =>
      (b.components ?? []).some((c) => c.type === 'HERO_BLOCK' && c.settings?.important)
    )

  // forceMode lo usa el preview del CMS para mostrar una sola variant a la vez.
  // CategoriesBar/MenuDrawer dependen de DrawerProvider, así que también
  // hay que envolver acá (en el flow normal lo envuelve HeaderSwitch).
  if (forceMode === 'mobile') {
    return (
      <DrawerProvider>
        <HeaderSimpleMobile settings={settings} categories={categories} />
      </DrawerProvider>
    )
  }
  if (forceMode === 'desktop') {
    return (
      <DrawerProvider>
        <HeaderSimpleDesktop settings={settings} categories={categories} />
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
