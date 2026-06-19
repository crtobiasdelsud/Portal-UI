/**
 * Genera CSS responsive scopeado a una clase, a partir de tres objetos de estilo
 * por breakpoint (base/tablet/móvil). Es el mismo mecanismo que usa el estilo
 * propio de los BLOQUES (ver blockStyleCss en el front), pero genérico: lo
 * reutiliza el estilo por WIDGET.
 *
 *   - base   → escritorio (aplica siempre)
 *   - tablet → pisa en tablet y abajo (@media max-width 1199.98)
 *   - mobile → pisa en móvil (@media max-width 767.98)
 *
 * Se usa @media (ancho real del viewport) y NO @container: a prueba de balas y
 * coincide con lo que el usuario entiende por móvil/tablet/escritorio. La cascada
 * por orden de fuente hace que Móvil gane sobre Tablet, y Tablet sobre Escritorio.
 */

const TABLET_MAX = '1199.98px';
const MOBILE_MAX = '767.98px';

/** camelCase → kebab-case ('backgroundColor' → 'background-color'). Respeta --custom-props. */
function cssKey(k) {
  if (k.startsWith('--')) return k;
  return k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/** Solo claves CSS plausibles: evita que una clave rara inyecte algo al <style>. */
function isSafeCssKey(k) {
  return /^-{0,2}[a-zA-Z][a-zA-Z-]*$/.test(k);
}

/**
 * Limpia un valor antes de meterlo en un `<style>`: saca caracteres que podrían
 * cerrar la regla o el tag (`< > { } \`) y colapsa `;`. Defensa contra Stored XSS.
 */
function sanitizeCssValue(v) {
  return String(v).replace(/[<>{}\\]/g, '').replace(/;+/g, ' ').trim();
}

/** Objeto de estilo React → string de declaraciones CSS ("a:b;c:d"). */
function styleObjectToCss(obj) {
  return Object.entries(obj || {})
    .filter(([k, v]) => isSafeCssKey(k) && v != null && v !== '')
    .map(([k, v]) => `${cssKey(k)}:${sanitizeCssValue(v)}`)
    .filter((decl) => !decl.endsWith(':'))
    .join(';');
}

const isEmpty = (o) => !o || Object.keys(o).length === 0;

/**
 * Devuelve el string CSS para `{ base, tablet, mobile }` scopeado a `.className`.
 * '' si no hay ningún estilo. Renderizá `<style>` con el resultado y aplicá
 * `className` al wrapper.
 */
export function buildResponsiveStyleCss({ base, tablet, mobile }, className) {
  if (isEmpty(base) && isEmpty(tablet) && isEmpty(mobile)) return '';

  const sel = `.${className}`;
  let css = '';

  const baseDecl = styleObjectToCss(base);
  if (baseDecl) css += `${sel}{${baseDecl}}`;

  const tabletDecl = styleObjectToCss(tablet);
  if (tabletDecl) css += `@media (max-width:${TABLET_MAX}){${sel}{${tabletDecl}}}`;

  const mobileDecl = styleObjectToCss(mobile);
  if (mobileDecl) css += `@media (max-width:${MOBILE_MAX}){${sel}{${mobileDecl}}}`;

  return css;
}
