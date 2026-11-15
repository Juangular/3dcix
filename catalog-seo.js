/* Metadatos compartidos por el build y la actualización del catálogo en navegador. */
var CatalogoSEO = (() => {
    "use strict";
    const siteUrl = "https://3dcix.vercel.app";
    const catalogoUrl = "https://script.google.com/macros/s/AKfycbzVDJLe8FpPEpR6Cl_1pmYGDy_k5aa7eJaZcPLpc27PNoCzguwnCH-CbpClMbRpcU24gg/exec";
    const ruta = id => `/productos/p-${encodeURIComponent(id)}/`;
    const url = id => siteUrl + ruta(id);
    const descripcion = p => (p.desc || `Consulta ${p.nombre}, sus opciones y disponibilidad en 3DCIX.`).replace(/\s+/g, " ").slice(0, 170);
    function producto(p) {
        const schema = {
            "@context": "https://schema.org", "@type": "Product", "@id": `${url(p.id)}#producto`,
            name: p.nombre, description: p.desc || descripcion(p), sku: p.id, category: p.cat, url: url(p.id),
            offers: { "@type": "Offer", price: p.precio.toFixed(2), priceCurrency: "PEN", url: url(p.id),
                seller: { "@type": "Organization", name: "3DCIX", url: siteUrl } }
        };
        // El stock desconocido y la fabricación por consultar no acreditan disponibilidad.
        if (p.stock !== null) schema.offers.availability = p.stock > 0
            ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
        if (p.img.length) schema.image = p.img.map(src => new URL(src, `${siteUrl}/`).href);
        if (p.material) schema.material = p.material;
        return schema;
    }
    function lista(productos) {
        return { "@context": "https://schema.org", "@type": "ItemList", name: "Catálogo de productos 3DCIX",
            numberOfItems: productos.length, itemListElement: productos.map((p, i) => ({
                "@type": "ListItem", position: i + 1, name: p.nombre, url: url(p.id)
            })) };
    }
    return { siteUrl, catalogoUrl, ruta, url, descripcion, producto, lista };
})();
if (typeof module !== "undefined" && module.exports) module.exports = CatalogoSEO;
