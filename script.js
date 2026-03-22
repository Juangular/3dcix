const CONFIG = {
    whatsapp: "51902245387",
    itemsPorPagina: 10
};

const productos = [
    { id: 1, nombre: "Organizador de Juegos PS5 - Torre de Discos Aesthetic", precio: 19.00, cat: "Gaming", img: ["Assets/Soporte Juego 1.jpg", "Assets/Soporte Juego 2.jpg", "Assets/Soporte Juego 3.jpg", "Assets/Soporte Juego 4.jpg"], desc: "¿Tus juegos de PS5 están tirados por todo el mueble? ¡Dales el lugar que se merecen con esta Torre de Discos Pro! 🎮🔵" },
    { id: 2, nombre: "Soporte Audífonos Sakura Aesthetic - Diseño Cerezo Japonés", precio: 33.00, cat: "Setup", img: ["Assets/Soporte Audifonos 4.jpg", "Assets/Soporte Audifonos 2.jpeg", "Assets/Soporte Audifonos 3.jpeg", "Assets/Soporte Audifonos 1.jpg"], desc: "¿Quieres el setup más lindo de Lima? Dale un toque Zen y Aesthetic a tu escritorio con el Soporte Sakura. 🌸✨" },
    { id: 3, nombre: "Soporte Gamer 2 en 1 - Audífonos y Mando Pro", precio: 17.00, cat: "Gaming", img: ["Assets/Soporte 2 en 1 3.jpg", "Assets/Soporte 2 en 1 2.jpg", "Assets/Soporte 2 en 1 1.jpg"], desc: "¿Cansado del desorden en tu escritorio? Organiza tu Setup como un Pro con este soporte 2 en 1. 🎧🎮" },
    { id: 4, nombre: "Cactus Love Aesthetic - Decoració Tejida 3D", precio: 25.00, cat: "Detalles", img: ["Assets/Captus love 4.jpg", "Assets/Captus love 2.jpg", "Assets/Captus love 3.jpg", "Assets/Captus love 1.jpg", "Assets/Captus love 5.jpg"], desc: "¿Buscas un detalle único que dure para siempre? Regala un Cactus Love que nunca se marchita. 🌵💚" },
    { id: 5, nombre: "Exhibidor Hot Wheels Garage - Logo Multicolor", precio: 29.00, cat: "Colección", img: ["Assets/Garaje hot wheels 1.jpg", "Assets/Garaje hot wheels 2.jpg", "Assets/Garaje hot wheels 3.jpg", "Assets/Garaje hot wheels 4.jpg"], desc: "¿Tus Hot Wheels favoritos siguen en una caja? ¡Dales el garaje que se merecen! 🏎️🔥" },
    { id: 6, nombre: "Organizador Joyas Aesthetic Premium - Porta Collares y Anillos", precio: 35.00, cat: "Hogar", img: ["Assets/Soporte joyas 3.jpg", "Assets/Soporte joyas 2.jpg", "Assets/Soporte joyas 1.jpg", "Assets/Soporte joyas 4.png"], desc: "¿Cansada de que tus collares se enreden? Dale a tus joyas el lugar que merecen con este organizador de diseño minimalista. ✨" },
    { id: 7, nombre: "Ajedrez Minimalista Premium - Diseño Plegable y Portátil", precio: 27.00, cat: "Colección", img: ["Assets/Ajedrez 1.jpg", "Assets/Ajedrez 2.jpg", "Assets/Ajedrez 3.jpg"], desc: "¿Buscas un ajedrez que combine con tu estilo? Redescubre el juego ciencia con este diseño minimalista y portátil. ♟️✨" },
    { id: 8, nombre: "Soporte Vertical Laptop - Ahorra Espacio Setup Pro", precio: 20.00, cat: "Setup", img: ["Assets/Soporte laptop 1.jpg", "Assets/Soporte laptop 2.jpg", "Assets/Soporte laptop 3.jpg", "Assets/Soporte laptop 4.jpg", "Assets/Soporte laptop 5.jpg", "Assets/Soporte laptop 6.jpg"], desc: "¿Escritorio lleno? Recupera tu espacio de trabajo con el Soporte Vertical Pro. 💻🚀" },
    { id: 9, nombre: "Poké Balance Challenge - Juguete de Equilibrio", precio: 86.00, cat: "Colección", img: ["Assets/Juego pokemon 5.jpeg", "Assets/Juego pokemon 2.jpeg", "Assets/Juego pokemon 3.jpeg", "Assets/Juego pokemon 4.jpeg", "Assets/Juego pokemon 1.jpeg", "Assets/Juego pokemon 6.jpeg", "Assets/Juego pokemon 7.jpeg", "Assets/Juego pokemon 8.jpeg"], desc: "¿Tienes buen equilibrio? ¡Acepta el reto Poké Balance y demuestra tus habilidades! 🔴⚪" },
    { id: 10, nombre: "Soporte Lentes Minimalista - Organizador Escultórico", precio: 29.00, cat: "Setup", img: ["Assets/Soporte lentes 1.jpg", "Assets/Soporte lentes 2.jpg", "Assets/Soporte lentes 3.jpg"], desc: "¿Cansado de rayar tus lentes o no saber dónde los dejaste? Cuídalos con estilo. ✨👓" },
    { id: 11, nombre: "Garaje Doble Hot Wheels Premium - Exhibidor con Portón", precio: 17.00, cat: "Colección", img: ["Assets/Garaje doble hot wheels 4.jpg", "Assets/Garaje doble hot wheels 2.jpg", "Assets/Garaje doble hot wheels 3.jpg", "Assets/Garaje doble hot wheels 1.jpg"], desc: "¡Dale a tus mejores Hot Wheels un garaje de lujo con portón funcional! 🏎️ Garage Pro 3D." }
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