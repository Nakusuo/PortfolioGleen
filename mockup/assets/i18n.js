// Idioma: el HTML está escrito en inglés (para managers, agencias y marcas) y
// cada texto lleva su versión en español en data-es. El botón EN/ES cambia
// entre ambos y la elección se recuerda en este navegador.
//
//   <p data-es="Hola">Hello</p>          texto
//   <a data-es-aria="Cerrar" aria-label="Close">   etiqueta accesible
//   <input data-es-placeholder="..." placeholder="...">
//
// Los scripts de cada página usan t("english", "español") y escuchan el
// evento "langchange" para volver a pintar lo que generan ellos mismos.

let lang = "en";
try { lang = localStorage.getItem("lang") === "es" ? "es" : "en"; } catch (e) {}

const t = (en, es) => (lang === "es" ? es : en);

function applyLang(next) {
  lang = next;
  try { localStorage.setItem("lang", lang); } catch (e) {}
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-es]").forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === "es" ? el.dataset.es : el.dataset.en;
    // Los títulos con desregistro repiten su texto en data-t
    if (el.dataset.t !== undefined) el.dataset.t = el.textContent;
  });
  for (const attr of ["aria", "placeholder", "title"]) {
    const real = attr === "aria" ? "aria-label" : attr;
    document.querySelectorAll(`[data-es-${attr}]`).forEach(el => {
      const key = "en" + attr[0].toUpperCase() + attr.slice(1);
      if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(real) || "";
      el.setAttribute(real, lang === "es" ? el.getAttribute(`data-es-${attr}`) : el.dataset[key]);
    });
  }
  document.querySelectorAll(".lang-toggle button").forEach(b => b.setAttribute("aria-pressed", b.value === lang));
  dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

// Botón EN / ES en la cabecera
const langBox = document.createElement("div");
langBox.className = "lang-toggle";
langBox.setAttribute("role", "group");
langBox.setAttribute("aria-label", "Language / Idioma");
langBox.innerHTML = `<button type="button" value="en" lang="en">EN</button><button type="button" value="es" lang="es">ES</button>`;
langBox.addEventListener("click", e => { const b = e.target.closest("button"); if (b && b.value !== lang) applyLang(b.value); });
(document.querySelector(".masthead") || document.body).append(langBox);

if (lang === "es") applyLang("es");
else langBox.querySelector('[value="en"]').setAttribute("aria-pressed", "true"), langBox.querySelector('[value="es"]').setAttribute("aria-pressed", "false");

// ---------- Imágenes reales: aparecen solas cuando el archivo existe ----------
// <div class="asset" data-asset="nombre del hueco" data-src="assets/obras/x.jpg">
// Si el archivo no está, se queda el hueco con su nombre.
document.querySelectorAll("[data-src]").forEach(el => {
  const img = new Image();
  img.onload = () => { el.style.backgroundImage = `url("${el.dataset.src}")`; el.classList.add("has-img"); };
  img.src = el.dataset.src;
});
