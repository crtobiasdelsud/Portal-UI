const RATIOS = {
  '16:9': '16/9',
  '4:3':  '4/3',
}

/**
 * Image container that enforces a fixed aspect ratio (16:9 or 4:3)
 * while applying focal-point positioning. Width comes from the parent.
 * Drop-in replacement for Next.js <Image> inside cards.
 *
 * focalPoint: { x: 0–1, y: 0–1, zoom: ≥1 }
 * aspect: '16:9' | '4:3'  (default '16:9')
 * priority: true → imagen LCP (carga eager + fetchpriority alta). Sin prioridad
 *           se difiere con loading="lazy".
 */
export default function AspectImage({
  src,
  alt       = '',
  focalPoint,
  aspect    = '16:9',
  fill      = false,
  className = '',
  style     = {},
  priority  = false,
}) {
  const x    = focalPoint?.x    ?? 0.5
  const y    = focalPoint?.y    ?? 0.5
  const zoom = focalPoint?.zoom ?? 1

  const pos         = `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`
  const aspectRatio = RATIOS[aspect] ?? RATIOS['16:9']

  const wrapStyle = fill
    ? { position: 'absolute', inset: 0, overflow: 'hidden', ...style }
    : { position: 'relative', width: '100%', aspectRatio, overflow: 'hidden', ...style }

  return (
    <div className={className} style={wrapStyle}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        {...(priority
          ? { loading: 'eager', fetchPriority: 'high' }
          : { loading: 'lazy' })}
        style={{
          position:        'absolute',
          inset:           0,
          width:           '100%',
          height:          '100%',
          objectFit:       'cover',
          objectPosition:  pos,
          display:         'block',
          transform:       zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: pos,
        }}
      />
    </div>
  )
}
