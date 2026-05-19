# Changelog

## [Unreleased] — 2026-05-18

### Fixed

- `EditorOutput` + `EditorOutputFull`: `@editorjs/quote` guarda `caption` como HTML via `innerHTML`; se renderizaba como texto plano mostrando tags HTML crudos en el autor de la cita. Corregido con `dangerouslySetInnerHTML`.

---

## 1.0.2 — 2026-05-15

Patch release. Fixes menores sobre la migracion 1.0.0; sin breaking changes
en API publica. Detalle de cambios: ver `git log v1.0.1..v1.0.2 -- src/`.

## 1.0.1 — 2026-05-14

Patch release post-1.0.0. Sin breaking changes en API publica.
Detalle de cambios: ver `git log v1.0.0..v1.0.1 -- src/`.

## 1.0.0 — 2026-05-14

Migración 100% completa. Paridad total entre portal y CMS — todos los
componentes "espejo" viven en este paquete; las apps sólo tienen data widgets
(thin wrappers que fetchean + renderizan el View).

### Fase 2 completa — Vistas puras
- **UI primitives**: `AspectImage`, `FocalImage`, `Icon`, `IconSmall`,
  `PageWrapper`, `ToolTip`
- **DateTime** + helper `getFechaHora()`
- **SiteConfigContext** — `SiteConfigProvider`, `PreviewThemeProvider`,
  `useSiteConfig`, `useTheme`, `useRawConfig`, `useCategories`,
  `useBanners`, `useComputed`, `useInfoPages`
- **AuthorBlock** (×4), **Breadcrumb** (×5), **ShareBlock** (×2)
- **Cards**: `ArticleCard` (con tooltip), `Bajada` (×2)
- **Headers**: `HeaderSimpleSwitch` (con `forceMode` para CMS preview),
  `HeaderSimpleDesktop`, `HeaderSimpleDesktopCompact`, `HeaderSimpleMobile`,
  `HeaderSimpleAmp` + sub-componentes (`CategoriesBar`, `LiveBanner`,
  `MenuDrawer`, `HeaderSwitch`, `SearchTrigger`, `DrawerContext`)
- **Footers**: `FooterSimple`
- **Blocks**: `BlockColumns`, `BlockColumnsBajada`, `BlockMain`,
  `BlockMainNarrow`, `BlockMainSidebar`, `BlockStack`, `WidgetErrorBoundary`
- **Article-detail**: `ArticleHero` (×8 variants V0/V0Tablet/V0Desktop/V1-V5),
  `ArticleHeroFull`, `ArticleSidebar`
- **EditorOutput / EditorOutputFull** — renderer de Editor.js (server + client),
  con soporte AMP. Exporta `EditorBlocks` para uso aislado.
- **Speech**: `SpeechProvider`, `SpeechProviderWrapper`, `SpeechButton`,
  `SpeechPlayerBar`, hook `useSpeech` — Web Speech API + contexto propio

### Fase 3 — Split data/view en widgets que tocan red
- **FeedView** + variants V1/V2
- **HeroView**
- **RecommendedView** (usa el `ArticleCard` interno)
- **CabezalView** + 18 variants top-level + 9 sub-variants de `CardCabezal`
- **BannerView** + **BannerDisplay** (client, tracking via adapter fetcher)
- **ClimaView**
- **TextWrapView** + **ArticleBodyView** — renderean un artículo via `EditorOutput`
- **DolarTicker** + **DolarTickerOriginal** — auto-fetchean su data internamente

### Adapter pattern
- `useAdapters().Link` / `.Image` / `.fetcher` para que el paquete no dependa
  de Next/Vite directamente
- `MenuDrawer` cambió `router.push` por `<form action="/search">` nativo
  para no necesitar useRouter
- Logos legacy de Mendoza incluidos en `components/Headers/HeaderSimple/_logos/`
  (TODO: quitar cuando todos los sites usen `logoUrl` directo)

### Utils & constants exportados
- `getFechaHora`, `contrastRatio`, `hexToCssFilter`, `ensureContrast`,
  `IMAGE_SIZES`

### Article pool
- `createArticlePool(fetcher, opts?)` — factory pura
- `ArticlePoolProvider` + `useArticlePool()` — uso client-side
- `useArticles({ limit, endpoint?, categoria? })` — hook universal

## 0.3.0 — 2026-05-14

Phase 3 — Feed/Hero/Recommended/Cabezal split data/view inicial. Apps consumen
via shims de 1 línea para no tocar 40+ callers.

## 0.2.0 — 2026-05-14

Phase 2 inicial: UI primitives + DateTime + SiteConfigContext + AuthorBlock/
Breadcrumb/ShareBlock + Cards.

## 0.1.0 — 2026-05-14

Setup — adapters, article pool, scaffold.
