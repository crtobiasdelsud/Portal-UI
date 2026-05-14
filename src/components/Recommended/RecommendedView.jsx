'use client'

import styles from "./Recommended.module.scss"
import ArticleCard from "../Cards/ArticleCard/ArticleCard.jsx"

export default function RecommendedView({ articles = [], imageSize = "mobile" }) {
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {articles.map((article) => (
          <li key={article.id} className={styles.item}>
            <ArticleCard
              article={article}
              size={imageSize}
              compact
              showAvatar={false}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
