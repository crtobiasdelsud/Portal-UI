/**
 * Convierte hex a luminancia relativa (WCAG 2.1)
 */
function getLuminance(hex) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const toLinear = (c) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Ratio de contraste entre dos colores (WCAG)
 * Mínimo recomendado: 4.5 (AA normal), 3.0 (AA large)
 */
export function contrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker  = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Dado un color HEX, devuelve un string de CSS filter que reproduce ese color
 * sobre un SVG/PNG blanco o negro (usado para colorear iconos on hover).
 */
export function hexToCssFilter(hex) {
  function hexToRgb(hex) {
    hex = hex.replace('#', '')
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('')
    const bigint = parseInt(hex, 16)
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
  }
  const { r, g, b } = hexToRgb(hex)
  const nr = r / 255, ng = g / 255, nb = b / 255
  const invert     = (1 - Math.max(nr, ng, nb)).toFixed(2)
  const sepia      = (0.2 + nr * 0.8).toFixed(2)
  const saturate   = (1 + ng * 5).toFixed(2)
  const hueRotate  = Math.round(nb * 360)
  const brightness = (0.8 + nr * 0.4).toFixed(2)
  const contrast   = (0.8 + ng * 0.4).toFixed(2)
  return `invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hueRotate}deg) brightness(${brightness}) contrast(${contrast})`
}

/**
 * Dado un color de fondo, devuelve el color de texto con mejor contraste.
 * Si el color original ya pasa el umbral mínimo, lo devuelve sin cambiar.
 */
export function ensureContrast(textColor, bgColor, minRatio = 4.5) {
  if (!textColor || !bgColor) return textColor

  try {
    if (contrastRatio(textColor, bgColor) >= minRatio) return textColor
    const withWhite = contrastRatio('#ffffff', bgColor)
    const withBlack = contrastRatio('#000000', bgColor)
    return withWhite >= withBlack ? '#ffffff' : '#000000'
  } catch {
    return textColor
  }
}
