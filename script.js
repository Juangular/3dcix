const CONFIG = {
    whatsapp: "51902245387",
    itemsPorPagina: 10,
    siteUrl: "https://juangular.github.io/3dcix"
};

function escAttr(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function altImagenProducto(producto) {
    return `${producto.nombre} — ${producto.cat} | Impresión 3D Lima 3DCIX`;
}

function actualizarSchemaProductos() {
    const schemaEl = document.getElementById("schema-productos");
    if (!schemaEl || productosFiltrados.length === 0) return;

    const itemListElement = productosFiltrados.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
            "@type": "Product",
            name: p.nombre,
            description: p.desc,
            category: p.cat,
            image: p.img,
            brand: { "@type": "Brand", name: "3DCIX" },
            offers: {
                "@type": "Offer",
                price: p.precio.toFixed(2),
                priceCurrency: "PEN",
                availability: "https://schema.org/InStock",
                url: `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola 3DCIX, estoy interesado en comprar el producto: " + p.nombre)}`,
                seller: { "@type": "Organization", name: "3DCIX" }
            }
        }
    }));

    schemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Catálogo de impresión 3D — 3DCIX Lima",
        numberOfItems: productosFiltrados.length,
        itemListElement
    });
}

// Variable global para almacenar los productos que vienen de Google Sheets
let productos = []; 
let productosFiltrados = [];
let paginaActual = 1;
let categoriaActual = "Todos";

// URL que te dio Google en el paso anterior
const URL_API = "https://script.google.com/macros/s/AKfycbwvMpBZaHUWHQRGygDb-Q4oZg0rw7wjRTMLFgwaBcps9ecztfX_u2q9FeNvxwfgKSWzug/exec"; 

const loader = document.getElementById("loader");

function toggleLoader(visible) {
    if (loader) loader.classList.toggle("hidden", !visible);
}

// Función para cargar los datos
async function inicializarCatalogo() {
    toggleLoader(true);
    try {
        const respuesta = await fetch(URL_API);
        productos = await respuesta.json();
        productosFiltrados = [...productos];
        crearFiltros();
        render();
        actualizarSchemaProductos();
    } catch (error) {
        console.error("No se pudieron cargar los productos:", error);
    } finally {
        toggleLoader(false);
    }
}

// Llama a esta función al final de tu archivo en lugar de llamar a render() directamente
inicializarCatalogo();

const contenedor = document.getElementById("catalogo");
const tagsContenedor = document.getElementById("categorias-tags");

function crearFiltros() {
    const categorias = ["Todos", ...new Set(productos.map(p => p.cat))];
    tagsContenedor.innerHTML = categorias.map(c => 
        `<span class="tag ${c === categoriaActual ? 'active' : ''}" onclick="filtrar('${c}')">${c}</span>`
    ).join('');
}

function filtrar(cat) {
    categoriaActual = cat;
    paginaActual = 1;
    productosFiltrados = cat === "Todos" ? [...productos] : productos.filter(p => p.cat === cat);
    crearFiltros();
    render();
    actualizarSchemaProductos();
}

function render() {
    contenedor.innerHTML = "";
    const inicio = (paginaActual - 1) * CONFIG.itemsPorPagina;
    const itemsAMostrar = productosFiltrados.slice(inicio, inicio + CONFIG.itemsPorPagina);

    itemsAMostrar.forEach(p => {
        const urlWa = `https://wa.me/${CONFIG.whatsapp}?text=Hola%203DCIX,%20estoy%20interesado%20en%20comprar%20el%20producto:%20${encodeURIComponent(p.nombre)}`;
        
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-producto";
        tarjeta.setAttribute("itemscope", "");
        tarjeta.setAttribute("itemtype", "https://schema.org/Product");
        const altTexto = escAttr(altImagenProducto(p));
        tarjeta.innerHTML = `
            <div class="carrusel">
                ${p.img.map((img, i) => `<img src="${img}" class="${i===0?'activa':''}" alt="${altTexto}" itemprop="image" ${i > 0 ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`).join('')}
                ${p.img.length > 1 ? `
                    <button class="btn-carrusel btn-prev" onclick="cambiarImg(this, -1)" aria-label="Imagen anterior de ${escAttr(p.nombre)}">❮</button>
                    <button class="btn-carrusel btn-next" onclick="cambiarImg(this, 1)" aria-label="Imagen siguiente de ${escAttr(p.nombre)}">❯</button>
                ` : ''}
            </div>
            <div class="info-producto">
                <span class="categoria-label" itemprop="category">${p.cat}</span>
                <h2 itemprop="name">${p.nombre}</h2>
                <p class="desc-producto" itemprop="description">${p.desc}</p>
                <div class="precio" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="priceCurrency" content="PEN">
                    <span itemprop="price" content="${p.precio.toFixed(2)}">S/ ${p.precio.toFixed(2)}</span>
                    <link itemprop="availability" href="https://schema.org/InStock">
                </div>
                <a href="${urlWa}" target="_blank" rel="noopener" class="boton-comprar">Comprar desde WhatsApp</a>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
    actualizarPaginacion();
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(productosFiltrados.length / CONFIG.itemsPorPagina);
    document.getElementById("info-página").innerText = `Página ${paginaActual} de ${totalPaginas || 1}`;
    document.getElementById("btn-prev-page").disabled = paginaActual === 1;
    document.getElementById("btn-next-page").disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

const catalogoSection = document.getElementById("catalogo-section");

function scrollToCatalogo() {
    catalogoSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("btn-prev-page").onclick = () => { paginaActual--; render(); scrollToCatalogo(); };
document.getElementById("btn-next-page").onclick = () => { paginaActual++; render(); scrollToCatalogo(); };

window.cambiarImg = (btn, dir) => {
    const carrusel = btn.parentElement;
    const imgs = carrusel.querySelectorAll('img');
    let act = 0;
    imgs.forEach((img, i) => { if(img.classList.contains('activa')){ act=i; img.classList.remove('activa'); } });
    let next = (act + dir + imgs.length) % imgs.length;
    imgs[next].classList.add('activa');
};
