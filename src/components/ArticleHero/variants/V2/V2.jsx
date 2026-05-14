import shared from '../../ArticleHero.module.scss'
import s from './V2.module.scss'

export default function V2({ isAmp, inlineStyle, titulo, volanta, copete, ImgEl, ExtrasEl, imgWrapClass, noImgMod }) {
  const VolantaEl = volanta
    ? <span className={isAmp ? 'article-hero__volanta' : `${shared.volanta} ${s.volanta}`}>{volanta}</span>
    : null
  const TituloEl = <h1 className={isAmp ? 'article-hero__titulo' : `${shared.titulo} ${s.titulo}`}>{titulo}</h1>
  const CopeteEl = copete
    ? <p className={isAmp ? 'article-hero__copete' : `${shared.copete} ${s.copete}`}>{copete}</p>
    : null

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
        {CopeteEl}
      </div>
      {ExtrasEl}
    </article>
  )
}
