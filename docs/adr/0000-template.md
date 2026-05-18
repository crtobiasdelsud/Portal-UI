# ADR-NNNN: Titulo corto y descriptivo

- **Estado:** proposed | accepted | superseded by ADR-NNNN | deprecated | rejected
- **Fecha:** YYYY-MM-DD
- **Decisores:** nombres o roles que aprobaron la decision
- **Unidad:** `Portal-UI`
- **Decision asociada (discovery):** D-NN (opcional)
- **Supersede:** ADR-MMMM (si aplica)
- **Superseded by:** ADR-MMMM (si aplica)
- **Fecha de revision:** YYYY-MM-DD (obligatoria si hay seccion "Excepcion a regla OBLIGATORIA")
- **Bump version:** patch | minor | major (si aplica al cierre del ADR)

> Este archivo es plantilla. NO es un ADR real, no se cuenta en la numeracion. Copiar a `NNNN-titulo-en-kebab.md` y rellenar.

## Contexto

Que problema o situacion motivo esta decision. Restricciones externas, tecnicas, de negocio. Que intentamos resolver y por que ahora.

## Alternativas evaluadas

Minimo 2 opciones reales. Para cada una: breve descripcion, pros y contras, por que se descarto.

1. **Alternativa A** — descripcion + por que no.
2. **Alternativa B** — descripcion + por que no.
3. (opcional) **No hacer nada** — por que no es opcion viable.

## Decision

Afirmacion clara, no debate.

## Consecuencias

- **Positivas** — beneficios concretos esperados.
- **Negativas** — costos y limitaciones aceptados.
- **Impacto sobre consumidores** — Next.js (`editor-template-front`), Vite (`cms-editor-front`). Que tienen que cambiar.
- **Bump de version requerido** — patch / minor / major. Justificacion.
- **Mantenibilidad** — impacto en el dia a dia.
- **Performance** — si aplica (bundle size, runtime cost).
- **Seguridad** — si aplica.

Borrar las dimensiones que no apliquen.

## Excepcion a regla OBLIGATORIA (si aplica)

Llenar SOLO si esta decision rompe una regla OBLIGATORIA de un standard global del equipo.

- **Regla violada:** standard + seccion + texto literal de la regla.
- **Justificacion:** constraint especifico que impide cumplirla.
- **Mitigacion:** que se aplica para minimizar el riesgo asumido.
- **Fecha de revision:** YYYY-MM-DD.
- **Revisor externo al equipo:** nombre o rol.

Si la decision NO rompe ninguna regla OBLIGATORIA, borrar esta seccion completa.

## Como se revierte o migra si falla

- **Plan:** pasos concretos para deshacer o cambiar la decision (con bump correspondiente).
- **Señales:** que indicaria que la decision esta fallando (error reports de consumidores, bundle bloat, runtime issues).
- **Costo cualitativo:** trivial / moderado / costoso / irreversible.

## Referencias

- Standards Nivel 1 relevantes: `<standard>.md`.
- ADRs relacionados de esta unidad: ADR-NNNN.
- Issues, PRs, threads externos (links).
