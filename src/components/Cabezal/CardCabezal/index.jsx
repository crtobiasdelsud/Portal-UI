import Amp                from './variants/Amp/Amp'
import Default            from './variants/Default/Default'
import Featured           from './variants/Featured/Featured'
import FeaturedDuo        from './variants/FeaturedDuo/FeaturedDuo'
import FeaturedHorizontal from './variants/FeaturedHorizontal/FeaturedHorizontal'
import Compact            from './variants/Compact/Compact'
import Ranked             from './variants/Ranked/Ranked'
import Medium             from './variants/Medium/Medium'
import CarruselCard       from './variants/Carrusel/Carrusel'

const RANKING_TYPES  = ['ranking', 'ranking2', 'ranking3', 'ranking4', 'ranking5']
const FEATURED_TYPES = ['categoria', 'categoriaDos']

export default function CardCabezal({ article, rank, tipo = 'default', index = 0, isAmp = false }) {
  if (isAmp)                                        return <Amp                article={article} rank={rank} />
  if (tipo === 'unaDetallada' && index === 0)        return <FeaturedHorizontal article={article} />
  if (tipo === 'unaDetallada' && index > 0)          return <Default            article={article} />
  if (tipo === 'duo')                                return <FeaturedDuo        article={article} />
  if (FEATURED_TYPES.includes(tipo) && index === 0) return <Featured           article={article} large />
  if (FEATURED_TYPES.includes(tipo) && index > 0)  return <Compact            article={article} />
  if (tipo === 'medium')                            return <Medium             article={article} />
  if (tipo === 'carrusel')                          return <CarruselCard       article={article} />
  if (RANKING_TYPES.includes(tipo))                 return <Ranked             article={article} rank={rank} rankVariant={tipo} />
  return <Default article={article} />
}
