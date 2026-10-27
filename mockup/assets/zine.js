// Glenn · Zine Nº 01 — comportamiento compartido por todas las páginas.
// En la web final (Astro) las pestañas y el pie serán componentes; aquí se
// generan desde PAGES para no repetir el mismo HTML en cada archivo.

// t() y el idioma vienen de i18n.js, que se carga antes
const PAGES = [
  { file: "index.html",       n: "01", en: "Cover",        es: "Portada",       color: "#FFFFFF" },
  { file: "mixed-media.html", n: "02", en: "Mixed media",  es: "Mixed media",   color: "#FF48B0" },
  { file: "ilustracion.html", n: "03", en: "Painting",     es: "Pintura",       color: "#00A95C" },
  { file: "fanart.html",      n: "04", en: "Music",        es: "Música",        color: "#FF48B0" },
  { file: "proceso.html",     n: "05", en: "Process",      es: "Proceso",       color: "#FFFFFF" },
  { file: "encargos.html",    n: "06", en: "Services ★",   es: "Servicios ★",   color: "#FFE800" },
  { file: "sobre-mi.html",    n: "07", en: "About",        es: "Sobre mí",      color: "#FFFFFF" },
  { file: "contacto.html",    n: "08", en: "Contact",      es: "Contacto",      color: "#FF48B0" },
];
const nameOf = p => t(p.en, p.es);

// Alto de la barra de maqueta, para que las páginas a pantalla completa la descuenten
const mast = document.querySelector(".masthead") || { offsetHeight: 0 };

// Alto de lo que hay encima de la hoja, para que la portada a pantalla completa lo descuente
const mockbar = document.querySelector(".mockbar");
const setBar = () => document.documentElement.style.setProperty("--bar", ((mockbar ? mockbar.offsetHeight : 0) + mast.offsetHeight) + "px");
setBar(); addEventListener("resize", setBar);

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const here = location.pathname.split("/").pop() || "index.html";
const idx = Math.max(0, PAGES.findIndex(p => p.file === here));

// ---------- Pestañas laterales ----------
const tabs = document.createElement("nav");
tabs.className = "tabs";
const renderTabs = () => {
  tabs.setAttribute("aria-label", t("Zine pages", "Páginas del zine"));
  tabs.innerHTML = PAGES.map((p, i) =>
    `<a href="${p.file}" style="--c:${p.color}" ${i === idx ? 'aria-current="page"' : ""}><b>${p.n}</b>${nameOf(p)}</a>`
  ).join("");
};
renderTabs();
document.body.append(tabs);

// ---------- Pie: página anterior / siguiente ----------
const page = document.querySelector(".page");
const prev = PAGES[idx - 1], next = PAGES[idx + 1];
const pager = document.createElement("nav");
pager.className = "pager";
const renderPager = () => {
  pager.setAttribute("aria-label", t("Turn the page", "Pasar página"));
  pager.innerHTML =
    (prev ? `<a href="${prev.file}" rel="prev" data-dir="back">← <span><small>p.${prev.n}</small>${nameOf(prev)}</span></a>` : "") +
    `<span class="kbd" aria-hidden="true">${t("use ← → to turn the page", "usa ← → para pasar página")}</span>` +
    (next ? `<a class="next" href="${next.file}" rel="next"><span><small>p.${next.n}</small>${nameOf(next)}</span> →</a>` : "");
};
renderPager();
page.after(pager);

// Teclas ← → pasan página (salvo escribiendo en un campo o con un diálogo abierto)
addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey || document.querySelector("dialog[open]")) return;
  if (e.target.closest("input, textarea, select, [contenteditable]")) return;
  if (e.key === "ArrowRight" && next) go(next.file, "forward");
  if (e.key === "ArrowLeft" && prev) go(prev.file, "back");
});

// ---------- Pasar página ----------
// Con View Transitions entre documentos el giro lo hace el CSS. Sin ellas
// (Firefox), la hoja se va girando con .leaving y después se navega.
const nativeTurn = "onpagereveal" in window;
let turning = false;
function go(file, dir) {
  if (turning) return;
  sessionStorage.setItem("zine-dir", dir);
  if (nativeTurn || reduceMotion) { location.href = file; return; }
  turning = true;
  page.classList.add("leaving");
  if (dir === "back") page.classList.add("back");
  const done = () => { location.href = file; };
  page.addEventListener("animationend", done, { once: true });
  setTimeout(done, 700); // por si animationend no llega
}
const pageIndexOf = href => PAGES.findIndex(p => href.split(/[?#]/)[0] === p.file);
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = a.getAttribute("href");
  const to = pageIndexOf(href);
  if (to === -1 || to === idx) return;
  e.preventDefault();
  go(href, to < idx ? "back" : "forward");
});
// Respaldo: la nueva hoja aparece aclarándose
if (!nativeTurn && !reduceMotion && sessionStorage.getItem("zine-dir")) page.classList.add("arriving");
setTimeout(() => sessionStorage.removeItem("zine-dir"), 1200);
// Volver con el botón "atrás" del navegador no debe dejar la hoja girada
addEventListener("pageshow", e => { if (e.persisted) { page.classList.remove("leaving", "back"); turning = false; } });

// Esquina doblada para pasar a la siguiente
if (next) {
  const curl = document.createElement("a");
  curl.className = "curl";
  curl.href = next.file;
  curl.innerHTML = `<span aria-hidden="true">p.${next.n} →</span>`;
  const label = () => curl.setAttribute("aria-label", t(`Turn to page ${next.n}: ${next.en}`, `Pasar a la página ${next.n}: ${next.es}`));
  label(); addEventListener("langchange", label);
  page.append(curl);
}
addEventListener("langchange", () => { renderTabs(); renderPager(); });

// Deslizar el dedo para pasar página (en celulares y tablets)
let sx = 0, sy = 0, st = 0, swipeOk = false;
addEventListener("touchstart", e => {
  const t = e.touches[0];
  swipeOk = e.touches.length === 1 && !document.querySelector("dialog[open]") &&
    !e.target.closest("input, textarea, select, [data-drag], .tabs, .scatter");
  sx = t.clientX; sy = t.clientY; st = performance.now();
}, { passive: true });
addEventListener("touchend", e => {
  if (!swipeOk) return;
  const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
  if (performance.now() - st > 700 || Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
  if (dx < 0 && next) go(next.file, "forward");
  if (dx > 0 && prev) go(prev.file, "back");
}, { passive: true });

// ---------- Garabatos: se dibujan una vez al entrar en pantalla ----------
const doodles = document.querySelectorAll(".doodle.draw");
if (reduceMotion) doodles.forEach(d => d.classList.add("in"));
else {
  const dio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add("in"), 250); dio.unobserve(e.target); }
  }), { threshold: .5 });
  doodles.forEach(d => dio.observe(d));
}

