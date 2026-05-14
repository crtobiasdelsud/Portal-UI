# Changelog

## 0.1.0 — 2026-05-14

Setup inicial del paquete.

- `AdaptersProvider` + `useAdapters()` — inyección de `Image`, `Link`, `fetcher`
- `ArticlePoolProvider` + `useArticlePool()` + `createArticlePool()` — dedupe
  de artículos por scope explícito (no más singleton global tipo `React.cache`)
- `useArticles()` — hook universal que respeta el provider si existe
- Estructura `src/{adapters,data,components}/` lista para migrar componentes
