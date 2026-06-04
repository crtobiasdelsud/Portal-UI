# Changelog

## [Unreleased] — 2026-06-04

### Added

Soporte de "Publicar como organización" en los bylines de tarjetas, heros y
carruseles. Hasta ahora solo `AuthorBlock` (detalle) contemplaba `publicarComoOrg`;
el resto mostraba el byline desde `autor.nombre` y quedaba **vacío** en las notas
publicadas como organización (el backend manda `autor: null`).

- **`utils/authorDisplay.js`** (nuevo): helper `resolveAuthorDisplay()` (puro) +
  hook `useAuthorDisplay(autor, publicarComoOrg)`. Centraliza la lógica de
  `AuthorBlock`: con organización (o sin autor) devuelve el nombre del sitio como
  `displayName` y su logo como `avatarSrc`, sin enlazar a `/autor/`. Lee
  `siteName`/`iconUrl` de `SiteConfigContext` (con default seguro si no hay provider).
- **Bylines consistentes**: `Cards/ArticleCard`, `Cabezal/CardCabezal/variants/`
  `{Default, Compact, Featured, FeaturedDuo, FeaturedHorizontal, Medium, Carrusel}`,
  `Cabezal/variants/LoQueSeLee` y `Hero/variants/{V1, V2, V3}` ahora muestran
  "Por {nombre del sitio}" (y el logo como avatar donde corresponde) en notas de
  organización, en vez de no mostrar autor. `Ranked`/`Amp` (sin byline) no cambian.
- **Sin cambios en la API pública**: los componentes ya recibían el `article`
  (con `publicarComoOrg`); no cambian props ni shape. `AuthorBlock` no se tocó.

### Fixed

Correcciones de marcado semántico, accesibilidad y validez de enlaces (HTML
correcto para indexación e intérpretes de pantalla). Sin cambios en la API
pública (mismos exports, mismos nombres y shape de props); sólo cambia el
markup/atributos que renderizan los componentes. Las clases de estilo se
preservan en todos los casos.

- **Headings del Hero**: `Hero/variants/V1` renderizaba el título como `<p>` y
  `Hero/variants/V2` como `<span>`; ahora ambos usan `<h2>` (igual que V3),
  conservando las clases `headline`/`headlineWrap`.
- **`alt` de imágenes de contenido**: en `EditorOutput` y `EditorOutputFull`, las
  imágenes del cuerpo caen al epígrafe como texto alternativo antes de quedar con
  `alt=""`, evitando dejar imágenes informativas sin descripción.
- **Enlace de `ArticleCard`**: se eliminó el atributo `rel="canonical"` del `<a>`
  de navegación (inválido en anclas; el canonical sólo corresponde al `<link>` del
  head).
- **Rutas de enlaces**: `ArticleCard`, `Feed/variants/V1`, `HeaderSimpleAmp` y
  `MenuDrawer` ahora normalizan el `href` a `/${slug}` (con guardia a `#` cuando no
  hay slug), alineándose con el patrón del resto de la librería.
- **"Lee además" como encabezado**: en `EditorOutput` y `EditorOutputFull` el
  título de relacionados pasó de `<p>` a `<h3>`.
- **Enlace "VER MÁS" descriptivo**: las 15 variantes de `Cabezal` agregan
  `aria-label="Ver más de <título de sección>"` al enlace, manteniendo el texto
  visible "VER MÁS".
- **`alt` del clima**: los iconos horarios de `ClimaView` usaban la URL/código del
  icono como `alt`; ahora usan la condición meteorológica (o `""` si no hay).
- **AMP `CardCabezal`**: el título se envuelve en `<h3>` (manteniendo el `<a>` y su
  clase) y el copete se renderiza como texto plano vía `stripHtml` en lugar de
  inyectar HTML.

### Performance

Optimización de LCP del destacado de portada. Sin cambios en la API pública
(mismos exports y shape de props); sólo se pasan props que `AspectImage` ya
acepta.

- **Imágenes responsive en `Hero`**: `Hero/variants/V1`, `V2` y `V3` ahora pasan
  `variants={article.imagen?.variants ?? null}` y `sizes="(max-width: 768px) 100vw, 66vw"`
  a `AspectImage`, de modo que el destacado de portada sirve `srcset` y el
  navegador baja la resolución justa según el viewport (antes bajaba siempre la
  variante `large`).
- **Prioridad de carga condicionada**: las tres variantes usan
  `priority={important}` para emitir `fetchpriority=high` sólo en el destacado
  principal. `V1` no tenía prioridad (ahora la recibe cuando es `important`); `V2`
  y `V3` emitían `priority` fijo (siempre `true`), lo que producía múltiples
  `fetchpriority=high` en una misma página con varios Hero; ahora queda acotado al
  destacado principal.

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
