# Documentación de 3DCIX

Estado: **fases 1–3 publicadas en Vercel**. Inventario y política de skills actualizados localmente.
Los cambios locales recientes de skills/documentación aún no están en Git.

## Orden de lectura

1. [`../PRODUCT.md`](../PRODUCT.md): hechos y reglas acordados con Juan.
2. [`plan.md`](plan.md): alcance, arquitectura, decisiones, fases y pendientes.
3. [`experiencia.md`](experiencia.md): recorridos, estructura y diseño propuesto.
4. [`catalogo-y-operacion.md`](catalogo-y-operacion.md): contrato de datos, precios,
   mantenimiento, migración y publicación.
5. [`skills.md`](skills.md): las skills agrupadas por función, sus activadores y la política para aplicarlas.
6. [`calidad-y-skills.md`](calidad-y-skills.md): seguridad, accesibilidad, SEO,
   medición y pruebas de aceptación.
7. [`fase-1.md`](fase-1.md): cambios, pruebas realizadas y pasos pendientes de datos.
8. [`../apps-script/README.md`](../apps-script/README.md): instrucciones para migrar la API.
9. [`fase-2.md`](fase-2.md): catálogo y ficha implementados, verificación y límites.
10. [`fase-3.md`](fase-3.md): Mi pedido, reglas de pago, almacenamiento y pruebas.
11. [`lanzamiento.md`](lanzamiento.md): estado de producción y pendientes operativos.

## Cómo mantener los documentos

- Los hechos confirmados del negocio viven en `PRODUCT.md`, no en múltiples copias.
- `AGENTS.md` y [`skills.md`](skills.md) indican cómo seleccionar y aplicar las skills.
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
