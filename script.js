"use strict";

const CONFIG = {
    whatsapp: "51902245387",
    itemsPorPagina: 10,
    siteUrl: "https://3dcix.vercel.app",
    // API de lectura con publicación explícita y campos normalizados.
    catalogoUrl: "https://script.google.com/macros/s/AKfycbzVDJLe8FpPEpR6Cl_1pmYGDy_k5aa7eJaZcPLpc27PNoCzguwnCH-CbpClMbRpcU24gg/exec"
};

let productos = [];
let productosFiltrados = [];
let paginaActual = 1;
let categoriaActual = null;
let cargando = false;
const moneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const contenedor = document.getElementById("catalogo");
const tagsContenedor = document.getElementById("categorias-tags");
const loader = document.getElementById("loader");
const aviso = document.getElementById("catalogo-aviso");
const mensaje = document.getElementById("catalogo-mensaje");
const reintentar = document.getElementById("catalogo-reintentar");
const anterior = document.getElementById("btn-prev-page");
const siguiente = document.getElementById("btn-next-page");
const buscador = document.getElementById("buscar-productos");

function nodo(tag, clase, contenido) {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    if (contenido !== undefined) el.textContent = contenido;
    return el;
}

function mostrarAviso(texto, permiteReintento = false) {
    aviso.hidden = !texto;
    mensaje.textContent = texto;
    reintentar.hidden = !permiteReintento;
}

function actualizarSchemaProductos() {
    const schema = {
        "@context": "https://schema.org", "@type": "ItemList",
        name: "Catálogo de productos 3DCIX", numberOfItems: productosFiltrados.length,
        itemListElement: productosFiltrados.map((p, i) => {
            const offer = {
                "@type": "Offer", price: p.precio.toFixed(2), priceCurrency: "PEN",
                url: `${CONFIG.siteUrl}/#catalogo-section`,
                seller: { "@type": "Organization", name: "3DCIX" }
            };
            // Stock desconocido no se convierte en InStock ni en fabricación confirmada.
            if (p.stock !== null) offer.availability = p.stock > 0
                ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
            const item = { "@type": "Product", name: p.nombre, description: p.desc,
                category: p.cat, brand: { "@type": "Brand", name: "3DCIX" }, offers: offer };
            if (p.img.length) item.image = p.img.map(src => new URL(src, `${CONFIG.siteUrl}/`).href);
            return { "@type": "ListItem", position: i + 1, item };
        })
    };
    document.getElementById("schema-productos").textContent = JSON.stringify(schema);
}

async function inicializarCatalogo() {
    if (cargando) return;
    cargando = true;
    loader.hidden = false;
    loader.classList.remove("hidden");
    loader.setAttribute("aria-busy", "true");
    contenedor.setAttribute("aria-busy", "true");
    mostrarAviso("");
    reintentar.disabled = true;
    anterior.disabled = siguiente.disabled = true;
    productos = [];
    productosFiltrados = [];
    contenedor.replaceChildren();
    tagsContenedor.replaceChildren();
    actualizarSchemaProductos();
    try {
        const resultado = await CatalogoDatos.cargar(CONFIG.catalogoUrl);
        productos = resultado.productos;
        leerEstado();
        if (resultado.descartados) console.warn(`Registros de catálogo omitidos: ${resultado.descartados}`);
        crearFiltros();
        aplicarFiltros();
        if (!productos.length) mostrarAviso("Aún no hay productos publicados. Puedes consultar el catálogo por WhatsApp.");
    } catch (error) {
        console.error("No se pudo cargar el catálogo:", error.message);
        mostrarAviso("No pudimos cargar los productos. Vuelve a intentarlo o consúltanos por WhatsApp.", true);
    } finally {
        cargando = false;
        reintentar.disabled = false;
        loader.classList.add("hidden");
        loader.hidden = true;
        loader.setAttribute("aria-busy", "false");
        contenedor.setAttribute("aria-busy", "false");
        actualizarPaginacion();
    }
}

