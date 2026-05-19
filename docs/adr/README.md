# ADR — `Portal-UI`

Architecture Decision Records para esta unidad. Compliant con el standard global de ADR vigente del equipo.

## Alcance

Decisiones arquitectonicas que afectan **exclusivamente** a esta unidad de despliegue. `Portal-UI` es libreria de componentes publicada a npm (`@crtobiasdelsud/portal-ui`).

Lo que NO va aca:

- Decisiones cross-cutting entre apps consumidoras -> documento maestro del proyecto o ADR de la app que adopta.
- Decisiones tomadas en discovery antes del primer release -> documento de discovery del proyecto (si existe).
- Decisiones triviales o reversibles -> commit message o conversacion.

## Estructura

```text
docs/adr/
├── README.md           (este archivo, indice)
├── 0000-template.md    (plantilla; NO es un ADR real, no contar como numerado)
├── 0001-<titulo>.md
├── 0002-<titulo>.md
└── ...
```

## Convenciones

- Numeracion **secuencial por unidad**, arrancando en `0001`, padding 4 digitos.
- Filename kebab-case: `0001-adapter-pattern-image-link-fetcher.md`.
- Estados validos: `proposed`, `accepted`, `superseded by ADR-NNNN`, `deprecated`, `rejected`.
- ADRs `accepted` son **inmutables** salvo correcciones tipograficas, links rotos o reformulacion menor (con anotacion).
- Si la decision cambia: escribir nuevo ADR que supersede al anterior, NO editar el aceptado.

## Cuando crear un ADR

OBLIGATORIO cuando la decision:

- Cambia la API publica del paquete (signature de componente, hook, context).
- Cambia el patron de adapters (`Image`, `Link`, `fetcher`) o el shape de cualquier context expuesto.
- Introduce dependencia runtime nueva (peer dep o runtime). Recordar: `Portal-UI` ship-ea `.jsx` + `.scss` crudo, peer deps solo.
- Rompe back-compat de un componente publicado -> requiere bump **major** y ADR.
- Define **excepcion** a una regla OBLIGATORIA de un standard global del equipo.

RECOMENDADO cuando:

- Se elige entre dos patrones de composicion (split data/view vs all-in-one) que no es obvio para nuevos consumidores.
- Se introduce convencion que rompe la actual (imports relativos, `'use client'` policy, contexts internos).

## Cuando NO crear un ADR

- Bug fixes que no cambian la API publica.
- Componente nuevo que respeta convenciones existentes.
- Cambios de estilos SCSS internos.

## Promocion a CHANGELOG

ADR aceptado -> entrada en `Portal-UI/CHANGELOG.md` seccion `Decisions`:

```markdown
### Decisions
- ADR-0001 — Adapter pattern (Image, Link, fetcher) ([0001-adapter-pattern.md](docs/adr/0001-adapter-pattern.md))
```

Recordatorio: cualquier breaking change (rename prop, remove export, cambio signature) requiere bump **major** + aviso explicito a `editor-template-front` y `cms-editor-front`.

## Conflictos con standards globales

Orden de precedencia:

1. **Standards globales Nivel 1 del equipo ganan** sobre cualquier ADR de unidad.
2. **Excepcion a regla OBLIGATORIA** requiere ADR con seccion "Excepcion a regla OBLIGATORIA" completa.
3. **Conflicto entre dos ADRs de esta unidad**: el mas nuevo gana solo si supersede explicitamente al anterior.
4. **Conflicto entre ADR de unidad y discovery del proyecto**: discovery gana salvo que un ADR cross-cutting nuevo lo supersede.

## Revision obligatoria

- Todo ADR debe ser revisado por al menos **una persona distinta del autor**.
- Si el ADR rompe regla OBLIGATORIA: revisor debe ser **externo al equipo**.
- Revisor queda registrado en campo `Decisores` del header.

## Numeracion: regla de no reuso

- Numeros son **reservados permanentemente** una vez asignados, incluso si el ADR queda en `rejected`.
- NO renumerar borrando un ADR del medio.
- NO reusar el numero de un ADR `rejected`.

## Indice

| ADR | Titulo | Estado | Fecha |
|-----|--------|--------|-------|
| 0001 | <pendiente del primer ADR real> | — | — |
