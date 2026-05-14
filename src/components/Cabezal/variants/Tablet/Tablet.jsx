import styles from './Tablet.module.scss'
import CardCabezal from '../../CardCabezal/index'

const RANKING_TYPES = ['ranking', 'ranking2', 'ranking3', 'ranking4', 'ranking5']

function listVariant(tipo) {
  if (RANKING_TYPES.includes(tipo)) return styles.listRanking
  if (tipo === 'categoria')         return styles.listCategoria
  if (tipo === 'categoriaDos')      return styles.listCategoriaDos
  if (tipo === 'horizontal')        return styles.listHorizontal
  if (tipo === 'compact')           return styles.listCompact
  return styles.listDefault
}

function itemVariant(tipo, i) {
  if (tipo === 'categoria')    return i === 0 ? styles.itemFeaturedFirst : styles.itemFeaturedOther
  if (tipo === 'categoriaDos') {
    if (i === 0) return styles.itemCDFirst
    if (i === 1) return styles.itemCDSecond
    if (i === 2) return styles.itemCDThird
  }
  return ''
}

export default function Tablet({ titulo, verMasUrl, articles, tipo }) {
  return (
    <section className={styles.container}>
      {titulo && (
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          {verMasUrl && <a href={verMasUrl} className={styles.verMas}>VER MÁS</a>}
        </div>
      )}
      {articles.length > 0 && (
        <ul className={`${styles.list} ${listVariant(tipo)}`}>
          {articles.map((article, i) => (
            <li key={article.id ?? i} className={`${styles.item} ${itemVariant(tipo, i)}`}>
              <CardCabezal article={article} rank={i + 1} tipo={tipo} index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
