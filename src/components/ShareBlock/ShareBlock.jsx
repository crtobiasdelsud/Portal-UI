'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '../../context/SiteConfigContext.jsx'
import V1 from './variants/V1/V1'
import { NETWORK_ICONS } from './icons/index.js'

const VARIANTS = { '1': V1 }

function buildNetworks(url) {
  const encoded = encodeURIComponent(url)
  return [
    {
      key: 'x',
      Glyph: NETWORK_ICONS.x,
      label: 'X',
      tooltip: 'Compartir en X',
      href: `https://twitter.com/intent/tweet?url=${encoded}`,
    },
    {
      key: 'facebook',
      Glyph: NETWORK_ICONS.facebook,
      label: 'Facebook',
      tooltip: 'Compartir en Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      key: 'linkedin',
      Glyph: NETWORK_ICONS.linkedin,
      label: 'LinkedIn',
      tooltip: 'Compartir en LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`,
    },
    {
      key: 'telegram',
      Glyph: NETWORK_ICONS.telegram,
      label: 'Telegram',
      tooltip: 'Compartir en Telegram',
      href: `https://t.me/share/url?url=${encoded}`,
    },
    {
      key: 'whatsapp',
      Glyph: NETWORK_ICONS.whatsapp,
      label: 'WhatsApp',
      tooltip: 'Compartir en WhatsApp',
      href: `https://wa.me/?text=${encoded}`,
    },
    {
      key: 'email',
      Glyph: NETWORK_ICONS.email,
      label: 'Email',
      tooltip: 'Compartir por Email',
      href: `mailto:?body=${encoded}`,
    },
  ]
}

export default function ShareBlock({ isAmp = false, settings = {} }) {
  const theme = useTheme()
  const [networks, setNetworks] = useState(() => buildNetworks(''))

  useEffect(() => {
    setNetworks(buildNetworks(window.location.href))
  }, [])

  const v = String(theme.shareBlock ?? 1)
  const Variant = VARIANTS[v] ?? V1

  // `borderLeft`: barra lateral con el color primario. Se usa cuando el
  // ShareBlock va dentro del cuerpo del artículo (lo setea el widget del CMS).
  const borderLeft = settings?.borderLeft ?? false

  const inlineStyle = isAmp ? {} : {
    '--primary-color': theme.primary,
    '--surface-color': theme.surface,
  }

  return (
    <Variant
      isAmp={isAmp}
      inlineStyle={inlineStyle}
      networks={networks}
      v={v}
      borderLeft={borderLeft}
    />
  )
}
