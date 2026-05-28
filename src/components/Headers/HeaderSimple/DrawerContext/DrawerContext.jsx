'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DrawerContext = createContext(null)

export function DrawerProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [liveDismissed, setLiveDismissed] = useState(false)
  const [liveExpanded, setLiveExpanded]   = useState(false)
  const [liveStarted, setLiveStarted]     = useState(false)
  const [liveMuted, setLiveMuted]         = useState(true)
  // Lista de anchors (DOM nodes + prioridad) registrados por todos los
  // <LiveBanner> vivos dentro de este DrawerProvider. <LivePlayerHost> tiene
  // UN solo iframe y lo reposiciona sobre el anchor "actualmente visible al
  // usuario". Cuando hay varios anchors visibles a la vez (caso desktop:
  // normal + compact ambos en el viewport sin scroll), el de mayor `priority`
  // gana — así el iframe siempre se ancla al banner que el usuario realmente
  // está viendo, sin depender de heurísticas frágiles de posición Y.
  // Convención: desktop normal = 2, desktop compact = 1, mobile/único = 0.
  const [liveAnchors, setLiveAnchors]     = useState([])
  const registerLiveAnchor = useCallback((el, priority = 0) => {
    if (!el) return
    setLiveAnchors((arr) => {
      const existing = arr.find((x) => x.el === el)
      if (existing) {
        if (existing.priority === priority) return arr
        return arr.map((x) => (x.el === el ? { el, priority } : x))
      }
      return [...arr, { el, priority }]
    })
  }, [])
  const unregisterLiveAnchor = useCallback((el) => {
    if (!el) return
    setLiveAnchors((arr) => arr.filter((x) => x.el !== el))
  }, [])
  const [focusSearch, setFocusSearch] = useState(false)

  const openWithSearch = useCallback(() => {
    setOpen(true)
    setFocusSearch(true)
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (open) {
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
    } else {
      html.style.overflow = ''
      body.style.overflow = ''
    }
    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
    }
  }, [open])

  return (
    <DrawerContext.Provider value={{ open, setOpen, liveDismissed, setLiveDismissed, liveExpanded, setLiveExpanded, liveStarted, setLiveStarted, liveMuted, setLiveMuted, liveAnchors, registerLiveAnchor, unregisterLiveAnchor, focusSearch, setFocusSearch, openWithSearch }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useDrawer must be used inside DrawerProvider')
  return ctx
}
