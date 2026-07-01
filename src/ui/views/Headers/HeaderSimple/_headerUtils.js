import logoClaroSrc from './_logos/mendoza-claro.svg'
import logoOscuroSrc from './_logos/mendoza-oscuro.svg'

// Logos legacy mapeados por número (1-4). Sólo se usan como fallback cuando
// no hay `logoUrl` en la config. Pendiente quitarlos cuando todos los sites
// migren a `logoUrl` directo.
const LOGO_MAP = {
  1: logoClaroSrc,
  2: logoOscuroSrc,
  3: logoClaroSrc,
  4: logoOscuroSrc,
}

export function resolveLogoSrc(logoUrl, logo) {
  return !logoUrl && logo ? LOGO_MAP[logo] ?? logoClaroSrc : null
}

/**
 * Fetch de categorías. Recibe el `fetcher` del adapter para no acoplar el
 * paquete al backendClient/env vars de cada app.
 */
export async function fetchCategories(fetcher, tag = 'HeaderSimple') {
  try {
    const res = await fetcher("/api/portal/categories", { cache: "no-store" })
    if (!res.ok) {
      console.error(`[${tag}] error ${res.status} al cargar categorías`)
      return []
    }
    const json = await res.json()
    const raw = json.data ?? json.categories ?? json ?? []
    const toSlug = (s) => (s ? (s.startsWith('/') ? s : `/${s}`) : '/')
    return Array.isArray(raw)
      ? raw.map(c => ({
          id:            c.id,
          label:         c.label ?? c.name,
          slug:          toSlug(c.slug),
          subcategories: (c.subcategories ?? c.children ?? []).map(s => ({
            id:    s.id,
            label: s.label ?? s.name,
            slug:  toSlug(s.slug),
          })),
        }))
      : []
  } catch (err) {
    console.error(`[${tag}] fetch falló:`, err.message)
    return []
  }
}
