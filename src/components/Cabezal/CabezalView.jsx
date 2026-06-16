'use client'

import { useTheme } from '../../context/SiteConfigContext.jsx'
import Default       from './variants/Default/Default.jsx'
import Medium        from './variants/Medium/Medium.jsx'
import Horizontal    from './variants/Horizontal/Horizontal.jsx'
import Compact       from './variants/Compact/Compact.jsx'
import Mini          from './variants/Mini/Mini.jsx'
import Categoria     from './variants/Categoria/Categoria.jsx'
import CategoriaDos  from './variants/CategoriaDos/CategoriaDos.jsx'
import UnaDetallada  from './variants/UnaDetallada/UnaDetallada.jsx'
import Duo           from './variants/Duo/Duo.jsx'
import DuoSinCopete  from './variants/DuoSinCopete/DuoSinCopete.jsx'
import Ranking       from './variants/Ranking/Ranking.jsx'
import Tres          from './variants/Tres/Tres.jsx'
import Carrusel      from './variants/Carrusel/Carrusel.jsx'
import LeeAdemas     from './variants/LeeAdemas/LeeAdemas.jsx'
import LoQueSeLee    from './variants/LoQueSeLee/LoQueSeLee.jsx'
import SeguiLeyendo  from './variants/SeguiLeyendo/SeguiLeyendo.jsx'
import Etiquetas     from './variants/Etiquetas/Etiquetas.jsx'
import { getCabezalLimit } from './cabezalLimits.js'

const VARIANTS = {
  default:       Default,
  medium:        Medium,
  horizontal:    Horizontal,
  compact:       Compact,
  mini:          Mini,
  categoria:     Categoria,
  categoriaDos:  CategoriaDos,
  categoriadós:  CategoriaDos,
  categoriados:  CategoriaDos,
  unaDetallada:  UnaDetallada,
  unadetallada:  UnaDetallada,
  duo:           Duo,
  duoSinCopete:  DuoSinCopete,
  duosincopete:  DuoSinCopete,
  tres:          Tres,
  ranking:       Ranking,
  ranking1:      Ranking,
  ranking2:      Ranking,
  ranking3:      Ranking,
  ranking4:      Ranking,
  ranking5:      Ranking,
  carrusel:      Carrusel,
  leeAdemas:     LeeAdemas,
  leeademas:     LeeAdemas,
  loQueSeLee:    LoQueSeLee,
  loqueselee:    LoQueSeLee,
  seguiLeyendo:  SeguiLeyendo,
  seguileyendo:  SeguiLeyendo,
  etiquetas:     Etiquetas,
}

/**
 * Vista de Cabezal con routing por `tipo`. Recibe los artículos ya resueltos
 * por la data layer del consumidor (server component en portal, hook client
 * en CMS). El caso especial `loQueSeLee` recibe un único `article` en lugar
 * del array — la data layer es la que lo fetchea con /trending?categoria=X.
 *
 * @param {object} props
 * @param {string} [props.titulo]
 * @param {string} [props.tipo='default']
 * @param {string} [props.verMasUrl]
 * @param {Array<object>} [props.articles=[]]  — todos los tipos excepto loQueSeLee/etiquetas
 * @param {object} [props.article]              — solo para loQueSeLee
 * @param {Array<object>} [props.tags]          — solo para etiquetas (tags del artículo actual)
 * @param {boolean} [props.isAmp=false]
 */
export default function CabezalView({
  titulo,
  tipo = 'default',
  verMasUrl,
  articles = [],
  article,
  tags,
  isAmp = false,
  getSlotProps,
}) {
  const theme = useTheme()

  // 6 CSS vars completas para que el override por widget (WidgetThemeScope)
  // aplique a cualquier variant del cabezal. Wrapper con `display: contents`
  // para no inyectar nada en el layout — las vars cascadean al hijo igual.
  // Las vars solo se setean si el theme tiene un valor (evita pisar el global
  // con `undefined`, que en CSS borra la herencia).
  const themeStyle = {
    display: 'contents',
    ...(theme.primary    ? { '--primary-color':    theme.primary }    : {}),
    ...(theme.secondary  ? { '--secondary-color':  theme.secondary }  : {}),
    ...(theme.accent     ? { '--accent-color':     theme.accent }     : {}),
    ...(theme.background ? { '--background-color': theme.background } : {}),
    ...(theme.surface    ? { '--surface-color':    theme.surface }    : {}),
    ...(theme.textColor  ? { '--text-color':       theme.textColor }  : {}),
  }

  const isLoQueSeLee = tipo === 'loQueSeLee' || tipo === 'loqueselee'

  if (isLoQueSeLee) {
    if (!article) return null
    return <div style={themeStyle}><LoQueSeLee article={article} /></div>
  }

  // `etiquetas` recibe los tags del artículo en curso, no un array de artículos.
  if (tipo === 'etiquetas') {
    return <div style={themeStyle}><Etiquetas tags={tags} /></div>
  }

  if (!titulo && !articles.length) return null

  // Tope estructural: cada layout aguanta un máximo de cartas. Recortamos acá
  // (único embudo) para proteger tanto al portal como al preview del CMS, sin
  // importar cuántas notas haya fetcheado la data layer.
  const max = getCabezalLimit(tipo).max
  const capped = articles.length > max ? articles.slice(0, max) : articles

  const Component = VARIANTS[tipo] ?? Default
  return (
    <div style={themeStyle}>
      <Component
        titulo={titulo}
        verMasUrl={verMasUrl}
        articles={capped}
        tipo={tipo}
        isAmp={isAmp}
        getSlotProps={getSlotProps}
      />
    </div>
  )
}
