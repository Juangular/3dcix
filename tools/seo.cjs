const SEO = require('../catalog-seo.js');
const Datos = require('../catalog-data.js');
const escapar = value => String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const moneda = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

function contenido(p, ficha = false) {
    const imagen = p.img[0] ? `<img class="activa" src="${escapar(p.img[0])}" width="800" height="800" alt="${escapar(p.nombre)}"${ficha ? '' : ' loading="lazy"'}>`
        : '<p class="foto-no-disponible">Fotografía no disponible. Solicítala por WhatsApp.</p>';
    const origen = p.foto_tipo === 'real' ? 'Fotografía del producto.' : p.foto_tipo === 'referencia'
        ? 'Imagen de referencia.' : 'Origen de la fotografía por confirmar.';
    return `<div class="${ficha ? 'product-gallery' : ''}"><div class="carrusel">${imagen}</div>${ficha ? `<p class="foto-origen">${origen}</p>` : ''}</div>
<div class="${ficha ? 'product-info' : 'info-producto'}"><span class="categoria-label">${escapar(p.cat)}</span>
<${ficha ? 'h1' : 'h3'}>${escapar(p.nombre)}</${ficha ? 'h1' : 'h3'}><div class="precio">${moneda.format(p.precio)}</div>
<p${ficha ? '' : ' class="desc-producto"'}>${escapar(p.desc)}</p><p class="disponibilidad-producto">${escapar(Datos.disponibilidad(p))}</p>
${ficha ? `<dl><div><dt>Medidas</dt><dd>${escapar(p.medidas || 'Por confirmar')}</dd></div><div><dt>Material</dt><dd>${escapar(p.material || 'Por confirmar')}</dd></div><div><dt>Colores</dt><dd>${escapar(p.colores.join(', ') || 'Por confirmar')}</dd></div></dl>
<p class="product-help">Confirma disponibilidad y color antes de pagar. El envío se paga en destino.</p>
<a class="btn-primary" href="https://wa.me/51902245387?text=${encodeURIComponent(`Hola 3DCIX, quiero consultar ${p.nombre} (ID: ${p.id}).`)}">Consultar por WhatsApp</a>`
        : `<p class="foto-origen">${origen}</p><a class="boton-comprar" href="${escapar(SEO.ruta(p.id))}" aria-label="Ver producto: ${escapar(p.nombre)}">Ver producto</a>`}</div>`;
}

function ficha(template, p) {
    const meta = `<link rel="canonical" href="${escapar(SEO.url(p.id))}">
<meta property="og:type" content="product"><meta property="og:site_name" content="3DCIX"><meta property="og:locale" content="es_PE">
<meta property="og:title" content="${escapar(p.nombre)} | 3DCIX"><meta property="og:description" content="${escapar(SEO.descripcion(p))}"><meta property="og:url" content="${escapar(SEO.url(p.id))}">
${p.img.length ? `<meta property="og:image" content="${escapar(new URL(p.img[0], SEO.siteUrl + '/').href)}"><meta property="og:image:alt" content="${escapar(p.nombre)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<script id="schema-producto" type="application/ld+json">${json(SEO.producto(p))}</script>`;
    return template.replace('</head>', () => `${meta}</head>`)
        .replace('<title>Producto | 3DCIX</title>', () => `<title>${escapar(p.nombre)} | 3DCIX</title>`)
        .replace('content="Consulta detalles y disponibilidad de productos impresos en 3D de 3DCIX."', () => `content="${escapar(SEO.descripcion(p))}"`)
        .replace('content="noindex,follow"', 'content="index,follow,max-image-preview:large"')
        .replace('id="producto-estado"', 'id="producto-estado" hidden')
        .replace('<div id="producto" class="product-layout" hidden></div>', () => `<div id="producto" class="product-layout">${contenido(p, true)}</div>`);
}

function inicio(template, productos) {
    return template.replace('<div id="catalogo" class="contenedor-grid" role="list" aria-busy="true" aria-label="Productos"></div>',
        () => `<div id="catalogo" class="contenedor-grid" role="list" aria-busy="false" aria-label="Productos">${productos.map(p => `<article class="tarjeta-producto" role="listitem">${contenido(p)}</article>`).join('')}</div>`)
        .replace('id="loader"', 'id="loader" hidden')
        .replace(/(<script id="schema-productos" type="application\/ld\+json">)[\s\S]*?(<\/script>)/, (_, a, b) => a + json(SEO.lista(productos)) + b);
}

function sitemap(productos) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[SEO.siteUrl + '/', ...productos.map(p => SEO.url(p.id))].map(url => `  <url><loc>${escapar(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
}
module.exports = { ficha, inicio, sitemap };
