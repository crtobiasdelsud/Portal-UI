import style from "./BlockMain.module.scss"
import WidgetFrame from "../WidgetFrame"

export default function BlockMain({ widgets, registry }) {
  const widget = widgets?.[0]
  if (!widget) return null

  const Widget = registry[widget.type]
  if (!Widget) return null

  return (
    <section className={style.container}>
      <WidgetFrame settings={widget.settings}>
        <Widget settings={widget.settings} />
      </WidgetFrame>
    </section>
  )
}
