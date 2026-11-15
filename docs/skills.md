# Skills del proyecto

Inventario contrastado con `.agents/skills/` y `skills-lock.json` el 15 de noviembre
de 2026. Hay **15 skills instaladas**. Este índice determina qué aplicar en cada
cambio; `AGENTS.md` exige consultarlo antes de trabajar.

## 1. Descubrimiento y alcance

| Skill | Aplicar cuando |
|---|---|
| `find-skills` | Juan pide buscar, comparar o instalar capacidades adicionales. Usar el catálogo, comprobar reputación/instalaciones/seguridad y clasificar cada alta. |
| `brainstorming` | Se propone una funcionalidad, experiencia o dirección creativa que no esté completamente especificada. Aclarar intención y aprobar el diseño antes de construir. |

## 2. Tienda, conversión y comunicación comercial

| Skill | Aplicar cuando |
|---|---|
| `cro` | Se cambia el recorrido de catálogo, ficha, lista de pedido, cotización o conversión a WhatsApp. |
| `copywriting` | Se redactan o reescriben encabezados, descripciones, etiquetas, CTAs, metadatos y mensajes de venta. Los claims requieren evidencia. |
| `marketing-psychology` | Se abordan objeciones como confianza en el adelanto, riesgo percibido, elección y prueba social. Persuadir sin escasez falsa, presión ni testimonios inventados. |
| `pricing` | Se cambian precios, adelanto, descuentos desde 20 unidades o condiciones de revendedor. No inventar porcentajes ni modificar la fórmula acordada sin revisión de Juan. |

## 3. Diseño, imágenes y accesibilidad

| Skill | Aplicar cuando |
|---|---|
| `frontend-design` | Se crean o rediseñan páginas, componentes o una identidad visual web. |
| `impeccable` | Se decide, documenta, critica o pule la experiencia visual; respetar su flujo, aprobación, responsive y revisión final. |
| `ui-ux-pro-max` | Se requiere consultar sistemas de diseño, patrones, tipografía, color o interacción. Verificar que el resultado aplica a este sitio estático y no migrar de stack por recomendación automática. |
| `accessibility` | Se cambia navegación, filtros, galería, formularios, mensajes dinámicos, foco o comportamiento móvil. Aplicar criterios WCAG y revisión manual; un score no equivale a conformidad. |
| `image` | Se fotografían, editan, dimensionan, comprimen o sirven activos del catálogo y material de marketing. Priorizar fotos reales de cada producto; imágenes generadas solo para contexto/marketing y claramente distintas de evidencia del producto. |

## 4. Visibilidad en buscadores

| Skill | Aplicar cuando |
|---|---|
| `seo` | Se cambian canonical, títulos, metadatos, robots, sitemap, imágenes o datos estructurados. Verificar salida renderizada y URLs reales. |
| `seo-audit` | Se investigan indexación, SEO local, contenido, rendimiento de búsqueda o errores de Search Console. Distinguir hipótesis de evidencia y no prometer rankings. |

## 5. Código, mantenimiento y seguridad

| Skill | Aplicar cuando |
|---|---|
| `ponytail` | Toda tarea de código: resolver el objetivo completo con la menor complejidad, reaprovechar HTML/CSS/JS y añadir una prueba pequeña a lógica nueva no trivial. |
| `security-review` | Se tocan entrada/salida de Sheets o Apps Script, URLs e imágenes externas, mensajes, almacenamiento local, pagos o límites de confianza. Reportar vulnerabilidades solo con evidencia de explotabilidad. |

## Combinaciones frecuentes

### Paquetes que se aplican juntos

Cuando un cambio entra en uno de estos dominios, lee y aplica **todas** las skills
del paquete indicado; no basta elegir una skill representativa:

- **Diseño, rediseño o calidad de interfaz:** `frontend-design` + `impeccable` +
  `ui-ux-pro-max` + `accessibility`. Si la interfaz es de venta, añade además
  `cro`, `copywriting` y `marketing-psychology`; usa `pricing` si toca precios.
- **Seguridad/calidad en datos, API o almacenamiento:** `security-review` + `ponytail`.
  Añade `accessibility` para superficies operables; `seo`/`seo-audit` para datos
  indexables; `image` para URLs, carga o procesamiento de imágenes.
- **Conversión y mensajes de venta:** `cro` + `copywriting` + `marketing-psychology`;
  `pricing` se suma si se diseñan precios, descuentos, adelantos o condiciones.
- **Fotografía y recursos del catálogo:** `image` + `frontend-design` +
  `accessibility`; añade `seo`/`seo-audit` por alt, formatos, tamaño, metadatos o
  rendimiento; `cro` si se evalúa su papel en la compra.
- **Descubrir/instalar skill:** `find-skills` guía la búsqueda, verificación e
  instalación. Después documenta el grupo, activador y combinaciones aquí.

`brainstorming` se añade antes de cualquier trabajo creativo no trivial y conserva
su aprobación previa a implementación cuando corresponda. `ponytail` acompaña cambios
de código para limitar alcance y probar lógica no trivial. Las skills no pertinentes
al cambio se omiten; los paquetes anteriores impiden reducir una tarea multidominio
a una sola skill.

| Cambio | Skills principales | Complementar si aplica |
|---|---|---|
| Nueva página o rediseño | `brainstorming`, `frontend-design`, `impeccable`, `ui-ux-pro-max` | `accessibility`, `cro`, `copywriting`, `seo` |
| Búsqueda, ficha o lista de pedido | `ponytail`, `cro` | `copywriting`, `marketing-psychology`, `pricing`, `accessibility`, `security-review` |
| Cambio de catálogo o Apps Script | `ponytail`, `security-review` | `accessibility`, `seo`, `seo-audit`, `image` |
| Precio o descuento por volumen | `pricing`, `marketing-psychology` | `copywriting`, `cro`, `ponytail` |
| Imágenes del producto | `image` | `accessibility`, `seo`, `cro`; no reemplazar evidencia por renders generados |
| Encontrar una skill | `find-skills` | Actualizar este índice; `skills-lock.json` lo actualiza la CLI |

Las combinaciones son orientación, no una lista que ejecutar a ciegas. Lee cada
`SKILL.md` aplicable; respeta instrucciones específicas, restricciones de seguridad
y los flujos de aprobación. Si dos skills chocan, los hechos del producto y la
petición aprobada tienen prioridad sobre sugerencias generales de una skill.

## Procedimiento para futuras altas

1. Confirmar una brecha del trabajo y buscar skills antes de instalar.
2. Preferir skills específicas, activas, con fuente y auditoría comprensibles.
   Rechazar alternativas que exijan una herramienta/cuenta/costo no justificado.
3. Instalar solo con autorización de Juan; verificar carpeta y lockfile.
4. Leer la skill, añadirla a uno de los grupos anteriores y registrar el activador
   y sus límites; corregir el inventario total.
5. Actualizar `AGENTS.md` solo si la skill añade una regla transversal. En tareas
   posteriores, aplicar la nueva skill cuando su activador coincida.

## Skills consideradas y no instaladas

La búsqueda encontró `101-skills/superpowers@product-photography` (65,6 mil
instalaciones), pero su repositorio mostraba 23 estrellas y el flujo requiere el
CLI externo `belt`/inference.sh para generar imágenes. Para 3DCIX se eligió `image`
de `coreyhaines31/marketingskills` (98,1 mil instalaciones, 60,3 mil estrellas,
auditorías publicadas aprobadas): cubre selección de método, edición y optimización
sin obligar a generar fotos falsas ni adoptar un servicio externo.
