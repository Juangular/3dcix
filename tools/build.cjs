// La salida pública es una lista permitida; documentación, costos y herramientas quedan fuera.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const archivos = ['index.html', 'producto.html', 'producto.js', 'pedido.html', 'pedido.js', 'pedido-data.js', 'pedido-storage.js', 'styles.css', 'catalog-data.js', 'script.js',
    'robots.txt', 'sitemap.xml', 'googleeffc3b6501e5f6b6.html'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const archivo of archivos) fs.copyFileSync(path.join(root, archivo), path.join(out, archivo));
fs.cpSync(path.join(root, 'Assets'), path.join(out, 'Assets'), {
    recursive: true, filter: source => !path.basename(source).startsWith('.')
});
console.log('Sitio estático preparado en dist/. Solo se incluyen archivos públicos.');
