import shared from '../../ArticleHero.module.scss'
import s from './V0.module.scss'
import { sanitizeInlineHtml } from '../../../../../utils/sanitizeHtml.js'

export default function V0({ isAmp, inlineStyle, titulo, volanta, copete, ImgEl, ExtrasEl, imgWrapClass, noImgMod, titleTag = 'h1' }) {
  const VolantaEl = volanta
    ? <span className={isAmp ? 'article-hero__volanta' : `${shared.volanta} ${s.volanta}`}>{volanta}</span>
    : null
  // `titleTag` permite que solo una variante renderice <h1> y las demás un tag
  // no-heading (ej. <p>), evitando múltiples <h1> en el DOM por el swapping
  // responsive (mobile/tablet/desktop se rinden a la vez). Ver ArticleHero.
  const TitleTag = titleTag
  const TituloEl = <TitleTag className={isAmp ? 'article-hero__titulo' : `${shared.titulo} ${s.titulo}`}>{titulo}</TitleTag>
  const CopeteEl = copete
    ? <div
        className={isAmp ? 'article-hero__copete' : `${shared.copete} ${s.copete}`}
        dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(copete) }}
      />
    : null

  return (
    <article
      className={isAmp ? 'article-hero article-hero--0' : `${shared.container} ${s.root}${noImgMod}`}
      style={inlineStyle}
    >
      <div className={isAmp ? 'article-hero__text' : s.text}>
        {VolantaEl}
        {TituloEl}
        {CopeteEl}
      </div>
      <div className={`${imgWrapClass} ${s.imgWrap}`}>
        {ImgEl}
      </div>
      {ExtrasEl}
    </article>
  )
}
