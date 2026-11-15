/* Compartido por navegador, Node y Apps Script (copiar como CatalogoDatos.gs). */
var CatalogoDatos = (() => {
    "use strict";

    const CAMPOS = ["id", "nombre", "precio", "cat", "desc", "img", "medidas",
        "material", "colores", "stock", "bajo_pedido", "campana", "foto_tipo"];
    const ESENCIALES = ["id", "nombre", "precio", "cat", "desc", "img", "publicado"];
    const esObjeto = value => value !== null && typeof value === "object" && !Array.isArray(value);
    const texto = value => typeof value === "string" ? value.trim() : "";
    const opcional = value => texto(value) || null;
    const idTexto = value => typeof value === "string" ? value.trim()
        : Number.isSafeInteger(value) && value >= 0 ? String(value) : "";
    const fallo = codigo => { throw new Error(codigo); };

    function centimos(precio) {
        if (typeof precio !== "number" || !Number.isFinite(precio) || precio <= 0) return null;
        const escalado = precio * 100;
        const entero = Math.round(escalado);
        return Number.isSafeInteger(entero) && entero > 0 && Math.abs(escalado - entero) < 0.000001
            ? entero : null;
    }

    function imagenSegura(value) {
        const src = texto(value);
        if (!src || /[\u0000-\u001f\u007f\\]/.test(src)) return null;
        if (/^https:\/\//i.test(src)) {
            // Apps Script no dispone de URL; esta validación no depende del DOM.
            const host = src.slice(8).split(/[/?#]/)[0];
            if (!host || /[@\s%]/.test(host) || host.startsWith(".")) return null;
            return src;
        }
        let ruta = src;
        try {
            for (let i = 0; i < 3 && ruta.includes("%"); i++) ruta = decodeURIComponent(ruta);
        } catch (_) { return null; }
        if (!/^\/?Assets\/.+\.(?:png|jpe?g|webp|avif|gif)$/i.test(ruta)) return null;
        if (/[\u0000-\u001f\u007f\\%?#]/.test(ruta)
            || ruta.split("/").some(segment => segment === "." || segment === "..")) return null;
        return ruta;
    }

    function productoNormalizado(raw) {
        if (!esObjeto(raw)) return null;
        const id = idTexto(raw.id);
        const nombre = texto(raw.nombre);
        const precioCentimos = centimos(raw.precio);
        if (!id || !nombre || precioCentimos === null) return null;
        if (!Array.isArray(raw.img) || !Array.isArray(raw.colores)) return null;
        if (raw.stock !== null && (!Number.isSafeInteger(raw.stock) || raw.stock < 0)) return null;
        if (typeof raw.bajo_pedido !== "boolean") return null;
        if (!["real", "referencia", "sin_confirmar"].includes(raw.foto_tipo)) return null;
        if (!["medidas", "material", "campana"].every(key => raw[key] === null || typeof raw[key] === "string")) return null;
        if (typeof raw.cat !== "string" || typeof raw.desc !== "string"
            || raw.img.some(value => typeof value !== "string")
            || raw.colores.some(value => typeof value !== "string")) return null;

        return {
            id, nombre, precio: precioCentimos / 100,
            cat: texto(raw.cat) || "Otros", desc: texto(raw.desc),
            img: [...new Set(raw.img.map(imagenSegura).filter(Boolean))],
            medidas: opcional(raw.medidas), material: opcional(raw.material),
            colores: [...new Set(raw.colores.map(texto).filter(Boolean))],
            stock: raw.stock, bajo_pedido: raw.bajo_pedido,
            campana: opcional(raw.campana), foto_tipo: raw.foto_tipo
        };
    }

    function normalizarRespuesta(payload) {
        if (!Array.isArray(payload)) fallo("catalogo_no_disponible");
        const vistos = new Set();
        const productos = [];
        let descartados = 0;
        payload.forEach(raw => {
            // Un payload antiguo no acredita el contrato ni la publicación de la nueva API.
            if (esObjeto(raw) && Object.keys(raw).length && !CAMPOS.every(key => Object.prototype.hasOwnProperty.call(raw, key))) {
                fallo("contrato_incompatible");
            }
            const id = esObjeto(raw) ? idTexto(raw.id) : "";
            if (id && vistos.has(id)) fallo("ids_duplicados");
            if (id) vistos.add(id);
            const producto = productoNormalizado(raw);
            if (producto) productos.push(producto);
            else descartados++;
        });
        if (payload.length && !productos.length) fallo("catalogo_invalido");
        return { productos, descartados };
    }

    function desdeHoja(data) {
        if (!Array.isArray(data) || !Array.isArray(data[0])) fallo("encabezados_invalidos");
        const headers = data[0].map(value => String(value).replace(/^\uFEFF/, "").trim());
        const presentes = headers.filter(Boolean);
        if (new Set(presentes).size !== presentes.length || !ESENCIALES.every(key => headers.includes(key))) {
            fallo("encabezados_invalidos");
        }
        const indice = Object.fromEntries(headers.map((key, i) => [key, i]));
        const publicados = [];
        const vistos = new Set();
        let descartados = 0;
        data.slice(1).forEach(row => {
            const celda = key => row[indice[key]];
            if (celda("publicado") !== true) return;
            const id = idTexto(celda("id"));
            if (id && vistos.has(id)) fallo("ids_duplicados");
            if (id) vistos.add(id);
            const stock = celda("stock");
            const bajoPedido = celda("bajo_pedido");
            const foto = celda("foto_tipo");
            const candidato = {
                id, nombre: texto(celda("nombre")), precio: celda("precio"),
                cat: texto(celda("cat")), desc: texto(celda("desc")),
                img: texto(celda("img")).split(",").map(texto).filter(Boolean),
                medidas: opcional(celda("medidas")), material: opcional(celda("material")),
                colores: texto(celda("colores")).split(",").map(texto).filter(Boolean),
                stock: stock === "" || stock === undefined ? null : stock,
                bajo_pedido: bajoPedido === "" || bajoPedido === undefined ? false : bajoPedido,
                campana: opcional(celda("campana")),
                foto_tipo: foto === "" || foto === undefined ? "sin_confirmar" : texto(foto)
            };
            const producto = productoNormalizado(candidato);
            if (producto) publicados.push(producto);
            else descartados++;
        });
        if (descartados && !publicados.length) fallo("productos_publicados_invalidos");
        return { productos: publicados, descartados };
    }

    async function cargar(url, { fetchImpl = fetch, timeoutMs = 15000 } = {}) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const respuesta = await fetchImpl(url, { signal: controller.signal, cache: "no-store" });
            if (!respuesta.ok) fallo("error_http");
            return normalizarRespuesta(await respuesta.json());
        } finally { clearTimeout(timer); }
    }

    function disponibilidad(producto) {
        if (producto.stock > 0) return `Stock registrado: ${producto.stock}. Confirma disponibilidad y color.`;
        if (producto.bajo_pedido) return "Bajo pedido. Consulta disponibilidad y plazo antes de pagar.";
        return producto.stock === 0 ? "Sin stock. Consulta por WhatsApp."
            : "Disponibilidad por confirmar. Consulta antes de pagar.";
    }

    return { CAMPOS, centimos, imagenSegura, normalizarRespuesta, desdeHoja, cargar, disponibilidad };
})();

if (typeof module !== "undefined" && module.exports) module.exports = CatalogoDatos;
