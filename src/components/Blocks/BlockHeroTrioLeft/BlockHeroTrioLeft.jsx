import style from "./BlockHeroTrioLeft.module.scss"
import WidgetErrorBoundary from "../WidgetErrorBoundary"
import { WidgetThemeScope } from "../../../context/SiteConfigContext.jsx"

/**
 * Espejo de BlockHeroTrio: columna lateral angosta (1/4) a la IZQUIERDA + main
 * ancho (3/4) con el hero/widget grande a la derecha. Mismas proporciones que
 * BlockHeroTrio, solo invertidas (cambia la asignación de grid-column, no el DOM).
 */
export default function BlockHeroTrioLeft({ widgets = [], sidebarWidgets = [], children, sidebarChildren, registry }) {
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
