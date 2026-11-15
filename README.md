# 3DCIX

Web de catálogo de productos impresos en 3D, con atención y cierre de pedidos por WhatsApp.

- Web pública indicada por el propietario: https://3dcix.vercel.app
- Stack actual: HTML, CSS y JavaScript; catálogo en Google Sheets mediante Apps Script.
- Estado: catálogo, ficha y Mi pedido publicados en producción en Vercel.
- Las reglas para cambios futuros y el inventario de skills están en [AGENTS.md](AGENTS.md) y [docs/skills.md](docs/skills.md).

## Documentación

El build genera fichas HTML y sitemap desde el catálogo público. Tras modificar
productos en Sheets, vuelve a construir y desplegar para actualizar su contenido
SEO. Detalles y validación: [docs/seo.md](docs/seo.md).

Empieza en [docs/README.md](docs/README.md). El contexto confirmado del negocio está
en [PRODUCT.md](PRODUCT.md); el alcance, arquitectura y fases en [docs/plan.md](docs/plan.md).

El catálogo usa el nuevo contrato de Apps Script, ya publicado por Juan. Revisa
la implementación anterior y otros límites operativos en
[docs/lanzamiento.md](docs/lanzamiento.md). La API antigua mostrará un error recuperable;
no hay fallback a productos históricos. Mi pedido prepara una consulta para WhatsApp;
no reserva stock ni confirma pagos. Consulta [docs/fase-3.md](docs/fase-3.md).

## Comprobaciones locales

Requiere Node.js 18 o posterior, sin instalar dependencias:

```sh
node --test tests/*.test.cjs
node --check script.js
node tools/build.cjs
python3 -m http.server 4189 --directory dist --bind 127.0.0.1
```

El build copia únicamente archivos públicos a `dist/`; Vercel utiliza esa salida
mediante `vercel.json`. Documentación, Apps Script, tests y skills no se publican.
El sitemap y los canonical apuntan a Vercel. El build genera fichas indexables en
`/productos/p-ID/`; la plantilla dinámica genérica conserva `noindex`.
