'use client'

import style from './MundialBoard.module.scss'
import { Flag, teamName } from './flags.jsx'
import { kickoffParts } from './mundialFormat.js'

/**
 * Sección completa "Mundial 2026" para la screen `/mundial` (variante "Página"
 * del diseño El Editor). Reusa la tira como widget superior y arma la sección:
 * partido destacado + posiciones + goleadores + próximos partidos.
 *
 * Vista pura: recibe `data` resuelta por la app (proxy `/api/portal/mundial`).
 * El masthead/nav y el theme vienen del layout raíz del portal.
 */
export default function MundialBoardView({ data }) {
  const matches = Array.isArray(data?.matches) ? data.matches : []
  const standings = Array.isArray(data?.standings) ? data.standings : []
  const scorers = Array.isArray(data?.scorers) ? data.scorers : []

  const featured = matches.find((m) => m.status === 'live') || matches[0] || null
  const fixtures = matches.filter((m) => m.status === 'scheduled').slice(0, 4)

  const hasContent = matches.length || standings.length || scorers.length
  if (!hasContent) {
    return <div className={style.sec}><p className={style.empty}>Todavía no hay información del Mundial disponible.</p></div>
  }

  return (
    <div className={style.root}>
      <div className={style.sec}>
        <div className={style.secHead}>
          <div>
            <p className={style.kick}>Fútbol · Copa del Mundo</p>
            <h2 className={style.h2}>{data?.tournament || 'Mundial 2026'}</h2>
          </div>
          <div className={style.ln} />
        </div>

        <div className={style.grid2}>
          <div className={style.feat}>
            {featured && <MatchCard match={featured} />}
          </div>

          <aside className={style.side}>
            {standings.map((g) => (
              <StandingsPanel key={g.group} group={g} />
            ))}
            {fixtures.length > 0 && <FixturesPanel fixtures={fixtures} />}
            {scorers.length > 0 && <ScorersPanel scorers={scorers} />}
          </aside>

          {matches.length > 0 && (
            <div className={style.histArea}>
              <HistorySection matches={matches} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HistorySection({ matches }) {
  const rounds = groupByRound(matches)
  return (
    <section className={style.history} aria-label="Todos los partidos">
      <h2 className={style.histTitle}>Todos los partidos</h2>
      {rounds.map(({ label, items }) => (
        <div key={label} className={style.histGroup}>
          <h3 className={style.histRound}>{label}</h3>
          <div className={style.histList}>
            {items.map((m, i) => <HistoryRow key={m.id ?? `${label}-${i}`} match={m} />)}
          </div>
        </div>
      ))}
    </section>
  )
}

function HistoryRow({ match }) {
  const { status, home = {}, away = {} } = match
  const finishedOrLive = status === 'finished' || status === 'live'
  const hasScore = typeof home.score === 'number' && typeof away.score === 'number'
  const hWin = hasScore && home.score > away.score
  const aWin = hasScore && away.score > home.score
  const k = kickoffParts(match.datetime)

  return (
    <div className={style.histRow}>
      <div className={`${style.histTeam} ${style.histHome} ${aWin ? style.lose : ''}`.trim()}>
        <span className={style.histName}>{teamName(home.code, home.name)}</span>
        <Flag code={home.code} flag={home.flag} />
      </div>
      <div className={style.histScore}>
        {finishedOrLive && hasScore
          ? <span className={status === 'live' ? style.histLive : ''}>{home.score}<i>-</i>{away.score}</span>
          : <span className={style.histVs}>{k.time}<small>{k.day}</small></span>}
      </div>
      <div className={`${style.histTeam} ${aWin ? '' : hWin ? style.lose : ''}`.trim()}>
        <Flag code={away.code} flag={away.flag} />
        <span className={style.histName}>{teamName(away.code, away.name)}</span>
      </div>
      <span className={style.histMeta}>
        {status === 'live'
          ? <span className={style.histLive}>EN VIVO</span>
          : status === 'finished'
          ? 'Final'
          : ''}
      </span>
    </div>
  )
}

function groupByRound(matches) {
  const map = new Map()
  for (const m of matches) {
    const label = m.group || m.matchday || 'Fase final'
    if (!map.has(label)) map.set(label, [])
    map.get(label).push(m)
  }
  return [...map.entries()].map(([label, items]) => ({ label, items }))
}

function MatchCard({ match }) {
  const { status, minute, group, matchday, home = {}, away = {}, venue, scorers = [] } = match
  const grpLabel = [group, matchday].filter(Boolean).join(' · ')
  const hs = home.score
  const as = away.score
  const hasScore = typeof hs === 'number' && typeof as === 'number'

  return (
    <div className={style.matchcard}>
      <div className={style.mcTop}>
        {status === 'live' ? (
          <>
            <span className={style.liveDot} />
            <span className={style.mcLive}>En vivo</span>
            {minute != null && <span className={style.mcMin}>{typeof minute === 'number' ? `${minute}'` : minute}</span>}
          </>
        ) : status === 'finished' ? (
          <span className={style.mcFinal}>Finalizado</span>
        ) : (
          <span className={style.mcTime}>{kickoffParts(match.datetime).day} {kickoffParts(match.datetime).time}</span>
        )}
        {grpLabel && <span className={style.grp}>{grpLabel}</span>}
      </div>

      <div className={style.mcBody}>
        <Side team={home} other={away} hasScore={hasScore} />
        <div className={style.mcScore}>
          {hasScore ? (
            <><span>{hs}</span><span className={style.dash}>–</span><span>{as}</span></>
          ) : (
            <span className={style.dash}>vs</span>
          )}
        </div>
        <Side team={away} other={home} hasScore={hasScore} />
      </div>

      {(scorers.length > 0 || venue) && (
        <div className={style.mcMeta}>
          {scorers.map((s, i) => (
            <span key={i} className={style.sg}>
              <span className={style.bul} /><b>{s.name}</b>{s.minute != null ? ` ${typeof s.minute === 'number' ? `${s.minute}'` : s.minute}` : ''}
            </span>
          ))}
          {venue && <span className={`${style.sg} ${style.sgFaint}`}>{venue}</span>}
        </div>
      )}
    </div>
  )
}

function Side({ team = {}, other = {}, hasScore }) {
  let cls = ''
  if (hasScore && typeof team.score === 'number' && typeof other.score === 'number') {
    if (team.score < other.score) cls = style.lose
  }
  return (
    <div className={`${style.mcSide} ${cls}`.trim()}>
      <Flag code={team.code} flag={team.flag} size="lg" />
      <span className={style.nm}>{teamName(team.code, team.name)}</span>
    </div>
  )
}

function StandingsPanel({ group }) {
  const teams = Array.isArray(group?.teams) ? group.teams : []
  return (
    <div className={style.panel}>
      <div className={style.panelH}>
        <span className={style.pBar} />
        <h4 className={style.pTitle}>Posiciones</h4>
        <span className={style.pGrp}>{group.group}</span>
      </div>
      <table className={style.stand}>
        <thead>
          <tr>
            <th className={style.lft} colSpan={2}>Equipo</th>
            <th>PJ</th><th>DG</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t, i) => (
            <tr key={t.code ?? i}>
              <td className={style.pos}>{t.pos ?? i + 1}</td>
              <td className={style.lft}><Flag code={t.code} flag={t.flag} /><span>{teamName(t.code, t.name)}</span></td>
              <td>{t.pj ?? 0}</td>
              <td>{formatDg(t.dg)}</td>
              <td className={style.pts}>{t.pts ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScorersPanel({ scorers }) {
  return (
    <div className={style.panel}>
      <div className={style.panelH}>
        <span className={style.pBar} />
        <h4 className={style.pTitle}>Goleadores</h4>
      </div>
      <div className={style.scorers}>
        {scorers.map((s, i) => (
          <div key={i} className={style.scorer}>
            <Flag code={s.code} flag={s.flag} />
            <span className={style.scNm}>{s.name} <small>{teamName(s.code, s.country)}</small></span>
            <span className={style.scG}>{s.goals}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FixturesPanel({ fixtures }) {
  return (
    <div className={style.panel}>
      <div className={style.panelH}>
        <span className={style.pBar} />
        <h4 className={style.pTitle}>Próximos partidos</h4>
      </div>
      <div className={style.fixt}>
        {fixtures.map((m, i) => {
          const { day, time } = kickoffParts(m.datetime)
          return (
            <div key={m.id ?? i} className={style.fix}>
              <div className={style.pair}>
                <div className={style.pr}><Flag code={m.home?.code} flag={m.home?.flag} /><span>{teamName(m.home?.code, m.home?.name)}</span></div>
                <div className={style.pr}><Flag code={m.away?.code} flag={m.away?.flag} /><span>{teamName(m.away?.code, m.away?.name)}</span></div>
              </div>
              <div className={style.when}>{time}<small>{day}</small></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatDg(dg) {
  const n = Number(dg ?? 0)
  return n > 0 ? `+${n}` : `${n}`
}
