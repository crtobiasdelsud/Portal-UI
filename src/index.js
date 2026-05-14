// === Adapters ===
export {
  AdaptersProvider,
  useAdapters,
  useOptionalAdapters,
} from './adapters/AdaptersContext.jsx'

// === Site config context ===
export {
  SiteConfigProvider,
  PreviewThemeProvider,
  useSiteConfig,
  useTheme,
  useRawConfig,
  useCategories,
  useBanners,
  useComputed,
  useInfoPages,
} from './context/SiteConfigContext.jsx'

// === Data layer ===
export {
  ArticlePoolProvider,
  useArticlePool,
  createArticlePool,
  useArticles,
} from './data/index.js'

// === Utils & constants ===
export { getFechaHora } from './utils/fechaHora.js'
export { IMAGE_SIZES } from './constants/imageSizes.js'

// === Components: UI primitives ===
export {
  AspectImage,
  FocalImage,
  Icon,
  IconSmall,
  PageWrapper,
  ToolTip,
} from './components/UI/index.js'

// === Components ===
export { default as DateTime }    from './components/DateTime/DateTime.jsx'
export { default as AuthorBlock } from './components/AuthorBlock/AuthorBlock.jsx'
export { default as Breadcrumb }  from './components/Breadcrumb/Breadcrumb.jsx'
export { default as ShareBlock }  from './components/ShareBlock/ShareBlock.jsx'
export { default as ArticleCard } from './components/Cards/ArticleCard/ArticleCard.jsx'
export { default as Bajada }      from './components/Cards/Bajada/Bajada.jsx'
