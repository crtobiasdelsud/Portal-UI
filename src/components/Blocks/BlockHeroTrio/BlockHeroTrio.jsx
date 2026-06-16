import style from "./BlockHeroTrio.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"
import { WidgetThemeScope } from "../../../context/SiteConfigContext.jsx"

/**
 * Bloque "Hero + trío": main ancho (3/4) para un hero/widget grande + columna
 * lateral angosta (1/4) pensada para 3 cards chicas apiladas. Mismas
 * proporciones que BlockMainSidebar pero como bloque dedicado del home.
 */
export default function BlockHeroTrio({ widgets = [], sidebarWidgets = [], children, sidebarChildren, registry }) {
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
