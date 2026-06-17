const INLINE_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'br',
  'code',
  'em',
  'i',
  'kbd',
  'mark',
  's',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'u',
])

const EDITORIAL_TAGS = new Set([
  ...INLINE_TAGS,
  'blockquote',
  'cite',
  'div',
  'figcaption',
  'figure',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
])

const VOID_TAGS = new Set(['br', 'hr', 'img'])
const BLOCKED_CONTENT_TAGS = new Set([
  'base',
  'button',
  'embed',
  'form',
  'iframe',
  'input',
  'link',
  'math',
  'meta',
  'noscript',
  'object',
  'option',
  'script',
  'select',
  'style',
  'svg',
  'template',
  'textarea',
])

const URL_ATTRS = new Set(['href', 'src'])
const ATTRS_BY_TAG = {
  a: new Set(['href', 'rel', 'target', 'title']),
  abbr: new Set(['title']),
  img: new Set(['alt', 'decoding', 'height', 'loading', 'src', 'title', 'width']),
  ol: new Set(['start', 'type']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan']),
}

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

function escapeText(value) {
  return String(value ?? '').replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;'))
}

function escapeAttribute(value) {
  return String(value ?? '').replace(/[&"<>]/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '"') return '&quot;'
    if (char === '<') return '&lt;'
    return '&gt;'
  })
}

function decodeHtmlEntities(value) {
  return String(value ?? '')
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => {
      const code = Number.parseInt(hex, 16)
      return Number.isFinite(code) ? String.fromCodePoint(code) : ''
    })
    .replace(/&#(\d+);?/g, (_, number) => {
      const code = Number.parseInt(number, 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : ''
    })
    .replace(/&(amp|colon|lt|gt|quot|apos);/gi, (_, entity) => {
      const normalized = entity.toLowerCase()
      if (normalized === 'amp') return '&'
      if (normalized === 'colon') return ':'
      if (normalized === 'lt') return '<'
      if (normalized === 'gt') return '>'
      if (normalized === 'quot') return '"'
      return "'"
    })
}

function sanitizeUrl(value, attrName) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return null

  const normalized = decodeHtmlEntities(trimmed)
    .replace(/[\u0000-\u001F\u007F\s]+/g, '')
    .toLowerCase()

  if (!normalized) return null

  // URL devuelta SIN espacios, caracteres de control ni invisibles Unicode
  // (zero-width U+200B–U+200D, word-joiner U+2060, BOM U+FEFF). El editor a
  // veces los pega al final de la URL: la validación de protocolo ya los ignora,
  // pero si se devolvían tal cual rompían la carga del recurso —p. ej. <amp-img>
  // tiraba "Failed to load: …png". Una URL válida no lleva whitespace, así que
  // quitarlo es seguro y no altera la ruta real.
  const safe = Array.from(trimmed).filter((ch) => {
    const c = ch.codePointAt(0)
    if (c <= 0x1f || c === 0x7f) return false           // control
    if (c === 0x200b || c === 0x200c || c === 0x200d) return false // zero-width
    if (c === 0x2060 || c === 0xfeff) return false       // word-joiner, BOM
    return !/\s/.test(ch)                                // cualquier whitespace
  }).join('')
  if (!safe) return null

  if (normalized.startsWith('#')) return safe
  if (normalized.startsWith('//')) return safe
  if (/^(\/|\.\.?\/|\?)/.test(normalized)) return safe

  const protocolMatch = normalized.match(/^([a-z][a-z0-9+.-]*:)/)
  if (!protocolMatch) return safe
  if (!SAFE_PROTOCOLS.has(protocolMatch[1])) return null
  if (attrName === 'src' && !/^https?:/.test(protocolMatch[1])) return null

  return safe
}

function sanitizeNumeric(value) {
  const trimmed = String(value ?? '').trim()
  return /^\d{1,5}$/.test(trimmed) ? trimmed : null
}

