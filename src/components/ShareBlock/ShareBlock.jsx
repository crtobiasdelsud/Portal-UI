'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '../../context/SiteConfigContext.jsx'
import V1 from './variants/V1/V1'
import V2 from './variants/V2/V2'

const VARIANTS = { '1': V1, '2': V2 }

function buildNetworks(url) {
  const encoded = encodeURIComponent(url)
  return [
    {
      key: 'x',
      src: '/icons/x.svg',
      label: 'X',
      tooltip: 'Compartir en X',
      href: `https://twitter.com/intent/tweet?url=${encoded}`,
    },
    {
      key: 'facebook',
      src: '/icons/facebook.svg',
      label: 'Facebook',
      tooltip: 'Compartir en Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      key: 'linkedin',
      src: '/icons/linkedin.svg',
      label: 'LinkedIn',
      tooltip: 'Compartir en LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`,
    },
    {
      key: 'telegram',
      src: '/icons/telegram.svg',
      label: 'Telegram',
      tooltip: 'Compartir en Telegram',
      href: `https://t.me/share/url?url=${encoded}`,
    },
    {
      key: 'whatsapp',
      src: '/icons/whatsapp.svg',
      label: 'WhatsApp',
      tooltip: 'Compartir en WhatsApp',
      href: `https://wa.me/?text=${encoded}`,
    },
    {
      key: 'email',
      src: '/icons/email.svg',
      label: 'Email',
      tooltip: 'Compartir por Email',
      href: `mailto:?body=${encoded}`,
    },
  ]
}

export default function ShareBlock({ isAmp = false }) {
  const theme = useTheme()
  const [networks, setNetworks] = useState(() => buildNetworks(''))

  useEffect(() => {
    setNetworks(buildNetworks(window.location.href))
  }, [])

  const v = String(theme.shareBlock ?? 1)
  const Variant = VARIANTS[v] ?? V1

  const inlineStyle = isAmp ? {} : {
    '--primary-color': theme.primary,
    '--surface-color': theme.surface,
  }

  return <Variant isAmp={isAmp} inlineStyle={inlineStyle} networks={networks} v={v} />
}
