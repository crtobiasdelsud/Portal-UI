import style from "./BlockMainSidebar.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"

export default function BlockMainSidebar({ widgets = [], sidebarWidgets = [], children, sidebarChildren, registry }) {
  return (
    <section className={style.container}>
      <div className={style.main}>
        {children}
        {widgets.map((widget, i) => {
          const Widget = registry?.[widget.type]
          if (!Widget) return null
          return (
            <WidgetErrorBoundary key={widget.type + i}>
              <Widget settings={widget.settings} />
            </WidgetErrorBoundary>
          )
        })}
      </div>
      <div className={style.sidebar}>
        {sidebarChildren}
        {sidebarWidgets.map((widget, i) => {
          const Widget = registry?.[widget.type]
          if (!Widget) return null
          return (
            <WidgetErrorBoundary key={widget.type + i}>
              <Widget settings={widget.settings} />
            </WidgetErrorBoundary>
          )
        })}
      </div>
    </section>
  )
}
