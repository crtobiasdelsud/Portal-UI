import BlockColumns from "../BlockColumns/BlockColumns"

/**
 * Espejo de BlockColumns con el Hero ancho (2 cols) a la IZQUIERDA y los 2
 * widgets acompañantes (1 col c/u) a la derecha. No tiene grilla propia: solo
 * fuerza `layout: 'heroIzquierda'`, que BlockColumns traduce a la clase
 * `.gridHeroLeft` ("hero hero recommended feed"). Mismo patrón que el par
 * BlockHeroTrio / BlockHeroTrioLeft.
 */
export default function BlockColumnsHeroLeft({ settings = {}, ...props }) {
  return <BlockColumns {...props} settings={{ ...settings, layout: 'heroIzquierda' }} />
}
