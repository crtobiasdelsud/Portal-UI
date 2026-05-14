# Changelog

## 0.2.0 — 2026-05-14

Fase 2 del plan — Views puras migradas desde `editor-template-front`.

- **UI primitives**: `AspectImage`, `FocalImage`, `Icon`, `IconSmall`,
  `PageWrapper`, `ToolTip`
- **DateTime** + helper `getFechaHora()` (`/utils/fechaHora.js`)
- **SiteConfigContext** — `SiteConfigProvider`, `PreviewThemeProvider`,
  `useSiteConfig`, `useTheme`, `useRawConfig`, `useCategories`, `useBanners`,
  `useComputed`, `useInfoPages`
- **AuthorBlock** (4 variants), **Breadcrumb** (5 variants), **ShareBlock**
  (2 variants) — `next/link` reemplazado por `useAdapters().Link`
- **Cards**: `ArticleCard` (con tooltip), `Bajada` (2 variants)
- `IMAGE_SIZES` constant exportada
- SCSS partials compartidos en `/styles/{mixins,variables}/` para que los
  `@use "../../../styles/index"` de los componentes resuelvan dentro del paquete

Las dos apps consumen el paquete a través de shims de 1 línea
(`export { X as default } from '@crtobias/portal-ui'`) ubicados en los
paths originales, de modo que los 43+ callers no necesitan tocarse en
este pase. Cleanup futuro: search/replace de los imports y borrar los shims.

## 0.1.0 — 2026-05-14

Setup inicial del paquete.

- `AdaptersProvider` + `useAdapters()` — inyección de `Image`, `Link`, `fetcher`
- `ArticlePoolProvider` + `useArticlePool()` + `createArticlePool()` — dedupe
  de artículos por scope explícito (no más singleton global tipo `React.cache`)
- `useArticles()` — hook universal que respeta el provider si existe
- Estructura `src/{adapters,data,components}/` lista para migrar componentes
