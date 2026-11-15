# Fase 2: catálogo y ficha

Juan aprobó una tienda clara, minimalista y centrada en el producto. Implementación
local: inicio rediseñado, búsqueda, filtros, ficha compartible, galería, cantidades,
color, disponibilidad y consulta por volumen desde 20 unidades. La API real se
consultó desde el navegador: devolvió el producto ID 1, S/ 29, stock 1 y una imagen
etiquetada como referencia. La medida `12x12x12` aún necesita unidad en Sheets.

La ficha envía una consulta individual a WhatsApp con producto, ID, color y cantidad;
es una solicitud, no reserva ni pago. El precio por volumen se confirma manualmente.
La lista de varios productos, añadir al pedido y su resumen siguen pendientes de la
fase 3: no se ha creado un botón simulado ni se ha incluido una navegación inoperante.

Se aplicaron criterios de copywriting (acciones y condiciones claras), psicología
de compra (stock e imágenes transparentes), pricing (precio final y envío separado),
accesibilidad (semántica, etiquetas, foco y movimiento reducido), seguridad (DOM
con textContent, URLs validadas), SEO (canonical y sitemap del dominio real; ficha
dinámica noindex) y el lenguaje visual aprobado. Los datos y pruebas anteriores se
conservan. No se ha desplegado la web a Vercel.

## Verificación local

- `node --test tests/catalog-data.test.cjs`: 13 pruebas aprobadas.
- `node --check script.js`, `node --check producto.js` y `node tools/build.cjs`: correctos.
- Navegador con API real: una tarjeta, ficha y selección de 20 unidades; inspección
  de capturas de escritorio y móvil, sin desbordamiento observado.
- Con datos simulados: búsqueda sin resultados, producto encontrado, stock cero,
  campos desconocidos, producto inexistente y umbral 19/20. Ficha a 320 px sin
  desbordamiento observado. Estos casos no verifican una venta ni un pago real.
- Detector de Impeccable ejecutado: detectó contraste bajo de un elemento decorativo,
  texto pequeño y una tipografía editorial. Se ajustaron contraste y texto; se
  conserva la elección editorial aprobada. No equivale a auditoría WCAG completa.

## Adaptación posterior del catálogo

Se cambió a una columna en móviles de hasta 480 px, dos en tablet y tres en
escritorio ancho; las imágenes muestran la fotografía completa. Las tarjetas
resumen descripciones y la ficha conserva el texto íntegro. La búsqueda, categoría
y página se incluyen en la URL y se conservan al volver desde la ficha.

Se inspeccionó la salida local con la API real en anchos emulados de 320, 390, 768,
1024 y 1440 CSS px: sin desbordamiento horizontal observado. Se comprobó la búsqueda
«Messi», categoría «Deportes», apertura de ficha y retorno con ambos filtros.
Las 13 pruebas de catálogo y el build pasaron. El detector señaló la tipografía
editorial del encabezado, que se conserva, y un texto móvil pequeño, que se ajustó.
La revisión se hizo con navegador emulado; no sustituye pruebas en dispositivos físicos.
