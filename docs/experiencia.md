# Experiencia y diseño propuestos

Estado: dirección visual aprobada; catálogo, ficha y Mi pedido implementados localmente.
Negocio: [PRODUCT.md](../PRODUCT.md). Arquitectura: [plan.md](plan.md).

## Trabajo de cada pantalla

| Superficie | Modo | Éxito del visitante |
|---|---|---|
| Inicio/catálogo | Persuade | Encontrar un objeto y entender precio/disponibilidad |
| Ficha | Persuade + selección funcional | Resolver medidas, color, material y entrega; elegir cantidad |
| Mi pedido | Operate | Revisar opciones/importes y preparar el contacto correcto |
| Cómo comprar/ayuda | Read | Comprender adelanto, saldo, transporte y excepciones |

La propuesta comercial inicial es «Objetos minimalistas para regalar y decorar».
Es posicionamiento a validar, no ventaja exclusiva demostrada. La compra del
catálogo domina; la cotización por volumen es secundaria pero visible.

## Estructura funcional

```text
3DCIX      Catálogo     Cómo comprar     Mi pedido (cantidad)

Objetos minimalistas para regalar y decorar
Fotografías de productos vigentes + acceso directo al catálogo

Buscar productos [________________]    Categoría [Todas]
Campaña activa, solo si existe contenido publicado
Producto / precio final / disponibilidad / Ver producto

¿20 unidades o más del mismo producto? Consultar por volumen
Cómo comprar: elegir → confirmar → adelantar → completar → recibir
Ayuda sobre pagos y entregas / contacto
```

En móvil: navegación compacta con etiquetas, buscador visible, fotos legibles y
botón de pedido siempre alcanzable sin cubrir contenido o foco. Evitar una gran
portada que obligue a recorrer servicios y cifras antes de ver productos.

### Ficha

```text
Volver al catálogo
Galería                           Nombre
Fotos reales o referencia          Precio final del producto
                                  Disponibilidad
                                  Medidas y material
                                  Color [opciones confirmadas]
                                  Cantidad [−] [1] [+]
                                  Agregar a mi pedido
                                  Desde 20: solicitar cotización
Pago del producto y transporte explicados junto a la decisión
```

- No sustituir fotos reales por renders sin etiquetar su origen.
- Sin colores definidos: «Color por confirmar», consulta antes del pago.
- Sin medidas/material: indicar la falta; no heredar datos del ejemplo histórico.
- Stock conocido es orientativo: no reserva ni garantiza disponibilidad concurrente.
- El stock es total por ID, no por color. Si la suma de sus líneas excede stock,
  ofrecer consulta/fabricación para el pedido completo, no confirmar entrega.
  La disponibilidad del color se confirma por WhatsApp aun con stock total positivo.
- Galería con botones y nombres accesibles, sin rotación automática.
- Producto retirado/ID desconocido: explicar y ofrecer volver; no elegir otro por defecto.

### Mi pedido y WhatsApp

Cada línea distingue ID y color. Cantidad entera positiva, edición y eliminación
con recuperación simple. Cálculo en céntimos; formato `Intl.NumberFormat('es-PE')`.
Adelanto orientativo = redondeo del 50 % del total en céntimos; saldo = total menos
adelanto. Así ambas partes suman exactamente el total, incluso en importes impares.

Campos antes del contacto: destino Lima/provincias y distrito o ciudad/agencia.
Fecha requerida opcional para compra pequeña y solicitada para cotización grande.
Sin email, cuenta, DNI, comprobante ni dirección completa en esta etapa.

El mensaje lleva IDs, nombres, colores, cantidades, precios de referencia y destino.
CTA: «Confirmar pedido por WhatsApp» o «Solicitar cotización por WhatsApp» según
el caso. Abrir el enlace no equivale a enviar el mensaje; permitir copiar el resumen
si WhatsApp no abre. No vaciar automáticamente la lista al abrir WhatsApp.

Si un mismo producto alcanza 20 unidades, aunque estén en líneas de colores
distintos, se deriva a cotización; Juan confirmará si admite esa combinación.
No sumar productos diferentes para prometer un descuento. Un pedido mixto con
líneas por volumen es una consulta completa: no cobrar automáticamente la parte restante.

## Secuencia de confianza y pago

1. Web: información verificable y solicitud preparada.
2. WhatsApp: Juan confirma disponibilidad, importe, transporte y fecha.
3. Cliente: adelanto habitual del 50 % a Yape/Plin, luego comprobante por WhatsApp.
4. Juan: verifica el movimiento recibido y prepara el producto.
5. Al llegar el repartidor a recoger: Juan envía foto, cobra/verifica el saldo.
6. Despacho: solo con producto pagado; transporte se paga en destino.

Este procedimiento de foto y saldo fue descrito para recojo con repartidor en
casa. El hito equivalente al entregar en Olva/Shalom debe precisarse antes de
publicar instrucciones específicas para provincias. La regla común es saldo
verificado antes de despachar. No describirlo como pago contraentrega del producto.

Hasta 48 horas en Lima se refiere a pedidos pequeños confirmados desde adelanto;
no es garantía universal para agotados, fabricación especial o volumen. Provincias:
hasta cinco días hábiles reportados, con inicio del cómputo pendiente de confirmar.

## Dirección visual aprobada

Juan aprobó la tienda clara/minimalista con productos desde el inicio. El primer
producto publicado usa una imagen de referencia; aún faltan fotos propias vigentes.

- Fotografías de objetos reales como punto focal, no ilustraciones decorativas de impresoras.
- Tipografía legible, una familia con carácter y jerarquía por tamaño/peso.
- Base clara y contraste alto para comparar objetos monocromos; acento reservado a acciones.
- Densidad de tienda: producto visible pronto, espacios útiles y controles inequívocos.
- Sin promesas no acreditadas, estrellas ficticias, contadores de urgencia o testimonios inventados.
- Movimiento breve como respuesta a acciones, sin parallax ni contenido oculto al cargar.

UI/UX Pro Max se consultó con `minimalist home decor ecommerce`. Coincidió con
minimalismo y fotos de producto; su recomendación de storytelling por scroll se
descartó por introducir fricción. Paleta y fuentes sugeridas son candidatas, no
tokens aprobados. Frontend Design e Impeccable aportan el contraste con plantillas
genéricas y la exigencia de revisar el resultado real.

## Estados obligatorios

Cargando, API inaccesible con reintento, catálogo vacío, búsqueda sin resultados,
imagen rota, ficha incompleta, producto retirado, stock desconocido, sin stock,
cantidad inválida, pedido vacío, almacenamiento no disponible, precio cambiado,
pedido por volumen y enlace de WhatsApp con alternativa de copia.

Ningún estado fallido debe convertirse en «gratis», «hay stock» o «pago recibido».
