'use client'

import styles from './ArticleDetailView.module.scss'
import Standard from './Standard.jsx'
import Full from './Full.jsx'

/**
 * ArticleDetailView — réplica portable de las screens `ArticleDetail` /
 * `ArticleDetailFull` del portal (editor-template-front).
 *
 * Pensada para previews fuera del portal (ej. el CMS): es una *vista pura*,
 * recibe el artículo ya resuelto y no hace data-fetching ni depende del
 * registry de widgets. Reproduce el layout y los estilos de las screens, y
 * elige la variante igual que el portal:
 *
 *   article.tipoContenido === 'notaEspecial'  →  Full   (ArticleDetailFull)
 *   resto                                     →  Standard (ArticleDetail)
 *
 * El root recrea el `<main>` del portal con `container-type: inline-size`
 * para que las container-queries de los componentes portal-ui respondan al
 * ancho real del contenedor — imprescindible al renderizar en un iframe.
 *
 * @param {object} props
 * @param {object} props.article - Artículo resuelto. Shape esperado:
 *   { id, titulo, volanta, copete, imagen: { url, epigrafe }, imagenEpigrafe,
 *     focalPoint, categoria: { nombre, slug }, autor, publicarComoOrg,
 *     fechaPublicacion, tipoContenido, cuerpo (payload EditorJS) }
 */
export default function ArticleDetailView({ article }) {
  if (!article) return null

  const isFull = article.tipoContenido === 'notaEspecial'

  return (
    <main className={styles.root}>
      {isFull ? <Full article={article} /> : <Standard article={article} />}
    </main>
  )
}