function crearFiltros() {
    const categorias = [null, ...new Set(productos.map(p => p.cat))];
    tagsContenedor.replaceChildren(...categorias.map(cat => {
        const boton = nodo("button", `tag${cat === categoriaActual ? " active" : ""}`, cat === null ? "Todos" : cat);
        boton.type = "button";
        boton.setAttribute("aria-pressed", String(cat === categoriaActual));
        boton.addEventListener("click", () => filtrar(cat));
        return boton;
    }));
}

function filtrar(cat) {
    categoriaActual = cat;
    paginaActual = 1;
    guardarEstado("pushState");
    aplicarFiltros();
}

function actualizarBotones() {
    // Conservar los botones mantiene el foco del filtro activado con teclado.
    [...tagsContenedor.children].forEach((boton, i) => {
        const activo = i === 0 ? categoriaActual === null : boton.textContent === categoriaActual;
        boton.classList.toggle("active", activo);
        boton.setAttribute("aria-pressed", String(activo));
    });
}

function aplicarFiltros() {
    const query = buscador.value.trim().toLocaleLowerCase("es-PE");
    productosFiltrados = productos.filter(p => (categoriaActual === null || p.cat === categoriaActual)
        && [p.nombre, p.cat, p.desc].some(texto => texto.toLocaleLowerCase("es-PE").includes(query)));
    paginaActual = Math.min(paginaActual, Math.max(1, Math.ceil(productosFiltrados.length / CONFIG.itemsPorPagina)));
    actualizarBotones();
    render();
    if (productos.length && !productosFiltrados.length) mostrarAviso("No encontramos productos con esa búsqueda. Prueba con otro término o categoría.");
    else mostrarAviso("");
}

function leerEstado() {
    const params = new URLSearchParams(location.search);
    buscador.value = params.get("q") || "";
    const categoria = params.get("categoria");
    categoriaActual = productos.some(p => p.cat === categoria) ? categoria : null;
    const pagina = Number(params.get("pagina"));
    paginaActual = Number.isSafeInteger(pagina) && pagina > 0 ? pagina : 1;
}

function guardarEstado(metodo) {
    const url = new URL(location.href);
    const busqueda = buscador.value.trim();
    if (busqueda) url.searchParams.set("q", busqueda); else url.searchParams.delete("q");
    if (categoriaActual !== null) url.searchParams.set("categoria", categoriaActual); else url.searchParams.delete("categoria");
    if (paginaActual > 1) url.searchParams.set("pagina", paginaActual); else url.searchParams.delete("pagina");
    history[metodo](null, "", url);
}

function flecha(dir) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", dir < 0 ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    svg.append(path);
    return svg;
}

function crearCarrusel(p) {
    const carrusel = nodo("div", "carrusel");
    const sinFoto = nodo("p", "foto-no-disponible", "Fotografía no disponible. Solicítala por WhatsApp.");
    carrusel.append(sinFoto);
    const imagenes = p.img.map((src, i) => {
        const imagen = nodo("img", i === 0 ? "activa" : "");
        imagen.alt = `${p.nombre}, imagen ${i + 1}`;
        imagen.width = 600;
        imagen.height = 520;
        imagen.loading = "lazy";
        imagen.decoding = "async";
        imagen.src = src;
        imagen.addEventListener("error", () => {
            imagen.dataset.fallida = "true";
            if (imagen.classList.contains("activa")) mostrar(i);
        });
        return imagen;
    });
    let actual = 0;
    const controles = [];
    function mostrar(indice) {
        actual = indice;
        imagenes.forEach((img, i) => img.classList.toggle("activa", i === actual));
        const rota = !imagenes.length || imagenes[actual].dataset.fallida === "true";
        sinFoto.hidden = !rota;
        imagenes.forEach(img => { img.hidden = img.dataset.fallida === "true"; });
        controles.forEach(boton => { boton.hidden = imagenes.every(img => img.dataset.fallida === "true"); });
    }
    carrusel.append(...imagenes);
    if (imagenes.length > 1) [-1, 1].forEach(dir => {
        const boton = nodo("button", `btn-carrusel ${dir < 0 ? "btn-prev" : "btn-next"}`);
        boton.type = "button";
        boton.setAttribute("aria-label", `${dir < 0 ? "Imagen anterior" : "Imagen siguiente"} de ${p.nombre}`);
        boton.append(flecha(dir));
        boton.addEventListener("click", () => mostrar((actual + dir + imagenes.length) % imagenes.length));
        controles.push(boton);
        carrusel.append(boton);
    });
    mostrar(0);
    return carrusel;
}

