import style from "./BlockHeroTrio.module.scss"
import WidgetFrame from "../WidgetFrame"

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
