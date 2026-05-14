# Changelog

## 0.3.0 — 2026-05-14

Migración completa de componentes del portal a la librería.

### Fase 3 — Split data/view en widgets que tocan red
- **FeedView** + variants V1/V2 — `next/link` → `useAdapters().Link`
- **HeroView** — `next/link/image` → `useAdapters()`
- **RecommendedView** — usa `ArticleCard` interno del paquete
- **CabezalView** + 18 variants top-level + CardCabezal (9 sub-variants)
  - Routing por `tipo` extraído de `Cabezal.jsx`
  - `LoQueSeLee` convertido a view pura (recibe `article` ya resuelto)
  - Caso especial `loQueSeLee` se pasa por prop `article` (no `articles[]`)

La capa de datos (`Feed.jsx`, `Hero.jsx`, `Recommended.jsx`, `Cabezal.jsx`)
queda en cada app:
- Portal (Next): async server components con `claimArticles()`/`claimWithFetch()`
- CMS (Vite): client components con `useState`/`useEffect`

### Fases 4 + 5 — Article pool con scope explícito

(Cambios en las apps consumidoras — la API `createArticlePool` /
`ArticlePoolProvider` del paquete ya estaba desde la 0.1.0; estas fases
arreglan cómo cada app la usa.)

- **Portal** — `articlePool.js` ahora es factory pura. Home llama a
  `setupHomePool()` para inicializar el tracker en el slot request-scoped
  (vía `React.cache()`). Otras pantallas (ArticleDetail, ArticleDetailFull,
  Category, etc.) no llaman → widgets caen al camino sin dedupe.
- **CMS** — `EditableHomePreview` envuelve el modo lector con
  `<ArticlePoolProvider key={...}>`. Cambiar de config o entrar/salir del
  modo lector remonta el provider → tracker nuevo. `EditableArticlePreview`
  no usa provider → cada widget fetchea independiente (match con el portal).
- Eliminado el singleton `tracker` global y `resetPool()` manual del CMS.

### Fase 6 — Limpieza
- Borrado código muerto en `cms-editor-front/src/previewHome/` (Next
  artifacts que no corrían en Vite: `app/`, `pages/`, `screens/`, `Home/`,
  `services/`, `mocks/`, `modules/`, `types/`, `utils/`, `registry/`,
  `layouts/`, `layout.jsx`, `previewApi.js`).
- Borrado `previewHome/lib/{font,head,navigation,baseUrl,buildArticleMetadata,
  normalizeArticle,sitemap}.js` (shims Next-only sin consumidores).
- Borrado `previewHome/constants/imageSizes.js` y `previewHome/hooks/useArticles.js`
  — ahora exportados desde `@crtobias/portal-ui`.

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
