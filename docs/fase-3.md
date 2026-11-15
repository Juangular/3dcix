# Fase 3: Mi pedido

Implementada localmente. La ficha permite agregar una o varias unidades de cada
color y conserva la consulta directa por WhatsApp. Mi pedido permite editar color
y cantidad, retirar una línea y deshacer la última eliminación.

## Reglas aplicadas

- La página reconsulta la API al abrir y al preparar el mensaje. Si un producto se
  retira o cambia el color, solicita corregirlo. Si cambia el precio, solicita aceptar
  el nuevo precio; abrir el enlace de WhatsApp no vacía el pedido.
- Se suman cantidades por ID, incluso de colores distintos. Desde 20 unidades del
  mismo producto se solicita cotización y fecha requerida. Si el stock es desconocido
  o insuficiente, también se consulta. Productos distintos no se suman para el umbral.
- Los importes se calculan en céntimos. Para una compra individual se muestran total,
  adelanto habitual del 50 % y saldo **orientativos**, sujetos a confirmación. Si hay
  cotización o revisión pendiente, no se presenta un total negociado ni adelanto exigible.
- El transporte se paga en destino y se coordina aparte. El enlace abre WhatsApp con
  un mensaje editable; hay un campo para copiar el resumen si no se abre WhatsApp.
- No hay reserva, registro remoto de pedido ni verificación automática de pagos.

## Almacenamiento y privacidad

Se guarda en el navegador una lista con versión, ID, color, cantidad y el precio en
céntimos observado al agregar. Esta referencia de precio **amplía el plan original**,
que preveía solo ID, color y cantidad: permite detectar cambios, pero nunca se usa
como precio autoritativo. El valor actual proviene siempre de la API. Distrito, ciudad,
fecha y texto del mensaje permanecen en memoria; no se guardan en la lista.

Se usa localStorage y, si está bloqueado, sessionStorage con aviso de temporalidad.
Si ambos están bloqueados, la ficha ofrece consulta directa por WhatsApp: no es posible
conservar una lista entre páginas sin almacenamiento. El pedido corrupto no se borra
automáticamente; se ofrece borrarlo de forma explícita.

## Verificaciones realizadas

- `node --test tests/*.test.cjs`: 21 pruebas aprobadas (13 de catálogo, 8 de pedido).
  Cubren 19/20 unidades, variantes, stock, precios cambiados, datos corruptos,
  exclusión de destino del almacenamiento, redondeo y mensaje de cotización.
- Navegador con datos simulados: agregar dos productos; total S/ 39,01, adelanto
  S/ 19,51 y saldo S/ 19,50; generar mensaje; pasar a volumen; cambiar precio y
  aceptar actualización; eliminar y deshacer. No se envió ningún mensaje real.
- Pedido vacío, API inaccesible y producto retirado: estados y recuperación revisados.
- Inspección visual en escritorio y móvil; sin desbordamiento observado a 320 y 390 px.
  No se han probado dispositivos físicos, cobros ni entrega real.

## Para continuar

La preview se verificó con catálogo real; detalles y pendientes en `lanzamiento.md`.
No se ha realizado commit, push ni despliegue a producción.
