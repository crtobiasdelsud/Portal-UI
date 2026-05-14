# @crtobias/portal-ui

Componentes compartidos entre **editor-template-front** (portal Next 15) y
**cms-editor-front** (CMS Vite). Views puras + providers para adapters
(`Image`, `Link`, `fetcher`) y para el `articlePool`.

> Paquete público en npm. Las apps consumen los `.jsx` y `.scss` **crudos**
> (sin build step en este repo). Cada app los compila en su propio bundle.

---

## Instalación en una app

```bash
npm install @crtobias/portal-ui
```

`peerDependencies`: `react@^19`, `react-dom@^19`, `sass@^1.98`.

---

## Setup mínimo

### Next 15 (server + client friendly)

```jsx
// src/app/layout.jsx
import Image from 'next/image'
import Link  from 'next/link'
import { backendFetch } from '@/lib/backendClient'
import { AdaptersProvider } from '@crtobias/portal-ui'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AdaptersProvider value={{ Image, Link, fetcher: backendFetch }}>
          {children}
        </AdaptersProvider>
      </body>
    </html>
  )
}
```

### Vite (CMS)

```jsx
// src/main.jsx
import { AdaptersProvider } from '@crtobias/portal-ui'
import { backendFetch } from './lib/backendClient'
import ImgShim  from './shims/Image'
import LinkShim from './shims/Link'

<AdaptersProvider value={{ Image: ImgShim, Link: LinkShim, fetcher: backendFetch }}>
  <App />
</AdaptersProvider>
```

Dentro del paquete los componentes consumen el adapter:

```jsx
import { useAdapters } from '@crtobias/portal-ui'

export default function ArticleCard({ article }) {
  const { Image, Link } = useAdapters()
  return (
    <Link href={`/${article.categoria}/${article.slug}`}>
      <Image src={article.imagen?.url} alt={article.titulo} width={400} height={250} />
    </Link>
  )
}
```

---

## ArticlePool (dedupe sólo donde se necesita)

Solo la **Home** del portal y el **EditableHomePreview** del CMS envuelven
su árbol con `<ArticlePoolProvider>`. El resto de páginas (artículo,
categoría) no lo usan, así cada widget hace fetch independiente y no se
"roban" IDs entre sí.

```jsx
import { ArticlePoolProvider } from '@crtobias/portal-ui'

<ArticlePoolProvider fetcher={backendFetch}>
  {homeBlocks}
</ArticlePoolProvider>
```

En widgets client:

```jsx
import { useArticles } from '@crtobias/portal-ui'

function Feed({ settings }) {
  const { articles, loading } = useArticles({ limit: settings.limit ?? 10 })
  // ...
}
```

En widgets server (Next):

```jsx
import { createArticlePool } from '@crtobias/portal-ui'
import { backendFetch } from '@/lib/backendClient'

// Una vez por request, en Home:
const pool = createArticlePool(backendFetch)
// Pasalo por prop a los widgets server.
```

---

## Workflow de desarrollo

### Iteración local (sin publicar)

Usar `npm link` para ver cambios en vivo:

```bash
cd portal-ui && npm link
cd ../editor-template-front && npm link @crtobias/portal-ui
cd ../cms-editor-front      && npm link @crtobias/portal-ui
```

Cuando termines: `npm unlink @crtobias/portal-ui` en cada app y
`npm install` para volver a la versión publicada.

### Publicar a npm

```bash
cd portal-ui
# arreglo chico:
npm run release:patch    # 0.1.0 -> 0.1.1
# feature nueva:
npm run release:minor    # 0.1.0 -> 0.2.0
# breaking change:
npm run release:major    # 0.1.0 -> 1.0.0
```

Cada script hace `npm version <bump>` (crea commit + tag) y `npm publish --access public`.

### Actualizar en cada app

```bash
cd editor-template-front && npm install @crtobias/portal-ui@latest
cd ../cms-editor-front    && npm install @crtobias/portal-ui@latest
```

Para pinear:

```bash
npm install @crtobias/portal-ui@0.2.3
```

---

## Qué NO va en el paquete

- `next/*` (Image, Link, navigation, font) → vía `AdaptersProvider`
- `@mui/*`, `@dnd-kit/*` → solo CMS
- `fs`, env de servidor, secrets → solo apps
- Lógica de fetching server-side (`React.cache`, etc.) → cada app

## Convención de versiones

- **patch**: bug fix, sin cambios de API
- **minor**: componente nuevo, prop opcional nueva
- **major**: breaking change (rename, remove prop, cambio de shape)
