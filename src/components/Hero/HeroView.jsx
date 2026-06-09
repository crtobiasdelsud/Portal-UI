'use client'

import { useTheme } from "../../context/SiteConfigContext.jsx"
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'
import V3 from './variants/V3/V3'

const VARIANTS = { '1': V1, '2': V2, '3': V3 }

export default function HeroView({ article, important = false, takeover = false }) {
  const theme = useTheme()
  const v = String(theme.hero ?? 1)

  // Exponemos las 6 CSS vars del theme para que el override por widget (via
  // WidgetThemeScope) se aplique siempre — la cascada solo "se ve" si la var
  // esta declarada aca y consumida en el SCSS del variant.
  const inlineStyle = {
    backgroundColor:      theme.surface,
    '--primary-color':    theme.primary,
    '--secondary-color':  theme.secondary,
    '--accent-color':     theme.accent,
    '--background-color': theme.background,
    '--surface-color':    theme.surface,
    '--text-color':       theme.textColor,
  }

  const Variant = VARIANTS[v] ?? V1

  return <Variant article={article} important={important} takeover={takeover} inlineStyle={inlineStyle} />
}
