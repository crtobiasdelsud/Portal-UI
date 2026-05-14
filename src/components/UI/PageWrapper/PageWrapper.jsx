import styles from './PageWrapper.module.scss'

export default function PageWrapper({ children, className = '' }) {
  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
