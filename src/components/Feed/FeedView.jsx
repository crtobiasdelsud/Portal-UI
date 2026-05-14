'use client'

import { useTheme } from "../../context/SiteConfigContext.jsx"
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'

const VARIANTS = { '1': V1, '2': V2 }

export default function FeedView({ articles = [] }) {
  const theme = useTheme()
  const v = String(theme.feed ?? 1)

  const inlineStyle = {
    backgroundColor:     theme.surface,
    fontFamily:          theme.fontFamily,
    '--primary-color':   theme.primary,
    '--secondary-color': theme.secondary,
    '--text-color':      theme.textColor ?? '#1a1a1a',
    '--surface-color':   theme.surface,
  }

  const Variant = VARIANTS[v] ?? V1

  return <Variant articles={articles} inlineStyle={inlineStyle} />
}
