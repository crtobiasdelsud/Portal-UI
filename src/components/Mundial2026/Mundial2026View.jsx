'use client'

import style from './Mundial2026.module.scss'
import { Flag, teamName } from './flags.jsx'
import { kickoffLabel } from './mundialFormat.js'
import { useOptionalAdapters } from '../../adapters/AdaptersContext.jsx'

/**
 * Widget "Mundial 2026" — tira de resultados (variante V2 del diseño El Editor):
 * verde petróleo, serif Frank Ruhl Libre, borde superior verde, banderas grandes
 * y celdas respiradas. Vista pura: recibe `data` resuelta (la app pega al proxy
 * `/api/portal/mundial`). Sin partidos, no renderiza.
 *
 * - Ordena EN VIVO primero (los que se están jugando), luego próximos y por
 *   último finalizados → "lo que se juega ahora" aparece primero.
 * - Todo el widget es un link a la sección `/mundial` (salvo `bare`, que ya va
 *   dentro de esa página). `settings.href` permite cambiar el destino.
 *
 * Props:
 *   - data, settings: { limit, sponsorLabel, href }
 *   - bare: sin chrome de tarjeta ni link (para insertar dentro de /mundial)
 */

const STATUS_ORDER = { live: 0, scheduled: 1, finished: 2 }

function sortMatches(matches) {
  return [...matches].sort((a, b) => {
    const d = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
    if (d) return d
    const ta = a.datetime ? new Date(a.datetime).getTime() : 0
    const tb = b.datetime ? new Date(b.datetime).getTime() : 0
    return a.status === 'finished' ? tb - ta : ta - tb // próximos: más cercano primero; finalizados: más reciente
  })
}

export default function Mundial2026View({ data, settings = {}, bare = false }) {
  const adapters = useOptionalAdapters()
  const Link = adapters?.Link

  const matches = Array.isArray(data?.matches) ? data.matches : []
  if (!matches.length) return null

  const sorted = sortMatches(matches)
  const liveCount = sorted.filter((m) => m.status === 'live').length
  // Default: mostrar al menos los partidos en vivo (mín. 2 celdas para acompañar).
  const limit = Number.isFinite(settings.limit) ? settings.limit : Math.max(liveCount, 2)
  const visibles = sorted.slice(0, Math.max(1, limit))

  const phase = data?.phase || 'Fase de grupos'
  const sponsorLabel = settings.sponsorLabel
  const href = settings.href || '/mundial'

  const inner = (
    <section className={`${style.mwid} ${style.v2} ${bare ? style.bare : ''}`.trim()} aria-label="Mundial 2026">
      <div className={style.head}>
        <span className={style.bar} />
        <h4 className={style.title}>{data?.tournament || 'Mundial 2026'}</h4>
        <span className={style.ph}>{phase}</span>
        {sponsorLabel && (
          <span className={style.spon}>
            <span className={style.sponLbl}>Ofrecido por</span>
            <span className={style.sponSlot}>{sponsorLabel}</span>
          </span>
        )}
        {!bare && <span className={style.go} aria-hidden="true">Ver Mundial ›</span>}
      </div>

      <div className={style.row}>
        {visibles.map((m, i) => (
          <Cell key={m.id ?? i} match={m} />
        ))}
      </div>
    </section>
  )

  if (bare) return inner

  return Link
    ? <Link href={href} className={style.link} aria-label="Ir a la sección Mundial 2026">{inner}</Link>
    : <a href={href} className={style.link} aria-label="Ir a la sección Mundial 2026">{inner}</a>
}

function Cell({ match }) {
  const upcoming = match.status === 'scheduled'
  return (
    <div className={style.cell}>
      <Status match={match} />
      <Team side={match.home} other={match.away} upcoming={upcoming} />
      <Team side={match.away} other={match.home} upcoming={upcoming} />
    </div>
  )
}

function Team({ side = {}, other = {}, upcoming }) {
  const sc = side.score
  const os = other.score
  let outcome = ''
  if (!upcoming && typeof sc === 'number' && typeof os === 'number') {
    if (sc > os) outcome = style.win
    else if (sc < os) outcome = style.lose
  }
  return (
    <div className={`${style.team} ${outcome}`.trim()}>
      <Flag code={side.code} flag={side.flag} size="md" />
      <span className={style.code}>{side.code || teamName(side.code, side.name).slice(0, 3).toUpperCase()}</span>
      {upcoming ? <span className={style.vs} /> : <span className={style.sc}>{sc}</span>}
    </div>
  )
}

function Status({ match }) {
  const { status, minute, datetime } = match
  if (status === 'live') {
    return (
      <div className={`${style.st} ${style.stLive}`}>
        <span className={style.liveDot} />
        <span className={style.stText}>En vivo</span>
        {minute != null && <span className={style.min}>{formatMinute(minute)}</span>}
      </div>
    )
  }
  if (status === 'finished') {
    return (
      <div className={`${style.st} ${style.stFinal}`}>
        <span className={style.stText}>Finalizado</span>
      </div>
    )
  }
  return (
    <div className={`${style.st} ${style.stTime}`}>
      <span className={style.stText}>{kickoffLabel(datetime)}</span>
    </div>
  )
}

function formatMinute(minute) {
  if (typeof minute === 'number') return `${minute}'`
  return String(minute)
}
