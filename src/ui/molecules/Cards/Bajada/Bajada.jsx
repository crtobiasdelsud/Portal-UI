'use client'

import { useTheme } from "../../../../context/SiteConfigContext.jsx"
import V1 from './variants/V1/V1'

const VARIANTS = { '1': V1 }

export default function Bajada({ settings = {}, isAmp = false }) {
  const theme = useTheme()

  const { content } = settings
  if (!content) return null

  const { volanta, title, copete, authorId } = content

  const v        = String(theme.bajada        ?? 1)
  const vDesktop = String(theme.bajadaDesktop ?? v)

  // 6 CSS vars completas para que el override por widget aplique sobre cualquier
  // estilo del variant (ver WidgetThemeScope).
  const inlineStyle = isAmp ? {} : {
    backgroundColor:      theme.surface,
    '--primary-color':    theme.primary,
    '--secondary-color':  theme.secondary,
    '--accent-color':     theme.accent,
    '--background-color': theme.background,
    '--surface-color':    theme.surface,
    '--text-color':       theme.textColor,
  }

  const Variant = VARIANTS[v] ?? V1

  const sharedProps = {
    isAmp,
    inlineStyle,
    volanta,
    title,
    copete,
    authorId,
    vDesktop,
  }

  return <Variant {...sharedProps} />
}
