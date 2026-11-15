# Calidad, skills y aceptación

Estado: estrategia general de calidad; fase 1 con pruebas locales registradas en
`fase-1.md`. La matriz completa sigue pendiente: no se declara conformidad WCAG o SEO.

## Aplicación de las 14 skills instaladas

Inventario confirmado con `npx skills list`. Se leyeron sus instrucciones locales.
La petición de usarlas no significa ejecutar catorce procesos incompatibles ni añadir
funcionalidades: cada una aporta en su dominio y en la fase que corresponde.

| Skill | Aplicación en este planeamiento | Evidencia o entrega posterior |
|---|---|---|
| `brainstorming` | Reutilizar entrevista, comparar enfoques, distinguir propuestas y aprobación | `PRODUCT.md`, decisiones del plan y revisión independiente del documento |
| `find-skills` | Comprobar inventario y cobertura antes de buscar más herramientas | Catorce skills tras las tres instalaciones solicitadas; ninguna adicional necesaria |
| `ponytail` | Stack existente, dependencias mínimas y alcance completo acotado | Sin panel/base de datos prematuros; pruebas pequeñas de lógica no trivial |
| `cro` | Resolver desconfianza/dudas, priorizar catálogo y reducir campos | Flujo en `experiencia.md`, formulario de destino mínimo, hipótesis de medición |
| `frontend-design` | Propuesta visual específica de objetos minimalistas, copy concreto | Brief visual; evitar métricas/testimonios decorativos; propuesta antes de UI |
| `impeccable` | Separar verdad de producto, brief y sistema visual; revisión al terminar | `PRODUCT.md` ahora; propuesta/validación visual y `DESIGN.md` al construir |
| `ui-ux-pro-max` | Consulta local de sistema y evaluación de ajuste al negocio | Se aceptan legibilidad/contraste/controles; se rechaza storytelling con scroll |
| `accessibility` | Definir criterios WCAG 2.2 AA y pruebas manuales | Teclado, foco, etiquetas, estados, zoom y contraste; no basta un puntaje |
| `seo-audit` | Priorizar dominio/catálogo real frente a claims o indexación supuesta | Hallazgos de origen, ausencia de métricas y límites de fichas con JS |
| `seo` | Canonical, metadata, robots/sitemap, imágenes y schema exacto | Pruebas de HTML/renderizado/HTTP y validación externa posterior |
| `security-review` | Límites de confianza y revisión del flujo comercial | Allowlist, DOM seguro, importes no autoritativos y pago manual verificado |
| `copywriting` | Edición puntual de copy funcional, diagnóstico C | Mensajes claros de error/vacío/reintento y «Consultar por WhatsApp», sin prometer compra completada |
| `marketing-psychology` | Reducir incertidumbre y carga cognitiva con información comprobada | Stock/origen de fotos explícitos; sin escasez o prueba social inventadas |
| `pricing` | Separar precio final, costo de transporte y cotización por volumen | Se elimina «Desde»; costos y precio tienda privados; fórmulas conservadas |

### Uso y límites de herramientas

- `npx skills list` reporta diferencias respecto del lock en accessibility,
  frontend-design y seo. Se conserva el estado local; no actualizar/restaurar
  automáticamente ni confundir diferencias con una vulnerabilidad.
- La skill local Impeccable declara v4.9.1; la global cargada anteriormente era
  otra versión. En la implementación se priorizarán referencias del proyecto.
- La consulta UI/UX se ejecutó sin persistir un sistema visual automáticamente.
  No hay stack vanilla en su catálogo de stacks: no se impone Tailwind por ello.
- Brainstorming menciona `writing-plans`, que no está instalada; se documenta
  el plan directamente, sin fingir una invocación ni instalarla sin necesidad.
- La fase actual no ejecuta auditoría visual de una UI futura ni detector sobre
  archivos sin modificar. Se programan para cuando exista el rediseño.

## Seguridad y datos

