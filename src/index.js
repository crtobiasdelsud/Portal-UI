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
} from './ui/atoms/index.js'

// === Componentes "vista pura" (sin data) ===
export { default as DateTime }        from './ui/atoms/DateTime/DateTime.jsx'
export { default as AuthorBlock }     from './ui/molecules/AuthorBlock/AuthorBlock.jsx'
export { default as Breadcrumb }      from './ui/molecules/Breadcrumb/Breadcrumb.jsx'
export { default as ShareBlock }      from './ui/molecules/ShareBlock/ShareBlock.jsx'
export { default as ArticleCard }     from './ui/molecules/Cards/ArticleCard/ArticleCard.jsx'
export { default as Bajada }          from './ui/molecules/Cards/Bajada/Bajada.jsx'
export { default as ArticleHero }     from './ui/organisms/ArticleHero/ArticleHero.jsx'
export { default as ArticleHeroFull } from './ui/organisms/ArticleHeroFull/ArticleHeroFull.jsx'
export { default as ArticleSidebar }  from './ui/organisms/ArticleSidebar/ArticleSidebar.jsx'
export { default as Carousel }        from './ui/molecules/Carousel/Carousel.jsx'

// === Screens / vistas de detalle de artículo (réplica portable para previews) ===
export { default as ArticleDetailView } from './ui/views/ArticleDetailView/ArticleDetailView.jsx'

// === Headers ===
export { default as HeaderSimpleSwitch }         from './ui/views/Headers/HeaderSimple/HeaderSimpleSwitch/HeaderSimpleSwitch.jsx'
export { default as HeaderSimpleDesktop }        from './ui/views/Headers/HeaderSimple/HeaderSimpleDesktop/HeaderSimpleDesktop.jsx'
export { default as HeaderSimpleDesktopCompact } from './ui/views/Headers/HeaderSimple/HeaderSimpleDesktopCompact/HeaderSimpleDesktopCompact.jsx'
export { default as HeaderSimpleMobile }         from './ui/views/Headers/HeaderSimple/HeaderSimpleMobile/HeaderSimpleMobile.jsx'
export { default as HeaderSimpleAmp }            from './ui/views/Headers/HeaderSimple/HeaderSimpleAmp/HeaderSimpleAmp.jsx'

// === Footers ===
export { default as FooterSimple } from './ui/organisms/Footers/FooterSimple/FooterSimple.jsx'

// === Blocks (containers que iteran widgets via registry) ===
export { default as BlockColumns }        from './ui/views/Blocks/BlockColumns/BlockColumns.jsx'
export { default as BlockColumnsHeroLeft } from './ui/views/Blocks/BlockColumnsHeroLeft/BlockColumnsHeroLeft.jsx'
export { default as BlockColumnsBajada }  from './ui/views/Blocks/BlockColumnsBajada/BlockColumnsBajada.jsx'
export { default as BlockMain }           from './ui/views/Blocks/BlockMain/BlockMain.jsx'
export { default as BlockMainNarrow }     from './ui/views/Blocks/BlockMainNarrow/BlockMainNarrow.jsx'
export { default as BlockMainSidebar }    from './ui/views/Blocks/BlockMainSidebar/BlockMainSidebar.jsx'
export { default as BlockHeroTrio }       from './ui/views/Blocks/BlockHeroTrio/BlockHeroTrio.jsx'
export { default as BlockHeroTrioLeft }   from './ui/views/Blocks/BlockHeroTrioLeft/BlockHeroTrioLeft.jsx'
export { default as BlockStack }          from './ui/views/Blocks/BlockStack/BlockStack.jsx'
export { default as WidgetErrorBoundary } from './ui/views/Blocks/WidgetErrorBoundary.jsx'
export { default as WidgetFrame }         from './ui/views/Blocks/WidgetFrame.jsx'

// === Views con data layer en cada app (split data/view) ===
export { default as FeedView }        from './ui/organisms/Feed/FeedView.jsx'
export { default as HeroView }        from './ui/organisms/Hero/HeroView.jsx'
export { default as RecommendedView } from './ui/organisms/Recommended/RecommendedView.jsx'
export { default as NotaDestacadaView } from './ui/organisms/NotaDestacada/NotaDestacadaView.jsx'
export { default as CabezalView }     from './ui/views/Cabezal/CabezalView.jsx'
export { CABEZAL_LIMITS, getCabezalLimit, cabezalLimitOptions, clampCabezalLimit, boundCabezalLimit } from './ui/views/Cabezal/cabezalLimits.js'
export { default as LoQueSeLeeSkeleton } from './ui/views/Cabezal/variants/LoQueSeLee/LoQueSeLeeSkeleton.jsx'
export { default as BannerView }      from './ui/molecules/Banner/BannerView.jsx'
export { default as BannerDisplay }   from './ui/molecules/Banner/BannerDisplay.jsx'
export { default as ClimaView }       from './ui/molecules/Clima/ClimaView.jsx'
export { default as TextWrapView }    from './ui/molecules/TextWrap/TextWrapView.jsx'
export { default as ArticleBodyView } from './ui/organisms/Cards/ArticleBody/ArticleBodyView.jsx'

// === Client-side widgets que auto-fetchean su data (vía adapter) ===
export { default as DolarTicker }         from './ui/atoms/DolarTicker/DolarTicker.jsx'
export { default as DolarTickerOriginal } from './ui/atoms/DolarTickerOriginal/DolarTickerOriginal.jsx'

// === Mundial 2026 (widget de home + board para la screen /mundial) ===
export { default as Mundial2026View }  from './ui/organisms/Mundial2026/Mundial2026View.jsx'
export { default as MundialBoardView } from './ui/organisms/Mundial2026/MundialBoardView.jsx'

// === Editor.js renderers ===
export { default as EditorOutput, EditorBlocks }         from './ui/organisms/EditorOutput/EditorOutput.jsx'
export { default as EditorOutputFull, EditorBlocks as EditorBlocksFull } from './ui/organisms/EditorOutputFull/EditorOutputFull.jsx'

// === Speech (Web Speech API + context) ===
export { SpeechProvider, useSpeech } from './context/SpeechContext.jsx'
export { default as SpeechButton }          from './ui/atoms/SpeechButton/SpeechButton.jsx'
export { default as SpeechPlayerBar }       from './ui/molecules/SpeechPlayerBar/SpeechPlayerBar.jsx'
export { default as SpeechProviderWrapper } from './ui/molecules/SpeechProviderWrapper/SpeechProviderWrapper.jsx'
