var PedidoStorage = (() => {
    "use strict";
    // La alternativa de sesión permite navegar cuando localStorage está bloqueado.
    function acceso() {
        for (const tipo of ["localStorage", "sessionStorage"]) {
            try {
                const storage = window[tipo];
                const prueba = "3dcix-prueba-almacenamiento";
                storage.setItem(prueba, "1"); storage.removeItem(prueba);
                return { storage, temporal: tipo === "sessionStorage" };
            } catch (_) { /* Probar el siguiente almacenamiento. */ }
        }
        return { storage: null, temporal: true };
    }
    function actualizarContador() {
        const { storage } = acceso();
        let total = 0;
        try { if (storage) total = PedidoDatos.leer(storage).reduce((sum, l) => sum + l.cantidad, 0); } catch (_) { /* Se informa en Mi pedido. */ }
        document.querySelectorAll("[data-pedido-count]").forEach(el => { el.textContent = total ? ` (${total})` : ""; });
    }
    return { acceso, actualizarContador };
})();
PedidoStorage.actualizarContador();
