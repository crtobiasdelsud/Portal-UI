import style from "./BlockColumnsBajada.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"

// rank 0 (prioridad más baja) = bajada abajo full width
// rank 1 y 2 = dos cards arriba
const RANK_TO_AREA = ["bajada", "top1", "top2"]

const GRID_CLASS = {
  1: style.grid1,
  2: style.grid2,
  3: style.grid3,
}

export default function BlockColumnsBajada({ widgets, registry }) {
  const sorted = [...widgets].sort((a, b) => a.priority - b.priority)
  const count  = sorted.length

  return (
    <section className={style.container}>
      <div className={`${style.grid} ${GRID_CLASS[count] ?? style.grid3}`}>
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
