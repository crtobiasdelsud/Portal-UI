'use client'

import { createContext, useContext, useRef } from 'react'

const ArticlePoolContext = createContext(null)

/**
 * Crea un tracker de artículos con scope explícito (sin React.cache).
 * Cada llamada a claim* se serializa en una cadena de Promises, así
 * dos widgets que claiman en paralelo nunca ven el mismo Set<usedIds>.
 *
 * @param {(input: string, init?: object) => Promise<Response>} fetcher
 * @param {object} [opts]
 * @param {string} [opts.poolEndpoint='/api/portal/articles?limit=30']
 */
export function createArticlePool(fetcher, opts = {}) {
  const { poolEndpoint = '/api/portal/articles?limit=30' } = opts
  const usedIds = new Set()

  const poolPromise = fetcher(poolEndpoint, { cache: 'no-store' })
    .then(async (res) => {
      if (!res || !res.ok) return []
      const json = await res.json()
      const raw = json?.data?.data ?? json?.data ?? json ?? []
      return Array.isArray(raw) ? raw : []
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[portal-ui/articlePool] pool fetch falló:', err?.message ?? err)
      return []
    })

  let chain = poolPromise.then(() => {})

  function claimArticles(limit = 5) {
    const result = chain.then(async () => {
      const pool = await poolPromise
      const available = pool.filter((a) => !usedIds.has(String(a.id)))
      const claimed = available.slice(0, limit)
      claimed.forEach((a) => usedIds.add(String(a.id)))
      return claimed
    })
    chain = result.then(() => {}).catch(() => {})
    return result
  }

  function claimWithFetch(asyncFetcher) {
    const result = chain.then(async () => {
      const articles = await asyncFetcher(new Set(usedIds))
      const safe = Array.isArray(articles) ? articles : []
      safe.forEach((a) => usedIds.add(String(a.id)))
      return safe
    })
    chain = result.then(() => {}).catch(() => {})
    return result
  }

  function reset() {
    usedIds.clear()
  }

  return { claimArticles, claimWithFetch, reset }
}

export function ArticlePoolProvider({ fetcher, poolEndpoint, children }) {
  const trackerRef = useRef(null)
  if (!trackerRef.current) {
    trackerRef.current = createArticlePool(fetcher, { poolEndpoint })
  }
  return (
    <ArticlePoolContext.Provider value={trackerRef.current}>
      {children}
    </ArticlePoolContext.Provider>
  )
}

/**
 * Devuelve el tracker actual o `null` si no hay provider en el árbol.
 * Los widgets deben tolerar `null` y caer al fetch directo sin dedupe.
 */
export function useArticlePool() {
  return useContext(ArticlePoolContext)
}
