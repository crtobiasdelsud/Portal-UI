'use client'

import { useTheme } from "../../../context/SiteConfigContext.jsx"
import V1 from './variants/V1/V1'

const VARIANTS = { '1': V1 }

export default function Bajada({ settings = {}, isAmp = false }) {
  const theme = useTheme()

  const { content } = settings
  if (!content) return null

  const { volanta, title, copete, authorId } = content

  const v        = String(theme.bajada        ?? 1)
  const vDesktop = String(theme.bajadaDesktop ?? v)

  const inlineStyle = isAmp ? {} : {
    backgroundColor:    theme.surface,
    fontFamily:         theme.fontFamily,
    '--primary-color':  theme.primary,
    '--text-color':     theme.textColor,
    '--surface-color':  theme.surface,
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
