'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useDrawer } from '../DrawerContext/DrawerContext'

function getYouTubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      return u.searchParams.get('v')
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1)
    }
  } catch {}
  return null
}

function buildEmbedSrc(url) {
  const id = getYouTubeId(url)
  if (!id) return url
  const params = new URLSearchParams({
    autoplay:    '1',
    mute:        '1',
    enablejsapi: '1',
    rel:         '0',
    playsinline: '1',
  })
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

let ytApiPromise = null
function loadYouTubeAPI() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (ytApiPromise) return ytApiPromise
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return ytApiPromise
}

// Iframe único del live. Se monta una sola vez por DrawerProvider, en posición
// fixed sobre el viewport, y se reposiciona/redimensiona sobre el anchor que
// cada <LiveBanner> reporta como visible (vía IntersectionObserver). Así el
// stream nunca se duplica ni se reinicia al alternar desktop ↔ compact.
export default function LivePlayerHost({ liveUrl }) {
  const {
    liveStarted, liveDismissed,
    liveMuted, liveExpanded,
    liveAnchors,
  } = useDrawer()

  const containerRef = useRef(null)
  const iframeRef    = useRef(null)
  const playerRef    = useRef(null)
  const mutedRef     = useRef(liveMuted)
  useEffect(() => { mutedRef.current = liveMuted }, [liveMuted])

  const videoId = getYouTubeId(liveUrl || '')
  const src = useMemo(
    () => buildEmbedSrc(liveUrl || ''),
    [liveUrl]
  )

  // Crear el YT.Player una vez que el iframe está montado. El src va con
  // mute=1 fijo (necesario para autoplay); onReady decide si dejarlo muteado
  // o desmutearlo según el estado actual del context.
  useEffect(() => {
    if (!liveStarted || !videoId || !iframeRef.current) return
    let cancelled = false

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !iframeRef.current || !YT?.Player) return
      try {
        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            onReady: (e) => {
              try {
                if (mutedRef.current) {
                  e.target.mute()
                } else {
                  e.target.unMute()
                  if (typeof e.target.setVolume === 'function') e.target.setVolume(100)
                }
                e.target.playVideo?.()
              } catch {}
            },
          },
        })
      } catch {}
    })

    return () => {
      cancelled = true
      try { playerRef.current?.destroy?.() } catch {}
      playerRef.current = null
    }
  }, [liveStarted, videoId])

  // Sincronizar mute/unmute con la API (sin recargar el iframe).
  useEffect(() => {
    const p = playerRef.current
    if (!p) return
    try {
      if (liveMuted) {
        p.mute?.()
      } else {
        p.unMute?.()
        if (typeof p.setVolume === 'function') p.setVolume(100)
      }
    } catch {}
  }, [liveMuted])

  // Reposicionar el iframe sobre el anchor "más visible" (el de mayor `top`
  // dentro del viewport). Cuando hay dos banners montados (desktop normal +
  // compact) ambos pueden estar técnicamente en el viewport, pero el de
  // arriba está tapado por el header activo: el de abajo es el que el usuario
  // realmente ve. El iframe nunca se remonta, sólo cambia su transform y
  // dimensiones — así el live no se rebufferea ni vuelve al live edge.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (!liveStarted || liveAnchors.length === 0) {
      el.style.display = 'none'
      return
    }

    // Opacity efectiva subiendo por el árbol — la `.desktopSlot.hidden` tiene
    // opacity:0 en el slot, no en el anchor mismo. Sin esto, durante la
    // transición de vuelta el anchor del desktop normal ya está visible pero
    // su slot todavía está animando opacity 0→1; igual lo descartamos para
    // que el iframe no salte antes de tiempo.
    const effectiveOpacity = (node) => {
      let op = 1
      let n = node
      while (n && n.nodeType === 1) {
        const cs = window.getComputedStyle(n)
        if (cs.visibility === 'hidden' || cs.display === 'none') return 0
        op *= parseFloat(cs.opacity || '1')
        if (op <= 0.01) return 0
        n = n.parentElement
      }
      return op
    }

    let raf = 0
    const reposition = () => {
      let best = null
      let bestPriority = -Infinity
      for (const { el: a, priority } of liveAnchors) {
        const r = a.getBoundingClientRect()
        const opaque = effectiveOpacity(a) > 0.01
        const visible =
          opaque &&
          r.bottom > 0 &&
          r.top    < window.innerHeight &&
          r.right  > 0 &&
          r.left   < window.innerWidth &&
          r.width  > 0 &&
          r.height > 0
        if (!visible) continue
        // Elegir el de mayor prioridad. Empates → el de más abajo (mayor top),
        // que en la práctica es el que está visualmente debajo del header.
        if (
          priority > bestPriority ||
          (priority === bestPriority && (!best || r.top > best.top))
        ) {
          best = r
          bestPriority = priority
        }
      }
      if (!best) {
        el.style.display = 'none'
        return
      }
      el.style.display = 'block'
      el.style.transform = `translate3d(${best.left}px, ${best.top}px, 0)`
      el.style.width  = `${best.width}px`
      el.style.height = `${best.height}px`
    }
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(reposition)
    }
    schedule()

    const ro = new ResizeObserver(schedule)
    for (const { el: a } of liveAnchors) ro.observe(a)
    ro.observe(document.documentElement)

    // IntersectionObserver detecta el momento en que un anchor entra o sale
    // del viewport — clave para el caso "scroll up con banner expanded": el
    // slot del desktop normal anima de vuelta con `transform` durante 250ms
    // DESPUÉS de que el último scroll event ya disparó. Sin esto, el iframe
    // queda anclado al compact aunque visualmente vuelva a aparecer el normal.
    const io = new IntersectionObserver(schedule, { threshold: [0, 0.5, 1] })
    for (const { el: a } of liveAnchors) io.observe(a)

    // Las transiciones CSS del swap (transform/opacity en .desktopSlot.hidden)
    // tampoco disparan scroll/resize. transitionend nos da el reposition final.
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'transform' || e.propertyName === 'opacity') schedule()
    }
    document.addEventListener('transitionend', onTransitionEnd, true)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('transitionend', onTransitionEnd, true)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [liveAnchors, liveStarted])

  if (liveDismissed || !liveStarted || !videoId) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1003,
        pointerEvents: liveExpanded ? 'auto' : 'none',
        overflow: 'hidden',
        display: 'none',
        willChange: 'transform, width, height',
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Transmisión en vivo"
      />
    </div>
  )
}
