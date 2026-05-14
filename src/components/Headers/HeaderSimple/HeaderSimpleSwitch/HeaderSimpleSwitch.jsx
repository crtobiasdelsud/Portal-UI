'use client'

import HeaderSwitch from "./HeaderSwitch"
import HeaderSimpleMobile from "../HeaderSimpleMobile/HeaderSimpleMobile"
import HeaderSimpleDesktop from "../HeaderSimpleDesktop/HeaderSimpleDesktop"
import HeaderSimpleDesktopCompact from "../HeaderSimpleDesktopCompact/HeaderSimpleDesktopCompact"
import HeaderSimpleAmp from "../HeaderSimpleAmp/HeaderSimpleAmp"
import { useCategories } from '../../../../context/SiteConfigContext.jsx'

export default function HeaderSimpleSwitch({ settings = {}, isAmp = false, forceMode }) {
  if (isAmp) return <HeaderSimpleAmp settings={settings} />

  const categories = useCategories()

  // forceMode lo usa el preview del CMS para mostrar una sola variant a la vez
  if (forceMode === 'mobile') {
    return <HeaderSimpleMobile settings={settings} categories={categories} />
  }
  if (forceMode === 'desktop') {
    return <HeaderSimpleDesktop settings={settings} categories={categories} />
  }

  return (
    <HeaderSwitch
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
