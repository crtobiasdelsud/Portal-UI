import assert from 'node:assert/strict'
import test from 'node:test'

import { buildSrcSet, resolveImageSrc } from './imageVariants.js'

test('buildSrcSet keeps only safe resource urls and numeric width descriptors', () => {
  const srcSet = buildSrcSet({
    thumb: { url: 'javascript:alert(1)', width: 320 },
    medium: { url: '/uploads/medium.webp', width: '800' },
    large: { url: '/uploads/large.webp', width: '1200w, https://evil.test/x 999w' },
    xl: { url: 'https://cdn.example.com/xl.webp', width: 1920 },
  })

  assert.equal(srcSet, '/uploads/medium.webp 800w, https://cdn.example.com/xl.webp 1920w')
})

test('resolveImageSrc falls back when the preferred variant is unsafe', () => {
  assert.equal(
    resolveImageSrc({ large: { url: 'data:image/svg+xml,<svg onload=alert(1)>' } }, '/uploads/fallback.jpg'),
    '/uploads/fallback.jpg'
  )
})
