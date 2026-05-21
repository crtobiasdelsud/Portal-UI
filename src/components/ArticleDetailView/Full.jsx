'use client'

import ArticleHeroFull from '../ArticleHeroFull/ArticleHeroFull.jsx'
import AuthorBlock from '../AuthorBlock/AuthorBlock.jsx'
import ShareBlock from '../ShareBlock/ShareBlock.jsx'
import EditorOutputFull from '../EditorOutputFull/EditorOutputFull.jsx'
import Breadcrumb from '../Breadcrumb/Breadcrumb.jsx'
import styles from './Full.module.scss'

/**
 * Réplica de la screen `ArticleDetailFull` (camino non-AMP) del portal —
 * la "nota especial": hero a sangre + cuerpo a una columna.
 *
 * Se omiten las piezas de infraestructura de la app (ArticleTracker y la
 * zona post-body de widgets desde el registry).
 */
export default function Full({ article }) {
  const imagenEpigrafe = article.imagen?.epigrafe ?? article.imagenEpigrafe ?? null

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    ...(article.categoria?.parent
      ? [{ label: article.categoria.parent.nombre ?? '', href: `/${article.categoria.parent.slug ?? ''}` }]
      : []),
    { label: article.categoria?.nombre ?? '', href: `/${article.categoria?.slug ?? ''}` },
  ]

  return (
    <>
      <ArticleHeroFull
        titulo={article.titulo}
        copete={article.copete}
        imagen={article.imagen?.url ?? null}
        imagenEpigrafe={imagenEpigrafe}
        focalPoint={article.focalPoint}
        categoria={article.categoria ?? null}
      />

      <div className={styles.wrap}>
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.author}>
          <AuthorBlock
            autor={article.autor}
            publicarComoOrg={article.publicarComoOrg}
            fechaPublicacion={article.fechaPublicacion}
          />
          <ShareBlock />
        </div>

        <div className={styles.body}>
          <EditorOutputFull data={article.cuerpo} />
        </div>
      </div>
    </>
  )
}
