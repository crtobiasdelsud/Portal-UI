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

  if (part === 'date') return <span className={styles.date} style={style}>{fecha}</span>
  if (part === 'time') return <span className={styles.time} style={style}>{hora}</span>

  return (
    <div className={styles.wrapper} style={{ color: textColor, backgroundColor }}>
      <span>{fecha}</span>
      <span>{hora}</span>
    </div>
  )
}
