const CONFIG = {
    whatsapp: "51902245387",
    itemsPorPagina: 10
};

const productos = [
    { id: 1, nombre: "Organizador de Juegos PS5 - Torre de Discos Aesthetic", precio: 19, cat: "Gaming", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "¿Tus juegos de PS5 están tirados por todo el mueble? ¡Dales el lugar que se merecen con esta Torre de Discos Pro! 🎮🔵" },
    { id: 2, nombre: "Stand Laptop Ergonómico", precio: 49.00, cat: "Setup", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Mejora tu postura. Diseño ultra ventilado." },
    { id: 3, nombre: "Articulated Dragon V2", precio: 65.00, cat: "Colección", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "45 cm de longitud. Movimiento fluido." },
    { id: 4, nombre: "Organizador de Cables Pro", precio: 12.50, cat: "Setup", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Set de 5 piezas magnéticas." },
    { id: 5, nombre: "Maceta Geométrica XL", precio: 35.00, cat: "Hogar", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Impreso en PLA biodegradable." },
    { id: 6, nombre: "Soporte Mando PS5/Xbox", precio: 18.00, cat: "Gaming", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Montaje de pared o escritorio." },
    { id: 7, nombre: "Llavero Personalizado", precio: 8.00, cat: "Accesorios", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Diseño con tu nombre o logo." },
    { id: 8, nombre: "Réplica Casco Iron Man", precio: 150.00, cat: "Colección", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Escala real con detalles premium." },
    { id: 9, nombre: "Dock Nintendo Switch", precio: 45.00, cat: "Gaming", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Versión compacta para viajes." },
    { id: 10, nombre: "Lámpara Cubo Minimal", precio: 55.00, cat: "Hogar", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Incluye sistema LED RGB." },
    { id: 11, nombre: "Mouse Bungee Custom", precio: 22.00, cat: "Gaming", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Control total del cable." },
    { id: 12, nombre: "Soporte Monitor VESA", precio: 70.00, cat: "Setup", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Reforzado para pantallas de 27'." },
    { id: 13, nombre: "Caja de Herramientas Mini", precio: 30.00, cat: "Accesorios", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Ideal para tornillería pequeña." },
    { id: 14, nombre: "Figura Pokémon Low-Poly", precio: 25.00, cat: "Colección", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Estilo artístico moderno." },
    { id: 15, nombre: "Engranajes Funcionales", precio: 40.00, cat: "Tecnología", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Repuestos industriales a medida." },
    { id: 16, nombre: "Ganchos de Pared Heavy Duty", precio: 15.00, cat: "Hogar", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Soporta hasta 5kg por pieza." },
    { id: 17, nombre: "Case para Raspberry Pi", precio: 20.00, cat: "Tecnología", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Con soporte para ventilador." },
    { id: 18, nombre: "Soporte Tablet/iPad", precio: 28.00, cat: "Setup", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Ajuste multiángulo." },
    { id: 19, nombre: "Protector de Cables Wall", precio: 10.00, cat: "Setup", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Organiza tu TV u oficina." },
    { id: 20, nombre: "Calavera Decorativa", precio: 50.00, cat: "Colección", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "Detalle óseo realista." }
];

let productosFiltrados = [...productos];
let paginaActual = 1;
let categoriaActual = "Todos";

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
}

function render() {
    contenedor.innerHTML = "";
    const inicio = (paginaActual - 1) * CONFIG.itemsPorPagina;
    const itemsAMostrar = productosFiltrados.slice(inicio, inicio + CONFIG.itemsPorPagina);

    itemsAMostrar.forEach(p => {
        const urlWa = `https://wa.me/${CONFIG.whatsapp}?text=Hola%203DCIX,%20estoy%20interesado%20en%20comprar%20el%20producto:%20${encodeURIComponent(p.nombre)}`;
        
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-producto";
        tarjeta.innerHTML = `
            <div class="carrusel">
                ${p.img.map((img, i) => `<img src="${img}" class="${i===0?'activa':''}" alt="${p.nombre}">`).join('')}
                ${p.img.length > 1 ? `
                    <button class="btn-carrusel btn-prev" onclick="cambiarImg(this, -1)">❮</button>
                    <button class="btn-carrusel btn-next" onclick="cambiarImg(this, 1)">❯</button>
                ` : ''}
            </div>
            <div class="info-producto">
                <span class="categoria-label">${p.cat}</span>
                <h2>${p.nombre}</h2>
                <p style="font-size:0.9rem; color:var(--text-muted);">${p.desc}</p>
                <div class="precio">S/ ${p.precio.toFixed(2)}</div>
                <a href="${urlWa}" target="_blank" class="boton-comprar">Comprar desde WhatsApp</a>
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

document.getElementById("btn-prev-page").onclick = () => { paginaActual--; render(); window.scrollTo(0, 400); };
document.getElementById("btn-next-page").onclick = () => { paginaActual++; render(); window.scrollTo(0, 400); };

window.cambiarImg = (btn, dir) => {
    const carrusel = btn.parentElement;
    const imgs = carrusel.querySelectorAll('img');
    let act = 0;
    imgs.forEach((img, i) => { if(img.classList.contains('activa')){ act=i; img.classList.remove('activa'); } });
    let next = (act + dir + imgs.length) % imgs.length;
    imgs[next].classList.add('activa');
};

crearFiltros();
render();