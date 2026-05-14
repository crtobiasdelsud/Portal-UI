# Workflow — @crtobiasdelsud/portal-ui

Guía rápida para el día a día: cómo agregar/cambiar algo en la librería y que llegue a las apps.

> Para el detalle del adapter pattern, estructura, y API exportada → ver [`README.md`](./README.md).

---

## TL;DR — ¿se actualiza solo el npm?

**No.** npm NO se actualiza automático cuando editás archivos del paquete. Hay que **publicar una versión nueva** y después **bumpear en las apps**.

Hay dos modos de trabajar:

| Modo | Cuándo usar | ¿Hay que publicar? |
|---|---|---|
| **Local con `file:` link** | Dev día a día — probar cambios al toque | ❌ No |
| **Versión publicada (`^1.0.0`)** | Producción / otro dev / deploy | ✅ Sí, cada cambio |

Las apps **actualmente están en modo publicado** (`^1.0.0`). Para volver a dev rápido, cambiá la dependencia a `"file:../portal-ui"` en el `package.json` de cada app y corré `npm install`. Pero recordá revertirlo antes de pushear.

---

## Flujo: cambiar/agregar algo en portal-ui

### 1. Editar el código en `portal-ui/src/`

Ej.: editar `src/components/Cards/ArticleCard/ArticleCard.jsx` o crear `src/components/Newsletter/Newsletter.jsx` y exportarlo en `src/index.js`.

### 2. Probarlo localmente — sin publicar (recomendado para iterar)

Hay dos opciones para que las apps vean los cambios sin publicar a npm:

**A) Cambiar temporalmente las apps a `file:` link**

En `editor-template-front/package.json` y `cms-editor-front/package.json`:

```json
"@crtobiasdelsud/portal-ui": "file:../portal-ui"
```

Después:
```bash
cd ~/Desktop/editor-template-front && npm install
cd ~/Desktop/cms-editor-front && npm install
```

Cualquier cambio en `portal-ui/src/` aparece al toque con HMR. **No publicás nada**.

> ⚠️ **Antes de mergear / deployar las apps**, revertí esto a `"^1.0.0"` y publicá la versión nueva. Si no, otros devs y CI no van a poder instalar.

> ⚠️ **Vite a veces cachea**: si parece "viejo", borrá `node_modules/.vite` y relevantá:
> ```bash
> rm -rf node_modules/.vite && npm run dev
> ```

**B) `npm link` (alternativa, mismo efecto)**

```bash
cd ~/Desktop/portal-ui && npm link

cd ~/Desktop/editor-template-front && npm link @crtobiasdelsud/portal-ui
cd ~/Desktop/cms-editor-front      && npm link @crtobiasdelsud/portal-ui
```

Para desconectar:
```bash
cd ~/Desktop/editor-template-front && npm unlink @crtobiasdelsud/portal-ui && npm install
```

### 3. Cuando esté listo, publicar a npm

```bash
cd ~/Desktop/portal-ui

# elegí UN tipo de bump según el cambio:
npm run release:patch   # 1.0.0 → 1.0.1  (bug fix)
npm run release:minor   # 1.0.0 → 1.1.0  (componente nuevo / prop nueva opcional)
npm run release:major   # 1.0.0 → 2.0.0  (breaking change — rename, remove, cambio de signature)

git push --follow-tags
```

Los scripts `release:*` hacen `npm version <bump>` + `npm publish --access public` en una sola pasada. El `npm version` crea un commit y un tag automático.

> Si te pide OTP/2FA, ver más abajo "Setup del token".

### 4. Subir la versión nueva en las apps

```bash
cd ~/Desktop/editor-template-front && npm install @crtobiasdelsud/portal-ui@latest
cd ~/Desktop/cms-editor-front      && npm install @crtobiasdelsud/portal-ui@latest
```

`npm install ...@latest` bumpea el `package.json` y el `package-lock.json`. Comiteá esos cambios en cada app.

---

## Resumen visual

```
EDITAR portal-ui/src/
        │
        ▼
PROBAR localmente
   ├─ A) cambiar apps a "file:../portal-ui" + npm install
   └─ B) npm link  (alternativa)
        │
        ▼
PUBLICAR
   npm run release:patch|minor|major
   git push --follow-tags
        │
        ▼
BUMPEAR EN APPS
   npm install @crtobiasdelsud/portal-ui@latest
   commit del package.json + lock en cada app
```

---

## Cuándo publicar (¿patch, minor o major?)

