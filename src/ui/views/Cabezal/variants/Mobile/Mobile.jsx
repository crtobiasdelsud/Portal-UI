import styles from './Mobile.module.scss'
import CardCabezal from '../../CardCabezal/index'

const RANKING_TYPES = ['ranking', 'ranking2', 'ranking3', 'ranking4', 'ranking5']

export default function Mobile({ titulo, verMasUrl, articles, tipo, isAmp }) {
  const isRanking = RANKING_TYPES.includes(tipo ?? '')

  if (isAmp) return (
    <section className={`cabezal cabezal--${tipo ?? 'default'}`}>
      {titulo && (
        <div className="cabezal__header">
          <h2 className="cabezal__titulo">{titulo}</h2>
          {verMasUrl && <a href={verMasUrl} className="cabezal__ver-mas" aria-label={`Ver más de ${titulo}`}>VER MÁS</a>}
        </div>
      )}
      {articles.length > 0 && (
        <ul className="cabezal__list">
          {articles.map((article, i) => (
            <li key={article.id ?? i} className="cabezal__item">
              <CardCabezal article={article} rank={i + 1} tipo={tipo} index={i} isAmp />
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  return (
    <section className={styles.container}>
      {titulo && (
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          {verMasUrl && <a href={verMasUrl} className={styles.verMas} aria-label={`Ver más de ${titulo}`}>VER MÁS</a>}
        </div>
      )}
      {articles.length > 0 && (
        <ul className={`${styles.list} ${isRanking ? styles.listRanking : ''}`}>
          {articles.map((article, i) => (
            <li key={article.id ?? i} className={styles.item}>
              <CardCabezal article={article} rank={i + 1} tipo={tipo} index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
