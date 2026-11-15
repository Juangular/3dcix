"use strict";
const API = "https://script.google.com/macros/s/AKfycbzVDJLe8FpPEpR6Cl_1pmYGDy_k5aa7eJaZcPLpc27PNoCzguwnCH-CbpClMbRpcU24gg/exec";
const moneda = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const el = id => document.getElementById(id);
const nodo = (tag, clase, texto) => { const n = document.createElement(tag); if (clase) n.className = clase; if (texto !== undefined) n.textContent = texto; return n; };
const acceso = PedidoStorage.acceso();
let lineas = [], productos = [], analisis = null, borrada = null, cargando = false;
const estado = el("pedido-estado"), contenido = el("pedido-contenido"), envio = el("envio");

function guardar() {
    if (!acceso.storage) throw new Error("almacenamiento");
    PedidoDatos.guardar(acceso.storage, lineas);
    PedidoStorage.actualizarContador();
}
function invalidarEnvio() { envio.hidden = true; el("mensaje-pedido").value = ""; }
function mostrarEstado(texto) { estado.textContent = texto; estado.hidden = !texto; }
function mensajeError(texto) { invalidarEnvio(); mostrarEstado(texto); }

function mostrarDeshacer() {
    const destino = el("deshacer"); destino.replaceChildren();
    if (!borrada) return;
    destino.append(document.createTextNode("Producto eliminado. "));
    const boton = nodo("button", "btn-text", "Deshacer"); boton.type = "button";
    boton.addEventListener("click", () => {
        const copia = lineas.slice();
        lineas.splice(Math.min(borrada.indice, lineas.length), 0, borrada.linea);
        try { guardar(); borrada = null; invalidarEnvio(); render(); }
        catch (_) { lineas = copia; mensajeError("No pudimos recuperar el producto guardado."); }
    }); destino.append(boton);
}

