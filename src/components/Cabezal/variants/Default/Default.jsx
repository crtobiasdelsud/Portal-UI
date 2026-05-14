import styles from './Default.module.scss'
import CardCabezal from '../../CardCabezal/index'

export default function Default({ titulo, verMasUrl, articles, tipo }) {
  return (
    <section className={styles.container}>
      {titulo && (
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          {verMasUrl && <a href={verMasUrl} className={styles.verMas}>VER MÁS</a>}
        </div>
      )}
      {articles.length > 0 && (
        <ul className={styles.list}>
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
