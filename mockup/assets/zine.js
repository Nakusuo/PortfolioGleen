// Glenn · Zine Nº 01 — comportamiento compartido por todas las páginas.
// En la web final (Astro) las pestañas y el pie serán componentes; aquí se
// generan desde PAGES para no repetir el mismo HTML en cada archivo.

const PAGES = [
  { file: "index.html",       n: "01", name: "Portada",     color: "#FFFFFF" },
  { file: "mixed-media.html", n: "02", name: "Mixed media", color: "#FF48B0" },
  { file: "ilustracion.html", n: "03", name: "Ilustración", color: "#00A95C" },
  { file: "fanart.html",      n: "04", name: "Fangirl",     color: "#FF48B0" },
  { file: "proceso.html",     n: "05", name: "Detrás",      color: "#FFFFFF" },
  { file: "encargos.html",    n: "06", name: "Encargos ★",  color: "#FFE800" },
  { file: "sobre-mi.html",    n: "07", name: "Sobre mí",    color: "#FFFFFF" },
  { file: "contacto.html",    n: "08", name: "Contacto",    color: "#FF48B0" },
];

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
tabs.setAttribute("aria-label", "Páginas del zine");
tabs.innerHTML = PAGES.map((p, i) =>
  `<a href="${p.file}" style="--c:${p.color}" ${i === idx ? 'aria-current="page"' : ""}><b>${p.n}</b>${p.name}</a>`
).join("");
document.body.append(tabs);

// ---------- Pie: página anterior / siguiente ----------
const page = document.querySelector(".page");
const prev = PAGES[idx - 1], next = PAGES[idx + 1];
const pager = document.createElement("nav");
pager.className = "pager";
pager.setAttribute("aria-label", "Pasar página");
pager.innerHTML =
  (prev ? `<a href="${prev.file}" rel="prev" data-dir="back">← <span><small>p.${prev.n}</small>${prev.name}</span></a>` : "") +
  `<span class="kbd" aria-hidden="true">usa ← → para pasar página</span>` +
  (next ? `<a class="next" href="${next.file}" rel="next"><span><small>p.${next.n}</small>${next.name}</span> →</a>` : "");
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
  curl.setAttribute("aria-label", `Pasar a la página ${next.n}: ${next.name}`);
  curl.innerHTML = `<span aria-hidden="true">p.${next.n} →</span>`;
  page.append(curl);
}

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

// ---------- Sellos que "caen" al entrar en pantalla ----------
const stamps = document.querySelectorAll(".stamp.drop");
if (reduceMotion) stamps.forEach(s => s.classList.add("in"));
else {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .6 });
  stamps.forEach(s => io.observe(s));
}

// ---------- Lightbox: cualquier [data-obra] abre su ficha ----------
// data-obra="Título|Técnica|Tamaño|Año|Estado"
const obras = [...document.querySelectorAll("[data-obra]")];
if (obras.length) {
  const dlg = document.createElement("dialog");
  dlg.className = "obra-dlg";
  dlg.setAttribute("aria-labelledby", "obra-t");
  dlg.innerHTML = `
    <div class="obra-card">
      <span class="tape" aria-hidden="true"></span>
      <button class="icon-btn obra-close" aria-label="Cerrar">✕</button>
      <div class="asset" id="obra-img"></div>
      <div class="info">
        <span class="dymo" id="obra-n"></span>
        <h2 id="obra-t"></h2>
        <dl><dt>Técnica</dt><dd id="obra-tec"></dd><dt>Tamaño</dt><dd id="obra-tam"></dd><dt>Año</dt><dd id="obra-y"></dd><dt>Estado</dt><dd id="obra-e"></dd></dl>
        <p style="margin:0">Nota corta de la artista sobre la pieza.</p>
        <div class="obra-nav">
          <button class="icon-btn" data-step="-1" aria-label="Obra anterior">←</button>
          <button class="icon-btn" data-step="1" aria-label="Obra siguiente">→</button>
          <a class="btn" href="contacto.html" style="min-height:48px">Quiero algo así</a>
        </div>
      </div>
    </div>`;
  document.body.append(dlg);
  let cur = 0;
  const $ = id => dlg.querySelector("#" + id);
  const show = i => {
    cur = (i + obras.length) % obras.length;
    const [t, tec, tam, y, est] = obras[cur].dataset.obra.split("|");
    $("obra-t").textContent = t; $("obra-tec").textContent = tec; $("obra-tam").textContent = tam;
    $("obra-y").textContent = y; $("obra-e").textContent = est;
    $("obra-n").textContent = `${cur + 1} / ${obras.length}`;
    $("obra-img").dataset.asset = `${t} en grande`;
  };
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
