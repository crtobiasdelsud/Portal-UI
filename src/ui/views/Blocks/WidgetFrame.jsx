'use client'

import { useId } from 'react'
import WidgetErrorBoundary from './WidgetErrorBoundary'
import { WidgetThemeScope } from '../../../context/SiteConfigContext.jsx'
import { buildResponsiveStyleCss } from '../../../lib/responsiveStyleCss.js'

/**
 * Envoltura estándar de un widget dentro de un bloque. Combina, en orden:
 *   1) WidgetErrorBoundary  — aísla los crashes del widget.
 *   2) Estilo propio del widget — margen/relleno/borde/etc. por breakpoint,
 *      definido en el CMS y guardado en `settings.style/styleTablet/styleMobile`.
 *      Se aplica como CSS @media scopeado a una clase única (useId) para que sea
 *      responsive en el portal (un solo HTML para todos los tamaños). Sin estilo,
 *      no agrega wrapper ni <style> (passthrough).
 *   3) WidgetThemeScope — cascada de theme por widget (colores/variantes).
 *
 * Reemplaza el patrón repetido `WidgetErrorBoundary > WidgetThemeScope > Widget`
 * que tenían todos los bloques, sumándole el estilo por widget.
 */
export default function WidgetFrame({ settings = {}, children }) {
  const rawId = useId()
  const className = `wstyle-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const css = buildResponsiveStyleCss(
    { base: settings?.style, tablet: settings?.styleTablet, mobile: settings?.styleMobile },
    className,
  )

  const inner = (
    <WidgetErrorBoundary>
      <WidgetThemeScope override={settings?.theme}>
        {children}
      </WidgetThemeScope>
    </WidgetErrorBoundary>
  )

  if (!css) return inner

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={className}>{inner}</div>
    </>
  )
}
