// Se carga en <head> para llegar antes del primer pintado de la página nueva:
// marca la transición como "hacia atrás" cuando se vuelve a una página anterior.
addEventListener("pagereveal", e => {
  if (e.viewTransition && sessionStorage.getItem("zine-dir") === "back") e.viewTransition.types.add("back");
});
