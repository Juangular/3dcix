const { test } = require('node:test');
const assert = require('node:assert/strict');
global.CatalogoDatos = require('../catalog-data.js');
const pedido = require('../pedido-data.js');
const p = (extra = {}) => ({ id: 'a', nombre: 'Pieza de prueba', precio: 29.01, colores: ['Blanco', 'Negro'], stock: 100, bajo_pedido: false, ...extra });
const linea = (extra = {}) => ({ id: 'a', color: 'Blanco', cantidad: 1, precioCentimos: 2901, ...extra });
const memoria = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: k => m.delete(k) }; };

test('guarda y recupera únicamente datos de línea sin datos personales', () => {
    const storage = memoria(); pedido.guardar(storage, [linea({ destino: 'Privado' })]);
    assert.deepEqual(pedido.leer(storage), [linea()]);
    assert.equal(JSON.parse(storage.getItem(pedido.KEY)).version, 1);
    assert.doesNotMatch(storage.getItem(pedido.KEY), /Privado|destino/);
});
test('rechaza almacenamiento corrupto o duplicado sin borrarlo', () => {
    const storage = memoria(); storage.setItem(pedido.KEY, '{');
    assert.throws(() => pedido.leer(storage), /pedido_corrupto/); assert.equal(storage.getItem(pedido.KEY), '{');
    storage.setItem(pedido.KEY, JSON.stringify({version: 1, lineas: [linea(), linea()]}));
    assert.throws(() => pedido.leer(storage), /pedido_corrupto/);
});
test('agrega por producto y color, conserva precio anterior y valida cantidades', () => {
    let items = pedido.agregar([], p(), 'Blanco', 2);
    items = pedido.agregar(items, p({precio: 35}), 'Blanco', 3);
    items = pedido.agregar(items, p(), 'Negro', 2);
    assert.deepEqual(items.map(x => x.cantidad), [5, 2]); assert.equal(items[0].precioCentimos, 2901);
    for (const n of [0, -1, 1.5, NaN, Infinity, 10001]) assert.throws(() => pedido.agregar([], p(), 'Blanco', n));
    assert.throws(() => pedido.agregar([linea({cantidad: 10000})], p(), 'Blanco', 1), /cantidad_excedida/);
});
test('umbral suma variantes del mismo producto, pero no productos distintos', () => {
    assert.equal(pedido.evaluar([linea({cantidad:19})], [p()]).cotizacion, false);
    assert.equal(pedido.evaluar([linea({cantidad:10}), linea({color:'Negro',cantidad:10})], [p()]).cotizacion, true);
    assert.equal(pedido.evaluar([linea({cantidad:10}), linea({id:'b',cantidad:10})], [p(), p({id:'b'})]).cotizacion, false);
});
test('stock se calcula por ID entre colores y desconocido requiere cotización', () => {
    assert.equal(pedido.evaluar([linea({cantidad:6}), linea({color:'Negro',cantidad:6})], [p({stock:10})]).cotizacion, true);
    assert.equal(pedido.evaluar([linea()], [p({stock:null})]).cotizacion, true);
    assert.equal(pedido.evaluar([linea()], [p({stock:0})]).cotizacion, true);
});
test('detecta producto retirado, precio y color cambiado', () => {
    assert.equal(pedido.evaluar([linea()], []).revision, true);
    assert.equal(pedido.evaluar([linea()], [p({precio: 30})]).items[0].precioCambiado, true);
    assert.equal(pedido.evaluar([linea()], [p({colores:['Negro']})]).items[0].colorCambiado, true);
    assert.equal(pedido.evaluar([linea({color:'Por confirmar'})], [p({colores:[]})]).cotizacion, true);
});
test('total en céntimos y adelanto se suman exactamente', () => {
    const a = pedido.evaluar([linea()], [p()]); assert.equal(a.total, 2901); assert.equal(a.adelanto,1451); assert.equal(a.saldo,1450); assert.equal(a.adelanto+a.saldo,a.total);
});
test('mensaje de volumen no promete precio final ni envío incluido', () => {
    const a = pedido.evaluar([linea({cantidad:20})], [p()]);
    const texto = pedido.mensaje(a, 'Lima: Lince', '2026-12-20');
    assert.match(texto, /solicitar una cotización/); assert.match(texto, /Precio total y plazo: por confirmar/);
    assert.match(texto, /transporte se paga en destino/); assert.doesNotMatch(texto, /Total de productos orientativo/);
});
