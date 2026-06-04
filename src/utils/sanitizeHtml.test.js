import assert from 'node:assert/strict'
import test from 'node:test'

import { sanitizeEditorialHtml, sanitizeInlineHtml, sanitizeResourceUrl } from './sanitizeHtml.js'

test('sanitizeInlineHtml preserves basic editorial inline markup', () => {
  const html = 'Texto <strong>fuerte</strong>, <em>enfasis</em> y <a href="/nota" target="_blank">link</a>.'

  assert.equal(
    sanitizeInlineHtml(html),
    'Texto <strong>fuerte</strong>, <em>enfasis</em> y <a href="/nota" target="_blank" rel="noopener noreferrer">link</a>.'
  )
})

test('sanitizeInlineHtml removes executable markup and dangerous urls', () => {
  const html = [
    '<script>alert(1)</script>',
    '<strong onclick="alert(1)">ok</strong>',
    '<a href="java&#x73;cript:alert(1)" onclick="alert(1)">bad</a>',
    '<img src=x onerror=alert(1)>',
  ].join('')

  const sanitized = sanitizeInlineHtml(html)

  assert.equal(sanitized, '<strong>ok</strong><a>bad</a>')
  assert.doesNotMatch(sanitized, /script|onclick|javascript|onerror|<img/i)
})

test('sanitizeEditorialHtml keeps safe raw editorial structure and drops unsafe blocks', () => {
  const html = [
    '<p style="color:red">Intro <mark>marcada</mark></p>',
    '<iframe src="https://example.com/embed"></iframe>',
    '<img src="javascript:alert(1)" alt="bad">',
    '<img src="/uploads/foto.jpg" alt="Foto" width="120" height="80" loading="lazy" onerror="alert(1)">',
    '<table><tr><td colspan="2" data-nosnippet>Dato</td></tr></table>',
  ].join('')

  const sanitized = sanitizeEditorialHtml(html)

  assert.equal(
    sanitized,
    '<p>Intro <mark>marcada</mark></p><img src="/uploads/foto.jpg" alt="Foto" width="120" height="80" loading="lazy"><table><tr><td colspan="2">Dato</td></tr></table>'
  )
  assert.doesNotMatch(sanitized, /iframe|javascript|onerror|style|data-nosnippet/i)
})

test('sanitizeResourceUrl allows public resources and rejects executable protocols', () => {
  assert.equal(sanitizeResourceUrl('/uploads/foto.jpg'), '/uploads/foto.jpg')
  assert.equal(sanitizeResourceUrl('https://cdn.example.com/foto.jpg'), 'https://cdn.example.com/foto.jpg')
  assert.equal(sanitizeResourceUrl('javascript:alert(1)'), null)
  assert.equal(sanitizeResourceUrl('data:image/svg+xml,<svg onload=alert(1)>'), null)
  assert.equal(sanitizeResourceUrl('mailto:persona@example.com'), null)
})
