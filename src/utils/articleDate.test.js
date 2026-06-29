import assert from 'node:assert/strict'
import test from 'node:test'

import { AR_TIME_ZONE, formatArticlePublicationDate } from './articleDate.js'

test('AR_TIME_ZONE usa la zona nombrada de Buenos Aires', () => {
  assert.equal(AR_TIME_ZONE, 'America/Argentina/Buenos_Aires')
})

test('formatArticlePublicationDate renderiza fecha visible en hora Argentina', () => {
  assert.deepEqual(
    formatArticlePublicationDate('2026-06-25T18:00:00Z'),
    {
      dateTime: '2026-06-25T18:00:00.000Z',
      label: 'Publicado el 25 de junio de 2026 a las 15:00',
    },
  )
})

test('formatArticlePublicationDate tolera valores vacios o invalidos', () => {
  assert.equal(formatArticlePublicationDate(null), null)
  assert.equal(formatArticlePublicationDate(''), null)
  assert.equal(formatArticlePublicationDate('not-a-date'), null)
})
