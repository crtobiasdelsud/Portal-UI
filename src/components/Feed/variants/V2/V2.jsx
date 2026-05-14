import { useAdapters } from '../../../../adapters/AdaptersContext.jsx'
import shared from '../../Feed.module.scss'
import s from './V2.module.scss'

export default function V2({ articles, inlineStyle }) {
  const { Link } = useAdapters()
  return (
    <section className={`${shared.container} ${s.root}`} style={inlineStyle}>
      <h2 className={`${shared.heading} ${s.heading}`}>Últimas Noticias</h2>
      <ul className={shared.list}>
        {articles.map((article) => (
          <li key={article.id} className={`${shared.containerItem} ${s.containerItem}`}>
            <Link href={article.slug} className={s.item}>
              {article.imagen?.url && (
                <div className={s.imgWrap}>
                  <img src={article.imagen.url} alt={article.imagen.alt ?? ''} />
                </div>
              )}
              <div className={s.cardBody}>
                <span className={s.time}>
                  {new Date(article.fechaPublicacion).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h23',
                    timeZone: 'America/Argentina/Buenos_Aires',
                  })}
                </span>
                <span className={s.title}>{article.titulo}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