function render() {
    const inicio = (paginaActual - 1) * CONFIG.itemsPorPagina;
    contenedor.replaceChildren(...productosFiltrados.slice(inicio, inicio + CONFIG.itemsPorPagina).map(p => {
        const tarjeta = nodo("article", "tarjeta-producto");
        tarjeta.setAttribute("role", "listitem");
        const info = nodo("div", "info-producto");
        info.append(nodo("span", "categoria-label", p.cat), nodo("h3", "", p.nombre));
        if (p.desc) info.append(nodo("p", "desc-producto", p.desc));
        info.append(nodo("div", "precio", moneda.format(p.precio)));
        info.append(nodo("p", "disponibilidad-producto", CatalogoDatos.disponibilidad(p)));
        info.append(nodo("p", "foto-origen", p.foto_tipo === "real" ? "Fotografía del producto."
            : p.foto_tipo === "referencia" ? "Imagen de referencia." : "Origen de la fotografía por confirmar."));
        const enlace = nodo("a", "boton-comprar", "Ver producto");
        const detalle = new URL("producto.html", location.href);
        detalle.searchParams.set("id", p.id);
        const regreso = new URLSearchParams(location.search);
        ["q", "categoria", "pagina"].forEach(key => {
            if (regreso.has(key)) detalle.searchParams.set(key, regreso.get(key));
        });
        enlace.href = detalle.href;
        enlace.setAttribute("aria-label", `Ver producto: ${p.nombre}`);
        info.append(enlace);
        tarjeta.append(crearCarrusel(p), info);
        return tarjeta;
    }));
    actualizarPaginacion();
    actualizarSchemaProductos();
    document.getElementById("resultados").textContent = productosFiltrados.length
        ? `${productosFiltrados.length} ${productosFiltrados.length === 1 ? "producto" : "productos"}` : "";
}

function actualizarPaginacion() {
    const paginas = Math.ceil(productosFiltrados.length / CONFIG.itemsPorPagina);
    document.getElementById("info-página").textContent = `Página ${paginaActual} de ${paginas || 1}`;
    anterior.disabled = cargando || paginaActual <= 1;
    siguiente.disabled = cargando || paginaActual >= paginas;
    document.querySelector(".paginacion").hidden = paginas <= 1;
}

function cambiarPagina(dir) {
    const paginas = Math.ceil(productosFiltrados.length / CONFIG.itemsPorPagina);
    if (cargando || paginaActual + dir < 1 || paginaActual + dir > paginas) return;
    paginaActual += dir;
    guardarEstado("pushState");
    render();
    const seccion = document.getElementById("catalogo-section");
    seccion.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    seccion.focus({ preventScroll: true });
}

anterior.addEventListener("click", () => cambiarPagina(-1));
siguiente.addEventListener("click", () => cambiarPagina(1));
reintentar.addEventListener("click", inicializarCatalogo);
buscador.addEventListener("input", () => { paginaActual = 1; guardarEstado("replaceState"); aplicarFiltros(); });
window.addEventListener("popstate", () => { leerEstado(); aplicarFiltros(); });
inicializarCatalogo();
