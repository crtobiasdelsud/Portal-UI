import shared from '../../ArticleHero.module.scss'
import s from './V2.module.scss'

export default function V2({ isAmp, inlineStyle, titulo, volanta, ImgEl, ExtrasEl, imgWrapClass, noImgMod, titleTag = 'h1' }) {
  const VolantaEl = volanta
    ? <span className={isAmp ? 'article-hero__volanta' : `${shared.volanta} ${s.volanta}`}>{volanta}</span>
    : null
  // `titleTag`: ver V0 — evita múltiples <h1> en el swapping responsive.
  const TitleTag = titleTag
  const TituloEl = <TitleTag className={isAmp ? 'article-hero__titulo' : `${shared.titulo} ${s.titulo}`}>{titulo}</TitleTag>

  return (
    <article
      className={isAmp ? 'article-hero article-hero--1' : `${shared.container}${noImgMod}`}
      style={inlineStyle}
    >
      <div className={`${imgWrapClass} ${s.imgWrap}`}>
        {VolantaEl}
        {ImgEl}
      </div>
      <div className={isAmp ? 'article-hero__panel' : s.panel}>
        {TituloEl}
      </div>
      {ExtrasEl}
    </article>
  )
}