function render() {
    if (!lineas.length) { analisis = null; contenido.hidden = true; mostrarEstado("Tu pedido está vacío. Explora el catálogo para agregar productos."); mostrarDeshacer(); if (borrada) { contenido.hidden = false; el("lineas").replaceChildren(); el("totales").replaceChildren(); el("datos-destino").hidden = true; } return false; }
    contenido.hidden = false; el("datos-destino").hidden = false;
    try { analisis = PedidoDatos.evaluar(lineas, productos); }
    catch (_) { analisis = null; mensajeError("El total supera el límite permitido. Reduce la cantidad y vuelve a intentar."); return false; }
    mostrarEstado(acceso.temporal ? "Tu pedido se conserva solo durante esta sesión del navegador." : "");
    const lista = el("lineas"); lista.replaceChildren();
    analisis.items.forEach((item, indice) => {
        const article = nodo("article", "order-item");
        const nombre = nodo("h3", "", item.producto ? item.producto.nombre : `Producto no disponible (ID: ${item.id})`);
        article.append(nombre);
        if (item.producto) {
            const link = nodo("a", "", "Ver producto"); link.href = `producto.html?id=${encodeURIComponent(item.id)}`; article.append(link);
            article.append(nodo("p", "order-price", `${moneda.format(item.precioActual / 100)} por unidad`));
        }
        const controls = nodo("div", "order-controls");
        const colorLabel = nodo("label", "", "Color"); colorLabel.htmlFor = `color-${indice}`;
        const color = nodo("select"); color.id = `color-${indice}`;
        const colores = item.producto && item.producto.colores.length ? [...item.producto.colores] : ["Por confirmar"];
        if (!colores.includes(item.color)) colores.unshift(item.color);
        colores.forEach(value => { const o = nodo("option", "", value); o.value = value; color.append(o); }); color.value = item.color;
        color.addEventListener("change", () => {
            const otro = lineas.findIndex((l, i) => i !== indice && l.id === item.id && l.color === color.value);
            if (otro >= 0) { color.value = item.color; mensajeError("Ese color ya está en otra línea. Cambia la cantidad en esa línea."); return; }
            const previo = lineas[indice].color; lineas[indice].color = color.value;
            try { guardar(); invalidarEnvio(); render(); } catch (_) { lineas[indice].color = previo; mensajeError("No pudimos guardar el color."); }
        });
        const cantidadLabel = nodo("label", "", "Cantidad"); cantidadLabel.htmlFor = `cantidad-${indice}`;
        const cantidad = nodo("input"); cantidad.type = "number"; cantidad.id = `cantidad-${indice}`; cantidad.min = "1"; cantidad.max = String(PedidoDatos.LIMITE); cantidad.step = "1"; cantidad.value = item.cantidad; cantidad.required = true;
        cantidad.addEventListener("change", () => {
            const n = Number(cantidad.value);
            if (!PedidoDatos.cantidadValida(n)) { cantidad.value = item.cantidad; mensajeError("La cantidad debe ser un número entero entre 1 y 10 000."); cantidad.focus(); return; }
            const previa = lineas[indice].cantidad; lineas[indice].cantidad = n;
            try { guardar(); invalidarEnvio(); render(); } catch (_) { lineas[indice].cantidad = previa; mensajeError("No pudimos guardar la cantidad."); }
        });
        controls.append(colorLabel, color, cantidadLabel, cantidad); article.append(controls);
        if (item.retirado) article.append(nodo("p", "order-warning", "Este producto ya no está publicado. Retíralo antes de continuar."));
        if (item.colorCambiado) article.append(nodo("p", "order-warning", "Este color ya no está disponible. Selecciona una opción actual antes de continuar."));
        if (item.precioCambiado) {
            article.append(nodo("p", "order-warning", `El precio cambió de ${moneda.format(item.precioCentimos / 100)} a ${moneda.format(item.precioActual / 100)} por unidad.`));
            const aceptar = nodo("button", "btn-outline", "Aceptar precio actualizado"); aceptar.type = "button";
            aceptar.addEventListener("click", () => { const anterior = lineas[indice].precioCentimos; lineas[indice].precioCentimos = item.precioActual; try { guardar(); invalidarEnvio(); render(); } catch (_) { lineas[indice].precioCentimos = anterior; mensajeError("No pudimos guardar el precio aceptado."); } }); article.append(aceptar);
        }
        if (item.volumen) article.append(nodo("p", "order-note", "Pedido por volumen: precio y plazo por confirmar."));
        else if (item.sinStock) article.append(nodo("p", "order-note", "Disponibilidad o cantidad por confirmar antes de pagar."));
        const quitar = nodo("button", "btn-text", "Quitar producto"); quitar.type = "button"; quitar.setAttribute("aria-label", `Quitar ${item.producto ? item.producto.nombre : item.id}, color ${item.color}`);
        quitar.addEventListener("click", () => { const anterior = lineas.slice(); const eliminada = lineas.splice(indice, 1)[0]; try { guardar(); borrada = { linea: eliminada, indice }; invalidarEnvio(); render(); } catch (_) { lineas = anterior; mensajeError("No pudimos quitar el producto."); } });
        article.append(quitar); lista.append(article);
    });
    const totales = el("totales"); totales.replaceChildren();
    if (analisis.cotizacion || analisis.revision) totales.append(nodo("p", "order-warning", "Precio final y plazo por confirmar en la consulta."));
    else {
        [["Total de productos orientativo", analisis.total], ["Adelanto habitual orientativo (50 %)", analisis.adelanto], ["Saldo orientativo", analisis.saldo]].forEach(([label, valor]) => {
            const fila = nodo("div", "order-total"); fila.append(nodo("span", "", label), nodo("strong", "", moneda.format(valor / 100))); totales.append(fila);
        });
        totales.append(nodo("p", "product-help", "Confirma disponibilidad e importe antes de transferir."));
    }
    el("fecha").required = analisis.items.some(i => i.volumen);
    el("fecha-requisito").textContent = el("fecha").required ? "(obligatoria para volumen)" : "(opcional)";
    mostrarDeshacer();
    return true;
}

