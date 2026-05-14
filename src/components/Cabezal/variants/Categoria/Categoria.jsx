import styles from './Categoria.module.scss'
import CardCabezal from '../../CardCabezal/index'

function itemClass(i) {
  if (i === 0) return `${styles.item} ${styles.itemFirst}`
  return `${styles.item} ${styles.itemOther}`
}

export default function Categoria({ titulo, verMasUrl, articles }) {
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
            <li key={article.id ?? i} className={itemClass(i)}>
              <CardCabezal article={article} tipo="categoria" index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
