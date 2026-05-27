/**
 * Límites de cantidad de notas por tipo de cabezal.
 *
 * Fuente única de verdad de "cuántas cartas aguanta cada layout sin romperse".
 * La usa `CabezalView` para recortar el array (garantía estructural en portal y
 * CMS) y el editor del CMS para ofrecer solo cantidades válidas.
 *
 *  - `min`/`max` iguales       → tamaño FIJO (grilla o auto-slice).
 *  - `step`                    → las flexibles van "de a N" (filas completas):
 *                                valores válidos = min, min+step, … hasta max.
 *  - `default`                 → valor inicial al elegir el tipo.
 *
 * Steps derivados del nº de columnas del layout (ver *.module.scss de cada variante):
 *   medium/default/horizontal = grilla de 3 → de a 3; compact = grilla de 6;
 *   ranking = fila de 5 → de a 5. carrusel/seguiLeyendo son listas libres (step 1).
 */
export const CABEZAL_LIMITS = {
  // Fijos por layout / auto-slice
  duo:          { min: 2,  max: 2,  step: 1, default: 2  },
  duoSinCopete: { min: 2,  max: 2,  step: 1, default: 2  },
  leeAdemas:    { min: 2,  max: 2,  step: 1, default: 2  },
  categoria:    { min: 3,  max: 3,  step: 1, default: 3  },
  categoriaDos: { min: 3,  max: 3,  step: 1, default: 3  },
  // Crecen en filas completas:
  tres:         { min: 3,  max: 9,  step: 3, default: 3  },  // grilla de 3 → 3,6,9
  unaDetallada: { min: 4,  max: 10, step: 3, default: 4  },  // 1 destacada + fila de 3 → 4,7,10
  loQueSeLee:   { min: 1,  max: 1,  step: 1, default: 1  },
  // "De a N" (filas completas)
  default:      { min: 3,  max: 9,  step: 3, default: 3  },
  medium:       { min: 3,  max: 9,  step: 3, default: 3  },
  horizontal:   { min: 3,  max: 9,  step: 3, default: 3  },
  compact:      { min: 6,  max: 12, step: 6, default: 6  },
  ranking:      { min: 5,  max: 10, step: 5, default: 5  },
  // Listas libres (slider / scroll)
  carrusel:     { min: 4,  max: 12, step: 1, default: 6  },
  seguiLeyendo: { min: 4,  max: 12, step: 1, default: 10 },
};

// Fallback para tipos sin spec (o desconocidos): lista moderada de a 3.
const FALLBACK = { min: 3, max: 9, step: 3, default: 3 };

/** Normaliza alias de tipo a la clave canónica de CABEZAL_LIMITS. */
function normalizeTipo(tipo) {
  const t = String(tipo ?? '').toLowerCase();
  const ALIASES = {
    duosincopete: 'duoSinCopete',
    categoriados: 'categoriaDos',
    'categoriadós': 'categoriaDos',
    unadetallada: 'unaDetallada',
    leeademas: 'leeAdemas',
    loqueselee: 'loQueSeLee',
    seguileyendo: 'seguiLeyendo',
    ranking1: 'ranking', ranking2: 'ranking', ranking3: 'ranking',
    ranking4: 'ranking', ranking5: 'ranking',
  };
  if (CABEZAL_LIMITS[tipo]) return tipo;       // ya canónico (camelCase)
  if (ALIASES[t]) return ALIASES[t];
  if (CABEZAL_LIMITS[t]) return t;             // canónico en minúscula (default, medium…)
  return null;
}

/** Devuelve la spec { min, max, step, default } del tipo (con fallback). */
export function getCabezalLimit(tipo) {
  const key = normalizeTipo(tipo);
  return key ? CABEZAL_LIMITS[key] : FALLBACK;
}

/** Lista de cantidades válidas para el tipo: [min, min+step, … , max]. */
export function cabezalLimitOptions(tipo) {
  const { min, max, step } = getCabezalLimit(tipo);
  const s = step > 0 ? step : 1;
  const opts = [];
  for (let n = min; n <= max; n += s) opts.push(n);
  if (opts.length === 0 || opts[opts.length - 1] !== max) opts.push(max); // garantizar max
  return opts;
}

/** Acota `n` a la cantidad válida más cercana del tipo (snapea al step). */
export function clampCabezalLimit(tipo, n) {
  const opts = cabezalLimitOptions(tipo);
  const num = Number(n);
  if (!Number.isFinite(num)) return getCabezalLimit(tipo).default;
  return opts.reduce((best, o) => (Math.abs(o - num) < Math.abs(best - num) ? o : best), opts[0]);
}

/**
 * Acota `n` SOLO al rango [min, max] del tipo, sin snapear al step. Se usa al
 * renderizar para NO cambiar cantidades existentes (un 5 guardado queda 5, no
 * salta a 6). El snapeo "de a N" se aplica solo al elegir en el selector.
 */
export function boundCabezalLimit(tipo, n) {
  const { min, max, default: def } = getCabezalLimit(tipo);
  const num = Number(n);
  if (!Number.isFinite(num)) return def;
  return Math.max(min, Math.min(max, Math.round(num)));
}
