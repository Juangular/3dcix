# Plan de primera versión

Estado: fases 1–3 publicadas. Juan aprobó comenzar datos y catálogo. Fecha: 15 de noviembre de 2026.
Estado de cada release y cambios locales pendientes: `lanzamiento.md`.

## Objetivo y alcance

Convertir la web de servicios en una tienda de productos minimalistas que permita
elegir un producto informado, preparar una solicitud y continuar por WhatsApp.
Reducir carga administrativa conservando Google Sheets inicialmente.

### Incluido

- Corregir la lectura de productos, sus errores y el dominio de referencia.
- Catálogo con búsqueda, categorías, campaña opcional y disponibilidad honesta.
- Ficha compartible con imágenes, medidas, material, colores y cantidad.
- Lista de pedido con variantes, importes y destino mínimo para cotizar transporte.
- Ruta por volumen desde veinte unidades del mismo producto, sin descuento inventado.
- Resumen de WhatsApp; instrucciones separadas de pago del producto y transporte.
- API de solo lectura con campos permitidos y plantilla/documentación de Sheets.
- Pruebas de reglas, revisión móvil/escritorio, accesibilidad y SEO técnico.
- Plan de medición de intención y operación diaria.

### Fuera de esta primera versión

Panel administrativo propio, cuentas de clientes, reservas de inventario,
verificación automática de Yape/Plin, cobro integrado, bot de WhatsApp, tarifas
de transporte en tiempo real, carga de STL, ERP y generación autónoma de productos.
No se cambian las fórmulas comerciales ni se añaden servicios pagos sin autorización.

## Estado actual y evidencia

| Evidencia | Consecuencia para el plan |
|---|---|
| `script.js:65–78`: `fetch` sin validación, fallo solo en consola | Normalización, tiempo de espera y recuperación visible |
| `script.js:118`: se asume que `img` es un arreglo | Aislar filas inválidas; no interrumpir el catálogo completo |
| `doGet()` suministrado devuelve todas las columnas y filas | Lista explícita de campos públicos y publicación controlada |
| `script.js:90`: filtros como `span onclick` | Botones nativos, estado seleccionado y navegación por teclado |
| `script.js:116–134`: interpolación de datos remotos en HTML | Texto seguro, URLs permitidas y eventos sin cadenas interpoladas |
| Canonical, sitemap y enlaces apuntan a GitHub Pages | Unificar dominio público en Vercel |
| Se declara todo producto `InStock` | Reflejar solo disponibilidad confirmada |
| `README.md` anterior contiene dos líneas | Añadir instrucciones operativas y comprobables |
| Web de Vercel recuperada durante este planeamiento | El antiguo 404 no demuestra caída de la web real |

Los 27 registros/19 filas vacías y los tamaños de imágenes son observaciones de la
revisión previa, no nuevas mediciones. El sitio no tiene auditoría de rendimiento
de campo ni una tasa de conversión conocida. Un patrón de HTML inseguro requiere
verificar permisos de entrada antes de declararlo una vulnerabilidad explotable.

## Enfoques considerados

| Enfoque | Beneficio | Costo o límite | Decisión |
|---|---|---|---|
| Web estática + Sheets + Apps Script | Reutiliza código y administración, pocos servicios | Stock y pagos manuales; API externa | Base previamente aprobada; recomendada nuevamente |
| Panel + base de datos + backend | Mayor control e inventario/pedidos persistentes | Autenticación, mantenimiento y migración | Posponer hasta tener necesidad medida |
| Plataforma de comercio gestionada | Administración y checkout ya disponibles | Costos y adaptación a Yape/Plin/volumen | No elegida para el presupuesto y flujo actual |

## Arquitectura propuesta

```text
Juan → Sheets privado (PRODUCTOS-FB + costos internos)
                 ↓ doGet con lista de campos públicos
             JSON público normalizado
                 ↓ validación en navegador
Vercel → HTML + CSS + JS → Catálogo / Ficha / Mi pedido
                                           ↓
                           resumen → WhatsApp → confirmación manual
```

Sin framework nuevo. Separar lógica pura de catálogo/importes/mensajes de la
manipulación del DOM solo donde facilite pruebas; no crear capas para uso futuro.
Apps Script no recibe pedidos ni ofrece escritura pública.

### Rutas, persistencia y límites

- Propuesta inicial: `/`, `/producto.html?id=<id-estable>`, `/pedido.html`.
  La ficha es una página real del mismo sitio, sin depender de un modal.
- Búsqueda/categoría/página en parámetros; Atrás restaura el estado.
- Lista guardada localmente: ID, variante, cantidad y referencia de precio, con versión
  del formato. El precio guardado solo sirve para detectar cambios; no es autoritativo.
  Datos de destino en memoria durante la sesión; sin comprobantes ni dirección
  completa persistida. Si falla localStorage se usa sessionStorage; si ambos fallan,
  la consulta individual por WhatsApp sigue disponible sin lista entre páginas.
