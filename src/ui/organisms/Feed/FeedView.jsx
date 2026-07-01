'use client'

import { useTheme } from "../../../context/SiteConfigContext.jsx"
import V1 from './variants/V1/V1'

const VARIANTS = { '1': V1 }

export default function FeedView({ articles = [] }) {
  const theme = useTheme()
  const v = String(theme.feed ?? 1)

  // 6 CSS vars completas para que el override por widget aplique sobre cualquier
  // estilo del variant (ver WidgetThemeScope).
  const inlineStyle = {
    backgroundColor:      theme.surface,
    '--primary-color':    theme.primary,
    '--secondary-color':  theme.secondary,
    '--accent-color':     theme.accent,
    '--background-color': theme.background,
    '--surface-color':    theme.surface,
    '--text-color':       theme.textColor ?? '#1a1a1a',
  }

  const Variant = VARIANTS[v] ?? V1

  return <Variant articles={articles} inlineStyle={inlineStyle} />
}
