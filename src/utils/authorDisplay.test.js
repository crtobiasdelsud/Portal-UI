import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveAuthorDisplay } from './authorDisplay.shared.js'

test('resolveAuthorDisplay uses publisherName for organizational bylines', () => {
  assert.deepEqual(
    resolveAuthorDisplay({
      autor: { nombre: 'Autora', slug: 'autora', avatar: '/autor.jpg' },
      publicarComoOrg: true,
      publisherName: 'Editorial Central',
      siteName: 'Marca Visible',
      iconUrl: '/logo.svg',
    }),
    {
      isOrg: true,
      displayName: 'Editorial Central',
      authorSlug: null,
      avatarSrc: '/logo.svg',
    }
  )
})

test('resolveAuthorDisplay falls back to siteName when publisherName is empty', () => {
  assert.equal(
    resolveAuthorDisplay({
      publicarComoOrg: true,
      publisherName: '   ',
      siteName: 'Marca Visible',
    }).displayName,
    'Marca Visible'
  )
})

test('resolveAuthorDisplay keeps person bylines unchanged', () => {
  assert.deepEqual(
    resolveAuthorDisplay({
      autor: { nombre: 'Autora', slug: 'autora', avatar: '/autor.jpg' },
      publicarComoOrg: false,
      publisherName: 'Editorial Central',
      siteName: 'Marca Visible',
      iconUrl: '/logo.svg',
    }),
    {
      isOrg: false,
      displayName: 'Autora',
      authorSlug: 'autora',
      avatarSrc: '/autor.jpg',
    }
  )
})
