import style from "./BlockMainSidebar.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"
import { WidgetThemeScope } from "../../../context/SiteConfigContext.jsx"

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
              <WidgetThemeScope override={widget.settings?.theme}>
                <Widget settings={widget.settings} />
              </WidgetThemeScope>
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
              <WidgetThemeScope override={widget.settings?.theme}>
                <Widget settings={widget.settings} />
              </WidgetThemeScope>
            </WidgetErrorBoundary>
          )
        })}
      </div>
    </section>
  )
}
