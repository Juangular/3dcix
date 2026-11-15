# Fase 1: datos y catálogo

Fecha: 15 de noviembre de 2026. Estado: implementación local; Google y Vercel sin modificar.

## Entregado

- `catalog-data.js`: validación compartida entre navegador, Node y Apps Script.
  Precio numérico en céntimos, stock desconocido distinto de cero, imágenes seguras,
  rechazo de IDs duplicados/contrato antiguo y exportación por lista permitida.
- `apps-script/Código.gs`: endpoint de solo lectura. Exporta solo publicados con
  casilla boolean true. Los errores públicos son genéricos; el diagnóstico queda
  en Ejecuciones, sin publicar columnas internas.
- `templates/catalogo.csv`: encabezados sin productos inventados ni históricos.
- `script.js`: consumo con timeout de 15 segundos, reintento manual, vacío/error
  distintos, filtros con foco preservado, paginación acotada y schema actualizado.
  Datos remotos mediante DOM/textContent, sin interpolación de HTML o handlers.
- `index.html`/`styles.css`: estado de recuperación, semántica de filtros y lista,
  precio final sin «Desde», disponibilidad y origen de foto explícitos. Se conserva
  el diseño previo; el rediseño completo sigue en fase 2.
- `vercel.json` y `tools/build.cjs`: salida `dist/` con lista explícita de archivos
  públicos; excluye documentación, tests, Apps Script y herramientas de agentes.
  Es una preparación local, no una publicación de Vercel.

## Aplicación de las skills nuevas

- Copywriting, diagnóstico C (edición puntual): mensajes describen qué pasó y cómo
  recuperarse. El CTA consulta disponibilidad; no afirma haber comprado.
- Marketing Psychology: reducción de incertidumbre mediante stock conocido/desconocido,
  tipo de fotografía y confirmación previa al pago. Sin urgencia o reseñas ficticias.
- Pricing: se conserva el precio unitario final y se separa transporte. La tarifa
  mayorista y los costos no salen del endpoint. No se cambiaron fórmulas ni descuentos.

## Comprobaciones realizadas

`node --test tests/catalog-data.test.cjs`: **13 pruebas aprobadas**. Incluye selección
de publicados, columnas privadas, encabezados/IDs, filas inválidas, importes, stock,
opcionales, payload antiguo, URLs peligrosas, texto con HTML, errores/timeout de fetch
y `doGet()` ejecutado con un entorno simulado de Apps Script sin Node ni URL global.

`node --check script.js`, `node --check catalog-data.js` y `git diff --check`: aprobados.
`node tools/build.cjs`: aprobado; se inspeccionó `dist/`, que contiene únicamente
los siete archivos públicos previstos y `Assets/`, sin docs, skills, tests o Apps Script.

Navegador local con respuestas interceptadas, no catálogo comercial:

- 12 fixtures: diez tarjetas en página 1 y dos en página 2; filtro con apóstrofe funciona.
- Un nombre con `<img onerror=…>` aparece como texto, sin ejecución ni errores JS.
- Catálogo vacío muestra aviso sin reintento innecesario; error de API/contrato antiguo
  muestra reintento. Reintentar con respuesta válida recupera diez tarjetas.
- Schema se vacía al fallar y contiene doce elementos válidos al cargar. Stock
  desconocido no se marca `InStock`.
- Imagen rota muestra alternativa. Inspección en escritorio y móvil de 390 px;
  no se observó desbordamiento horizontal en ese escenario.
- Confirmación sobre la salida `dist/`: diez tarjetas, sin desbordamiento horizontal
  a 1440, 390 y 320 px. Filtro activado con Enter conserva foco y `aria-pressed`.
- Detector de Impeccable ejecutado una vez. Señala estética/contrastes heredados
  fuera del catálogo (hero, CTA, navegación). Se ajustaron contraste del filtro,
  categoría y CTA del catálogo; no se declara auditoría completa de la web.

## Pendientes para conectar y lanzar

1. Seguir `apps-script/README.md`: crear también `CatalogoDatos.gs` copiando el
   archivo compartido. Probar y publicar una nueva versión remota desde la cuenta de Juan.
2. Revisar/archivar otras implementaciones que puedan seguir exponiendo encabezados.
3. Migrar casillas y datos; marcar como publicado únicamente catálogo vigente aprobado.
4. Confirmar la URL `/exec`, actualizar `CONFIG.catalogoUrl` si cambia y verificar
   CORS/redirecciones desde preview. No se ha comprobado la implementación remota nueva.
5. Revisar la configuración efectiva de Vercel para que use el build y `dist/`.
6. Completar fases de diseño, pedido y SEO antes de anunciar la tienda renovada.

Las pruebas locales no acreditan stock, permisos remotos, pagos ni indexación real.
No se ha realizado commit, push ni despliegue.

## Conexión remota actualizada

Juan proporcionó una URL nueva `/exec`, ahora configurada en `CONFIG.catalogoUrl`.
Se consultó directamente y devuelve un solo producto con `id` string,
`colores` como arreglo, stock numérico y `campana: null`, sin `publicado` ni
columnas internas en la respuesta observada. Esto confirma el formato de esta
respuesta; no acredita permisos de otras implementaciones ni vigencia comercial.

El registro es el organizador histórico: sirve para comprobar la conexión,
pero todavía debe confirmarse o sustituirse antes del lanzamiento minimalista.
También falta añadir unidades a sus medidas (`12x12x12`). La actualización del
frontend sigue siendo local hasta publicar en Vercel.
