'use client'

import { createContext, useContext } from 'react'

const AdaptersContext = createContext(null)

export function AdaptersProvider({ value, children }) {
  return (
    <AdaptersContext.Provider value={value}>
      {children}
    </AdaptersContext.Provider>
  )
}

export function useAdapters() {
  const adapters = useContext(AdaptersContext)
  if (!adapters) {
    throw new Error(
      '[portal-ui] useAdapters() llamado fuera de <AdaptersProvider>. ' +
      'Asegurate de envolver tu app con <AdaptersProvider value={{ Image, Link, fetcher }}>.'
    )
  }
  return adapters
}

export function useOptionalAdapters() {
  return useContext(AdaptersContext)
}
