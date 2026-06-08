'use client'

import { createContext, useContext } from 'react'

const SiteConfigCtx = createContext({
  theme:      {},
  slots:      {},
  config:     {},
  categories: [],
  banners:    [],
  computed:   {},
  infoPages:  [],
})

export function SiteConfigProvider({ value, children }) {
  return (
    <SiteConfigCtx.Provider value={value}>
      {children}
    </SiteConfigCtx.Provider>
  )
}

export function PreviewThemeProvider({ theme, children }) {
  return (
    <SiteConfigCtx.Provider value={{ theme, slots: {}, config: {}, categories: [], banners: [], computed: {}, infoPages: [] }}>
      {children}
    </SiteConfigCtx.Provider>
  )
}

/**
 * Cascada de theme por widget: si el widget trae un `theme` propio en sus
 * settings, gana sobre el theme global (merge superficial: las claves del
 * widget pisan, el resto se hereda). Preserva TODO el resto del contexto
 * (slots, categories, banners, computed, infoPages) — a diferencia de
 * PreviewThemeProvider, que lo reemplaza.
 *
 * Sin override (vacío o ausente) es un passthrough: no agrega un Provider.
 *
 * @param {{ override?: Object, children: React.ReactNode }} props
 */
export function WidgetThemeScope({ override, children }) {
  const ctx = useContext(SiteConfigCtx)

  if (!override || typeof override !== 'object') return children

  // Merge superficial ignorando claves vacías/nulas: un campo vacío en el theme
  // del widget significa "heredar el global", no "pisar con vacío".
  const merged = { ...ctx.theme }
  let touched = false
  for (const [key, val] of Object.entries(override)) {
    if (val !== undefined && val !== null && val !== '') { merged[key] = val; touched = true }
  }

  if (!touched) return children

  return <SiteConfigCtx.Provider value={{ ...ctx, theme: merged }}>{children}</SiteConfigCtx.Provider>
}

/**
 * Devuelve el site-config completo: { theme, slots, config }
 */
export function useSiteConfig() {
  return useContext(SiteConfigCtx)
}

/**
 * Atajo — solo el theme: { primary, secondary, surface, ... }
 */
export function useTheme() {
  return useContext(SiteConfigCtx).theme
}

/**
 * Devuelve el JSON completo tal como llega desde la DB, sin transformaciones.
 */
export function useRawConfig() {
  return useContext(SiteConfigCtx).config
}

/**
 * Devuelve las categorías del sitio.
 */
export function useCategories() {
  return useContext(SiteConfigCtx).categories ?? []
}

/**
 * Devuelve los banners activos del sitio.
 */
export function useBanners() {
  return useContext(SiteConfigCtx).banners ?? []
}

/**
 * Devuelve valores pre-computados en el servidor (contrastes, etc.)
 */
export function useComputed() {
  return useContext(SiteConfigCtx).computed ?? {}
}

/**
 * Devuelve las páginas de información del sitio (scope=data).
 * Cada ítem: { titulo, slug, texto }
 */
export function useInfoPages() {
  return useContext(SiteConfigCtx).infoPages ?? []
}
