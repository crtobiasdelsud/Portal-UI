'use client'

import PageWrapper from '../UI/PageWrapper/PageWrapper.jsx'
import AspectImage from '../UI/AspectImage/AspectImage.jsx'
import EditorOutput from '../EditorOutput/EditorOutput.jsx'
import Breadcrumb from '../Breadcrumb/Breadcrumb.jsx'
import ArticleHero from '../ArticleHero/ArticleHero.jsx'
import AuthorBlock from '../AuthorBlock/AuthorBlock.jsx'
import ShareBlock from '../ShareBlock/ShareBlock.jsx'
import SpeechButton from '../SpeechButton/SpeechButton.jsx'
import ArticleSidebar from '../ArticleSidebar/ArticleSidebar.jsx'
import styles from './Standard.module.scss'

/**
 * Réplica de la screen `ArticleDetail` (camino non-AMP) del portal.
 *
 * Reproduce el mismo árbol JSX y los mismos estilos. Se omiten las piezas
 * que dependen de infraestructura de la app (ArticleTracker, zonas de
 * widgets pre/post/in-body desde el registry, LoQueSeLee con data-fetching):
 * el preview muestra el artículo en sí, no la config de layout del sitio.
 */
export default function Standard({ article }) {
  // Epígrafe de la imagen principal — normalizado en `imagen.epigrafe` y/o
  // `imagenEpigrafe` a nivel raíz; puede venir null.
  const imagenEpigrafe = article.imagen?.epigrafe ?? article.imagenEpigrafe ?? null

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: article.categoria?.nombre ?? '', href: `/${article.categoria?.slug ?? ''}` },
  ]

  return (
    <PageWrapper>
      <div className={styles.pageWrap}>
        <div className={styles.articleWrap}>

          {/* Row 2 — breadcrumb, hero, autor, speechbutton */}
          <div className={styles.articleHeader}>
            <Breadcrumb items={breadcrumbItems} />
            <ArticleHero
              titulo={article.titulo}
              volanta={article.volanta}
              copete={article.copete}
              imagen={article.imagen?.url ?? null}
              imagenEpigrafe={imagenEpigrafe}
              focalPoint={article.focalPoint}
              hideImageOnDesktop
              extras={
                <div className={styles.heroExtras}>
                  <AuthorBlock
                    autor={article.autor}
                    publicarComoOrg={article.publicarComoOrg}
                    fechaPublicacion={article.fechaPublicacion}
                  />
                  <ShareBlock />
                </div>
              }
            />
            {/* mobile-only: autor + share debajo del hero */}
            <div className={styles.authorContainer}>
              <AuthorBlock
                autor={article.autor}
                publicarComoOrg={article.publicarComoOrg}
                fechaPublicacion={article.fechaPublicacion}
              />
              <ShareBlock />
            </div>
            {/* mobile-only: speechbutton debajo del hero */}
            <div className={styles.speechMobile}>
              <SpeechButton
                titulo={article.titulo}
                copete={article.copete}
                cuerpo={article.cuerpo}
                imagen={article.imagen?.url ?? null}
              />
            </div>
          </div>

          {/* Row 3 — body (2fr) + sidebar sticky (1fr) */}
          <div className={styles.contentRow}>
            <div className={styles.body}>
              {article.imagen?.url && (
                <figure className={styles.bodyImage}>
                  <AspectImage
                    src={article.imagen.url}
                    alt={article.titulo ?? ''}
                    aspect="16:9"
                    focalPoint={article.focalPoint}
                  />
                  {imagenEpigrafe && (
                    <figcaption className={styles.bodyImageCaption}>{imagenEpigrafe}</figcaption>
                  )}
                </figure>
              )}
              <div className={styles.speechDesktop}>
                <SpeechButton
                  titulo={article.titulo}
                  copete={article.copete}
                  cuerpo={article.cuerpo}
                  imagen={article.imagen?.url ?? null}
                />
              </div>
              {article.cuerpo?.blocks?.length > 0 && (
                <EditorOutput data={article.cuerpo} />
              )}
            </div>
            <div className={styles.sidebarPlacement}>
              <ArticleSidebar hasWidgets={false} />
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  )
}
