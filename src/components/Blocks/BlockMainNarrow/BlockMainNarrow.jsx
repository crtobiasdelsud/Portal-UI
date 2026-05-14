import style from "./BlockMainNarrow.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"

export default function BlockMainNarrow({ widgets, registry }) {
  const widget = widgets?.[0]
  if (!widget) return null

  const Widget = registry[widget.type]
  if (!Widget) return null

  return (
    <section className={style.container}>
      <WidgetErrorBoundary>
        <Widget settings={widget.settings} />
      </WidgetErrorBoundary>
    </section>
  )
}
