# @crtobias/portal-ui

Librería de componentes compartida entre:
- **editor-template-front** — portal público (Next 15 + React 19)
- **cms-editor-front** — CMS/editor (Vite + React 19 + MUI + react-router 7)

Views puras, providers para inyectar `Image`/`Link`/`fetcher`, y un
`ArticlePoolProvider` para dedupe de artículos con scope explícito.

> Paquete público en npm. Sin build step: las apps consumen `.jsx` + `.scss`
> directo y los compilan en su propio bundle. Eso minimiza fricción
> (no hay tsup/rollup que mantener) a costa de necesitar `transpilePackages`
> en Next.

---

## Tabla de contenidos

1. [Instalación](#instalación)
2. [Setup en las apps](#setup-en-las-apps)
3. [Article pool](#article-pool)
4. [Workflow de desarrollo](#workflow-de-desarrollo)
5. [Publicar a npm](#publicar-a-npm)
6. [Qué NO va en el paquete](#qué-no-va-en-el-paquete)
7. [Convención de versiones](#convención-de-versiones)
8. [Estructura del paquete](#estructura-del-paquete)

---

## Instalación

```bash
npm install @crtobias/portal-ui
```

`peerDependencies` que la app consumidora tiene que proveer:
- `react@^19`
- `react-dom@^19`
- `sass@^1.98`

**Next 15:** agregar el paquete a `transpilePackages` en `next.config.mjs`:

```js
const nextConfig = {
  transpilePackages: ['@crtobias/portal-ui'],
  // ...
}
```

Sin esto, Next no transpila los `.jsx` del paquete.

**Vite:** funciona out-of-the-box, no hace falta config extra.

---

## Setup en las apps

### Adapters — inyectar `Image`, `Link`, `fetcher`

El paquete **no importa nada de `next/*`**. Cada app provee su implementación
vía `<AdaptersProvider>` en la raíz del árbol.

#### Next 15 (App Router)

```jsx
// src/app/PortalUIProviders.jsx
'use client'
import Image from 'next/image'
import Link  from 'next/link'
import { AdaptersProvider } from '@crtobias/portal-ui'

export default function PortalUIProviders({ children }) {
  return (
    <AdaptersProvider value={{ Image, Link, fetcher: (url, init) => fetch(url, init) }}>
      {children}
    </AdaptersProvider>
  )
}
```

```jsx
// src/app/layout.jsx (server component)
import PortalUIProviders from './PortalUIProviders'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PortalUIProviders>{children}</PortalUIProviders>
      </body>
    </html>
  )
}
```

#### Vite (CMS)

```jsx
// src/PortalUIProviders.jsx
import { AdaptersProvider } from '@crtobias/portal-ui'
import ImageShim from './shims/Image'
import LinkShim from './shims/Link'
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
import PortalUIProviders from './PortalUIProviders'
<PortalUIProviders><App /></PortalUIProviders>
```

Los shims son triviales — `next/image` → `<img>`, `next/link` → `<a>`.

### Site config context

Mover `SiteConfigProvider` al paquete permite a las views consumir
`useTheme()`, `useSiteConfig()`, `useCategories()` etc. sin importar nada
de las apps.

```jsx
// En la raíz de cada app:
import { SiteConfigProvider } from '@crtobias/portal-ui'

<SiteConfigProvider value={{ theme, slots, config, categories, banners, infoPages, computed }}>
  {children}
</SiteConfigProvider>
```

Dentro del paquete, los componentes usan `useTheme()` etc.

---

## Article pool

Sólo la **Home del portal** y el **EditableHomePreview del CMS** crean pool.
El resto de páginas (artículo, categoría) NO crea pool → cada widget
fetchea independiente.

### Portal (Next server)

`createArticlePool(fetcher)` es una factory pura. La app puede combinarla con
`React.cache()` para scope request:

```js
// editor-template-front/src/lib/articlePool.js
import { cache } from 'react'
import { createArticlePool } from '@crtobias/portal-ui'
import { backendFetch } from './backendClient'

const getSlot = cache(() => ({ pool: null }))

export function setupHomePool() {
  const slot = getSlot()
  if (!slot.pool) slot.pool = createArticlePool(backendFetch)
}

export function getCurrentPool() {
  return getSlot().pool
}

export async function claimArticles(limit) {
  const pool = getCurrentPool()
  if (pool) return pool.claimArticles(limit)
  // fallback: fetch fresco sin dedupe
}
```

```jsx
// src/screens/Home/Home.jsx
import { setupHomePool } from '@/lib/articlePool'

export default async function Home(...) {
  setupHomePool()   // Home explícitamente activa el pool
  // ...renderizar widgets normalmente
}

// src/screens/ArticleDetail/ArticleDetail.jsx
// NO llama setupHomePool → widgets caen al camino sin dedupe.
```

### CMS (Vite client)

```jsx
import { ArticlePoolProvider } from '@crtobias/portal-ui'

// Solo en EditableHomePreview, modo lector:
<ArticlePoolProvider key={poolKey} fetcher={backendFetch}>
  {homeBlocks}
</ArticlePoolProvider>
```

Los widgets client consumen via hook:

```jsx
import { useArticlePool } from '@crtobias/portal-ui'

function Feed({ settings }) {
  const pool = useArticlePool()
  // si pool: pool.claimArticles(limit)
  // si null: fetch fresco
}
```

`useArticles({ limit })` también está disponible — wraps el flow anterior.

---

## Workflow de desarrollo

### Iteración local con `npm link`

Para ver cambios al toque sin publicar:

```bash
cd portal-ui && npm link

cd ../editor-template-front && npm link @crtobias/portal-ui
cd ../cms-editor-front      && npm link @crtobias/portal-ui
```

Al terminar:

```bash
cd editor-template-front && npm unlink @crtobias/portal-ui && npm install
cd ../cms-editor-front    && npm unlink @crtobias/portal-ui && npm install
```

### Alternativa: `file:` durante el setup

Antes del primer publish a npm, podés usar:

```json
{
  "dependencies": {
    "@crtobias/portal-ui": "file:../portal-ui"
  }
}
```

Eso simula la dependencia. Cuando ya publicaste, cambiá a `"^0.3.0"`.

### Agregar un componente nuevo

1. **Copiá el componente** de `editor-template-front/src/components/X/`
   a `portal-ui/src/components/X/`
2. **Quitá los imports `next/*`** y reemplazalos por `useAdapters()`:
   ```diff
   - import Link from 'next/link'
   + import { useAdapters } from '../../adapters/AdaptersContext.jsx'

     export default function MyComponent() {
   +   const { Link } = useAdapters()
       return <Link href="...">...</Link>
     }
   ```
3. **Cambiá imports `@/...`** a paths relativos (el paquete no tiene el
   alias `@/` de las apps).
4. **Agregalo al barrel** en `src/index.js`.
5. **Bump versión** y publicá (ver abajo).
6. **En cada app**, dejá un shim de 1 línea en la ruta original:
   ```js
   export { MyComponent as default } from '@crtobias/portal-ui'
   ```
   Esto evita tocar los 20+ callers que ya importan
   `@/components/MyComponent/MyComponent`.

---

## Publicar a npm

```bash
cd portal-ui

# Login una sola vez por máquina
npm login

# Bump + publicar (los scripts del package.json corren ambos pasos)
npm run release:patch   # 0.3.0 -> 0.3.1   bugfix
npm run release:minor   # 0.3.0 -> 0.4.0   componente nuevo
npm run release:major   # 0.3.0 -> 1.0.0   breaking change
```

Después, en cada app:

```bash
npm install @crtobias/portal-ui@latest
# o pinear:
npm install @crtobias/portal-ui@^0.4.0
```

---

## Qué NO va en el paquete

| ❌ NO | Por qué | Solución |
|---|---|---|
| `next/*` (Image, Link, navigation, font) | Acoplaría el paquete a Next | Adapter via `useAdapters()` |
| `@mui/*` | Solo el CMS lo usa | Vive en `cms-editor-front` |
| `@dnd-kit/*` | Solo el editor lo usa | Vive en `cms-editor-front` |
| `fs`, env del server, secrets | No es código de cliente | Cada app |
| `React.cache()` u otra magia de Next server | Acopla a runtime | Cada app lo combina con la factory del paquete |
| Path alias `@/` | El paquete no controla el resolver | Imports relativos siempre |

## Convención de versiones

- **patch** (`0.3.0 → 0.3.1`): bug fix, sin cambios de API
- **minor** (`0.3.0 → 0.4.0`): componente nuevo, prop opcional nueva
- **major** (`0.3.0 → 1.0.0`): breaking change (rename, remove prop,
  cambio de shape, signature de hook)

Pinear con `^` para auto-update minor/patch en las apps durante la beta.
Para producción estable, pinear exact (`"@crtobias/portal-ui": "0.4.2"`).

---

## Estructura del paquete

```
src/
├── adapters/
│   └── AdaptersContext.jsx       — AdaptersProvider, useAdapters
├── context/
│   └── SiteConfigContext.jsx     — SiteConfigProvider + hooks (useTheme...)
├── data/
│   ├── ArticlePoolContext.jsx    — createArticlePool, ArticlePoolProvider
│   ├── useArticles.js            — hook universal
│   └── index.js
├── constants/
│   └── imageSizes.js
├── utils/
│   └── fechaHora.js
├── styles/                       — SCSS partials compartidos (mixins, variables)
│   ├── index.scss
│   ├── mixins/
│   └── variables/
├── components/
│   ├── UI/                       — primitives (AspectImage, Icon, Tooltip…)
│   ├── DateTime/
│   ├── AuthorBlock/
│   ├── Breadcrumb/
│   ├── ShareBlock/
│   ├── Cards/                    — ArticleCard, Bajada
│   ├── Feed/                     — FeedView + variants
│   ├── Hero/                     — HeroView
│   ├── Recommended/              — RecommendedView
│   └── Cabezal/                  — CabezalView + 18 variants + CardCabezal
└── index.js                      — barrel exports
```

Cada View es un client component (`'use client'`) cuando usa hooks. La
data layer (fetch, claim del pool) **vive en cada app**, no en el paquete.
