# Catálogo, precios y operación

Estado: contrato implementado localmente en `catalog-data.js` y `apps-script/Código.gs`.
Pendiente de desplegar en Google y revisar catálogo vigente. Fuente de negocio: `PRODUCT.md`.

## API actual suministrada por Juan

El único archivo remoto es `Código.gs`. `doGet()` abre `PRODUCTOS-FB`, usa la primera
fila como nombres de propiedades y devuelve todas las filas y columnas. Divide
`img` por comas solo si tiene contenido y aplica `parseFloat` al precio.

Consecuencias: filas vacías pueden producir `img: ""` y `precio: null` al serializar
`NaN`; encabezados añadidos se publican sin revisión; no hay estado de publicación.
No se ha inspeccionado la configuración de permisos remota. La revisión de código
no implica haber actualizado la implementación de Google.

## Contrato de lectura propuesto

Se conserva un arreglo JSON y los nombres de los campos originales; el contrato
nuevo agrega campos normalizados obligatorios, aunque permitan null o arreglos
vacíos. Esto no significa aceptar el payload antiguo en producción. Fallo global:
objeto `{ "error": "catalogo_no_disponible" }`, sin trazas ni nombres internos.
El frontend identifica el objeto como fallo, aunque Apps Script responda HTTP 200.

| Campo | Tipo público | Regla |
|---|---|---|
| `id` | string | Estable y único; no depende del número de fila |
| `nombre` | string | Obligatorio, texto sin HTML |
| `precio` | number | Final unitario en PEN, positivo y representable en céntimos |
| `cat` | string | Categoría; si falta, agrupar como «Otros» |
| `desc` | string | Texto; vacío no impide consultar |
| `img` | string[] | URLs HTTPS o rutas locales de imágenes permitidas; nunca HTML |
| `medidas` | string o null | Medidas con unidad; desconocido no se transforma en cero |
| `material` | string o null | Valor confirmado por producto |
| `colores` | string[] | Opciones confirmadas, no inferidas desde fotos |
| `stock` | integer o null | Total por ID; cero agotado, null desconocido; no stock por color ni reserva |
| `bajo_pedido` | boolean | Acepta consulta de fabricación; no promete capacidad o plazo |
| `campana` | string o null | Etiqueta de campaña opcional |
| `foto_tipo` | `real`, `referencia` o `sin_confirmar` | No atribuir fotos a producción propia por defecto |

`publicado` es una columna de control en Sheets: solo un true explícito permite
exportar la fila en la API nueva. No exportar ese campo ni columnas no permitidas.
Campos de costos, márgenes, fórmulas, precio tienda, datos de pago de clientes o
notas privadas no forman parte del contrato. `getValues()` obtiene valores
calculados, pero la lista permitida debe excluir sus columnas igualmente.
Comparar stock con la cantidad agregada por ID entre todos los colores. Si la
supera, el pedido completo requiere consulta; no limitarse a validar cada línea.
El stock por color no se modela en esta versión: se confirma al atender la solicitud.

### Normalización y errores

- Nuevas hojas usan encabezados exactos; recortar espacios/BOM antes de validarlos.
  Encabezados duplicados, faltantes esenciales o IDs duplicados son fallos globales
  visibles para Juan; no elegir una fila arbitraria.
- IDs numéricos existentes se normalizan como string; conservar el valor al migrar.
- Filas vacías/incompletas se excluyen sin romper las válidas. Una hoja solo con
  encabezados devuelve `[]`; JSON inválido o esquema inválido es error, no vacío.
- Google entrega precios de celdas numéricas como number. No usar `parseFloat` de
  cadenas ambiguas como `29,50` o `S/ 29`; corregir la celda numérica. El frontend
  exige números finitos y no negativos/incorrectos en precio, stock y cantidad.
- Imágenes vacías generan una colección vacía y un estado visual honesto, no caída.
  `img` de Sheets se convierte desde lista separada por comas; URLs con comas
  deben codificarse. JSON consumido solo admite el arreglo normalizado.
- Se permiten imágenes HTTPS externas y rutas locales normalizadas. Rechazar
  `javascript:`, `data:`, URLs con credenciales y rutas locales con traversal o
  que escapen del directorio de imágenes. En texto usar `textContent`; eventos
  mediante listeners.
- Valores ausentes de stock/material/colores nunca se completan con el producto histórico.
- Frontend con timeout propuesto de 15 segundos y reintento manual; sin reintentos
  infinitos ni datos antiguos presentados como stock actual.

## Migración sin publicar productos antiguos por accidente

1. Copiar la hoja actual y guardar la versión remota del script como respaldo privado.
   Inventariar todas sus implementaciones públicas. Antes de agregar datos internos,
   sustituir o desactivar cada versión que serialice encabezados sin filtro; si no
   se puede comprobar, preparar la estructura en una hoja privada separada.
2. Identificar todos los registros actuales; conservar IDs y originales. No borrarlos.
3. Agregar columnas nuevas en el entorno de preparación y dejar `publicado`
   desactivado hasta que Juan revise. Ninguna URL antigua debe exponer campos privados.
4. Completar al menos un producto minimalista vigente. El organizador histórico
   solo se utiliza como fixture de desarrollo identificado, no como stock público.
