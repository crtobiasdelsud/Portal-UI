import shared from '../../ArticleHero.module.scss'
import s from './V4.module.scss'

export default function V4({ isAmp, inlineStyle, titulo, volanta, ImgEl, ExtrasEl, imgOnlyClass, noImgMod }) {
  const VolantaEl = volanta
    ? <span className={isAmp ? 'article-hero__volanta' : `${shared.volanta} ${s.volanta}`}>{volanta}</span>
    : null
  const TituloEl = <h1 className={isAmp ? 'article-hero__titulo' : `${shared.titulo} ${s.titulo}`}>{titulo}</h1>

  return (
    <article
      className={isAmp ? 'article-hero article-hero--4' : `${shared.container}${noImgMod}`}
      style={inlineStyle}
    >
      <div className={isAmp ? 'article-hero__img-wrap' : shared.imgWrap}>
        {imgOnlyClass ? <div className={imgOnlyClass}>{ImgEl}</div> : ImgEl}
        <div className={isAmp ? 'article-hero__overlay' : s.overlay}>
          {VolantaEl}
          {TituloEl}
        </div>
      </div>
      {ExtrasEl}
    </article>
  )
}
