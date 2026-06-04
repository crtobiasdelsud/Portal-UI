import { useSiteConfig } from '../context/SiteConfigContext.jsx'

/**
 * Resuelve cómo mostrar la autoría de un artículo contemplando "Publicar como
 * organización" (`publicarComoOrg`) y notas sin autor. Centraliza la lógica que ya
 * aplicaba `AuthorBlock` para que tarjetas, heros y carruseles sean consistentes:
 * con org se muestra el nombre del sitio y su logo como avatar, sin enlazar a
 * `/autor/`. Función pura (testeable sin React).
 *
 * @param {Object} [params]
 * @param {{ nombre?: string, slug?: string, avatar?: string }|null} [params.autor]
 * @param {boolean} [params.publicarComoOrg=false]
 * @param {string|null} [params.siteName] Nombre del sitio (slots.header.settings.siteName)
 * @param {string|null} [params.iconUrl]  Logo del sitio (slots.header.settings.iconUrl)
 * @returns {{ isOrg: boolean, displayName: string|null, authorSlug: string|null, avatarSrc: string|null }}
 */
export function resolveAuthorDisplay({
  autor = null,
  publicarComoOrg = false,
  siteName = null,
  iconUrl = null,
} = {}) {
  const isOrg = publicarComoOrg || !autor
  const displayName = isOrg ? (siteName ?? null) : (autor?.nombre ?? null)
  const authorSlug = !isOrg ? (autor?.slug ?? null) : null
  const avatarSrc = (!isOrg && autor?.avatar) ? autor.avatar : (iconUrl ?? null)
  return { isOrg, displayName, authorSlug, avatarSrc }
}

/**
 * Hook de conveniencia: resuelve la autoría leyendo `siteName`/`iconUrl` del
 * `SiteConfigContext` (mismo origen que `AuthorBlock`). Pensado para componentes
 * cliente que reciben el `article` y solo necesitan el byline/avatar resuelto.
 *
 * @param {{ nombre?: string, slug?: string, avatar?: string }|null} autor
 * @param {boolean} [publicarComoOrg=false]
 * @returns {{ isOrg: boolean, displayName: string|null, authorSlug: string|null, avatarSrc: string|null }}
 */
export function useAuthorDisplay(autor, publicarComoOrg = false) {
  const { slots } = useSiteConfig()
  const settings = slots?.header?.settings ?? {}
  return resolveAuthorDisplay({
    autor,
    publicarComoOrg,
    siteName: settings.siteName ?? null,
    iconUrl: settings.iconUrl ?? null,
  })
}
