export const AR_TIME_ZONE = 'America/Argentina/Buenos_Aires'

export function formatArticlePublicationDate(value, useLongDate = true) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const fecha = date.toLocaleDateString('es-AR', {
    timeZone: AR_TIME_ZONE,
    day: '2-digit',
    month: useLongDate ? 'long' : '2-digit',
    year: 'numeric',
  })
  const hora = date.toLocaleTimeString('es-AR', {
    timeZone: AR_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  return {
    dateTime: date.toISOString(),
    label: `Publicado el ${fecha} a las ${hora}`,
  }
}
