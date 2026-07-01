/**
 * Renders an image cropped to a container using a focal point + optional zoom.
 *
 * The container must have explicit dimensions (via className or style).
 * focalPoint: { x: 0–1, y: 0–1, zoom: ≥1 }
 */
export default function FocalImage({ src, alt = '', focalPoint, className = '', style = {} }) {
  const x    = focalPoint?.x    ?? 0.5
  const y    = focalPoint?.y    ?? 0.5
  const zoom = focalPoint?.zoom ?? 1

  const pos = `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <img
        src={src}
        alt={alt}
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