| Tipo de cambio | Bump | Ejemplo |
|---|---|---|
| Bug fix sin cambio de API | `patch` | corregir un bug en ArticleCard |
| Componente nuevo | `minor` | agregar `<Newsletter>` |
| Prop nueva **opcional** | `minor` | `<ArticleCard variant="bordered" />` con default |
| Prop nueva **requerida** | `major` | `<ArticleCard required onClick={...}>` |
| Renombrar export | `major` | `ArticleCard` → `Card` |
| Cambiar shape de prop | `major` | `article.imagen.url` → `article.image.src` |
| Quitar export | `major` | borrar `<OldThing>` |

**Regla mental**: si un dev tiene que cambiar código en las apps para que sigan funcionando, es **major**.

---

## Versión, lock files y `^`

En el `package.json` de las apps:

```json
"@crtobiasdelsud/portal-ui": "^1.0.0"
```

- `^1.0.0` permite auto-update a **`1.x.x`** (cualquier minor/patch nuevo).
- Tras `npm install`, el `package-lock.json` pinea la versión **exacta** que se instaló (ej. `1.2.5`). El lock es la fuente de verdad para reproducir el entorno.
- Cambios de **major** (ej. `2.0.0`) **no entran automáticamente** — hay que cambiar el `^1.0.0` a `^2.0.0` a mano.

Para forzar la última versión:
```bash
npm install @crtobiasdelsud/portal-ui@latest
```

---

## Setup del token de npm (una vez)

El primer publish y los siguientes necesitan auth con npm. Para evitar el prompt de 2FA cada vez:

1. Andá a https://www.npmjs.com/settings/crtobiasdelsud/tokens
2. **"Generate New Token"** → tipo **"Automation"** (bypassea 2FA)
3. Configurá en tu máquina:
   ```bash
   npm config set //registry.npmjs.org/:_authToken=npm_xxxxx
   ```
4. Verificá:
   ```bash
   npm whoami   # debe decir: crtobiasdelsud
   ```

Después podés correr `npm publish --access public` sin que te pida OTP.

> El token se guarda en `~/.npmrc`. **No lo subas a git** ni lo pegues en chats.

---

## Multi-dev (cuando haya más gente tocando portal-ui)

Modelo recomendado: **CI publica al merge a `main`**.

- Cada dev → su cuenta de GitHub, sin acceso a npm
- Vos sos el único que tiene el `NPM_TOKEN`
- Workflow de GitHub Actions corre `npm publish` automático al mergear

Setup en `.github/workflows/publish.yml` está documentado en el [README — sección "Trabajar entre varios devs"](./README.md#trabajar-entre-varios-devs).

Sin CI: los devs proponen PRs, vos publicás a mano con `npm run release:*`.

---

## Tabla de "cuándo necesito publicar"

| Acción | Con `file:` link | Con versión publicada |
|---|---|---|
| Editar un `.scss` / `.jsx` | ✅ instantáneo (HMR) | ❌ publicar `patch` |
| Agregar un componente nuevo | ✅ instantáneo | ❌ publicar `minor` |
| Cambiar API (props, exports) | ✅ instantáneo | ❌ publicar `minor`/`major` |
| Bug fix urgente en prod | — | ❌ publicar `patch` |

**Regla:** publicás cuando alguien (CI / otro dev / deploy) que no tiene tu `~/Desktop/portal-ui` necesita el cambio.

---

## Troubleshooting

**`403 Forbidden` al publicar**
- El scope no es tuyo, o el token no tiene permiso de publish. Verificá con `npm whoami` y que el scope del `name` matchee tu username.

**`Two-factor authentication ... required`**
- Generá un **Automation token** (sección de arriba) o pasá el OTP a mano: `npm publish --access public --otp=123456`.

**`Scope not found`**
- El scope del `name` (`@xxx/portal-ui`) no existe. Si tu user es `crtobiasdelsud`, el scope automático es `@crtobiasdelsud`. Si querés otro, hay que crear una **organización** en npmjs.com.

**En la app no se ven los cambios después de `npm install ...@latest`**
- Borrá el cache de Vite: `rm -rf node_modules/.vite && npm run dev`
- Si es Next: reiniciá el dev server. `next/transpilePackages` cachea.

**`Cannot find module '@crtobiasdelsud/portal-ui'`**
- ¿Está en `transpilePackages` del `next.config.mjs`? (solo el portal Next)
- ¿La versión está bien en `package.json`? Corré `npm ls @crtobiasdelsud/portal-ui` para ver qué está instalado.
