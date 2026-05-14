# @crtobias/portal-ui

Librería de componentes compartida entre el portal público (Next 15) y el
editor CMS (Vite). Provee:

- **Componentes UI** — Header, Footer, Hero, Feed, Cabezal, Cards, AuthorBlock,
  Breadcrumb, ShareBlock, EditorOutput, Speech*, Banner, Clima, DolarTicker,
  Blocks, ArticleHero, etc.
- **Providers** — adapters (`Image`/`Link`/`fetcher`), site config,
  article pool, speech.
- **Hooks** — `useTheme`, `useSiteConfig`, `useCategories`, `useBanners`,
  `useArticlePool`, `useArticles`, `useSpeech`, etc.
- **Utils** — `getFechaHora`, `contrastRatio`, `hexToCssFilter`, `ensureContrast`.

> El paquete ship-ea `.jsx` + `.scss` crudo. No hay build step propio: cada app
> los compila en su bundle (Next via `transpilePackages`, Vite out-of-the-box).

---

## Índice

1. [Instalación](#instalación)
2. [Setup mínimo](#setup-mínimo)
3. [El adapter pattern — cómo funciona Next ↔ Vite](#el-adapter-pattern--cómo-funciona-next--vite)
4. [Workflow de desarrollo](#workflow-de-desarrollo)
5. [Cómo agregar un componente nuevo](#cómo-agregar-un-componente-nuevo)
6. [Publicar a npm](#publicar-a-npm)
7. [Trabajar entre varios devs](#trabajar-entre-varios-devs)
8. [Qué NO va en el paquete](#qué-no-va-en-el-paquete)
9. [Estructura](#estructura)
10. [API exportada](#api-exportada)

---

## Instalación

```bash
npm install @crtobias/portal-ui
```

`peerDependencies`:
- `react` ^19
- `react-dom` ^19
- `sass` ^1.98

**Next 15:** agregar a `transpilePackages` en `next.config.mjs`:

```js
const nextConfig = {
  transpilePackages: ['@crtobias/portal-ui'],
  // ...
}
```

**Vite:** funciona out-of-the-box.

---

## Setup mínimo

### Next (App Router)

```jsx
// src/app/PortalUIProviders.jsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { AdaptersProvider } from '@crtobias/portal-ui'
import { clientFetch } from '@/lib/clientFetch'   // tu fetcher con BASE_URL + tenant

export default function PortalUIProviders({ children }) {
  return (
    <AdaptersProvider value={{ Image, Link, fetcher: clientFetch }}>
      {children}
    </AdaptersProvider>
  )
}
```

```jsx
// src/app/layout.jsx (server component)
import PortalUIProviders from './PortalUIProviders'
import { SiteConfigProvider } from '@crtobias/portal-ui'

export default async function RootLayout({ children }) {
  const siteData = await fetchSiteConfig()  // tu lógica
  return (
    <html>
      <body>
        <PortalUIProviders>
          <SiteConfigProvider value={siteData}>
            {children}
          </SiteConfigProvider>
        </PortalUIProviders>
      </body>
    </html>
  )
}
```

### Vite (CMS)

```jsx
// src/PortalUIProviders.jsx
import { AdaptersProvider } from '@crtobias/portal-ui'
import ImageShim from './shims/Image'   // <img> plano
import LinkShim from './shims/Link'     // <a> plano
import { backendFetch } from './lib/backendClient'

export default function PortalUIProviders({ children }) {
  return (
    <AdaptersProvider value={{ Image: ImageShim, Link: LinkShim, fetcher: backendFetch }}>
      {children}
    </AdaptersProvider>
  )
}
```

```jsx
// src/main.jsx
<PortalUIProviders><App /></PortalUIProviders>
```

---

## El adapter pattern — cómo funciona Next ↔ Vite

### El problema

El portal usa **Next 15**, el CMS usa **Vite**. Ambos consumen los mismos
componentes. Si dentro de `portal-ui` hacemos:

```jsx
import Link from 'next/link'
import Image from 'next/image'
```

…rompe en el CMS, porque Vite no resuelve esos paquetes. Y si hacemos:

```jsx
import { Link } from 'react-router-dom'
```

…rompe en el portal, porque Next no usa react-router.

Tampoco queremos `if (process.env...)` ramificando código. Ni hacer dos copias
del paquete. Queremos **el mismo componente** funcionando en los dos lados.

### La solución: inyección de dependencias por contexto

`portal-ui` define una "interfaz" — tres cosas que cualquier app tiene que
proveer:

```jsx
// portal-ui/src/adapters/AdaptersContext.jsx
const AdaptersContext = createContext(null)

export function AdaptersProvider({ value, children }) {
  return (
    <AdaptersContext.Provider value={value}>
      {children}
    </AdaptersContext.Provider>
  )
}

export function useAdapters() {
  const a = useContext(AdaptersContext)
  if (!a) throw new Error('AdaptersProvider missing')
  return a
}
```

La interfaz es: `{ Image, Link, fetcher }`.

### Cada app implementa la interfaz

**Portal (Next):**
```jsx
import Image from 'next/image'           // optimización Next + lazy loading
import Link from 'next/link'             // client-side navigation
import { clientFetch } from '@/lib/clientFetch'  // fetch con BASE_URL + X-Tenant-ID

<AdaptersProvider value={{ Image, Link, fetcher: clientFetch }}>
```

**CMS (Vite):**
```jsx
// shims/Image.jsx
export default function Image({ src, alt, width, height, ...rest }) {
  return <img src={src} alt={alt} width={width} height={height} {...rest} />
}

// shims/Link.jsx
export default function Link({ href, children, ...rest }) {
  return <a href={href} {...rest}>{children}</a>
}

<AdaptersProvider value={{ Image: ImageShim, Link: LinkShim, fetcher: backendFetch }}>
```

### Dentro del paquete

```jsx
// portal-ui/src/components/ArticleCard/ArticleCard.jsx
'use client'
import { useAdapters } from '../../adapters/AdaptersContext.jsx'

export default function ArticleCard({ article }) {
  const { Image, Link } = useAdapters()  // ← traduce a Next o Vite según la app
  return (
    <Link href={article.slug}>
      <Image src={article.imagen.url} alt={article.titulo} width={400} height={250} />
    </Link>
  )
}
```

**El componente no sabe** si está corriendo en Next o en Vite. Solo sabe que
hay un `Link` y un `Image` con cierta API.

### Diagrama

```
┌─────────────────────────────────────────┐
│ PORTAL (Next 15)                        │
│ ┌─────────────────────────────────────┐ │
│ │ AdaptersProvider                    │ │
│ │   value={{                          │ │
│ │     Image: next/image,    ─────┐    │ │
│ │     Link:  next/link,     ─────┤    │ │
│ │     fetcher: clientFetch  ─────┤    │ │
│ │   }}                           │    │ │
│ │ ┌─────────────────────────┐    │    │ │
│ │ │ <ArticleCard>           │    │    │ │
│ │ │   useAdapters() ────────┴────┘    │ │
│ │ │   → next/image            │       │ │
│ │ │   → next/link             │       │ │
│ │ │   → clientFetch           │       │ │
│ │ └─────────────────────────┘         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CMS (Vite)                              │
│ ┌─────────────────────────────────────┐ │
│ │ AdaptersProvider                    │ │
│ │   value={{                          │ │
│ │     Image: ImgShim,       ─────┐    │ │
│ │     Link:  LinkShim,      ─────┤    │ │
│ │     fetcher: backendFetch ─────┤    │ │
│ │   }}                           │    │ │
│ │ ┌─────────────────────────┐    │    │ │
│ │ │ <ArticleCard>  (MISMO)  │    │    │ │
│ │ │   useAdapters() ────────┴────┘    │ │
│ │ │   → <img>                 │       │ │
│ │ │   → <a>                   │       │ │
│ │ │   → backendFetch          │       │ │
│ │ └─────────────────────────┘         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Por qué funciona

1. **Sin acoplamiento.** El paquete no importa nada de Next ni de Vite. Solo
   importa `useAdapters` de su propio contexto. Cero dependencias en
   `package.json` aparte de las peer deps.

2. **Sin if/else.** No hay ramas tipo `if (isNext) ... else ...`. El
   componente usa una sola API uniforme.

3. **Extensible.** Si mañana hace falta otro adapter (ej. `navigate` para
   programmatic navigation), se agrega al objeto del provider. Las dos apps
   lo implementan a su modo.

4. **SSR-friendly.** En Next, `next/image` se renderiza server-side con
   `<picture>` y srcset. En Vite/CMS, `<img>` plano alcanza para preview.
   Ningún componente del paquete tiene que saberlo.

### Otros adapters internos del paquete

Además del context principal, el paquete tiene **3 contexts más** para
inyectar "data" en lugar de "primitives":

| Context | Qué provee la app | Ejemplo Next | Ejemplo Vite |
|---|---|---|---|
| `AdaptersContext` | `Image`, `Link`, `fetcher` | `next/image`, `next/link`, `clientFetch` | `<img>`, `<a>`, `backendFetch` |
| `SiteConfigContext` | `theme`, `slots`, `categories`, `banners` | desde `layout.jsx` async fetch | desde `EditableHomePreview` state |
| `ArticlePoolContext` | tracker de dedup de artículos | sólo en `<Home>` (request-scoped) | sólo en modo Lector del CMS |
| `SpeechContext` | estado de Web Speech API | montado una vez en layout | montado una vez en App |

Todos siguen el mismo patrón: `XxxProvider` arriba en el árbol, `useXxx()`
adentro de los componentes.

### Casos donde el adapter no alcanza

| Caso | Solución |
|---|---|
| Router programático (`router.push`) | Convertir a `<form action="...">` nativo o aceptar `onNavigate` como prop. Ya lo hicimos en `MenuDrawer`. |
| `next/font/google` | Cargar fonts en CSS global de cada app, no en el componente |
| `next/dynamic` lazy load | Cada app decide cuándo lazy-loadear el componente |
| Web Speech API | Wraperar en context propio (`SpeechProvider`) que sea opcional |

### Resumen

El paquete es **agnóstico al framework**. Las "diferencias" entre Next y Vite
viven en 5 líneas de JSX en cada `PortalUIProviders.jsx` de cada app. Todo lo
demás (componentes, hooks, styles) es código portable.

---

## Workflow de desarrollo

### Local (varios escenarios)

#### A. `file:` link (recomendado para dev de día a día)

En el `package.json` de cada app:

```json
"@crtobias/portal-ui": "file:../portal-ui"
```

`npm install` crea un symlink: `node_modules/@crtobias/portal-ui` → `../portal-ui/`. **Cualquier cambio en `portal-ui/src/` aparece al toque** en las apps con HMR. **No tenés que publicar nada.**

Cuando hagas un cambio que rompa, ambas apps lo ven en el siguiente reload. Cuando estás contento, lo publicás.

> Ojo Vite: a veces no invalida el cache de file: deps con HMR. Si parece "viejo":
> ```bash
> rm -rf node_modules/.vite && npm run dev
> ```

#### B. `npm link`

Mismo efecto que `file:`, pero global a tu máquina:

```bash
cd portal-ui && npm link

cd ../editor-template-front && npm link @crtobias/portal-ui
cd ../cms-editor-front      && npm link @crtobias/portal-ui
```

Para desconectar:

```bash
cd editor-template-front && npm unlink @crtobias/portal-ui && npm install
```

#### C. Versión publicada (producción / otro dev sin acceso al disco)

```json
"@crtobias/portal-ui": "^1.0.0"
```

```bash
npm install
```

En este modo NO se ven cambios locales. Hay que publicar.

### ¿Cuándo necesito publicar?

| Acción | Local con `file:` / `npm link` | Producción / otro dev |
|---|---|---|
| Editar un .scss / .jsx | ✅ instantáneo | ❌ publicar nueva versión |
| Agregar un componente | ✅ instantáneo | ❌ publicar nueva versión |
| Cambiar API (props, exports) | ✅ instantáneo | ❌ publicar major / minor |
| Bug fix urgente en prod | — | ❌ publicar patch |

**Regla:** publicás cuando alguien (incluyendo CI) que no tiene tu `~/Desktop/portal-ui` necesita el cambio.

---

## Cómo agregar un componente nuevo

Te tomo un caso concreto: querés agregar un componente `Newsletter` para
mostrar un formulario de suscripción.

### 1. Crear los archivos en `portal-ui`

```
src/components/Newsletter/
  Newsletter.jsx
  Newsletter.module.scss
```

```jsx
// src/components/Newsletter/Newsletter.jsx
'use client'

import { useState } from 'react'
import styles from './Newsletter.module.scss'
import { useAdapters } from '../../adapters/AdaptersContext.jsx'
import { useTheme } from '../../context/SiteConfigContext.jsx'

export default function Newsletter({ titulo = 'Suscribite' }) {
  const { fetcher } = useAdapters()
  const theme = useTheme()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetcher('/api/portal/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  return (
    <form
      className={styles.container}
      style={{ '--primary': theme.primary }}
      onSubmit={handleSubmit}
    >
      <h3 className={styles.titulo}>{titulo}</h3>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />
      <button type="submit">Suscribirme</button>
    </form>
  )
}
```

```scss
/* src/components/Newsletter/Newsletter.module.scss */
@use "../../styles/index" as *;

.container { /* ... */ }
.titulo { color: var(--primary); }
```

### 2. Reglas para el código del componente

| ✅ Hacer | ❌ Evitar |
|---|---|
| `import { useAdapters }` para `Image`, `Link`, `fetcher` | `import Link from 'next/link'` |
| `import { useTheme }` para colores/fonts del site | acceder a `process.env` |
| Paths relativos: `../../adapters/AdaptersContext.jsx` | Path aliases: `@/components/...` |
| `'use client'` si usa hooks o estado | `async function` si va a usar hooks (ver split data/view abajo) |
| Para componentes que necesitan data: aceptar `articles`/`article` como prop | Hacer `await fetch(...)` dentro del componente del paquete |
| Para tracking client: `useAdapters().fetcher` | `process.env.NEXT_PUBLIC_X` |

### 3. Si tu componente necesita fetchear (split data/view)

Patrón: el paquete expone el **View**, cada app implementa la **data layer**.

```jsx
// portal-ui/src/components/Newsletter/NewsletterView.jsx
'use client'
export default function NewsletterView({ subscribers, onSubmit }) {
  return (
    <div>
      <span>{subscribers.length} suscriptos</span>
      <button onClick={onSubmit}>Suscribirme</button>
    </div>
  )
}
```

```jsx
// editor-template-front/src/components/Newsletter/Newsletter.jsx (data layer)
import { backendFetch } from '@/lib/backendClient'
import { NewsletterView } from '@crtobias/portal-ui'

export default async function Newsletter({ settings }) {
  const subs = await fetchSubscribers(backendFetch)
  return <NewsletterView subscribers={subs} />
}
```

```jsx
// cms-editor-front/src/previewHome/components/Newsletter/Newsletter.jsx (data layer)
import { useEffect, useState } from 'react'
import { backendFetch } from '@/lib/backendClient'
import { NewsletterView } from '@crtobias/portal-ui'

export default function Newsletter({ settings }) {
  const [subs, setSubs] = useState([])
  useEffect(() => { fetchSubscribers(backendFetch).then(setSubs) }, [])
  return <NewsletterView subscribers={subs} />
}
```

Mismos componentes que ya hicieron split data/view: `Feed`, `Hero`, `Recommended`,
`Cabezal`, `Banner`, `Clima`, `TextWrap`, `ArticleBody`.

### 4. Agregar al barrel

```js
// src/index.js
export { default as Newsletter } from './components/Newsletter/Newsletter.jsx'
// o si es split data/view:
export { default as NewsletterView } from './components/Newsletter/NewsletterView.jsx'
```

### 5. (Opcional) Shim en las apps para no tocar callers

Si ya hay código importando `@/components/Newsletter/Newsletter`, mantené ese
path con un re-export:

```jsx
// editor-template-front/src/components/Newsletter/Newsletter.jsx
'use client'
export { Newsletter as default } from '@crtobias/portal-ui'
```

Así no hay que tocar 20 callers — el caller sigue importando como antes, pero
termina yendo al paquete.

### 6. Probar local

Con `file:` link o `npm link` activo, las dos apps levantan con el componente
nuevo sin publicar:

```bash
cd ~/Desktop/editor-template-front && npm run dev  # http://localhost:3000
cd ~/Desktop/cms-editor-front      && npm run dev  # http://localhost:5173
```

### 7. Cuando funcione, publicar

```bash
cd ~/Desktop/portal-ui
npm run release:minor   # componente nuevo = minor
git push --follow-tags
```

(Si CI hace publish automático, basta con `git push`.)

### 8. En las apps, traer la versión nueva

```bash
cd ~/Desktop/editor-template-front && npm install @crtobias/portal-ui@latest
cd ~/Desktop/cms-editor-front      && npm install @crtobias/portal-ui@latest
```

---

## Publicar a npm

### Setup una vez por máquina

```bash
npm login   # con tu cuenta crtobiasdev
```

### Publicar

```bash
cd ~/Desktop/portal-ui

npm run release:patch   # 1.0.0 → 1.0.1  bug fix
npm run release:minor   # 1.0.0 → 1.1.0  componente nuevo / feature
npm run release:major   # 1.0.0 → 2.0.0  breaking change (rename, remove prop)
```

Los scripts hacen `npm version <bump>` (commit + tag automáticos) y
`npm publish --access public` en una sola pasada.

Después:

```bash
git push --follow-tags
```

---

## Trabajar entre varios devs

### El problema

Si sos el único que publica, hay que decidir cómo:
- Los otros devs **proponen** cambios al paquete
- Quién **autoriza** y **publica**

### Modelo recomendado: CI publica al merge

**Setup:**

1. **Cada dev tiene cuenta de GitHub propia** (no compartir la tuya)
2. **Sumalos como collaborators** al repo `portal-ui` en GitHub
   (Settings → Collaborators)
3. **La cuenta de npm queda SOLO tuya** — los devs no necesitan acceso a npm
4. **GitHub Actions publica automático** cuando vos mergeás a `main`

**Workflow para un dev nuevo:**

```bash
# Una vez
git clone git@github.com:crtobias/portal-ui.git
git clone git@github.com:crtobias/editor-template-front.git
git clone git@github.com:crtobias/cms-editor-front.git

# Asegurarse que las apps usen el paquete local
cd portal-ui && npm link
cd ../editor-template-front && npm link @crtobias/portal-ui
cd ../cms-editor-front && npm link @crtobias/portal-ui
```

**Para cada cambio:**

```bash
cd portal-ui
git checkout -b mi-feature
# ...editar...
git commit -am "feat: agregar Newsletter"
git push origin mi-feature
# Crear PR en GitHub
```

**Vos (mantenedor):**
1. Revisás el PR
2. Mergeás a `main`
3. CI corre `npm publish` automático
4. Avisás en Slack/Discord: "Nueva versión 1.1.0 — bumpean en las apps"

### GitHub Actions — workflow de auto-publish

Crear `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Bump patch version
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          npm version patch -m "chore: release %s [skip ci]"
          git push --follow-tags

      - name: Publish
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Setup del token:**
1. En npmjs.com → Profile → Access Tokens → "Generate New Token"
   (tipo "Automation")
2. Copiá el token
3. En GitHub repo → Settings → Secrets and variables → Actions → New secret
   - Name: `NPM_TOKEN`
   - Value: pegá el token

> Este workflow bumpea **patch** cada merge a main. Para minor/major, los devs
> ponen en el commit `[minor]` o `[major]` y agregás lógica al workflow para
> parsear eso. O publicás manualmente para versiones grandes.

### Si NO querés CI

Alternativa simple: los devs proponen PRs, vos publicás manualmente al mergear:

```bash
git checkout main && git pull
npm run release:minor
git push --follow-tags
```

### Permisos a tener en cuenta

| Recurso | A quién dar acceso | Cómo |
|---|---|---|
| Repo de GitHub `portal-ui` | Todos los devs | Settings → Collaborators (write para mergear, read para PRs) |
| Repos de las apps | Todos los devs | Igual |
| Cuenta npm `crtobiasdev` | Solo vos | — |
| `NPM_TOKEN` en GitHub Secrets | Generado por vos, accesible solo por CI | — |
| Bump de versión | Solo CI (o vos) | Workflow / manual |

---

## Qué NO va en el paquete

| ❌ NO | Por qué | Solución |
|---|---|---|
| `next/*` (Image, Link, font, navigation) | Acopla a Next | Inyectar via `useAdapters()` |
| `@mui/*` | Solo CMS lo usa | Vive en `cms-editor-front` |
| `@dnd-kit/*` | Solo el editor lo usa | Vive en `cms-editor-front` |
| `fs`, env del server, secrets | No es código de cliente | Cada app |
| `React.cache()` | Acopla a Next runtime | Cada app lo usa con `createArticlePool` |
| Path alias `@/` | El paquete no controla resolver | Imports relativos |
| `process.env.X` | No portable | Settings via prop o context |

---

## Estructura

```
src/
├── adapters/
│   └── AdaptersContext.jsx          AdaptersProvider, useAdapters
├── context/
│   ├── SiteConfigContext.jsx        SiteConfigProvider + hooks
│   └── SpeechContext.jsx            SpeechProvider, useSpeech
├── data/
│   ├── ArticlePoolContext.jsx       createArticlePool, useArticlePool
│   ├── useArticles.js               hook universal
│   └── index.js
├── constants/imageSizes.js
├── utils/
│   ├── fechaHora.js                 getFechaHora
│   └── colorContrast.js             contrastRatio, hexToCssFilter, ensureContrast
├── styles/                          SCSS partials compartidos
│   ├── index.scss
│   ├── mixins/
│   └── variables/
└── components/
    ├── UI/                          AspectImage, FocalImage, Icon, IconSmall,
    │                                PageWrapper, ToolTip
    ├── DateTime/
    ├── AuthorBlock/                 4 variants
    ├── Breadcrumb/                  5 variants
    ├── ShareBlock/                  2 variants
    ├── Cards/
    │   ├── ArticleCard/
    │   ├── Bajada/                  2 variants
    │   └── ArticleBody/             View only (data layer en cada app)
    ├── Headers/HeaderSimple/        HeaderSimpleSwitch (+ forceMode para CMS)
    │                                Desktop / Mobile / Compact / Amp
    │                                + sub-componentes (CategoriesBar,
    │                                LiveBanner, MenuDrawer, etc.)
    ├── Footers/FooterSimple/
    ├── Blocks/                      Containers que iteran widgets via registry
    ├── ArticleHero/                 8 variants
    ├── ArticleHeroFull/
    ├── ArticleSidebar/
    ├── EditorOutput/                Renderer de Editor.js (con AMP)
    ├── EditorOutputFull/
    ├── SpeechButton/
    ├── SpeechPlayerBar/
    ├── SpeechProviderWrapper/
    ├── Feed/                        FeedView (data layer en cada app)
    ├── Hero/                        HeroView
    ├── Recommended/                 RecommendedView
    ├── Cabezal/                     CabezalView + 18 variants + 9 CardCabezal
    ├── Banner/                      BannerView + BannerDisplay (tracking)
    ├── Clima/                       ClimaView
    ├── TextWrap/                    TextWrapView
    ├── DolarTicker/                 Self-fetching client
    └── DolarTickerOriginal/
```

---

## API exportada

```js
import {
  // Adapters
  AdaptersProvider, useAdapters, useOptionalAdapters,

  // Site config
  SiteConfigProvider, PreviewThemeProvider,
  useSiteConfig, useTheme, useRawConfig,
  useCategories, useBanners, useComputed, useInfoPages,

  // Article pool
  ArticlePoolProvider, useArticlePool, createArticlePool,
  useArticles,

  // Speech
  SpeechProvider, useSpeech,

  // Utils
  getFechaHora,
  contrastRatio, hexToCssFilter, ensureContrast,

  // Constants
  IMAGE_SIZES,

  // UI primitives
  AspectImage, FocalImage, Icon, IconSmall, PageWrapper, ToolTip,

  // Componentes
  DateTime, AuthorBlock, Breadcrumb, ShareBlock,
  ArticleCard, Bajada,
  ArticleHero, ArticleHeroFull, ArticleSidebar,
  HeaderSimpleSwitch, HeaderSimpleDesktop, HeaderSimpleDesktopCompact,
  HeaderSimpleMobile, HeaderSimpleAmp,
  FooterSimple,
  BlockColumns, BlockColumnsBajada, BlockMain, BlockMainNarrow,
  BlockMainSidebar, BlockStack, WidgetErrorBoundary,
  EditorOutput, EditorBlocks, EditorOutputFull, EditorBlocksFull,
  SpeechButton, SpeechPlayerBar, SpeechProviderWrapper,
  DolarTicker, DolarTickerOriginal,

  // Views (data layer en cada app)
  FeedView, HeroView, RecommendedView, CabezalView,
  BannerView, BannerDisplay, ClimaView,
  TextWrapView, ArticleBodyView,
} from '@crtobias/portal-ui'
```

---

## Convención de versiones

- **patch** (`1.0.0 → 1.0.1`): bug fix sin cambios de API
- **minor** (`1.0.0 → 1.1.0`): componente nuevo, prop opcional nueva
- **major** (`1.0.0 → 2.0.0`): breaking change (rename, remove prop,
  cambio de shape, cambio de signature de hook)

Pinear con `^` para auto-update minor/patch en las apps. Para producción
estable, pinear exact (`"@crtobias/portal-ui": "1.1.2"`).
