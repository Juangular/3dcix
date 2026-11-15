const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const datos = require('../catalog-data.js');

// Fixture sintético: no se publica ni representa un producto vigente.
const producto = (extra = {}) => ({
    id: 'prueba-1', nombre: 'Objeto de prueba', precio: 29, cat: 'Pruebas',
    desc: 'Fixture de validación', img: ['https://example.com/foto.jpg'],
    medidas: null, material: null, colores: [], stock: null, bajo_pedido: false,
    campana: null, foto_tipo: 'sin_confirmar', ...extra
});
const headers = ['id', 'nombre', 'precio', 'cat', 'desc', 'img', 'publicado',
    'medidas', 'material', 'colores', 'stock', 'bajo_pedido', 'campana', 'foto_tipo', 'costo_privado'];
const fila = (extra = {}) => {
    const p = { ...producto(), img: 'https://example.com/foto.jpg', colores: '',
        stock: '', bajo_pedido: false, publicado: true, costo_privado: 800, ...extra };
    return headers.map(key => p[key]);
};

test('solo exporta campos públicos de registros con casilla true', () => {
    const result = datos.desdeHoja([headers, fila(), fila({ id: 'borrador', publicado: false }),
        fila({ id: 'texto', publicado: 'TRUE' }), Array(headers.length).fill('')]);
    assert.equal(result.productos.length, 1);
    assert.deepEqual(Object.keys(result.productos[0]), datos.CAMPOS);
    assert.equal(result.productos[0].stock, null);
    assert.equal(result.productos[0].material, null);
    assert.ok(!('costo_privado' in result.productos[0]));
    assert.ok(!('publicado' in result.productos[0]));
});

test('encabezados vacíos, duplicados o incompletos fallan globalmente', () => {
    for (const tabla of [[], [[]], [['id']], [[...headers, ' precio ']]]) {
        assert.throws(() => datos.desdeHoja(tabla), /encabezados_invalidos/);
    }
    const tabla = [[...headers], fila()];
    tabla[0][0] = '\uFEFF id ';
    assert.equal(datos.desdeHoja(tabla).productos[0].id, 'prueba-1');
});

test('IDs estables numéricos y duplicados publicados', () => {
    assert.equal(datos.desdeHoja([headers, fila({ id: 23 })]).productos[0].id, '23');
    assert.throws(() => datos.desdeHoja([headers, fila({ id: 23 }), fila({ id: '23' })]), /ids_duplicados/);
    assert.throws(() => datos.normalizarRespuesta([producto(), producto()]), /ids_duplicados/);
});

test('descuenta filas publicadas inválidas sin perder válidas; todas inválidas no simulan vacío', () => {
    const result = datos.desdeHoja([headers, fila(), fila({ id: 'malo', precio: null })]);
    assert.equal(result.productos.length, 1);
    assert.equal(result.descartados, 1);
    assert.throws(() => datos.desdeHoja([headers, fila({ nombre: '' })]), /productos_publicados_invalidos/);
    assert.deepEqual(datos.desdeHoja([headers]), { productos: [], descartados: 0 });
    assert.deepEqual(datos.desdeHoja([headers, fila({ publicado: false })]), { productos: [], descartados: 0 });
});

test('no convierte precios ambiguos, cero, negativos o fuera de precisión monetaria', () => {
    for (const precio of [null, undefined, NaN, Infinity, 0, -1, '29', '29,50', 'S/ 29', 0.001, 1e20]) {
        assert.equal(datos.centimos(precio), null, String(precio));
    }
    assert.equal(datos.centimos(29.5), 2950);
    assert.equal(datos.centimos(0.1 + 0.2), 30);
    assert.equal(datos.normalizarRespuesta([producto({ precio: 29.01 })]).productos[0].precio, 29.01);
});

test('stock y booleanos conservan su significado, datos desconocidos no se inventan', () => {
    for (const stock of [-1, 1.5, '10', NaN, Infinity]) {
        assert.throws(() => datos.normalizarRespuesta([producto({ stock })]), /catalogo_invalido/);
    }
    for (const stock of [0, 10, null]) {
        assert.equal(datos.normalizarRespuesta([producto({ stock })]).productos[0].stock, stock);
    }
    assert.throws(() => datos.normalizarRespuesta([producto({ bajo_pedido: 'true' })]), /catalogo_invalido/);
    assert.match(datos.disponibilidad(producto()), /por confirmar/);
    assert.match(datos.disponibilidad(producto({ stock: 0 })), /Sin stock/);
    assert.match(datos.disponibilidad(producto({ bajo_pedido: true })), /Bajo pedido/);
});

test('normaliza columnas opcionales omitidas sin heredar un producto histórico', () => {
    const minHeaders = headers.slice(0, 7);
    const result = datos.desdeHoja([minHeaders, fila().slice(0, 7)]).productos[0];
    assert.equal(result.medidas, null);
    assert.equal(result.material, null);
    assert.equal(result.stock, null);
    assert.deepEqual(result.colores, []);
    assert.equal(result.foto_tipo, 'sin_confirmar');
});

