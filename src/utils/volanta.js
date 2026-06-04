// Helper compartido por cabezales, hero, bajada, etc. Normaliza la volanta
// para que el render con el título siempre sea: «volanta + punto + espacio + titulo».
// El espacio entre volanta y titulo lo provee el callsite (literal " " en JSX,
// o `margin-right` en CSS).
//
// Normalización:
// 1. Quita whitespace trailing ("postgres "        → "postgres").
// 2. Colapsa whitespace entre la palabra y un signo final ("postgres ."  → "postgres.").
// 3. Si no termina en signo de cierre (.!?…), agrega ".".
//
// Resultado: "Política." / "Política." (sin doble) / "EXCLUSIVO!" / "" .

const SENTENCE_END = /[.!?…]$/

export function volantaWithStop(volanta) {
  if (!volanta) return ''
  // Colapsa "palabra <space> . <space>" → "palabra.", y limpia trailing.
  const clean = volanta.replace(/\s+([.!?…])\s*$/, '$1').trimEnd()
  if (!clean) return ''
  return SENTENCE_END.test(clean) ? clean : `${clean}.`
}
