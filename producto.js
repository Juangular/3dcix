"use strict";

const CATALOGO_URL = CatalogoSEO.catalogoUrl;
const moneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const estado = document.getElementById("producto-estado");
const contenedor = document.getElementById("producto");
const regreso = new URLSearchParams();
const parametros = new URLSearchParams(location.search);
const rutaId = location.pathname.match(/^\/productos\/p-([^/]+)\/?$/);
let idProducto = parametros.get("id");
try { if (rutaId) idProducto = decodeURIComponent(rutaId[1]); } catch (_) { idProducto = null; }
["q", "categoria", "pagina"].forEach(key => {
    if (parametros.has(key)) regreso.set(key, parametros.get(key));
});
document.querySelector(".back-link").href = `/${regreso.size ? `?${regreso}` : ""}#catalogo-section`;
const crear = (tag, clase, texto) => { const e = document.createElement(tag); if (clase) e.className = clase; if (texto !== undefined) e.textContent = texto; return e; };

function mostrarProducto(p) {
    document.title = `${p.nombre} | 3DCIX`;
    document.querySelector('meta[name="description"]').content = CatalogoSEO.descripcion(p);
    let schema = document.getElementById("schema-producto");
    if (!schema && document.querySelector('link[rel="canonical"]')) {
        schema = crear("script"); schema.id = "schema-producto"; schema.type = "application/ld+json";
        document.head.append(schema);
    }
    if (schema) schema.textContent = JSON.stringify(CatalogoSEO.producto(p));
    for (const [campo, valor] of [["og:title", document.title], ["og:description", CatalogoSEO.descripcion(p)]]) {
        const meta = document.querySelector(`meta[property="${campo}"]`);
        if (meta) meta.content = valor;
    }
    const galeria = crear("div", "product-gallery");
    const marco = crear("div", "carrusel");
    const fallback = crear("p", "foto-no-disponible", "Fotografía no disponible. Solicítala por WhatsApp.");
    const imagen = crear("img", "activa");
    imagen.width = 800; imagen.height = 800; imagen.alt = p.nombre;
    let actual = 0;
    const contador = crear("p", "foto-origen");
    const origen = p.foto_tipo === "real" ? "Fotografía del producto." : p.foto_tipo === "referencia" ? "Imagen de referencia." : "Origen de la fotografía por confirmar.";
    function mostrar() {
        fallback.hidden = p.img.length > 0;
        imagen.hidden = !p.img.length;
        if (p.img.length) { imagen.src = p.img[actual]; imagen.alt = `${p.nombre}, imagen ${actual + 1} de ${p.img.length}`; }
        contador.textContent = `${origen}${p.img.length > 1 ? ` Imagen ${actual + 1} de ${p.img.length}.` : ""}`;
    }
    imagen.addEventListener("error", () => { imagen.hidden = true; fallback.hidden = false; });
    marco.append(fallback, imagen);
    if (p.img.length > 1) [-1, 1].forEach(dir => {
        const b = crear("button", `btn-carrusel ${dir < 0 ? "btn-prev" : "btn-next"}`, dir < 0 ? "‹" : "›");
        b.type = "button"; b.setAttribute("aria-label", dir < 0 ? "Imagen anterior" : "Imagen siguiente");
        b.addEventListener("click", () => { actual = (actual + dir + p.img.length) % p.img.length; mostrar(); });
        marco.append(b);
    });
    mostrar(); galeria.append(marco, contador);
    const info = crear("div", "product-info");
    info.append(crear("span", "categoria-label", p.cat), crear("h1", "", p.nombre), crear("div", "precio", moneda.format(p.precio)));
    if (p.desc) info.append(crear("p", "", p.desc));
    info.append(crear("p", "disponibilidad-producto", CatalogoDatos.disponibilidad(p)));
    const lista = crear("dl");
    [["Medidas", p.medidas || "Por confirmar"], ["Material", p.material || "Por confirmar"]].forEach(([nombre, valor]) => {
        const fila = crear("div"); fila.append(crear("dt", "", nombre), crear("dd", "", valor)); lista.append(fila);
    });
    info.append(lista);
    const form = crear("form");
    const colorLabel = crear("label", "", "Color"); colorLabel.htmlFor = "color";
    const color = crear("select"); color.id = "color"; color.name = "color";
    const opciones = p.colores.length ? p.colores : ["Por confirmar"];
    opciones.forEach(valor => { const option = crear("option", "", valor); option.value = valor; color.append(option); });
    const cantidadLabel = crear("label", "", "Cantidad"); cantidadLabel.htmlFor = "cantidad";
    const cantidad = crear("input"); cantidad.id = "cantidad"; cantidad.name = "cantidad"; cantidad.type = "number"; cantidad.min = "1"; cantidad.max = "10000"; cantidad.step = "1"; cantidad.value = "1"; cantidad.required = true;
    const aviso = crear("p", "product-help", "Confirma disponibilidad y color antes de pagar. El envío se paga en destino."); aviso.setAttribute("aria-live", "polite");
    const boton = crear("button", "btn-primary", "Consultar por WhatsApp"); boton.type = "submit";
    const volumen = crear("p", "product-help", "Desde 20 unidades del mismo producto, consulta el precio y plazo por volumen.");
    const error = crear("p", "field-error"); error.setAttribute("role", "alert");
    const confirmacion = crear("p", "product-help"); confirmacion.setAttribute("role", "status");
    const agregar = crear("button", "btn-primary", "Agregar a mi pedido"); agregar.type = "button";
    const acciones = crear("div", "product-actions");
    boton.className = "btn-outline";
    acciones.append(agregar, boton);
    form.append(colorLabel, color, cantidadLabel, cantidad, aviso, error, acciones, confirmacion, volumen);
    agregar.addEventListener("click", () => {
        const n = Number(cantidad.value);
        if (!PedidoDatos.cantidadValida(n)) { error.textContent = "Introduce una cantidad entera entre 1 y 10 000."; cantidad.focus(); return; }
        const { storage, temporal } = PedidoStorage.acceso();
        if (!storage) { error.textContent = "Tu navegador no permite guardar el pedido. Puedes consultar este producto por WhatsApp."; return; }
        try {
            const lineas = PedidoDatos.agregar(PedidoDatos.leer(storage), p, color.value, n);
            PedidoDatos.guardar(storage, lineas);
            PedidoStorage.actualizarContador(); error.textContent = "";
            confirmacion.replaceChildren(document.createTextNode(temporal ? "Agregado durante esta sesión. " : "Agregado a tu pedido. "));
            const ver = crear("a", "", "Ver mi pedido"); ver.href = "pedido.html"; confirmacion.append(ver);
        } catch (e) {
            error.textContent = e.message === "cantidad_excedida" ? "La cantidad acumulada supera 10 000 unidades."
                : "No pudimos guardar el producto. Revisa Mi pedido o consulta por WhatsApp.";
        }
    });
    cantidad.addEventListener("input", () => {
        const n = Number(cantidad.value);
        boton.textContent = n >= 20 ? "Solicitar cotización por WhatsApp" : "Consultar por WhatsApp";
        aviso.textContent = n >= 20 ? "Confirma el precio y plazo por volumen antes de pagar. El envío se paga en destino."
            : p.stock !== null && n > p.stock ? "La cantidad supera el stock registrado. Consulta disponibilidad y plazo antes de pagar."
            : "Confirma disponibilidad y color antes de pagar. El envío se paga en destino.";
    });
    form.addEventListener("submit", event => {
        event.preventDefault(); const n = Number(cantidad.value);
        if (!Number.isSafeInteger(n) || n < 1 || n > 10000) { error.textContent = "Introduce una cantidad entera entre 1 y 10 000."; cantidad.focus(); return; }
        error.textContent = "";
        const tipo = n >= 20 ? "solicitar una cotización por volumen" : "consultar disponibilidad y entrega";
        const mensaje = `Hola 3DCIX, quiero ${tipo}.\nProducto: ${p.nombre}\nID: ${p.id}\nCantidad: ${n}\nColor: ${color.value}\nPrecio unitario publicado: ${moneda.format(p.precio)}\nQuisiera confirmar el precio total, la disponibilidad y el envío antes de pagar.`;
        const enlace = `https://wa.me/51902245387?text=${encodeURIComponent(mensaje)}`;
        window.open(enlace, "_blank", "noopener,noreferrer");
    });
    info.append(form, crear("p", "product-help", "El adelanto habitual es del 50 % del producto. El saldo se confirma antes del despacho; el transporte se paga en destino."));
    contenedor.replaceChildren(galeria, info); estado.hidden = true; contenedor.hidden = false;
}

