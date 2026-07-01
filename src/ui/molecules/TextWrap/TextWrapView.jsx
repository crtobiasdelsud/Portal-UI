import styles from "./TextWrap.module.scss"
import EditorOutput from "../../organisms/EditorOutput/EditorOutput.jsx"

/**
 * View pura — recibe el `article` ya resuelto. La data layer en cada app se
 * encarga de buscar por articleId.
 */
export default function TextWrapView({ article, primaryColor, textColor, surfaceColor, fontFamily }) {
  if (!article) return null

  const inlineStyle = {
    backgroundColor: surfaceColor,
    fontFamily,
    '--primary-color': primaryColor,
    '--text-color': textColor,
  }

  return (
    <article style={inlineStyle} className={styles.container}>
      {article.body && <EditorOutput data={article.body} />}
    </article>
  )
}
