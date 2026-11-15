# Estado de lanzamiento

Actualizado el 15 de noviembre de 2026. El commit `b93bdac` se publicó desde Git:

- Producción: https://3dcix.vercel.app
- Deployment: `dpl_wB5b7oNBT1tXWezqWUQrp98j6mSe`, estado READY, target production.
- Inspección: `https://vercel.com/juan-nunezs-projects/3dcix/wB5b7oNBT1tXWezqWUQrp98j6mSe`.
- Alias de producción `3dcix.vercel.app` confirmado por Vercel.
- Método: push a `main`; Vercel ejecutó `tools/build.cjs` y publicó `dist/`.

La preview previa sigue disponible para comparación:

- Preview: `https://3dcix-nh38wwjdi-juan-nunezs-projects.vercel.app`
- Deployment: `dpl_H5Yaq2XePitf5uMyCiR312pjAcjJ`, estado READY, target preview.
- El acceso a preview requiere autenticación de Vercel o un enlace temporal compartido.
  El enlace compartido no se guarda en este documento.

## Comprobaciones de la preview

- El build ejecutó `node tools/build.cjs` y publicó la salida `dist/`.
- El navegador cargó la API real con ocho productos. Se agregó el producto 1,
  se preparó una consulta para Lima y se obtuvieron S/ 29,00 de total y S/ 14,50
  tanto de adelanto como de saldo orientativos. No se envió ningún WhatsApp.
- Con 20 unidades se exigió fecha y el mensaje indicó precio y plazo por confirmar.
  Se probaron quitar y deshacer. A 320 CSS px no se observó desbordamiento.
- `PRODUCT.md` y `apps-script/Código.gs` respondieron 404 en la preview. El árbol
  de fuentes del despliegue no incluyó `.env.local`, documentación ni pruebas.
- Se corrigió una condición de carrera: si el pedido cambia mientras se reconsulta
  la API, se vuelve a leer el almacenamiento antes de generar el mensaje. Se probó
  vaciando el pedido durante la petición; no se creó un mensaje con datos antiguos.
- 21 pruebas Node y comprobación de sintaxis/build locales completadas.

## Operación y límites que requieren a Juan

1. **Implementación antigua de Apps Script:** su URL `/exec` seguía accesible y
   devolvía todos los encabezados de `PRODUCTOS-FB`. La producción antigua puede
   usarla. No añadir costos ni notas privadas a esa hoja. Después de coordinar el
   cambio de producción, revisar y archivar o actualizar esa implementación desde
   Google Apps Script y comprobar el sitio resultante.
2. **Datos comerciales:** revisar medidas con unidad, descripciones, stock, colores,
   uso comercial de las imágenes y qué productos se desean vender. Las ocho fotos
   actuales se identifican como referencia; no se afirman fotografías propias.
3. **Condiciones:** definir la política de defectos/cancelaciones y cómo se coordina
   el momento del saldo para provincias. No se inventó una garantía o devolución.
4. **Métricas:** la herramienta de analítica y sus permisos no se han seleccionado;
   no se instalaron servicios pagos ni se afirma haber medido ventas.
5. **Skills/documentación local:** la nueva skill `image`, el inventario agrupado y
   `AGENTS.md` se añadieron después del deployment; aún esperan commit/push y no forman
   parte de la versión publicada. No cambian el artefacto web.
6. **API heredada:** la implementación antigua de Apps Script sigue accesible. No
   agregues datos privados a esa hoja; coordina actualizar/desactivar la versión
   anterior y revisar todos sus endpoints.

La plantilla privada `templates/costos.csv` conserva las fórmulas comunicadas por
Juan. Las herramientas, plantillas y documentación no forman parte de `dist/`.