async function cargarProducto() {
    const id = idProducto;
    if (!id) { estado.textContent = "No se indicó un producto. Vuelve al catálogo para elegir uno."; return; }
    try {
        const { productos } = await CatalogoDatos.cargar(CATALOGO_URL);
        const producto = productos.find(p => p.id === id);
        if (!producto) {
            document.querySelector('meta[name="robots"]').content = "noindex,follow";
            document.getElementById("schema-producto")?.remove();
            contenedor.hidden = true; estado.hidden = false;
            estado.textContent = "Este producto no está disponible. Vuelve al catálogo para ver los productos publicados."; return;
        }
        mostrarProducto(producto);
    } catch (_) {
        // La ficha estática conserva los datos del último build, pero sin oferta indexable obsoleta.
        document.getElementById("schema-producto")?.remove();
        estado.hidden = false;
        estado.replaceChildren(document.createTextNode(contenedor.hidden ? "No pudimos cargar el producto. "
            : "No pudimos actualizar el producto. Estos datos corresponden a la última publicación; confirma precio y disponibilidad por WhatsApp. "));
        const reintentar = crear("button", "btn-outline", "Volver a intentar"); reintentar.type = "button";
        reintentar.addEventListener("click", () => { estado.textContent = "Cargando producto…"; cargarProducto(); }); estado.append(reintentar);
    }
}
cargarProducto();
