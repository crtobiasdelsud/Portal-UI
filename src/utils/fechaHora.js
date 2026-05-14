const DIAS = [
  "Domingo", "Lunes", "Martes", "Miércoles",
  "Jueves", "Viernes", "Sábado"
]

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export function getFechaHora() {
  const now = new Date()

  const diaSemana = DIAS[now.getDay()]
  const dia = now.getDate()
  const mes = MESES[now.getMonth()]
  const año = now.getFullYear()
  const horas = String(now.getHours()).padStart(2, "0")
  const minutos = String(now.getMinutes()).padStart(2, "0")

  return {
    fecha: `${diaSemana} ${dia} de ${mes} de ${año}`,
    hora: `${horas}:${minutos}HS`
  }
}
