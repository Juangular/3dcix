# 3DCIX — contexto del producto

<!-- impeccable:product-schema 1 -->

Fuente: respuestas de Juan durante el descubrimiento. Registro: 15 de noviembre de 2026.
Este archivo contiene hechos confirmados; las propuestas técnicas están en `docs/plan.md`.

## Platform

web

## Users

Personas naturales y empresas que compran objetos impresos en 3D. El cliente deseado
realiza pedidos grandes y recurrentes. También se atiende a tiendas y revendedores.
La principal objeción reportada es la desconfianza en pagar antes de ver el producto.
Otras dudas: medidas, colores, precio, stock, fotos reales y fecha de entrega.

## Product Purpose

Vender productos del catálogo, facilitar pedidos por volumen y reducir el tiempo de
administración y atención repetitiva. El cierre de ventas seguirá en WhatsApp.
El negocio se está reactivando, con presupuesto reducido y sin fecha urgente.
Juan mantiene la web y el catálogo. No hay una meta numérica de ventas acordada.

## Positioning

Se quiere priorizar objetos minimalistas, preferentemente de un solo color.
Las ventas varían por campañas; el nacimiento minimalista destacó en Navidad.
No se ha demostrado una ventaja competitiva exclusiva. La propuesta comercial
debe validarse; no afirmar liderazgo, cifras de satisfacción ni superioridad.

## Operating Context

- Web declarada por Juan: https://3dcix.vercel.app. Repositorio en GitHub.
- Código actual: HTML, CSS y JavaScript sin framework ni compilación.
- Catálogo: pestaña `PRODUCTOS-FB` de Google Sheets, API de Google Apps Script.
- Equipos: Bambu Lab A1 Mini Combo y A1 Combo.
- Hay stock y fabricación bajo pedido. Publicar productos consume mucho tiempo
  en selección del modelo, imágenes, descripción, cálculo y carga.
- El peso y las horas del cálculo corresponden a una unidad vendible, aunque
  esa unidad sea un conjunto; incluyen soportes y desperdicio/purga.
- El costo de máquina utilizado es S/ 1 por hora para luz, desgaste y mantenimiento.
  Las horas son decimales: 1,5 equivale a una hora y treinta minutos.

## Capabilities and Constraints

### Reglas comerciales confirmadas

- Los precios del catálogo son finales para el producto, sin transporte.
- Desde 20 unidades del mismo producto se puede ofrecer un precio menor,
  sujeto a cotización. No hay porcentajes ni escalas de descuento definidos.
- El precio para tiendas/revendedores es distinto y no debe exponerse por defecto.
- Adelanto habitual: 50 % del producto, con excepciones según precio/pedido.
- Cuando el repartidor llega a recoger, Juan envía foto al comprador, cobra el
  saldo y verifica el pago antes de entregar el producto al transportista.
- Yape y Plin: 902245387, titular Juan Nuñez. WhatsApp: +51 902245387.
- El transporte se paga en destino, tanto en Lima como en provincias.
- En Lima se cotiza mediante aplicaciones como Yango o inDrive. Hasta 48 horas
  desde el adelanto hasta la entrega para pedidos pequeños, sujeto a confirmación.
- Provincias: Olva o Shalom, hasta cinco días hábiles para pedidos pequeños;
  falta precisar desde cuándo se cuenta y la cobertura de cada agencia.
- Los pedidos grandes requieren confirmar capacidad, precio y plazo.
- Si no hay stock confirmado, se consulta antes de pagar; Juan aceptó este flujo.

### Decisiones pendientes

Catálogo minimalista vigente y fotos; política de defectos, cambios y cancelación;
datos actuales de domicilio/horarios/correo; condiciones especiales de adelanto;
posibilidad de mezclar colores en un pedido por volumen; margen mínimo de utilidad.
No deben convertirse en afirmaciones públicas por inferencia.

## Brand Commitments

Nombre: 3DCIX. No hay logo definitivo. Juan quiere reemplazar el diseño actual.
Se aprobó como enfoque una tienda minimalista, clara y centrada en el producto;
la selección visual final sigue pendiente en el nuevo planeamiento.

## Evidence on Hand

- Fotografías históricas en `Assets/`; Juan dice contar con algunas fotos propias.
  No asumir origen, vigencia, permiso comercial ni correspondencia con un producto.
- Hay conversaciones de compradores satisfechos; no se han entregado ni autorizado
  para publicación. No hay reseñas públicas suministradas.
- El organizador de figuras de S/ 29, 12 × 12 × 15 cm, PLA, blanco con negro y
  diez unidades es un ejemplo histórico, no una oferta vigente confirmada.
- Juan compartió el código de `doGet()` y las fórmulas de costos en la conversación;
  se documentan en `docs/catalogo-y-operacion.md`.
- No se han proporcionado estadísticas de visitas, conversiones ni Search Console.

## Product Principles

1. Resolver dudas de compra con información verificable antes de WhatsApp.
2. Facilitar la compra individual y distinguirla de la cotización por volumen.
3. Automatizar preparación y cálculo; no inventar stock, pagos ni entregas.
4. Priorizar herramientas económicas que Juan pueda mantener.
5. Medir intención de compra sin confundirla con una venta confirmada.
