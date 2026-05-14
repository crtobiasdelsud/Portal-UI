import styles from './Duo.module.scss'
import CardCabezal from '../../CardCabezal/index'

export default function Duo({ titulo, verMasUrl, articles }) {
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
          {articles.slice(0, 2).map((article, i) => (
            <li key={article.id ?? i} className={styles.item}>
              <CardCabezal article={article} tipo="duo" index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
