'use client'

import { useTheme, useSiteConfig } from '../../context/SiteConfigContext.jsx'
import { formatArticlePublicationDate } from '../../utils/articleDate.js'
import { resolveAuthorDisplay } from '../../utils/authorDisplay.shared.js'
import V1 from './variants/V1/V1'

const VARIANTS = { '1': V1 }

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
  const publicationDate = formatArticlePublicationDate(fechaPublicacion, useLongDate)

  const inlineStyle = isAmp ? {} : {
    '--primary-color':   theme.primary,
    '--surface-color':   theme.surface,
    '--secondary-color': theme.secondary,
  }

  const Variant = VARIANTS[v] ?? V1

  const sharedProps = {
    isAmp,
    inlineStyle,
    displayName,
    authorSlug,
    publicationDate,
    avatarSrc: avatarSrc || '/profile-placeholder.svg',
    showAvatar,
    v,
  }

  return <Variant {...sharedProps} />
}
