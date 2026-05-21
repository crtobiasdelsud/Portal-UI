'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const DrawerContext = createContext(null)

export function DrawerProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [liveDismissed, setLiveDismissed] = useState(false)
  const [liveExpanded, setLiveExpanded]   = useState(false)
  const [liveMuted, setLiveMuted]         = useState(true)
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
    <DrawerContext.Provider value={{ open, setOpen, liveDismissed, setLiveDismissed, liveExpanded, setLiveExpanded, liveMuted, setLiveMuted, focusSearch, setFocusSearch, openWithSearch }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  const ctx = useContext(DrawerContext)
  if (!ctx) throw new Error('useDrawer must be used inside DrawerProvider')
  return ctx
}
