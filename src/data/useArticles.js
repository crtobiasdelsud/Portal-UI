'use client'

import { useEffect, useState } from 'react'
import { useAdapters } from '../adapters/AdaptersContext.jsx'
import { useArticlePool } from './ArticlePoolContext.jsx'

/**
 * Hook universal (client-side) que devuelve artículos.
 * - Si hay <ArticlePoolProvider> en el árbol, claima del pool (dedupe).
 * - Si no, fetch directo sin dedupe.
 *
 * @param {object} opts
 * @param {number} [opts.limit=10]
 * @param {string} [opts.endpoint] — si se provee, hace fetch directo a ese endpoint.
 * @param {string} [opts.categoria]
 * @param {Array}  [opts.deps=[]] — extra deps para re-fetch.
 */
export function useArticles({ limit = 10, endpoint, categoria, deps = [] } = {}) {
  const { fetcher } = useAdapters()
  const pool = useArticlePool()

  const [state, setState] = useState({ articles: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        let articles = []

        if (endpoint) {
          const res = await fetcher(endpoint, { cache: 'no-store' })
          const json = await res.json()
          const raw = json?.data?.data ?? json?.data ?? json ?? []
          articles = Array.isArray(raw) ? raw.slice(0, limit) : []
        } else if (pool) {
          articles = await pool.claimArticles(limit)
        } else {
          const url = buildArticlesUrl({ limit, categoria })
          const res = await fetcher(url, { cache: 'no-store' })
          const json = await res.json()
          const raw = json?.data?.data ?? json?.data ?? json ?? []
          articles = Array.isArray(raw) ? raw.slice(0, limit) : []
        }

        if (!cancelled) setState({ articles, loading: false, error: null })
      } catch (err) {
        if (!cancelled) setState({ articles: [], loading: false, error: err })
      }
    }

    setState((s) => ({ ...s, loading: true }))
    run()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, endpoint, categoria, pool, ...deps])

  return state
}

function buildArticlesUrl({ limit, categoria }) {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  if (categoria) params.set('categoria', categoria)
  return `/api/portal/articles?${params.toString()}`
}
