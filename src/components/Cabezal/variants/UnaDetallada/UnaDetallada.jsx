import styles from './UnaDetallada.module.scss'
import CardCabezal from '../../CardCabezal/index'

function itemClass(i, s) {
  if (i === 0) return `${s.item} ${s.itemFirst}`
  return `${s.item} ${s.itemOther}`
}

export default function UnaDetallada({ titulo, verMasUrl, articles, getSlotProps }) {
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
            <li key={article.id ?? i} className={itemClass(i, styles)} {...(getSlotProps?.(i) ?? {})}>
              <CardCabezal article={article} tipo="unaDetallada" index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