// ---------- Lightbox: cualquier [data-obra] abre su ficha ----------
// data-obra="Title|Technique|Size|Year|Status" y data-obra-es con lo mismo en español.
// La imagen grande es la misma que el hueco de la obra (data-src).
const obras = [...document.querySelectorAll("[data-obra]")];
if (obras.length) {
  const dlg = document.createElement("dialog");
  dlg.className = "obra-dlg";
  dlg.setAttribute("aria-labelledby", "obra-t");
  dlg.innerHTML = `
    <div class="obra-card">
      <span class="tape" aria-hidden="true"></span>
      <button class="icon-btn obra-close"></button>
      <div class="asset" id="obra-img"></div>
      <div class="info">
        <span class="dymo" id="obra-n"></span>
        <h2 id="obra-t"></h2>
        <dl><dt data-l="Technique|Técnica"></dt><dd id="obra-tec"></dd><dt data-l="Size|Tamaño"></dt><dd id="obra-tam"></dd>
            <dt data-l="Year|Año"></dt><dd id="obra-y"></dd><dt data-l="Status|Estado"></dt><dd id="obra-e"></dd></dl>
        <div class="obra-nav">
          <button class="icon-btn" data-step="-1">←</button>
          <button class="icon-btn" data-step="1">→</button>
          <a class="btn" href="contacto.html" style="min-height:48px" data-l="Start a project|Empezar un proyecto"></a>
        </div>
      </div>
    </div>`;
  document.body.append(dlg);
  let cur = 0;
  const $ = id => dlg.querySelector("#" + id);
  const labels = () => {
    dlg.querySelectorAll("[data-l]").forEach(el => { const [en, es] = el.dataset.l.split("|"); el.textContent = t(en, es); });
    dlg.querySelector(".obra-close").setAttribute("aria-label", t("Close", "Cerrar"));
    dlg.querySelector('[data-step="-1"]').setAttribute("aria-label", t("Previous piece", "Obra anterior"));
    dlg.querySelector('[data-step="1"]').setAttribute("aria-label", t("Next piece", "Obra siguiente"));
  };
  const show = i => {
    cur = (i + obras.length) % obras.length;
    const el = obras[cur];
    const [ti, tec, tam, y, est] = ((lang === "es" && el.dataset.obraEs) || el.dataset.obra).split("|");
    $("obra-t").textContent = ti; $("obra-tec").textContent = tec; $("obra-tam").textContent = tam;
    $("obra-y").textContent = y; $("obra-e").textContent = est;
    $("obra-n").textContent = `${cur + 1} / ${obras.length}`;
    const src = el.querySelector("[data-src]");
    const img = $("obra-img");
    img.dataset.asset = ti;
    img.style.backgroundImage = src && src.classList.contains("has-img") ? `url("${src.dataset.src}")` : "";
    img.classList.toggle("has-img", !!(src && src.classList.contains("has-img")));
  };
  labels();
  addEventListener("langchange", () => { labels(); if (dlg.open) show(cur); });
  obras.forEach((el, i) => el.addEventListener("click", e => {
    if (el.dataset.dragged) { delete el.dataset.dragged; return; }
    e.preventDefault(); show(i); dlg.showModal();
  }));
  dlg.querySelector(".obra-close").onclick = () => dlg.close();
  dlg.querySelectorAll("[data-step]").forEach(b => b.onclick = () => show(cur + +b.dataset.step));
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
}

// ---------- Arrastrar ([data-drag]) — decorativo, con umbral para no romper el clic ----------
document.querySelectorAll("[data-drag]").forEach(el => {
  let x = 0, y = 0;
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    const sx = e.clientX - x, sy = e.clientY - y, ox = e.clientX, oy = e.clientY;
    let moved = false;
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - ox, ev.clientY - oy) < 6) return;
      if (!moved) { moved = true; el.setPointerCapture(e.pointerId); el.style.zIndex = 20; }
      x = ev.clientX - sx; y = ev.clientY - sy;
      el.style.translate = `${x}px ${y}px`;
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      // El clic que sigue a soltar no debe abrir la ficha
      if (moved) { el.dataset.dragged = "1"; setTimeout(() => delete el.dataset.dragged, 0); }
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up, { once: true });
  });
  el.addEventListener("dragstart", e => e.preventDefault());
  el._reset = () => { x = y = 0; el.style.translate = ""; };
});
document.querySelectorAll("[data-reset]").forEach(b => b.onclick = () =>
  document.querySelectorAll("[data-drag]").forEach(el => el._reset && el._reset()));