- La API pública de catálogo es una frontera de confianza. Validar en origen y
  consumidor; no interpolar nombres, categorías, URLs o descripciones en HTML/eventos.
- Probar texto con `<`, comillas, apóstrofes, caracteres Unicode y cadenas largas.
  Verificar que aparecen como texto y que no ejecutan handlers.
- No publicar costos, márgenes, notas o encabezados arbitrarios al añadir columnas.
- Cantidades/precios en navegador son editables: solo resumen orientativo. Juan
  confirma el precio y verifica movimientos reales de Yape/Plin.
- No subir comprobantes, introducir credenciales o crear escritura anónima.
- Revalidar selección al enviar; no reservar stock mediante localStorage ni usar
  una captura de pago como estado pagado.
- Informar hallazgos con evidencia y nivel de confianza. Permisos de Sheets,
  implementación remota y origen editable de datos requieren verificación de Juan;
  no afirmar un exploit por encontrar `innerHTML` por sí solo.

## Accesibilidad y experiencia

- Botones nativos para filtros/acciones, enlaces reales para navegación; foco visible.
- Texto normal ≥4,5:1, texto grande ≥3:1 y controles/foco ≥3:1. Tamaño grande WCAG:
  18 pt (~24 CSS px) o 14 pt en negrita (~18,7 px), no 18 px sin negrita.
- Objetivo cómodo de toque 44 × 44 CSS px; comprobar espaciado y mínimo WCAG.
- Labels visibles, errores junto al campo, `aria-invalid` cuando corresponda y
  anuncio de resultados/cambios sin mover foco arbitrariamente.
- Enlace para saltar al contenido, encabezados/landmarks semánticos y orden lógico.
- Zoom 200 %, reflow a 320 CSS px, contenido largo, sin scroll horizontal accidental.
- Movimiento reducido, sin carruseles automáticos; controles visibles en teclado/táctil.
- No pedir teléfono/email/DNI que WhatsApp ya permite coordinar después.

## SEO y rendimiento

- Dominio único: `https://3dcix.vercel.app`; revisar canonical, OG, JSON-LD,
  enlaces, robots y sitemap. No eliminar verificación de Google sin conocer su uso.
- Descripciones de tienda reales, no promesas de prototipado/garantías sin respaldo.
- `Product` y `Offer` solo para producto visible y datos válidos. No usar siempre
  `InStock`, reviews ficticias ni precios mayoristas internos. Limpiar schema obsoleto.
- Ficha con ID comparte estado; no garantiza preview social o indexación por producto.
  Sitemap inicial solo incluye URLs canónicas intencionalmente indexables; revisar
  la ficha dinámica antes de añadir URLs, sin anunciar que ya son páginas SEO.
- Fotos con espacio reservado, alt descriptivo, formatos/tamaños adecuados,
  lazy-loading bajo el primer viewport; no priorizar todas las tarjetas.
- Registrar LCP/CLS y auditoría de laboratorio con entorno; INP necesita evidencia
  de uso/campo. Objetivos de referencia: LCP ≤2,5 s, CLS ≤0,1, INP ≤200 ms,
  no resultados prometidos antes de medir.
- La indexación y los resultados enriquecidos quedan sujetos a Google. No atribuir
  ranking a metakeywords ni al puntaje de Lighthouse.

## Medición mínima propuesta

Registrar después de elegir/configurar una herramienta: `product_view`, `add_to_order`,
`volume_quote_click`, `whatsapp_click`, `catalog_load_error`. Propiedades permitidas:
ID de producto, categoría, cantidad o tramo y tipo de recorrido. Nada de nombre,
dirección, mensajes, comprobantes o texto de búsqueda libre.

El clic a WhatsApp es intención, no venta. Ventas confirmadas y recurrencia requieren
un registro manual posterior; no existe sincronización automática acordada.
No instalar una herramienta o plan de pago como supuesto de esta fase.

