# Instrucciones para trabajar en 3DCIX

## Antes de cada cambio

1. Lee `PRODUCT.md` para respetar hechos, límites comerciales y activos confirmados.
2. Lee `docs/skills.md` y selecciona las skills cuyo activador coincida con la tarea.
   Abre su `SKILL.md` antes de aplicarlas. No ejecutes las 15 mecánicamente: usa
   todas las necesarias para el cambio y no fuerces las que no aporten.
3. Revisa los archivos relacionados y el estado del repositorio antes de editar.
4. Sigue las pruebas y criterios definidos en `docs/calidad-y-skills.md` y documenta
   resultados reales, fallos y límites.

## Selección y aplicación de skills

- Para un cambio de diseño/interfaz, aplica **en conjunto** las cuatro skills del
  paquete visual: `frontend-design`, `impeccable`, `ui-ux-pro-max` y `accessibility`.
  No elijas solo una. Añade las skills comerciales, de contenido, imagen o SEO
  que correspondan al componente afectado, según `docs/skills.md`.
- Para cambios de seguridad/datos, aplica `security-review` y `ponytail` juntos;
  suma `accessibility`, `seo`/`seo-audit` e `image` cuando el cambio afecte también
  la interfaz pública, indexación o activos.
- Para cambios de conversión/oferta, aplica en conjunto `cro`, `copywriting` y
  `marketing-psychology`; añade `pricing` si cambia precio, adelanto o descuento.
- En revisiones de calidad visual, aplica el paquete visual completo y sus pruebas
  manuales/automáticas. En calidad de datos/código, `ponytail` más las skills de
  seguridad, SEO o negocio cuyos límites toque la modificación.
- La combinación significa leer y aplicar las instrucciones de todas las skills
  coincidentes; no ejecutar comandos redundantes si la skill no los requiere.
- En cambios que afecten compra, oferta o conversión, combina las skills pertinentes
  de conversión, copy, psicología y precios; conserva solo claims verificables.
- En cambios de interfaz, cubre diseño y accesibilidad; revisa el resultado en
  móvil, tablet y escritorio cuando corresponda.
- En catálogo/API, cambios de datos externos, HTML dinámico o publicación, aplica
  seguridad y las comprobaciones de datos/SEO que afecte el cambio.
- Para código, prioriza la solución completa más pequeña, sin dependencias nuevas
  no aprobadas, y prueba la lógica no trivial.
- No generes imágenes de IA que puedan confundirse con una fotografía real de un
  producto en venta. Marca como ilustrativa cualquier escena generada.

## Cambios de diseño o alcance

Usa `brainstorming` para trabajo creativo no trivial. Si la tarea implica una
dirección visual nueva o reemplazar la existente, presenta la propuesta y espera
aprobación antes de implementarla. Respeta el flujo aprobado en `docs/plan.md` y
`docs/experiencia.md`; no vuelvas a preguntar decisiones ya confirmadas.

## Instalación de skills

Si Juan pide buscar o instalar skills:

1. Usa `.agents/skills/find-skills/SKILL.md`: identifica la brecha, revisa
   `skills.sh`, busca y verifica pertinencia, reputación y auditorías.
2. Instala solo la opción o opciones útiles solicitadas con `npx skills add`.
3. Comprueba que aparezcan en `.agents/skills/` y `skills-lock.json`.
4. Añade cada skill a `docs/skills.md` en el grupo y activador correctos. Actualiza
   cualquier referencia al inventario total. No edites el contenido de skills
   de terceros para resolver sus advertencias de estilo.

## Cierre

Resume qué skills aplicaste y por qué, pruebas ejecutadas, resultados, cambios
externos pendientes y si el cambio se publicó. No hagas commit, push o despliegue
sin una solicitud explícita del usuario.
