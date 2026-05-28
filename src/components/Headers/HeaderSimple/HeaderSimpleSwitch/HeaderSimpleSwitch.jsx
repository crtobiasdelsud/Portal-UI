'use client'

import HeaderSwitch from "./HeaderSwitch"
import HeaderSimpleMobile from "../HeaderSimpleMobile/HeaderSimpleMobile"
import HeaderSimpleDesktop from "../HeaderSimpleDesktop/HeaderSimpleDesktop"
import HeaderSimpleDesktopCompact from "../HeaderSimpleDesktopCompact/HeaderSimpleDesktopCompact"
import HeaderSimpleAmp from "../HeaderSimpleAmp/HeaderSimpleAmp"
import { DrawerProvider } from '../DrawerContext/DrawerContext'
import { useCategories } from '../../../../context/SiteConfigContext.jsx'

export default function HeaderSimpleSwitch({ settings = {}, isAmp = false, forceMode }) {
  if (isAmp) return <HeaderSimpleAmp settings={settings} />

  const categories = useCategories()

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
      mobile={
        <HeaderSimpleMobile settings={settings} categories={categories} />
      }
      desktop={
        <HeaderSimpleDesktop settings={settings} categories={categories} />
      }
      desktopCompact={
        <HeaderSimpleDesktopCompact settings={settings} categories={categories} />
      }
    />
  )
}
