# Documentación de 3DCIX

Estado: **plan aprobado; fase 1 implementada localmente, publicación remota pendiente**.
Fecha: 15 de noviembre de 2026. No se ha implementado el rediseño.

## Orden de lectura

1. [`../PRODUCT.md`](../PRODUCT.md): hechos y reglas acordados con Juan.
2. [`plan.md`](plan.md): alcance, arquitectura, decisiones, fases y pendientes.
3. [`experiencia.md`](experiencia.md): recorridos, estructura y diseño propuesto.
4. [`catalogo-y-operacion.md`](catalogo-y-operacion.md): contrato de datos, precios,
   mantenimiento, migración y publicación.
5. [`calidad-y-skills.md`](calidad-y-skills.md): uso de las 14 skills, seguridad,
   accesibilidad, SEO, medición y pruebas de aceptación.
6. [`fase-1.md`](fase-1.md): cambios, pruebas realizadas y pasos pendientes de datos.
7. [`../apps-script/README.md`](../apps-script/README.md): instrucciones para migrar la API.
8. [`fase-2.md`](fase-2.md): catálogo y ficha implementados, verificación y límites.
9. [`fase-3.md`](fase-3.md): Mi pedido, reglas de pago, almacenamiento y pruebas.
10. [`lanzamiento.md`](lanzamiento.md): preview verificada y decisiones para producción.

## Cómo mantener los documentos

- Los hechos confirmados del negocio viven en `PRODUCT.md`, no en once copias.
- Una propuesta no es una decisión del usuario. Registrar su aprobación o cambio
  en la tabla de decisiones del plan antes de implementarla.
- La arquitectura y el contrato describen la solución prevista, no APIs ya desplegadas.
- En la implementación, documentar comandos realmente probados, resultado de pruebas,
  variables públicas/privadas y cambios de API. No marcar tareas por intención.
- El sistema visual terminado se registrará en `DESIGN.md` y, si corresponde al
  flujo de Impeccable, su archivo de tokens. No crearlos como evidencia de una UI
  que todavía no existe.
- Evitar credenciales, comprobantes, conversaciones sin anonimizar y datos privados
  en documentación versionada. Los datos de pago de `PRODUCT.md` fueron autorizados
  por Juan para información pública, no son credenciales de acceso.
