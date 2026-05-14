import shared from '../../ArticleHero.module.scss'
import s from './V1.module.scss'

export default function V1({ isAmp, inlineStyle, titulo, volanta, copete, ImgEl, ExtrasEl, imgWrapClass, noImgMod }) {
  const VolantaEl = volanta
    ? <span className={isAmp ? 'article-hero__volanta' : `${shared.volanta} ${s.volanta}`}>{volanta}</span>
    : null
  const TituloEl = <h1 className={isAmp ? 'article-hero__titulo' : `${shared.titulo} ${s.titulo}`}>{titulo}</h1>
  const CopeteEl = copete
    ? <p className={isAmp ? 'article-hero__copete' : `${shared.copete} ${s.copete}`}>{copete}</p>
    : null

  return (
    <article
      className={isAmp ? 'article-hero article-hero--2' : `${shared.container} ${s.root}${noImgMod}`}
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
