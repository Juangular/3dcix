const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const SEO = require('../catalog-seo.js');
const { ficha, inicio, sitemap } = require('../tools/seo.cjs');
const root = path.join(__dirname, '..');
const p = { id: '../1?a&b', nombre: 'Objeto "verde" </script><script>alert(1)</script>',
    desc: 'Medidas < 20 cm & color por confirmar.', cat: 'Decoración', precio: 29.5,
    img: ['Assets/imagen con espacios.png'], material: null, medidas: null,
    colores: [], stock: null, bajo_pedido: true, foto_tipo: 'referencia' };
const template = fs.readFileSync(path.join(root, 'producto.html'), 'utf8');

test('ficha HTML incluye contenido indexable, canonical y metadatos sin ejecutar datos externos', () => {
    const html = ficha(template, p);
    assert.ok(html.includes('<h1>Objeto &quot;verde&quot; &lt;/script&gt;'));
    assert.ok(!html.includes('<script>alert(1)</script>'));
    assert.ok(html.includes('index,follow,max-image-preview:large'));
    assert.ok(!html.includes('noindex,follow'));
    assert.ok(html.includes(`rel="canonical" href="${SEO.url(p.id)}"`));
    assert.ok(html.includes('property="og:description"'));
    assert.ok(html.includes('Imagen de referencia.'));
    assert.equal((html.match(/<base /g) || []).length, 1);
    const schema = JSON.parse(html.match(/id="schema-producto" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema.name, p.nombre);
    assert.equal(schema.offers.price, '29.50');
    assert.equal(schema.offers.priceCurrency, 'PEN');
    assert.equal(schema.offers.url, SEO.url(p.id));
    assert.equal(schema.image[0], 'https://3dcix.vercel.app/Assets/imagen%20con%20espacios.png');
    assert.equal(schema.offers.availability, undefined);
    assert.equal(schema.brand, undefined);
});

test('stock desconocido no se publica como disponible y no inventa valoraciones', () => {
    assert.equal(SEO.producto({ ...p, stock: 0 }).offers.availability, 'https://schema.org/OutOfStock');
    assert.equal(SEO.producto({ ...p, stock: 2 }).offers.availability, 'https://schema.org/InStock');
    assert.equal(SEO.producto(p).aggregateRating, undefined);
});

test('el contenido con dólares no se interpreta como sustituciones de String.replace', () => {
    const producto = { ...p, nombre: '$& $` $$', desc: '$& $` $$' };
    const html = ficha(template, producto);
    assert.ok(html.includes('<title>$&amp; $` $$ | 3DCIX</title>'));
    assert.ok(html.includes('<h1>$&amp; $` $$</h1>'));
    assert.equal((html.match(/<!doctype html>/g) || []).length, 1);
});

test('inicio y sitemap enlazan a las mismas fichas y excluyen el pedido', () => {
    const html = inicio(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), [p]);
    assert.ok(html.includes(`href="${SEO.ruta(p.id)}"`));
    assert.ok(html.includes('id="loader" hidden'));
    const schema = JSON.parse(html.match(/id="schema-productos" type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema.itemListElement[0].url, SEO.url(p.id));
    assert.ok(sitemap([p]).includes(`<loc>${SEO.url(p.id)}</loc>`));
    assert.ok(!sitemap([p]).includes('pedido.html'));
    assert.ok(!sitemap([p]).includes('lastmod'));
    assert.equal(fs.readFileSync(path.join(root, 'pedido.html'), 'utf8').includes('noindex,follow'), true);
    const output = path.join(root, 'dist', SEO.ruta(p.id));
    assert.ok(output.startsWith(path.join(root, 'dist', 'productos') + path.sep));
});
