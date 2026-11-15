# SEO del catálogo

## Cambios del 15 de noviembre de 2026

- El bloqueo principal era `noindex` en todas las fichas y contenido exclusivamente
  generado con JavaScript. El sitemap publicado solo incluía el inicio.
- `node tools/build.cjs` consulta la API pública y valida su contrato antes de
  generar el sitio. Crea ocho fichas con el catálogo actual, en
  `/productos/p-ID/`, y enlaces HTML a ellas desde el inicio.
- Cada ficha incluye nombre, descripción, precio, medidas/material/colores
  disponibles, origen de la imagen y contacto sin requerir JavaScript.
- Los metadatos incluyen canonical propio, título, descripción y Open Graph.
  `Product`/`Offer` utiliza el precio publicado en PEN y enlaza a la ficha;
  no inventa fabricante, reseñas, descuentos, transporte ni stock desconocido.
- El inicio usa `ItemList` con enlaces a productos, sin repetir ofertas de todo
  el catálogo como si el inicio fuera una ficha individual.
- El sitemap se genera con inicio y fichas reales, sin fechas de modificación
  inventadas ni páginas de pedido. `robots.txt` permite rastrearlo.
- `/index.html` redirige permanentemente a `/` en Vercel.
- `pedido.html` y la plantilla genérica `producto.html?id=...` conservan
  `noindex,follow`. Los enlaces anteriores de consulta siguen funcionando;
  la URL indexable es la ficha estática. Los parámetros de regreso de búsqueda
  no cambian su canonical.

## Publicación y actualización

El contenido SEO es una instantánea de la hoja pública al construir. **Después de
cambiar nombres, descripciones, precios, fotos o publicación de productos en Sheets,
ejecutar un nuevo build y despliegue** para actualizar HTML, previews y sitemap.
La interfaz sigue consultando los datos vivos al cargar; las actualizaciones de
Sheets no disparan un deployment automáticamente.

Si la API falla o contiene registros inválidos descartados, el build falla antes
de sustituir la salida; no publica silenciosamente una versión parcial. Un catálogo
válido vacío sí produce un sitio sin fichas. La API pasa a ser un requisito del build.
No se incorporan credenciales ni datos internos al artefacto.

En Vercel las URLs de productos aún no generadas abren la plantilla dinámica
mediante rewrite; conservan `noindex` hasta el siguiente build. Un producto retirado
de la hoja pierde su schema y recibe `noindex` al comprobarse en navegador; para
retirar también su HTML inicial es necesario reconstruir. La retirada no es un 410
de servidor: la plantilla de recuperación está excluida de indexación.

## Verificación y pendientes

- `node --test tests/*.test.cjs`: 25 pruebas aprobadas, incluyendo escape de HTML
  y JSON-LD ante `</script>`, URLs/paths, moneda, stock desconocido y sitemap.
- Build con API real: ocho fichas generadas. Estos datos prueban generación,
  no confirman disponibilidad física ni aceptación por Google.
- Navegador sin JavaScript: inicio con ocho enlaces y ficha con contenido,
  canonical, Open Graph y JSON-LD presentes en el HTML inicial.
- Las nueve URLs del sitemap local devuelven 200 con canonical coincidente.
  Recorrido catálogo → ficha → agregar al pedido comprobado con datos reales.
- Fixtures de navegador: producto retirado elimina oferta y recibe `noindex`;
  fallo de API conserva contenido estático con advertencia y elimina la oferta.
  Un reintento exitoso restaura contenido dinámico y datos estructurados.
- Lighthouse 13.6.0, navegación móvil predeterminada en Chrome headless, servido
  en localhost: inicio y `/productos/p-1/` obtienen SEO 100 y accesibilidad 100.
  No mide ranking ni certifica conformidad WCAG. Informes JSON guardados fuera
  del repositorio, en el directorio temporal de OpenCode.
- Redirect de `/index.html` y rewrite de fichas nuevas definidos en `vercel.json`;
  su comportamiento HTTP en Vercel queda por verificar tras el despliegue.
- Validar después de publicar con Google Rich Results Test e inspección de URLs
  en Search Console. Enviar `https://3dcix.vercel.app/sitemap.xml` y observar cobertura.
- No hay acceso proporcionado a Search Console ni datos de tráfico/rankings;
  no se afirma indexación ni aumento de posiciones.

Estas mejoras están verificadas localmente, pendientes de commit y publicación.

Skills: `seo` y `seo-audit` para rastreo/metadatos/schema; `security-review` y
`ponytail` para generación segura y reutilización sin dependencias; `image` y
`accessibility` para conservar origen y alternativas de las imágenes existentes.
