/* El navegador conserva una referencia de precio; la API es la fuente actual. */
var PedidoDatos = (() => {
    "use strict";
    const KEY = "3dcix-pedido-v1";
    const LIMITE = 10000;
    const cantidadValida = n => Number.isSafeInteger(n) && n > 0 && n <= LIMITE;
    const lineaValida = l => l && typeof l.id === "string" && l.id.trim() && typeof l.color === "string"
        && cantidadValida(l.cantidad) && Number.isSafeInteger(l.precioCentimos) && l.precioCentimos > 0;

    function leer(storage) {
        const raw = storage.getItem(KEY);
        if (!raw) return [];
        let data;
        try { data = JSON.parse(raw); } catch (_) { throw new Error("pedido_corrupto"); }
        if (!data || data.version !== 1 || !Array.isArray(data.lineas) || !data.lineas.every(lineaValida)) throw new Error("pedido_corrupto");
        const keys = new Set();
        return data.lineas.map(l => {
            const key = JSON.stringify([l.id, l.color]);
            if (keys.has(key)) throw new Error("pedido_corrupto");
            keys.add(key);
            return { id: l.id, color: l.color, cantidad: l.cantidad, precioCentimos: l.precioCentimos };
        });
    }

    function guardar(storage, lineas) {
        if (!Array.isArray(lineas) || !lineas.every(lineaValida)) throw new Error("linea_invalida");
        storage.setItem(KEY, JSON.stringify({ version: 1, lineas: lineas.map(l => ({
            id: l.id, color: l.color, cantidad: l.cantidad, precioCentimos: l.precioCentimos
        })) }));
    }

    function agregar(lineas, producto, color, cantidad) {
        const precioCentimos = CatalogoDatos.centimos(producto.precio);
        if (!precioCentimos || !cantidadValida(cantidad) || typeof color !== "string") throw new Error("linea_invalida");
        const copia = lineas.map(l => ({ ...l }));
        const existe = copia.find(l => l.id === producto.id && l.color === color);
        if (existe) {
            if (!cantidadValida(existe.cantidad + cantidad)) throw new Error("cantidad_excedida");
            // Mantener referencia anterior para que un precio cambiado sea revisado.
            existe.cantidad += cantidad;
        } else copia.push({ id: producto.id, color, cantidad, precioCentimos });
        return copia;
    }

    function evaluar(lineas, productos) {
        const porId = new Map(productos.map(p => [p.id, p]));
        const cantidades = new Map();
        lineas.forEach(l => cantidades.set(l.id, (cantidades.get(l.id) || 0) + l.cantidad));
        const items = lineas.map(l => {
            const producto = porId.get(l.id);
            const retirado = !producto;
            const precioActual = producto ? CatalogoDatos.centimos(producto.precio) : null;
            const precioCambiado = !!producto && precioActual !== l.precioCentimos;
            const colorCambiado = !!producto && (l.color === "Por confirmar" ? producto.colores.length > 0 : !producto.colores.includes(l.color));
            const volumen = cantidades.get(l.id) >= 20;
            const sinStock = !!producto && (producto.stock === null || cantidades.get(l.id) > producto.stock);
            return { ...l, producto, retirado, precioActual, precioCambiado, colorCambiado, volumen, sinStock };
        });
        let total = 0;
        items.forEach(i => { if (i.producto) total += i.precioActual * i.cantidad; });
        if (!Number.isSafeInteger(total)) throw new Error("total_excedido");
        const revision = items.some(i => i.retirado || i.precioCambiado || i.colorCambiado);
        const cotizacion = items.some(i => i.volumen || i.sinStock || i.color === "Por confirmar");
        const adelanto = Math.round(total / 2);
        return { items, total, adelanto, saldo: total - adelanto, revision, cotizacion };
    }

    function mensaje(analisis, destino, fecha) {
        const moneda = n => `S/ ${(n / 100).toFixed(2)}`;
        const titulo = analisis.cotizacion ? "Hola 3DCIX, quisiera solicitar una cotización." : "Hola 3DCIX, quisiera confirmar este pedido.";
        const detalle = analisis.items.map(i => `- ${i.producto.nombre} (ID: ${i.id}) | ${i.cantidad} unidad(es) | Color: ${i.color} | Precio unitario publicado: ${moneda(i.precioActual)}`);
        return [titulo, ...detalle, `Destino: ${destino}`, fecha ? `Fecha requerida: ${fecha}` : "",
            analisis.cotizacion ? "Precio total y plazo: por confirmar." : `Total de productos orientativo: ${moneda(analisis.total)}.`,
            "El transporte se paga en destino. Quisiera confirmar disponibilidad, precio y envío antes de pagar."].filter(Boolean).join("\n");
    }

    return { KEY, LIMITE, cantidadValida, leer, guardar, agregar, evaluar, mensaje };
})();
if (typeof module !== "undefined" && module.exports) module.exports = PedidoDatos;
