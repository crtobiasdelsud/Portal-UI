'use client'

import { useTheme } from '../../context/SiteConfigContext.jsx'
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'
import V3 from './variants/V3/V3'
import V4 from './variants/V4/V4'
import V5 from './variants/V5/V5'

const VARIANTS = { '1': V1, '2': V2, '3': V3, '4': V4, '5': V5 }

export default function Breadcrumb({ items = [], isAmp = false }) {
  const theme = useTheme()
  const v = String(theme.slugType ?? 1)

  const inlineStyle = isAmp ? {} : {
    '--bc-primary':   theme.primary   ?? '#e00',
    '--bc-secondary': theme.secondary ?? '#142376',
  }

  const Variant = VARIANTS[v] ?? V1

  return <Variant items={items} isAmp={isAmp} inlineStyle={inlineStyle} />
}
