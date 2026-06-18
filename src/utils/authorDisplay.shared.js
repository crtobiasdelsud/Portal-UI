function resolveNonEmptyString(...values) {
  for (const value of values) {
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (trimmed) return trimmed
  }

  return null
}

/**
 * @param {Object} [params]
 * @param {{ nombre?: string, slug?: string, avatar?: string }|null} [params.autor]
 * @param {boolean} [params.publicarComoOrg=false]
 * @param {string|null} [params.publisherName]
 * @param {string|null} [params.siteName]
 * @param {string|null} [params.iconUrl]
 * @returns {{ isOrg: boolean, displayName: string|null, authorSlug: string|null, avatarSrc: string|null }}
 */
export function resolveAuthorDisplay({
  autor = null,
  publicarComoOrg = false,
  publisherName = null,
  siteName = null,
  iconUrl = null,
} = {}) {
  const isOrg = publicarComoOrg || !autor
  const orgDisplayName = resolveNonEmptyString(publisherName, siteName)
  const displayName = isOrg ? orgDisplayName : (autor?.nombre ?? null)
  const authorSlug = !isOrg ? (autor?.slug ?? null) : null
  const avatarSrc = (!isOrg && autor?.avatar) ? autor.avatar : (iconUrl ?? null)
  return { isOrg, displayName, authorSlug, avatarSrc }
}
