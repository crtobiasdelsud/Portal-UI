import styles from './LoQueSeLee.module.scss'
import skStyles from './LoQueSeLeeSkeleton.module.scss'

export default function LoQueSeLeeSkeleton() {
  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Lo que se lee ahora</span>
      </div>
      <div className={skStyles.skeleton}>
        <div className={skStyles.img} />
        <div className={skStyles.body}>
          <div className={skStyles.line} style={{ width: '55%' }} />
          <div className={skStyles.line} style={{ width: '100%' }} />
          <div className={skStyles.line} style={{ width: '80%' }} />
          <div className={skStyles.line} style={{ width: '40%', marginTop: 4 }} />
        </div>
      </div>
    </section>
  )
}
