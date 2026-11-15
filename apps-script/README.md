# Publicar la API de catálogo (fase 1)

Código preparado y probado localmente; todavía no desplegado en tu cuenta de Google.
No hay productos de muestra en la plantilla para evitar publicar una oferta histórica.

## Preparar Sheets

1. Guarda una copia privada de la hoja y del script actual. Revisa todas las
   implementaciones públicas anteriores: ninguna debe seguir exportando todas las
   columnas cuando agregues datos internos. Usa una hoja privada separada si no
   puedes comprobarlo. No hagas la hoja editable públicamente.
2. En `PRODUCTOS-FB`, conserva los encabezados originales y agrega los de
   [`../templates/catalogo.csv`](../templates/catalogo.csv). No importes reemplazando
   una hoja con datos: la plantilla contiene únicamente encabezados.
3. Configura `publicado` y `bajo_pedido` como casillas de verificación estándar
   (TRUE/FALSE booleanos, sin valores personalizados). Desmarca todos los productos
   antiguos hasta revisar su vigencia.
4. `precio` debe ser una celda numérica positiva con hasta dos decimales. El precio
   está en soles y excluye envío; no escribas `S/` dentro del valor. `stock` es un
   entero no negativo, o una celda vacía para desconocido. Cero significa agotado.
5. `img`: URLs HTTPS separadas por comas (codifica las comas dentro de una URL), o
   rutas del sitio como `Assets/foto.webp`. `colores`: nombres separados por comas.
   `foto_tipo`: `real`, `referencia` o `sin_confirmar`. Material/medidas sin datos
   se dejan vacíos. No copiar los datos del organizador antiguo a productos nuevos.
6. No cambies IDs al ordenar filas. No repitas un ID publicado. Un producto con
   nombre/precio inválidos se omite; si todos los publicados son inválidos, la API
   responde error. Los borradores y filas vacías nunca se exportan.

## Actualizar Apps Script

1. En Extensiones → Apps Script, reemplaza `Código.gs` con el archivo de esta carpeta.
2. Crea `CatalogoDatos.gs` y pega **todo** el contenido de `../catalog-data.js`.
   Es la misma validación que usa el navegador; no mantengas una copia antigua.
   Apps Script V8 ejecuta todos los `.gs` del proyecto sin imports.
3. Guarda y prueba `doGet` desde el editor. Mira Ejecuciones para el diagnóstico
   privado; la respuesta pública solo muestra `catalogo_no_disponible` si falla.
4. Implementar → Administrar implementaciones → editar → nueva versión. Verifica
   cuenta ejecutora y permiso de lectura pública del endpoint; autoriza solo desde
   tu propia cuenta. No compartas credenciales. Puedes probar con otra implementación.
5. Abre la URL `/exec`: con todo desmarcado debe devolver `[]`. Con un producto
   aprobado devuelve solo las 13 propiedades públicas del contrato (incluido `id`).
6. Agrega una columna de prueba interna y verifica que no aparece. Verifica también
   URLs antiguas; actualízalas o archívalas si todavía publican columnas arbitrarias.
7. Si cambió la URL, actualiza `CONFIG.catalogoUrl` en `script.js`. Si conservas la
   misma URL, igual debes publicar la nueva versión: guardar el editor no basta.
8. Prueba desde una preview web (incluye redirecciones y CORS) antes de producción.

## Datos públicos y diagnóstico

Encabezados obligatorios: `id,nombre,precio,cat,desc,img,publicado`. Los otros se
normalizan como null, arreglos vacíos, `false` o `sin_confirmar` si están ausentes.
El JSON nuevo incluye siempre todas las claves públicas de `CatalogoDatos.CAMPOS`.
Los costos, fórmulas, precios de tienda y notas no se exportan. El control
`publicado` tampoco: solo permite exportar un booleano true explícito de la hoja.

Los errores de encabezados o IDs duplicados detienen la respuesta completa.
Las filas publicadas incompletas se descartan y su cantidad queda en Ejecuciones.
Un catálogo vacío válido no es un fallo de conexión. La web no acepta el formato
antiguo ni recurre automáticamente a productos históricos.

## Volver atrás

Restaura una versión revisada del script y del frontend compatibles entre sí.
No reactives la serialización indiscriminada si la hoja ya contiene datos privados.
El frontend nuevo muestra un error recuperable si encuentra el contrato antiguo.
No publiques la web nueva hasta completar esta migración y revisar el catálogo.
