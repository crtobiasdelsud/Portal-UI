import styles from './Tres.module.scss'
import CardCabezal from '../../CardCabezal/index'

export default function Tres({ titulo, verMasUrl, articles }) {
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
            <li key={article.id ?? i} className={`${styles.item} ${styles.itemOther}`}>
              <CardCabezal article={article} tipo="default" />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
