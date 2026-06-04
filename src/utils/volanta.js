// Helper compartido por cabezales, hero, bajada, etc. La volanta se renderiza
// inline con el título separada por ". " (en cabezales el espacio lo da el
// `margin-right` del CSS; en bajada/leeAdemas/loQueSeLee es un literal en JSX).
// Si quien edita la nota ya cerró la volanta con un signo (".", "!", "?", "…"),
// no agregamos otro punto — devolvemos el texto tal cual.

const SENTENCE_END = /[.!?…]\s*$/

export function volantaWithStop(volanta) {
  if (!volanta) return ''
  return SENTENCE_END.test(volanta) ? volanta : `${volanta}.`
}