## Matriz de aceptación prevista

| ID | Escenario | Resultado requerido |
|---|---|---|
| T1 | Hoja con filas vacías y productos válidos | Válidos visibles, sin caída ni categorías vacías |
| T2 | API inválida, HTML de Google, timeout o error HTTP | Error claro, reintento y contacto; no falso catálogo vacío |
| T3 | Arreglo vacío | Estado vacío sin productos históricos de respaldo |
| T4 | Precio inválido, ID duplicado o imágenes maliciosas | Rechazo según contrato, sin ejecución ni precio cero inventado |
| T5 | Nueva columna privada en Sheets | No aparece en la respuesta JSON |
| T6 | Borrador, stock desconocido, agotado o bajo pedido | No publicar borrador ni prometer disponibilidad/plazo |
| T7 | 19 y 20 unidades del mismo ID | Individual frente a cotización por volumen |
| T8 | 10 + 10 del mismo ID en colores distintos; 10 + 10 de IDs distintos | Primer caso consulta; segundo no promete descuento por volumen |
| T9 | Cantidad 0, negativa, decimal, NaN o fuera de rango seguro | Validación visible; sin total no finito ni bloqueo silencioso |
| T10 | S/ 29 × 1; total con número impar de céntimos | 50 % orientativo y saldo suman el total exactamente |
| T11 | Lista guardada, precio cambiado o producto retirado | Revalidación y revisión antes de contactar |
| T12 | Almacenamiento bloqueado/corrupto, refresh y Atrás | Continuidad en memoria o recuperación explicada, sin caída |
| T13 | WhatsApp no disponible o mensaje excesivamente largo | Copiar resumen; no afirmar envío ni vaciar lista |
| T14 | Pedido mixto con una línea de volumen | Todo como consulta; no solicitar adelanto de total no confirmado |
| T15 | Navegación de teclado, zoom, móvil y movimiento reducido | Flujo completo, foco no cubierto, controles con nombres |
| T16 | Catálogo real y schema renderizado | Datos coinciden, sin stock/precios/reseñas inventados |
| T17 | Preview y producción | Dominio/recursos correctos; docs/costos/herramientas fuera de salida pública |
| T18 | Foto, saldo y transporte | Copy distingue saldo antes del despacho de flete pagado en destino |
| T19 | Stock 10, dos colores del mismo ID con 6 unidades cada uno | Consulta completa por exceso agregado, aunque cada línea sea menor que 10 |
| T20 | Endpoint antiguo sin campos normalizados; otra implementación pública previa | Payload rechazado en producción; ninguna URL exporta datos internos |

Usar pruebas unitarias pequeñas con Node para parsers/importes/mensajes y mocks
de Apps Script; recorridos de navegador con fixtures claramente separados del
catálogo público. Al implementar, elegir un runner mínimo compatible con el entorno.
Registrar comando, resultado y pendientes, sin decir que fixtures prueban stock real.

## Revisión y cierre

El plan pasó una revisión independiente de construcción. Se detectaron y corrigieron
tres ambigüedades: payload legado en producción, exposición mediante implementaciones
antiguas y stock agregado entre variantes. Esto es revisión documental. Las pruebas
de fase 1 cubren parte de la matriz; T7–T14 del flujo de pedido y las comprobaciones
remotas siguen pendientes. Ver evidencia y límites en `fase-1.md`.

Antes de construir, revisar el plan desde la perspectiva de quien lo ejecutará.
Al construir, revisión visual agrupada en escritorio y móvil, correcciones en lote
y confirmación acotada. Revisar la UI real con las referencias locales de Impeccable.
Auditoría automática cuando esté disponible + teclado/manual; un puntaje no certifica WCAG.

Para lanzar: producto vigente, permisos/endpoint comprobados, política comercial
aprobada, matriz ejecutada, documentación actualizada y autorización de publicación.
No realizar commit, push, promoción o cambios remotos solo por aprobar un plan.
