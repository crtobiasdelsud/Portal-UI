import { buildSrcSet, resolveImageSrc } from '../../../utils/imageVariants.js'

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
 * variants: objeto `imagen.variants` del backend ({thumb,medium,large,xl}). Si
 *           se provee, emite `srcset` + `sizes` para que el navegador baje la
 *           resolución justa según el viewport (ver ADR-0002). Sin variantes el
 *           comportamiento es idéntico al anterior (img con `src` plano).
 * sizes:    hint de tamaño renderizado para el srcset (p. ej. "100vw").
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
  variants  = null,
  sizes,
}) {
  const srcSet  = buildSrcSet(variants)
  // Con variantes, el `src` base apunta a `large` (fallback al src recibido).
  const imgSrc  = srcSet ? resolveImageSrc(variants, src, 'large') : src

  const x    = focalPoint?.x    ?? 0.5
  const y    = focalPoint?.y    ?? 0.5
  const zoom = focalPoint?.zoom ?? 1

  const pos         = `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`
  const aspectRatio = RATIOS[aspect] ?? RATIOS['16:9']

  // width/height intrínsecos según el aspect: el CSS sigue controlando el tamaño
  // real (width/height 100%), pero estos atributos le dan al navegador el ratio
  // para reservar espacio y evitar CLS (audit "image elements without w/h").
  const [imgW, imgH] = aspect === '4:3' ? [1200, 900] : [1600, 900]

  const wrapStyle = fill
    ? { position: 'absolute', inset: 0, overflow: 'hidden', ...style }
    : { position: 'relative', width: '100%', aspectRatio, overflow: 'hidden', ...style }

  return (
    <div className={className} style={wrapStyle}>
      <img
        src={imgSrc}
        alt={alt}
        width={imgW}
        height={imgH}
        decoding="async"
        {...(srcSet ? { srcSet, sizes } : {})}
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