function sanitizeAttribute(tagName, attrName, attrValue) {
  const allowed = ATTRS_BY_TAG[tagName]
  if (!allowed?.has(attrName)) return null
  if (attrName.startsWith('on') || attrName === 'style' || attrName === 'srcdoc') return null

  if (URL_ATTRS.has(attrName)) {
    const safeUrl = sanitizeUrl(attrValue, attrName)
    return safeUrl ? [attrName, safeUrl] : null
  }

  if (attrName === 'target') {
    const target = String(attrValue ?? '').trim().toLowerCase()
    return target === '_blank' || target === '_self' ? ['target', target] : null
  }

  if (attrName === 'rel') {
    const rel = String(attrValue ?? '')
      .split(/\s+/)
      .map((item) => item.trim().toLowerCase())
      .filter((item) => /^(nofollow|noopener|noreferrer|ugc|sponsored)$/.test(item))
    return rel.length ? ['rel', [...new Set(rel)].join(' ')] : null
  }

  if (attrName === 'loading') {
    const loading = String(attrValue ?? '').trim().toLowerCase()
    return loading === 'lazy' || loading === 'eager' ? ['loading', loading] : null
  }

  if (attrName === 'decoding') {
    const decoding = String(attrValue ?? '').trim().toLowerCase()
    return decoding === 'async' || decoding === 'sync' || decoding === 'auto' ? ['decoding', decoding] : null
  }

  if (attrName === 'width' || attrName === 'height' || attrName === 'colspan' || attrName === 'rowspan' || attrName === 'start') {
    const number = sanitizeNumeric(attrValue)
    return number ? [attrName, number] : null
  }

  if (attrName === 'type') {
    const type = String(attrValue ?? '').trim()
    return /^[1aAiI]$/.test(type) ? ['type', type] : null
  }

  return [attrName, String(attrValue ?? '')]
}

function parseAttributes(rawAttrs, tagName) {
  const attrs = []
  const seen = new Set()
  const attrPattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let match

  while ((match = attrPattern.exec(rawAttrs || ''))) {
    const attrName = match[1].toLowerCase()
    if (seen.has(attrName)) continue
    seen.add(attrName)

    const attrValue = match[2] ?? match[3] ?? match[4] ?? ''
    const sanitized = sanitizeAttribute(tagName, attrName, attrValue)
    if (sanitized) attrs.push(sanitized)
  }

  if (tagName === 'a' && attrs.some(([name, value]) => name === 'target' && value === '_blank')) {
    const relIndex = attrs.findIndex(([name]) => name === 'rel')
    const relValues = new Set(relIndex >= 0 ? attrs[relIndex][1].split(/\s+/) : [])
    relValues.add('noopener')
    relValues.add('noreferrer')
    const rel = [...relValues].filter(Boolean).join(' ')
    if (relIndex >= 0) attrs[relIndex] = ['rel', rel]
    else attrs.push(['rel', rel])
  }

  return attrs
}

function sanitizeTag(tagToken, allowedTags) {
  const match = tagToken.match(/^<\s*(\/?)\s*([a-zA-Z][\w:-]*)([^>]*)>/)
  if (!match) return escapeText(tagToken)

  const isClosing = Boolean(match[1])
  const tagName = match[2].toLowerCase()
  const rawAttrs = match[3] || ''

  if (!allowedTags.has(tagName)) return ''
  if (isClosing) return VOID_TAGS.has(tagName) ? '' : `</${tagName}>`

  const attrs = parseAttributes(rawAttrs, tagName)
  if (tagName === 'img' && !attrs.some(([name]) => name === 'src')) return ''

  const serializedAttrs = attrs.map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`).join('')
  return `<${tagName}${serializedAttrs}>`
}

function stripBlockedContent(html) {
  let sanitized = String(html ?? '').replace(/<!--[\s\S]*?-->/g, '')

  for (const tagName of BLOCKED_CONTENT_TAGS) {
    const paired = new RegExp(`<\\s*${tagName}\\b[\\s\\S]*?<\\s*\\/\\s*${tagName}\\s*>`, 'gi')
    sanitized = sanitized.replace(paired, '')
    const single = new RegExp(`<\\s*\\/?\\s*${tagName}\\b[^>]*>`, 'gi')
    sanitized = sanitized.replace(single, '')
  }

  return sanitized
}

function sanitizeHtml(value, allowedTags) {
  const source = stripBlockedContent(value)
  const tagPattern = /<\/?[a-zA-Z][\w:-]*(?:\s+[^<>]*)?>/g
  let output = ''
  let cursor = 0
  let match

  while ((match = tagPattern.exec(source))) {
    output += escapeText(source.slice(cursor, match.index))
    output += sanitizeTag(match[0], allowedTags)
    cursor = match.index + match[0].length
  }

  output += escapeText(source.slice(cursor))
  return output
}

export function sanitizeInlineHtml(value) {
  return sanitizeHtml(value, INLINE_TAGS)
}

export function sanitizeEditorialHtml(value) {
  return sanitizeHtml(value, EDITORIAL_TAGS).trim()
}

export function sanitizeResourceUrl(value) {
  return sanitizeUrl(value, 'src')
}
