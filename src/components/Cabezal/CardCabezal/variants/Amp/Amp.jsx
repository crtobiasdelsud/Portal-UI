import { stripHtml } from '../../../../../utils/stripHtml'

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
        {titulo && (
          // El título es un heading semántico; el <a> conserva la clase y el estilo de link.
          // margin:0 inline anula el margin por defecto del <h3> (AMP no permite <style> extra).
          <h3 className="card-cabezal__titulo-heading" style={{ margin: 0 }}>
            <a href={href} className="card-cabezal__titulo">{titulo}</a>
          </h3>
        )}
        {copete && <div className="card-cabezal__copete">{stripHtml(copete)}</div>}
      </div>
      {rank != null && <span className="card-cabezal__rank">{rank}</span>}
    </article>
  )
}
