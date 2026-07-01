/**
 * Helpers de fecha/hora para el Mundial, en horario de Argentina (es-AR).
 * Devuelven etiquetas tipo "Hoy 21:00" / "Mañana 16:00" / "12 jun 19:00",
 * como en el diseño.
 */
const TZ = 'America/Argentina/Buenos_Aires'

const dayKey = (d) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ }).format(d)

const timeStr = (d) =>
  new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TZ }).format(d)

/** Devuelve { day, time } — day ∈ {'Hoy','Mañana','12 jun', ...}. */
export function kickoffParts(datetime) {
  if (!datetime) return { day: 'A', time: 'confirmar' }
  const d = new Date(datetime)
  if (Number.isNaN(d.getTime())) return { day: 'A', time: 'confirmar' }

  const now = new Date()
  const today = dayKey(now)
  const tomorrow = dayKey(new Date(now.getTime() + 86_400_000))
  const k = dayKey(d)

  let day
  if (k === today) day = 'Hoy'
  else if (k === tomorrow) day = 'Mañana'
  else day = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', timeZone: TZ }).format(d)

  return { day, time: timeStr(d) }
}

/** Etiqueta compacta de una sola línea: "Hoy 21:00". */
export function kickoffLabel(datetime) {
  const { day, time } = kickoffParts(datetime)
  return `${day} ${time}`
}

/** Rango de fechas del torneo: "11 jun — 19 jul 2026". */
export function formatRange(start, end) {
  const fmt = (s) => {
    if (!s) return ''
    const d = new Date(s)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ }).format(d)
  }
  const a = fmt(start), b = fmt(end)
  return a && b ? `${a} — ${b}` : a || b
}
