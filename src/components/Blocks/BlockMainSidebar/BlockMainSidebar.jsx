import style from "./BlockMainSidebar.module.scss"
import WidgetFrame from "../WidgetFrame"

export default function BlockMainSidebar({ widgets = [], sidebarWidgets = [], children, sidebarChildren, registry }) {
  return (
    <section className={style.container}>
      <div className={style.main}>
        {children}
        {widgets.map((widget, i) => {
          const Widget = registry?.[widget.type]
          if (!Widget) return null
          return (
            <WidgetFrame key={widget.type + i} settings={widget.settings}>
              <Widget settings={widget.settings} />
            </WidgetFrame>
          )
        })}
      </div>
      <div className={style.sidebar}>
        {sidebarChildren}
        {sidebarWidgets.map((widget, i) => {
          const Widget = registry?.[widget.type]
          if (!Widget) return null
          return (
            <WidgetFrame key={widget.type + i} settings={widget.settings}>
              <Widget settings={widget.settings} />
            </WidgetFrame>
          )
        })}
      </div>
    </section>
  )
}
