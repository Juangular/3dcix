/** Crear también CatalogoDatos.gs copiando catalog-data.js del repositorio. */
function doGet() {
  var payload;
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PRODUCTOS-FB');
    if (!sheet) throw new Error('hoja_no_encontrada');
    var resultado = CatalogoDatos.desdeHoja(sheet.getDataRange().getValues());
    if (resultado.descartados) console.warn('Filas publicadas inválidas: ' + resultado.descartados);
    payload = resultado.productos;
  } catch (error) {
    console.error('Error del catálogo: ' + error.message);
    payload = { error: 'catalogo_no_disponible' };
  }
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