5. Probar el nuevo endpoint en implementación de prueba y comparar campos/datos.
6. El adaptador del formato antiguo se limita a fixtures y preview controlada.
   Producción exige las claves normalizadas del contrato nuevo y un endpoint
   cuya publicación explícita se verificó; el payload antiguo produce error de
   compatibilidad, nunca habilita productos. Mantener esos adaptadores fuera de
   la salida pública. No hay fallback automático al endpoint anterior.
7. Antes de producción, activar la publicación explícita y comprobar que la tienda
   solo muestra el catálogo autorizado. Verificar también todas las URLs antiguas:
   ninguna debe seguir exponiendo columnas internas. API inaccesible nunca recupera
   productos borrados.

## Fórmulas actuales: preservar antes de cambiar

| Columna | Encabezado actual | Fórmula en fila 3 |
|---|---|---|
| A | Peso (g) | Entrada por unidad vendible |
| B | Horas de imprecion | Entrada decimal por unidad vendible |
| C | Precio Material | Precio por kilogramo |
| D | Precio Producto | `=(C3*A3)/1000` |
| E | Precio Luz | `=B3` |
| F | Bolsa | Entrada |
| G | Exclusivo/Campaña | 1 o 0 |
| H | Ganancia | `=IFS(G3=1;D3*2;G3=0;D3*0,5)` |
| I | Precio Venta | `=D3 + E3 + F3 + H3` |
| J | Precio Tienda | `=D3 + E3 + H3/2` |
| K | Precio OFERTA | `=D3+F3+E3/2` |

Interpretación: D es material; E cubre máquina a S/ 1/h; H es un recargo sobre
material, no utilidad neta demostrada. J es revendedor y no incluye bolsa. K no
incluye recargo y recupera solo media tarifa de máquina. No usar J o K como precio
publicado/volumen por defecto. Si el objetivo de una oferta es recuperar costos,
K puede incumplirlo. La herramienta señalará esto, no modificará fórmulas sola.

Propuesta de administración: duplicar fila/plantilla, registrar peso y horas,
calcular precio sugerido con estas reglas y aprobar el precio final de venta.
Umbrales de margen o nuevas fórmulas quedan pendientes. La tarifa real se puede
revisar con datos de consumo, mantenimiento y fallos; no se afirma suficiente.

La plantilla [`../templates/costos.csv`](../templates/costos.csv) contiene una
fila de fórmulas sin valores de ejemplo. Impórtala en un **archivo privado separado**
del catálogo publicado, no como una nueva pestaña con información sensible en la
hoja expuesta por un script antiguo. Usa una configuración regional de Google Sheets
que acepte `;` como separador de argumentos y `,` como separador decimal; valida los
resultados con tus datos antes de duplicar la fila. Rellena A, B, C, F y G (0 o 1),
verifica D, E, H, I, J y K, y copia solo el precio de venta aprobado al catálogo.
Las celdas vacías al principio no son ofertas ni deben publicarse.

## Administración diaria prevista

1. Guardar candidato y comprobar posibilidad de venta/licencia del modelo.
2. Obtener datos del laminador y fotografías con origen identificado.
3. Completar plantilla; generar descripción solo a partir de datos comprobados.
4. Revisar costo/precio y ficha; mantener en borrador hasta completar lo necesario.
5. Publicar y verificar en móvil. Actualizar stock manualmente tras confirmar ventas.
6. Al terminar campaña, retirar publicación sin reciclar el ID para otro producto.

Automatización inmediata: validación, normalización y reutilización de plantilla.
Asistencia editorial/calculadora se documenta en la fase 4; no es un generador
autónomo de catálogo ni una integración de IA pagada ya elegida.

## Publicación y reversión previstas

- Guardar versión previa y revisar cambios de datos/código por separado.
- La implementación antigua seguía pública al comprobarse el 15 de noviembre de
  2026 y devolvía todos los encabezados de `PRODUCTOS-FB`. La producción anterior
  aún puede depender de ella: no archivarla hasta haber coordinado el cambio de
  producción. Mientras tanto, no agregar costos ni datos privados a esa hoja.
- En Apps Script: actualizar `Código.gs`, probar, ir a Implementar → Administrar
  implementaciones → editar → nueva versión. Conservar URL cuando sea posible.
  El endpoint público es lectura del catálogo; la hoja no debe hacerse editable
  públicamente. Juan revisa permisos y cuenta ejecutora; no se solicitan credenciales.
- Verificar redirecciones/CORS desde una preview de la web antes de promover.
- Vercel: comprobar proyecto/rama/directorio vinculados; el push puede publicar
  automáticamente. Hacer preview y aprobación antes de producción; no asumir acceso.
- El despliegue estático debe excluir costos, respaldos, tests, docs y herramientas
  de agentes. Definir exclusiones/salida pública y comprobar URLs de archivos
  internos antes de publicar; `robots.txt` no protege información privada.
- Reversión: restaurar despliegue web anterior y versión anterior de Apps Script;
  restaurar la hoja solo desde respaldo revisado, sin perder cambios de pedidos.
  Si la versión anterior expone columnas nuevas, priorizar cerrar la exposición,
  no revertir ciegamente a la serialización de todos los encabezados.

La referencia local del pedido no crea un registro remoto. Juan mantiene confirmación,
pagos y coordinación en WhatsApp. Un registro operativo automatizado es otra fase.
