import { volantaWithStop } from '../../../../../utils/volanta.js'

export default function Amp({ article, rank }) {
  const { titulo, volanta, copete, imagen, slug } = article
  const href = slug ? `/${slug}` : '#'

  return (
    <article className="card-cabezal">
      {imagen?.url && (
        <a href={href} className="card-cabezal__img-link">
          <img src={imagen.url} alt={imagen.alt ?? titulo ?? ''} className="card-cabezal__img" />
        </a>
      )}
      <div className="card-cabezal__body">
        {volanta && <span className="card-cabezal__volanta">{volantaWithStop(volanta)}</span>}
        {titulo && <a href={href} className="card-cabezal__titulo">{titulo}</a>}
        {copete && <div className="card-cabezal__copete" dangerouslySetInnerHTML={{ __html: copete }} />}
      </div>
      {rank != null && <span className="card-cabezal__rank">{rank}</span>}
    </article>
  )
}
