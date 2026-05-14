import style from "./BlockColumns.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"

// área según ranking de prioridad (menor número = más importante)
const RANK_TO_AREA = ["hero", "recommended", "feed"]

export default function BlockColumns({ widgets, registry, settings = {} }) {
  const sorted = [...widgets].sort((a, b) => a.priority - b.priority)

  const hasImportant = sorted.some((w) => w.settings?.important === true)
  const layout = settings.layout ?? 'default'

  const gridClass = layout === 'categoriaDos'
    ? style.gridCategoriaDos
    : hasImportant ? style.gridFeatured : style.gridNormal

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
                <Widget settings={settings} />
              </WidgetErrorBoundary>
            </div>
          )
        })}
      </div>
    </section>
  )
}
