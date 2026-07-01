import { useAdapters } from '../../../../../adapters/AdaptersContext.jsx'
import shared from '../../Feed.module.scss'
import s from './V1.module.scss'

export default function V1({ articles, inlineStyle }) {
  const { Link } = useAdapters()
  return (
    <section className={shared.container} style={inlineStyle}>
      <h2 className={shared.heading}>Últimas Noticias</h2>
      <ul className={shared.list}>
        {articles.map((article) => (
          <li key={article.id} className={shared.containerItem}>
            <Link href={article.slug ? `/${article.slug}` : '#'} className={s.item}>
              <span className={s.feedUi} aria-hidden="true">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="currentColor" />
                </svg>
              </span>
              <span className={shared.time}>
                {new Date(article.fechaPublicacion).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h23',
                  timeZone: 'America/Argentina/Buenos_Aires',
                })}
              </span>
              <span className={shared.title}>{article.titulo}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
