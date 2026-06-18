'use client'

import { useState, useEffect } from 'react'
import { useTheme, useSiteConfig } from '../../context/SiteConfigContext.jsx'
import { resolveAuthorDisplay } from '../../utils/authorDisplay.shared.js'
import V1 from './variants/V1/V1'

const VARIANTS = { '1': V1 }

function formatDate(fechaPublicacion, useLongDate) {
  if (!fechaPublicacion) return null
  const date  = new Date(fechaPublicacion)
  const fecha = date.toLocaleDateString('es-AR', useLongDate
    ? { day: '2-digit', month: 'long',    year: 'numeric' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hora  = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  return `${fecha} - ${hora}`
}

export default function AuthorBlock({ autor, publicarComoOrg = false, fechaPublicacion, isAmp = false }) {
  const theme      = useTheme()
  const { slots }  = useSiteConfig()
  const v          = String(theme.authorBlock ?? 1)

  const settings    = slots?.header?.settings ?? {}
  const { displayName, authorSlug, avatarSrc } = resolveAuthorDisplay({
    autor,
    publicarComoOrg,
    publisherName: settings.publisherName ?? null,
    siteName: settings.siteName ?? null,
    iconUrl: settings.iconUrl ?? null,
  })

  const showAvatar  = v === '1' || v === '2'
  const useLongDate = v === '1' || v === '2'

  const [dateStr, setDateStr] = useState(null)
  useEffect(() => {
    setDateStr(formatDate(fechaPublicacion, useLongDate))
  }, [fechaPublicacion, useLongDate])

  const inlineStyle = isAmp ? {} : {
    '--primary-color':   theme.primary,
    '--surface-color':   theme.surface,
    '--secondary-color': theme.secondary,
  }

  const ampDate = isAmp ? formatDate(fechaPublicacion, useLongDate) : null

  const Variant = VARIANTS[v] ?? V1

  const sharedProps = {
    isAmp,
    inlineStyle,
    displayName,
    authorSlug,
    dateStr,
    ampDate,
    avatarSrc: avatarSrc || '/profile-placeholder.svg',
    showAvatar,
    v,
  }

  return <Variant {...sharedProps} />
}
