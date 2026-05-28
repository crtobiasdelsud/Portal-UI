'use client'

import { useTheme } from "../../context/SiteConfigContext.jsx"
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'
import V3 from './variants/V3/V3'

const VARIANTS = { '1': V1, '2': V2, '3': V3 }

export default function HeroView({ article, important = false }) {
  const theme = useTheme()
  const v = String(theme.hero ?? 1)

  const inlineStyle = {
    backgroundColor:   theme.surface,
    fontFamily:        theme.fontFamily,
    '--primary-color': theme.primary,
    '--text-color':    theme.textColor,
    '--surface-color': theme.surface,
  }

  const Variant = VARIANTS[v] ?? V1

  return <Variant article={article} important={important} inlineStyle={inlineStyle} />
}