test('rechaza contrato antiguo y errores globales; distingue vacío de malformado', () => {
    for (const payload of [{ error: 'x' }, {}, null, 'HTML', [{ id: 1, precio: 29, img: '' }]]) {
        assert.throws(() => datos.normalizarRespuesta(payload));
    }
    assert.deepEqual(datos.normalizarRespuesta([]), { productos: [], descartados: 0 });
    assert.equal(datos.normalizarRespuesta([producto(), {}, null]).descartados, 2);
    assert.throws(() => datos.normalizarRespuesta([producto({ img: '' })]), /catalogo_invalido/);
});

test('filtra URLs peligrosas, credenciales y traversal incluso codificado', () => {
    const rechazadas = ['javascript:alert(1)', 'data:image/svg+xml,<svg/>', '//evil.test/x.jpg',
        'http://example.com/x.jpg', 'https://user:pass@example.com/a.jpg', 'https://',
        'https://example.com\\@evil.test/foto.jpg', '/privado/a.jpg',
        'Assets/../secreto.jpg', 'Assets/%2e%2e/secreto.jpg', 'Assets/%252e%252e/secreto.jpg',
        'Assets/..%5csecreto.jpg', 'Assets/foto.svg', 'Assets/foto.jpg?x=1'];
    rechazadas.forEach(src => assert.equal(datos.imagenSegura(src), null, src));
    for (const src of ['https://example.com/a.jpg?x=1', 'Assets/foto.jpg', '/Assets/foto.webp']) {
        assert.equal(datos.imagenSegura(src), src);
    }
    assert.equal(datos.imagenSegura('Assets/foto%20real.jpg'), 'Assets/foto real.jpg');
    const p = datos.normalizarRespuesta([producto({ img: ['data:bad', 'https://example.com/a.jpg'] })]).productos[0];
    assert.deepEqual(p.img, ['https://example.com/a.jpg']);
});

test('texto con comillas/HTML se conserva como texto y no crea propiedades privadas', () => {
    const nombre = '<img src=x onerror="alert(1)"> Objeto de O\'Brien';
    const p = datos.normalizarRespuesta([producto({ nombre, costo: 100 })]).productos[0];
    assert.equal(p.nombre, nombre);
    assert.ok(!('costo' in p));
    const r = datos.desdeHoja([headers, fila({ img: '', colores: ' Blanco , Negro,Blanco ', cat: '' })]);
    assert.deepEqual(r.productos[0].img, []);
    assert.deepEqual(r.productos[0].colores, ['Blanco', 'Negro']);
    assert.equal(r.productos[0].cat, 'Otros');
});

test('carga controla HTTP, JSON, contrato, abort y opciones sin caché', async () => {
    let opciones;
    const result = await datos.cargar('https://example.com', { fetchImpl: async (_, options) => {
        opciones = options;
        return { ok: true, json: async () => [producto()] };
    } });
    assert.equal(result.productos.length, 1);
    assert.equal(opciones.cache, 'no-store');
    await assert.rejects(datos.cargar('x', { fetchImpl: async () => ({ ok: false }) }), /error_http/);
    await assert.rejects(datos.cargar('x', { fetchImpl: async () => ({ ok: true,
        json: async () => { throw new SyntaxError('HTML'); } }) }), /HTML/);
    await assert.rejects(datos.cargar('x', { timeoutMs: 5, fetchImpl: (_, { signal }) =>
        new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('abortado')))) }), /abortado/);
});

function ejecutarAppsScript(tabla, sinHoja = false) {
    let resultado;
    const contexto = vm.createContext({
        console: { warn() {}, error() {} },
        SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sinHoja ? null :
            { getDataRange: () => ({ getValues: () => tabla }) } }) },
        ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: texto => ({
            setMimeType: mime => { resultado = { body: JSON.parse(texto), mime }; return resultado; }
        }) }
    });
    const raiz = path.resolve(__dirname, '..');
    vm.runInContext(fs.readFileSync(path.join(raiz, 'catalog-data.js'), 'utf8'), contexto);
    vm.runInContext(fs.readFileSync(path.join(raiz, 'apps-script/Código.gs'), 'utf8'), contexto);
    vm.runInContext('doGet()', contexto);
    return resultado;
}

test('doGet funciona con la librería en entorno Apps Script sin Node ni URL', () => {
    const result = ejecutarAppsScript([headers, fila()]);
    assert.equal(result.mime, 'application/json');
    assert.equal(result.body.length, 1);
    assert.deepEqual(Object.keys(result.body[0]), datos.CAMPOS);
    assert.equal(result.body[0].precio, 29);
});

test('doGet devuelve error genérico sin filtrar encabezados, trazas o costos', () => {
    for (const result of [ejecutarAppsScript([['nota privada']]), ejecutarAppsScript([], true),
        ejecutarAppsScript([headers, fila(), fila()])]) {
        assert.deepEqual(result.body, { error: 'catalogo_no_disponible' });
    }
});
