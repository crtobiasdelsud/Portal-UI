import style from "./BlockColumns.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"
import { WidgetThemeScope } from "../../../context/SiteConfigContext.jsx"

// área según ranking de prioridad (menor número = más importante)
const RANK_TO_AREA = ["hero", "recommended", "feed"]

export default function BlockColumns({ widgets, registry, settings = {} }) {
  const sorted = [...widgets].sort((a, b) => a.priority - b.priority)

  const importantHero = sorted.find((w) => w.settings?.important === true)
  const hasImportant = !!importantHero
  // Nota elegida por el editor para el hero fantasma (settings del hero bomba).
  // Si no hay, queda `{}` → nota automática (random), como antes.
  const fantasmaArticleId = importantHero?.settings?.fantasmaArticleId
  const layout = settings.layout ?? 'default'

  const gridClass = layout === 'categoriaDos'
    ? style.gridCategoriaDos
    : hasImportant ? style.gridFeatured : style.gridNormal

  // Hero "fantasma": cuando hay un hero importante se agrega un Hero extra,
  // sin articleId (artículo random), solo para ocupar el espacio del centro
  // de la fila de abajo.
  const HeroWidget = registry["HERO_BLOCK"]

  return (
    <section className={style.container}>
      <div className={`${style.grid} ${gridClass}`}>
        {sorted.map(({ type, settings }, rank) => {
          const Widget = registry[type]
          if (!Widget) return null

          const area = RANK_TO_AREA[rank] ?? "auto"

          return (
            <div key={rank} className={style.item} style={{ gridArea: area }}>
              <WidgetErrorBoundary>
                <WidgetThemeScope override={settings?.theme}>
                  <Widget settings={settings} />
                </WidgetThemeScope>
              </WidgetErrorBoundary>
            </div>
          )
        })}
        {hasImportant && HeroWidget && (
          <div className={style.item} style={{ gridArea: "fantasma" }}>
            <WidgetErrorBoundary>
              <HeroWidget settings={fantasmaArticleId ? { articleId: fantasmaArticleId } : {}} />
            </WidgetErrorBoundary>
          </div>
        )}
      </div>
    </section>
  )
}
