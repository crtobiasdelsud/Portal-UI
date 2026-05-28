import shared from '../../Bajada.module.scss'
import s from './V2.module.scss'

export default function V2({ isAmp, inlineStyle, volanta, title, authorId, vDesktop }) {
  const deskCls = shared[`vd${vDesktop}`] ?? ''
  const className = isAmp
    ? 'bajada__container'
    : `${shared.container} ${s.root} ${deskCls}`.trim()

  return (
    <div className={className} style={inlineStyle}>
      <h2 className={isAmp ? 'bajada__headline' : shared.headline}>
        <span className={isAmp ? 'bajada__volanta' : shared.volanta}>{volanta}. </span>
        {title}
      </h2>
      {authorId && <span className={isAmp ? 'bajada__autor' : shared.autor}>Por {authorId}</span>}
    </div>
  )
}
