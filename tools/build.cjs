// La salida pública es una lista permitida; documentación, costos y herramientas quedan fuera.
const fs = require('node:fs');
const path = require('node:path');
const Datos = require('../catalog-data.js');
const SEO = require('../catalog-seo.js');
const seo = require('./seo.cjs');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const archivos = ['index.html', 'producto.html', 'producto.js', 'pedido.html', 'pedido.js', 'pedido-data.js', 'pedido-storage.js', 'styles.css', 'catalog-data.js', 'catalog-seo.js', 'script.js',
    'robots.txt', 'sitemap.xml', 'googleeffc3b6501e5f6b6.html'];

async function build() {
    // No publicar un catálogo incompleto si falla la API o descarta registros inválidos.
    const { productos, descartados } = await Datos.cargar(SEO.catalogoUrl);
    if (descartados) throw new Error('El catálogo contiene registros inválidos; corrígelos antes de publicar.');
    fs.rmSync(out, { recursive: true, force: true });
    fs.mkdirSync(out);
    for (const archivo of archivos) fs.copyFileSync(path.join(root, archivo), path.join(out, archivo));
    fs.cpSync(path.join(root, 'Assets'), path.join(out, 'Assets'), {
        recursive: true, filter: source => !path.basename(source).startsWith('.')
    });
    fs.writeFileSync(path.join(out, 'index.html'), seo.inicio(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), productos));
    const template = fs.readFileSync(path.join(root, 'producto.html'), 'utf8');
    for (const producto of productos) {
        const carpeta = path.join(out, SEO.ruta(producto.id));
        fs.mkdirSync(carpeta, { recursive: true });
        fs.writeFileSync(path.join(carpeta, 'index.html'), seo.ficha(template, producto));
    }
    fs.writeFileSync(path.join(out, 'sitemap.xml'), seo.sitemap(productos));
    console.log(`Sitio estático preparado en dist/ con ${productos.length} fichas indexables. Solo se incluyen archivos públicos.`);
}
build().catch(error => { console.error('Build cancelado:', error.message); process.exitCode = 1; });
