import styles from "./DateTime.module.scss"
import { getFechaHora } from "../../utils/fechaHora.js"

export default function DateTime({ isAmp = false, textColor, backgroundColor, part = 'both' }) {
  const { fecha, hora } = getFechaHora()
  if (isAmp) {
    return (
      <div className="header-simple__datetime">
        <span className="header-simple__datetime-date">{fecha}</span>
        <span className="header-simple__datetime-time">{hora}</span>
      </div>
    )
  }

  const style = { color: textColor }

  // suppressHydrationWarning: la hora/fecha se calcula con new Date() y difiere
  // entre SSR y cliente (zona horaria / minuto); es esperado, no un bug.
  if (part === 'date') return <span className={styles.date} style={style} suppressHydrationWarning>{fecha}</span>
  if (part === 'time') return <span className={styles.time} style={style} suppressHydrationWarning>{hora}</span>

  return (
    <div className={styles.wrapper} style={{ color: textColor, backgroundColor }}>
      <span suppressHydrationWarning>{fecha}</span>
      <span suppressHydrationWarning>{hora}</span>
    </div>
  )
}
