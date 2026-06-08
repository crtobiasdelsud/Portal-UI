// Portal UI — librería compartida portal Next + CMS Vite
// === Adapters ===
export {
  AdaptersProvider,
  useAdapters,
  useOptionalAdapters,
} from './adapters/AdaptersContext.jsx'

// === Site config context ===test
export {
  SiteConfigProvider,
  PreviewThemeProvider,
  WidgetThemeScope,
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
export {
  contrastRatio,
  hexToCssFilter,
  ensureContrast,
} from './utils/colorContrast.js'

// === Components: UI primitives ===
export {
  AspectImage,
  FocalImage,
  Icon,
  IconSmall,
  PageWrapper,
  ToolTip,
} from './components/UI/index.js'

// === Componentes "vista pura" (sin data) ===
export { default as DateTime }        from './components/DateTime/DateTime.jsx'
export { default as AuthorBlock }     from './components/AuthorBlock/AuthorBlock.jsx'
export { default as Breadcrumb }      from './components/Breadcrumb/Breadcrumb.jsx'
export { default as ShareBlock }      from './components/ShareBlock/ShareBlock.jsx'
export { default as ArticleCard }     from './components/Cards/ArticleCard/ArticleCard.jsx'
export { default as Bajada }          from './components/Cards/Bajada/Bajada.jsx'
export { default as ArticleHero }     from './components/ArticleHero/ArticleHero.jsx'
export { default as ArticleHeroFull } from './components/ArticleHeroFull/ArticleHeroFull.jsx'
export { default as ArticleSidebar }  from './components/ArticleSidebar/ArticleSidebar.jsx'
export { default as Carousel }        from './components/Carousel/Carousel.jsx'

// === Screens / vistas de detalle de artículo (réplica portable para previews) ===
export { default as ArticleDetailView } from './components/ArticleDetailView/ArticleDetailView.jsx'

// === Headers ===
export { default as HeaderSimpleSwitch }         from './components/Headers/HeaderSimple/HeaderSimpleSwitch/HeaderSimpleSwitch.jsx'
export { default as HeaderSimpleDesktop }        from './components/Headers/HeaderSimple/HeaderSimpleDesktop/HeaderSimpleDesktop.jsx'
export { default as HeaderSimpleDesktopCompact } from './components/Headers/HeaderSimple/HeaderSimpleDesktopCompact/HeaderSimpleDesktopCompact.jsx'
export { default as HeaderSimpleMobile }         from './components/Headers/HeaderSimple/HeaderSimpleMobile/HeaderSimpleMobile.jsx'
export { default as HeaderSimpleAmp }            from './components/Headers/HeaderSimple/HeaderSimpleAmp/HeaderSimpleAmp.jsx'

// === Footers ===
export { default as FooterSimple } from './components/Footers/FooterSimple/FooterSimple.jsx'

// === Blocks (containers que iteran widgets via registry) ===
export { default as BlockColumns }        from './components/Blocks/BlockColumns/BlockColumns.jsx'
export { default as BlockColumnsBajada }  from './components/Blocks/BlockColumnsBajada/BlockColumnsBajada.jsx'
export { default as BlockMain }           from './components/Blocks/BlockMain/BlockMain.jsx'
export { default as BlockMainNarrow }     from './components/Blocks/BlockMainNarrow/BlockMainNarrow.jsx'
export { default as BlockMainSidebar }    from './components/Blocks/BlockMainSidebar/BlockMainSidebar.jsx'
export { default as BlockStack }          from './components/Blocks/BlockStack/BlockStack.jsx'
export { default as WidgetErrorBoundary } from './components/Blocks/WidgetErrorBoundary.jsx'

// === Views con data layer en cada app (split data/view) ===
export { default as FeedView }        from './components/Feed/FeedView.jsx'
export { default as HeroView }        from './components/Hero/HeroView.jsx'
export { default as RecommendedView } from './components/Recommended/RecommendedView.jsx'
export { default as CabezalView }     from './components/Cabezal/CabezalView.jsx'
export { CABEZAL_LIMITS, getCabezalLimit, cabezalLimitOptions, clampCabezalLimit, boundCabezalLimit } from './components/Cabezal/cabezalLimits.js'
export { default as LoQueSeLeeSkeleton } from './components/Cabezal/variants/LoQueSeLee/LoQueSeLeeSkeleton.jsx'
export { default as BannerView }      from './components/Banner/BannerView.jsx'
export { default as BannerDisplay }   from './components/Banner/BannerDisplay.jsx'
export { default as ClimaView }       from './components/Clima/ClimaView.jsx'
export { default as TextWrapView }    from './components/TextWrap/TextWrapView.jsx'
export { default as ArticleBodyView } from './components/Cards/ArticleBody/ArticleBodyView.jsx'

// === Client-side widgets que auto-fetchean su data (vía adapter) ===
export { default as DolarTicker }         from './components/DolarTicker/DolarTicker.jsx'
export { default as DolarTickerOriginal } from './components/DolarTickerOriginal/DolarTickerOriginal.jsx'

// === Editor.js renderers ===
export { default as EditorOutput, EditorBlocks }         from './components/EditorOutput/EditorOutput.jsx'
export { default as EditorOutputFull, EditorBlocks as EditorBlocksFull } from './components/EditorOutputFull/EditorOutputFull.jsx'

// === Speech (Web Speech API + context) ===
export { SpeechProvider, useSpeech } from './context/SpeechContext.jsx'
export { default as SpeechButton }          from './components/SpeechButton/SpeechButton.jsx'
export { default as SpeechPlayerBar }       from './components/SpeechPlayerBar/SpeechPlayerBar.jsx'
export { default as SpeechProviderWrapper } from './components/SpeechProviderWrapper/SpeechProviderWrapper.jsx'
