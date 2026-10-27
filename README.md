<p align="center">
  <a href="https://github.com/Nakusuo"><img src="https://raw.githubusercontent.com/Nakusuo/Nakusuo/main/assets/covers/PortfolioGleen-3.svg" width="100%" alt="PortfolioGleen-3 — Nakusu"/></a>
</p>

# Glenn — Portafolio de arte

Web portafolio para [Glenn (@fresaperdidaa)](https://www.instagram.com/fresaperdidaa/),
artista visual de **mixed media**: fotos de conciertos y de sus artistas favoritos
intervenidas con pintura, glitter, pedrería y stickers, además de ilustración.

El problema que resuelve: el trabajo de una artista mixed media pierde casi todo
en un feed de Instagram. No se ven las capas, el papel ni el proceso, y quien
quiere un encargo no encuentra precios ni una forma clara de pedirlo. Esta web
reúne la obra ordenada por tipo, enseña cómo se hace cada pieza y termina siempre
en un formulario de cotización.

## Por qué existe

Es un regalo para mi novia. Ella pone los dibujos, los gráficos y la letra; yo
pongo la estructura y el código. La idea es que tenga un sitio que se parezca a
ella (fangirl, rosa, hecho a mano) y que además le traiga clientes.

## Estado

**Fase 0: maqueta.** Todavía no hay web final. Hay una maqueta navegable de 8
páginas con estética de fanzine riso y huecos marcados donde irán sus gráficos
cuando me los pase.

```bash
git clone https://github.com/Nakusuo/PortfolioGleen-3.git
cd PortfolioGleen-3
python3 -m http.server 5500 --directory mockup
```

Luego abre `http://localhost:5500`. No necesita instalar nada más. Cada recuadro
con trama de puntos lleva el nombre del gráfico que va ahí. La transición de
pasar hoja se ve en Chrome y Edge; en otros navegadores la página cambia sin
animación.

## Qué tendrá

La web es un zine: cada sección es una página con su propio diseño y se pasa de
una a otra con las pestañas laterales, los botones del pie o las flechas del teclado.

| Pág. | Sección | Qué hace |
|---|---|---|
| 01 | Portada | Nombre en letras recortadas, su personaje y un índice que asoma cada sección. |
| 02 | Mixed media | Fotos intervenidas con pintura, glitter y pedrería, sobre una mesa donde se arrastran. |
| 03 | Ilustración | Galería con filtro digital/tradicional. |
| 04 | Fangirl | Arte de conciertos con filtro por fandom y un muro "noticed!" de artistas que la compartieron. |
| 05 | Detrás | Deslizador que va sumando las capas: foto, pintura, brillo y stickers. |
| 06 | Encargos | Calculadora: armas tu encargo y se imprime un ticket con el precio. |
| 07 | Sobre mí | Polaroid que se voltea y carta que se escribe a máquina. |
| 08 | Contacto | Cupón para recortar que llega con el ticket ya pegado. |

## Stack previsto

Astro con Content Collections para las obras, Formspree o Web3Forms para el
formulario y Vercel o Netlify para publicar. Opcionalmente, un CMS (Sveltia o
Decap) para que ella suba obras sin tocar código.

## Flujo de trabajo

El repo sigue **gitflow**:

| Rama | Para qué |
|---|---|
| `main` | Solo versiones publicadas. Cada una lleva su etiqueta (`v0.1.0`, `v0.2.0`…). |
| `develop` | Integración: aquí se juntan las features terminadas. |
| `feature/<nombre>` | Un cambio concreto. Sale de `develop` y vuelve a `develop`. |
| `release/<versión>` | Preparar una versión. Sale de `develop`, se fusiona en `main` y en `develop`. |
| `hotfix/<nombre>` | Arreglo urgente sobre `main`; vuelve a `main` y a `develop`. |

Las fusiones se hacen con `--no-ff` para que cada feature quede visible en el historial.

## Documentación

- [`docs/PLAN.md`](docs/PLAN.md): referencias, mapa del sitio, dirección visual,
  lista de assets, stack y fases.
- [`mockup/`](mockup/): maqueta navegable. Una página HTML por sección, con estilos y comportamiento compartidos en `mockup/assets/`.

## Inspiración

- [dessiejackson.com](https://www.dessiejackson.com/): home visual con accesos
  por categoría dibujados a mano.
- Consejos de otros artistas sobre cómo ordenar el arte por tipo y presentar
  varios medios en una sola home (resumidos en el plan).
