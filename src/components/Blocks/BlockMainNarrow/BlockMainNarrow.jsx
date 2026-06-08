import style from "./BlockMainNarrow.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"
import { WidgetThemeScope } from "../../../context/SiteConfigContext.jsx"

export default function BlockMainNarrow({ widgets, registry }) {
  const widget = widgets?.[0]
  if (!widget) return null

  const Widget = registry[widget.type]
  if (!Widget) return null

  return (
    <section className={style.container}>
      <WidgetErrorBoundary>
        <WidgetThemeScope override={widget.settings?.theme}>
          <Widget settings={widget.settings} />
        </WidgetThemeScope>
      </WidgetErrorBoundary>
    </section>
  )
}