async function actualizar() {
    if (cargando) return false;
    cargando = true; invalidarEnvio(); mostrarEstado("Actualizando disponibilidad y precios…");
    try {
        if (!acceso.storage) { mensajeError("Tu navegador no permite guardar el pedido. Consulta productos directamente por WhatsApp."); return false; }
        lineas = PedidoDatos.leer(acceso.storage);
        if (!lineas.length) { productos = []; render(); return false; }
        productos = (await CatalogoDatos.cargar(API)).productos;
        // Otra pestaña o una edición durante la consulta puede haber cambiado el pedido.
        lineas = PedidoDatos.leer(acceso.storage);
        return render();
    } catch (e) {
        contenido.hidden = true;
        if (e.message === "pedido_corrupto") {
            mostrarEstado("No pudimos leer el pedido guardado. Puedes borrarlo y empezar de nuevo.");
            const limpiar = nodo("button", "btn-outline", "Borrar pedido guardado"); limpiar.type = "button";
            limpiar.addEventListener("click", () => { try { acceso.storage.removeItem(PedidoDatos.KEY); PedidoStorage.actualizarContador(); actualizar(); } catch (_) { mostrarEstado("No pudimos borrar el pedido guardado."); } }); estado.append(" ", limpiar);
        } else mensajeError("No pudimos actualizar el catálogo. Tu pedido sigue guardado; vuelve a intentarlo.");
        if (e.message !== "pedido_corrupto") { const reintentar = nodo("button", "btn-outline", "Volver a intentar"); reintentar.type = "button"; reintentar.addEventListener("click", actualizar); estado.append(" ", reintentar); }
        return false;
    } finally { cargando = false; }
}

el("datos-destino").addEventListener("input", invalidarEnvio);
el("datos-destino").addEventListener("change", invalidarEnvio);
el("datos-destino").addEventListener("submit", async event => {
    event.preventDefault();
    const zona = el("zona").value, destino = el("destino").value.trim(), fecha = el("fecha").value;
    if (!zona || !destino) { mensajeError("Indica el destino y el distrito o ciudad antes de continuar."); el("destino").focus(); return; }
    if (!await actualizar()) return;
    if (el("zona").value !== zona || el("destino").value.trim() !== destino || el("fecha").value !== fecha) {
        mensajeError("Los datos de destino cambiaron. Revisa la consulta nuevamente."); return;
    }
    if (analisis.items.some(i => i.volumen) && !fecha) { mensajeError("Indica la fecha requerida para solicitar el pedido por volumen."); el("fecha").focus(); return; }
    if (analisis.revision) { mensajeError("Revisa los productos, colores o precios que cambiaron antes de continuar."); return; }
    const mensaje = PedidoDatos.mensaje(analisis, `${zona}: ${destino}`, fecha);
    el("mensaje-pedido").value = mensaje;
    el("whatsapp-pedido").href = `https://wa.me/51902245387?text=${encodeURIComponent(mensaje)}`;
    el("whatsapp-pedido").textContent = analisis.cotizacion ? "Solicitar cotización por WhatsApp" : "Confirmar pedido por WhatsApp";
    el("aviso-envio").textContent = "Revisa el resumen. Al abrir WhatsApp tendrás que enviar el mensaje; tu pedido permanecerá guardado.";
    envio.hidden = false;
});
el("copiar").addEventListener("click", async () => { try { await navigator.clipboard.writeText(el("mensaje-pedido").value); el("copiar-estado").textContent = "Resumen copiado."; } catch (_) { el("mensaje-pedido").focus(); el("mensaje-pedido").select(); el("copiar-estado").textContent = "Seleccionamos el resumen para que puedas copiarlo."; } });
window.addEventListener("storage", event => { if (event.key === PedidoDatos.KEY) actualizar(); });
window.addEventListener("pageshow", event => { if (event.persisted) actualizar(); });
actualizar();
