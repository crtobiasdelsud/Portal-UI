import styles from './CategoriaDos.module.scss'
import CardCabezal from '../../CardCabezal/index'

function itemClass(i) {
  if (i === 0) return `${styles.item} ${styles.itemFirst}`
  return `${styles.item} ${styles.itemOther}`
}

export default function CategoriaDos({ titulo, verMasUrl, articles, getSlotProps }) {
  return (
    <section className={styles.container}>
      {titulo && (
        <div className={styles.header}>
          <h2 className={styles.titulo}>{titulo}</h2>
          {verMasUrl && <a href={verMasUrl} className={styles.verMas} aria-label={`Ver más de ${titulo}`}>VER MÁS</a>}
        </div>
      )}
      {articles.length > 0 && (
        <ul className={styles.list}>
          {articles.map((article, i) => (
            <li key={article.id ?? i} className={itemClass(i)} {...(getSlotProps?.(i) ?? {})}>
              <CardCabezal article={article} tipo="categoria" index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
