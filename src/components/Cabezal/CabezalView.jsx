'use client'

import Default       from './variants/Default/Default.jsx'
import Medium        from './variants/Medium/Medium.jsx'
import Horizontal    from './variants/Horizontal/Horizontal.jsx'
import Compact       from './variants/Compact/Compact.jsx'
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

const VARIANTS = {
  default:       Default,
  medium:        Medium,
  horizontal:    Horizontal,
  compact:       Compact,
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
}) {
  const isLoQueSeLee = tipo === 'loQueSeLee' || tipo === 'loqueselee'

  if (isLoQueSeLee) {
    if (!article) return null
    return <LoQueSeLee article={article} />
  }

  // `etiquetas` recibe los tags del artículo en curso, no un array de artículos.
  if (tipo === 'etiquetas') {
    return <Etiquetas tags={tags} />
  }

  if (!titulo && !articles.length) return null

  const Component = VARIANTS[tipo] ?? Default
  return (
    <Component
      titulo={titulo}
      verMasUrl={verMasUrl}
      articles={articles}
      tipo={tipo}
      isAmp={isAmp}
    />
  )
}