- Reconsultar catálogo al revisar/enviar la lista. Precios modificados o productos
  retirados requieren revisión visible; nunca confiar en importes de localStorage.
- El resumen es una solicitud, no un pedido registrado en servidor. Una referencia
  local no prueba reserva, envío de WhatsApp ni recepción por Juan.
- Cotización si la cantidad agregada de un mismo ID llega al umbral, o alguna
  línea no tiene disponibilidad/precio confirmados. No mostrar un total negociado
  ni adelanto exigible en ese caso.
- El stock es total orientativo por ID, no por color: comparar con la suma de
  todas sus líneas. Superarlo deriva el pedido completo a consulta; cada color
  se confirma en WhatsApp. No se presupone inventario por variante.
- Una ficha por query es compartible, pero depende de JS: no promete metadatos
  sociales por producto ni indexación independiente. Páginas prerenderizadas
  serían una mejora posterior, con sincronización y compilación explícitas.

## Decisiones y cuestiones abiertas

| ID | Decisión | Estado |
|---|---|---|
| D1 | Mantener stack estático, Vercel, GitHub y Sheets inicialmente | Aprobada previamente; se conserva como base |
| D2 | Cierre por WhatsApp, verificación manual, transporte separado | Confirmada por Juan |
| D3 | Desde 20 unidades del mismo producto se cotiza | Confirmada por Juan |
| D4 | Mismo ID suma colores para detectar volumen; cotización sin descuento automático | Propuesta conservadora; mezcla de colores pendiente comercialmente |
| D5 | Mostrar 50 % orientativo; solicitar confirmación antes de transferir | Propuesta para stock/precios no transaccionales y excepciones de Juan |
| D6 | Un endpoint de solo lectura; no publicar costos ni datos de compradores | API nueva publicada; implementación antigua aún accesible, ver `lanzamiento.md` |
| D7 | Publicar productos solo con consentimiento explícito en la hoja migrada | Implementado: casilla true; no borrar ni reactivar catálogo antiguo |
| D8 | Dirección visual y paleta definitivas | Aprobadas e implementadas localmente y en preview |
| D9 | Herramienta de analítica y activación en producción | Pendientes; no asumir acceso o plan gratuito suficiente |
| D10 | API antigua solo para fixtures/preview; producción exige el contrato nuevo y publicación explícita | Implementado: respuesta antigua rechazada, sin fallback |

## Fases y entregables

| Fase | Trabajo y archivos previstos | Salida verificable |
|---|---|---|
| 0. Aprobación | Este plan; reglas y campos | Aprobado para datos y catálogo |
| 1. Datos | `apps-script/Código.gs`, `catalog-data.js`, plantilla, pruebas y salida pública permitida | API nueva publicada y probada; implementación antigua pendiente de coordinación |
| 2. Experiencia | Propuesta visual; `index.html`, `producto.html`, `styles.css`, JS | Implementado y publicado; ver `fase-2.md` |
| 3. Pedido | `pedido.html`, cantidades, importes, persistencia, WhatsApp | Implementado y publicado; ver `fase-3.md` |
| 4. Operación | Guía de Sheets, cálculo existente, fotos y borradores | Guía y plantilla de costos privadas preparadas; contenido final por revisar |
| 5. Calidad y SEO | Dominio, metadata, schema, sitemap, medición acordada | Matriz de calidad ejecutada; incidencias y resultados registrados |
| 6. Publicación | Preview Vercel, actualización manual de Apps Script y datos | Deployment READY; API heredada y reglas comerciales siguen pendientes |

El código fuente de Apps Script se entregará en el repositorio, pero no se
despliega allí automáticamente. Los tests pueden usar su entorno simulado.
Cada fase se termina con sus comprobaciones; no hay fechas o costos inventados.

## Dependencias reales de Juan

Se puede construir y probar sin esperar un catálogo completo. El lanzamiento
comercial requiere al menos un producto vigente con fotos, datos y precio
aprobados; publicación del nuevo Apps Script desde su cuenta; reglas reales de
defectos/cancelación y revisión de datos de contacto. No prometer devolución,
garantía, recogida presencial ni atención inmediata sin confirmación.

## Seguimiento de documentación

La revisión independiente del plan identificó tres brechas, ya incorporadas:
compatibilidad antigua limitada a pruebas, retirada de endpoints que exportan
columnas sin filtro y agregación de cantidades por ID al verificar stock.

Después de aprobar: actualizar estado y decisiones; al implementar, registrar
archivos/comandos reales y resultados. Al terminar el diseño: `DESIGN.md` describe
lo construido. No se instalará `writing-plans` solo porque brainstorming la
referencia: no está instalada; el plan detallado queda escrito aquí.
