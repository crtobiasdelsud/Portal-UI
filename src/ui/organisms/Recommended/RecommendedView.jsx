'use client'

import { useTheme } from "../../../context/SiteConfigContext.jsx"
import styles from "./Recommended.module.scss"
import ArticleCard from "../../molecules/Cards/ArticleCard/ArticleCard.jsx"

export default function RecommendedView({ articles = [], imageSize = "mobile", getSlotProps }) {
  const theme = useTheme()

  // 6 CSS vars completas en el container para que el override por widget (via
  // WidgetThemeScope) tambien aplique al list/items del Recommended — sin esto
  // solo las cards internas (ArticleCard) tomaban el theme y el wrapper quedaba
  // anclado al theme global del documento.
  const inlineStyle = {
    '--primary-color':    theme.primary,
    '--secondary-color':  theme.secondary,
    '--accent-color':     theme.accent,
    '--background-color': theme.background,
    '--surface-color':    theme.surface,
    '--text-color':       theme.textColor,
  }

  return (
    <section className={styles.container} style={inlineStyle}>
      <ul className={styles.list}>
        {articles.map((article, i) => (
          <li key={article.id} className={styles.item} {...(getSlotProps?.(i) ?? {})}>
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
