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
        {volanta && <span className="card-cabezal__volanta">{volanta}.</span>}
        {titulo && <a href={href} className="card-cabezal__titulo">{titulo}</a>}
        {copete && <p className="card-cabezal__copete">{copete}</p>}
      </div>
      {rank != null && <span className="card-cabezal__rank">{rank}</span>}
    </article>
  )
}
