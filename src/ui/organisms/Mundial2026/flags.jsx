import s from './Flags.module.scss'

/**
 * Banderas de selecciones. Estrategia (en orden):
 *   1. Bandera CUADRADA (1:1) por código ISO-2 vía flag-icons (jsDelivr) —
 *      uniforme para las 48 selecciones, sin recortes.
 *   2. `flag` (URL del proveedor — ej. imagen de Promiedos / logo API-Football)
 *      cuando no tenemos ISO-2 para el código.
 *   3. SVG geométrico embebido (offline, set acotado del diseño original).
 *   4. Recuadro neutro (el caller igualmente muestra el código de texto).
 */
const FLAG_CDN = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/1x1'

// TLA (FIFA, 3 letras) → ISO-3166-1 alfa-2 (flagcdn). Incluye subdivisiones UK.
export const ISO2 = {
  ARG: 'ar', AUS: 'au', AUT: 'at', BEL: 'be', BRA: 'br', CAN: 'ca', CHI: 'cl',
  CIV: 'ci', CMR: 'cm', COL: 'co', CRC: 'cr', CRO: 'hr', DEN: 'dk', ECU: 'ec',
  EGY: 'eg', ENG: 'gb-eng', ESP: 'es', FRA: 'fr', GER: 'de', GHA: 'gh',
  IRN: 'ir', ITA: 'it', JPN: 'jp', JOR: 'jo', KOR: 'kr', KSA: 'sa', MAR: 'ma',
  MEX: 'mx', NED: 'nl', NGA: 'ng', NOR: 'no', NZL: 'nz', PAN: 'pa', PAR: 'py',
  PER: 'pe', POL: 'pl', POR: 'pt', QAT: 'qa', RSA: 'za', SCO: 'gb-sct',
  SEN: 'sn', SRB: 'rs', SUI: 'ch', SWE: 'se', TUN: 'tn', UKR: 'ua', URU: 'uy',
  USA: 'us', UZB: 'uz', WAL: 'gb-wls', ALG: 'dz', DZA: 'dz', HAI: 'ht',
  CPV: 'cv', CUW: 'cw', HON: 'hn', JAM: 'jm', VEN: 've', BOL: 'bo',
  TUR: 'tr', GRE: 'gr', ROU: 'ro', ROM: 'ro', CZE: 'cz', HUN: 'hu',
  IRL: 'ie', IRE: 'ie', SVN: 'si', SVK: 'sk', MLI: 'ml', COD: 'cd',
  BFA: 'bf', NIR: 'gb-nir', PAN: 'pa', BIH: 'ba', IRQ: 'iq',
}

// SVG geométrico (offline) del set original del diseño.
export const FLAGS = {
  ARG: '<svg viewBox="0 0 9 6"><rect width="9" height="6" fill="#74acdf"/><rect y="2" width="9" height="2" fill="#fff"/><circle cx="4.5" cy="3" r=".75" fill="#f6b40e"/></svg>',
  MEX: '<svg viewBox="0 0 9 6"><rect width="3" height="6" fill="#006847"/><rect x="3" width="3" height="6" fill="#fff"/><rect x="6" width="3" height="6" fill="#ce1126"/><circle cx="4.5" cy="3" r=".6" fill="#9b6b2e"/></svg>',
  BRA: '<svg viewBox="0 0 9 6"><rect width="9" height="6" fill="#009b3a"/><polygon points="4.5,.7 8.3,3 4.5,5.3 .7,3" fill="#fedf00"/><circle cx="4.5" cy="3" r="1.15" fill="#002776"/></svg>',
  ESP: '<svg viewBox="0 0 9 6"><rect width="9" height="6" fill="#aa151b"/><rect y="1.5" width="9" height="3" fill="#f1bf00"/></svg>',
  FRA: '<svg viewBox="0 0 9 6"><rect width="3" height="6" fill="#0055a4"/><rect x="3" width="3" height="6" fill="#fff"/><rect x="6" width="3" height="6" fill="#ef4135"/></svg>',
  ENG: '<svg viewBox="0 0 9 6"><rect width="9" height="6" fill="#fff"/><rect x="3.8" width="1.4" height="6" fill="#ce1124"/><rect y="2.3" width="9" height="1.4" fill="#ce1124"/></svg>',
  GER: '<svg viewBox="0 0 9 6"><rect width="9" height="2" fill="#111"/><rect y="2" width="9" height="2" fill="#dd0000"/><rect y="4" width="9" height="2" fill="#ffce00"/></svg>',
  POR: '<svg viewBox="0 0 9 6"><rect width="9" height="6" fill="#da291c"/><rect width="3.6" height="6" fill="#046a38"/><circle cx="3.6" cy="3" r=".85" fill="#ffe000"/></svg>',
  NED: '<svg viewBox="0 0 9 6"><rect width="9" height="2" fill="#ae1c28"/><rect y="2" width="9" height="2" fill="#fff"/><rect y="4" width="9" height="2" fill="#21468b"/></svg>',
  CRO: '<svg viewBox="0 0 9 6"><rect width="9" height="2" fill="#ff0000"/><rect y="2" width="9" height="2" fill="#fff"/><rect y="4" width="9" height="2" fill="#171796"/><rect x="3.9" y="1.4" width="1.2" height="1.2" fill="#ff0000"/><rect x="3.9" y="2.6" width="1.2" height="1.2" fill="#fff" stroke="#ff0000" stroke-width=".15"/></svg>',
}

export const NAME = {
  ARG: 'Argentina', MEX: 'México', BRA: 'Brasil', ESP: 'España', FRA: 'Francia',
  ENG: 'Inglaterra', GER: 'Alemania', POR: 'Portugal', NED: 'Países Bajos', CRO: 'Croacia',
}

/** Nombre legible de una selección por código, con fallback al nombre dado o al código. */
export function teamName(code, fallback) {
  return fallback || NAME[code] || code || ''
}

const SIZE_CLASS = { lg: 'lg', md: 'md' }

/**
 * Bandera. `flag` = URL explícita (proveedor). `code` = TLA (para CDN/SVG).
 * `size`: 'sm' (default) | 'md' (tira V2) | 'lg' (destacado).
 */
export function Flag({ code, flag, size = 'sm', className = '' }) {
  const sizeClass = SIZE_CLASS[size] ? s[SIZE_CLASS[size]] : ''
  const cls = `${s.fl} ${sizeClass} ${className}`.trim()

  const iso = ISO2[code]
  // Preferimos la bandera cuadrada (1:1) por ISO-2; si no, la del proveedor.
  const url = (iso ? `${FLAG_CDN}/${iso}.svg` : '') || flag

  if (url) {
    return <img src={url} alt="" aria-hidden="true" loading="lazy" className={`${cls} ${s.img}`} />
  }

  const svg = FLAGS[code]
  if (svg) {
    return <span className={cls} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
  }

  return <span className={cls} aria-hidden="true" />
}
