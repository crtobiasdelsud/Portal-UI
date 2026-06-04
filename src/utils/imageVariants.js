// Helpers para servir las variantes WebP que genera el backend (Sharp) sin
// depender del Image Optimization API de Next (`images.unoptimized: true`).
// El backend expone `imagen.variants.{thumb,medium,large,xl,og}`, cada una con
// { url, width, height }. Ver ADR-0002 (editor-template-front/docs/adr).

import { sanitizeResourceUrl } from './sanitizeHtml.js'

// Variantes proporcionales utilizables como resolución alternativa en un srcset.
// `og` queda fuera porque es un cover-crop 1200x630 (otra relación de aspecto).
const SRCSET_VARIANTS = ['thumb', 'medium', 'large', 'xl']

/**
 * Construye el atributo `srcset` con width-descriptors a partir de las variantes
 * del CDN, p. ej. "<thumb> 300w, <medium> 800w, <large> 1200w, <xl> 1920w".
 * Usa el `width` real de cada variante; ignora las que falten.
 *
 * @param {Object|null|undefined} variants
 * @returns {string|null} srcset o null si no hay variantes con url+width.
 */
export function buildSrcSet(variants) {
  if (!variants || typeof variants !== 'object') return null
  const parts = []
  for (const name of SRCSET_VARIANTS) {
    const v = variants[name]
    const url = sanitizeResourceUrl(v?.url)
    const widthValue = String(v?.width ?? '').trim()
    const width = /^\d{1,5}$/.test(widthValue) ? Number.parseInt(widthValue, 10) : null
    if (url && width && width > 0 && width <= 10000) parts.push(`${url} ${width}w`)
  }
  return parts.length ? parts.join(', ') : null
}

/**
 * Devuelve la url de la variante preferida con fallback (patrón ADR-0002).
 *
 * @param {Object|null|undefined} variants
 * @param {string|null} fallbackUrl
 * @param {'thumb'|'medium'|'large'|'xl'|'og'} [preferred='large']
 * @returns {string|null}
 */
export function resolveImageSrc(variants, fallbackUrl, preferred = 'large') {
  return sanitizeResourceUrl(variants?.[preferred]?.url) ?? sanitizeResourceUrl(fallbackUrl) ?? null
}
