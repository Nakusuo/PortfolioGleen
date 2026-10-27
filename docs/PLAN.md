# Plan del portafolio

Documento de trabajo. Recoge qué se va a construir, en qué orden y qué hace
falta de la artista para avanzar.

## 0. Quién es

**Glenn** ([@fresaperdidaa](https://www.instagram.com/fresaperdidaa/), ella/she/they):
artista visual, fangirl y mixed media, de Perú. Su trabajo más reconocible son
fotos de conciertos y de sus artistas favoritos impresas e intervenidas a mano
con acrílico, óleo pastel, glitter, pedrería, lentejuelas y stickers, con
estrellas amarillas y corazones. También pinta ilustraciones (por ejemplo, un
unicornio) y hace collage con fotos propias. En sus historias destacadas tiene
"noticed!" (artistas que compartieron su arte) y "detrás" (proceso). En su bio
dice "open agenda!" para los encargos.

## 1. Objetivo

Una web que haga tres cosas, en este orden de importancia:

1. **Mostrar el trabajo** de forma que se aprecie: mixed media, ilustración y fanart.
2. **Enseñar la técnica.** El proceso a mano es lo que la diferencia de un
   ilustrador digital genérico y lo que justifica el precio.
3. **Convertir visitas en encargos** con un formulario de cotización corto y claro.

## 2. Referencias y qué tomamos de cada una

| Referencia | Qué tomamos |
|---|---|
| [dessiejackson.com](https://www.dessiejackson.com/) | Home muy visual: una pieza animada y accesos por categoría con iconos dibujados por ella. Menú corto (work, about, contact) y la tienda como "próximamente". |
| Artista con plantilla Shopify Minimal | Menú fijo en todas las páginas. Arte separado por **tipo**; dentro de cada tipo, de **más reciente a más antiguo**. Se pueden crear categorías aunque parezcan raras si hay volumen. |
| Artista con "categorías" y "proyectos" | Cada sección puede tener su propia presentación. El reto es la **home**: tiene que presentar todos los medios a quien solo hace scroll. |
| studio-w.art | Categorías por tema (mascotas, personas, naturaleza, ilustración) en vez de por material. Útil si los encargos se concentran en un tema. |
| [Neha Jangid (theyellowdiary)](https://www.wallofportfolios.in/portfolios/neha-jangid/) | Escritorio de papel cuadriculado, objetos reales recortados con sombra que se arrastran, menú con sello dibujado al centro, papel kraft rasgado que deja ver el texto, fotos con esquinas redondeadas y "pastillas" de habilidades alrededor de un objeto. |
| [Keerthi Gurram](https://www.wallofportfolios.in/portfolios/keerthi-gurram/) | Objetos recortados encima del título (aquí, la fresa sobre "GLENN") y fichas de obra limpias: título grande y técnica en mayúsculas. |

## 3. Concepto: el sitio es un fanzine

La web es un **zine riso de varias páginas**. Cada sección es una página distinta
del zine, con su propio diseño, como recomendaba la artista que dijo "no intento
que mi página de poesía combine con mis páginas de cuentos". Se salta de una a
otra como en dessiejackson.com, pero pasando hojas.

| Pág. | Archivo | Qué es | Interacción |
|---|---|---|---|
| 01 | `index.html` | Portada: nombre en letras recortadas, su personaje y el índice | Al pasar por el índice se asoma una imagen de cada sección. Las letras se mueven. Hay stickers sueltos que se arrastran (con botón "ordenar"). |
| 02 | `mixed-media.html` | Fotos intervenidas (pintura, glitter, pedrería, stickers) sobre una mesa de collage | Las obras se arrastran por la mesa. Con clic se abre su ficha. |
| 03 | `ilustracion.html` | Página verde con marcos | Filtro digital/tradicional y ficha de cada obra. |
| 04 | `fanart.html` | **Fangirl**: arte de conciertos como hoja de stickers, y muro **noticed!** con capturas de artistas que compartieron su trabajo | Filtro por fandom. La esquina se despega al pasar el ratón. Ficha de cada obra. |
| 05 | `proceso.html` | **Detrás**: las capas de una pieza | Un deslizador suma capas: foto impresa → pintura → glitter y pedrería → stickers. |
| 06 | `encargos.html` | Calculadora con ticket de compra | Eliges foto intervenida, retrato mixed media o pintura, personas extra, nivel de brillo, urgencia y uso; el ticket se imprime con el total. "Pedir con este ticket" lo lleva al cupón de contacto. |
| 07 | `sobre-mi.html` | Polaroid y carta a máquina | La polaroid se voltea y muestra un dato curioso. La carta se escribe sola. |
| 08 | `contacto.html` | Cupón para recortar | Llega con el ticket de Encargos pegado. Al enviar, unas tijeras recortan el borde y cae el sello "¡recibido!". |

**Navegación común** (`assets/zine.js`):
- Pestañas de colores en el borde derecho, como separadores de carpeta. En móvil van abajo.
- Al pie, botones de página anterior y siguiente. Las flechas ← → del teclado también pasan página.
- **Pasar página como una revista**: la hoja gira en 3D sobre su lomo y se oscurece al levantarse, dejando ver la siguiente debajo; hacia atrás, la anterior vuelve cayendo encima.
  - Chrome, Edge y Safari 18.2+: con View Transitions entre documentos (`assets/zine.css` + `assets/turn.js` en el `<head>`).
  - Firefox y navegadores sin soporte: respaldo en `assets/zine.js` que gira la hoja antes de navegar.
  - Solo se animan `transform` y `filter`, así que es fluido también en celulares.
- **Esquina doblada** abajo a la derecha de cada página: al pasar el ratón se levanta y lleva a la siguiente.
- **Deslizar el dedo** a izquierda o derecha pasa página en celulares y tablets (no se activa sobre formularios ni sobre obras que se arrastran).
- Ficha de obra (lightbox) para cualquier elemento con `data-obra`, con flechas para ver la anterior o la siguiente.

Todo respeta `prefers-reduced-motion`: sin animaciones, con el contenido completo.

## 4. Dirección visual

**Tintas riso** sobre papel de fotocopia blanco, superpuestas con `multiply` y un
poco desalineadas, como una impresión real:

| Token | Valor | Uso |
|---|---|---|
| `--riso-pink` | `#FF48B0` | Fluorescent Pink. Fondos de página, sombras, trama de puntos |
| `--riso-red` | `#E3242B` | Sellos, botones, etiquetas destacadas |
| `--riso-green` | `#00A95C` | Página de Ilustración, desregistro de títulos |
| `--riso-yellow` | `#FFE800` | Cinta adhesiva, Encargos, foco de campos |
| `--ink` | `#111111` | Todo el texto |

**Regla de contraste:** el texto siempre va en negro, o en blanco sobre negro.
Nunca en tinta de color.

**Tipografía** (Google Fonts, provisional):
- **Archivo Black**: títulos y sellos. Solo algunas páginas llevan el desregistro rosa.
- **Courier Prime**: texto corrido, como escrito a máquina.
- **Nanum Pen Script**: notas a mano, **hasta tener la letra de Glenn** como fuente (Calligraphr).
- **Bowlby One** y **Special Elite**: solo para las letras recortadas de la portada, hasta tener letras recortadas de revista escaneadas.

### Reglas para que no parezca hecho por IA

Salieron de revisar la maqueta (rama `feature/correcion-aspecto`):

1. **Nada de sombra dura en todo.** Solo los botones llevan sombra desplazada; fotos, hojas y objetos llevan sombra suave de papel.
2. **Pocas metáforas:** fotocopia, cinta, stickers y sus fotos intervenidas. El ticket queda solo en Encargos y las etiquetas Dymo solo como pie de obra.
3. **Imperfecto a propósito:** cada hoja y cada obra tiene un giro distinto (no siempre ±3°); el borde rasgado y la cinta son irregulares.
4. **Movimiento solo si informa:** pasar página, abrir una obra y el cursor. Nada de titileos, brillos animados ni rastros.
5. **Romper la retícula:** obras que se salen de la hoja, texto en vertical, la primera ilustración grande, palabras gigantes de fondo.
6. **Su voz:** textos en minúscula, cortos, con sus expresiones ("open agenda!", "me gusta darle color a mi mundo"). Nada de frases de plantilla ni filas de cifras.
7. **Material real antes que efectos CSS:** cuando lleguen sus escaneos (papel, cinta, rasgados, letras recortadas), reemplazan a los efectos dibujados con código.

## 6. Qué necesitamos de ella (assets)

En la maqueta, cada hueco con trama de puntos lleva el nombre del asset que va ahí.

- [ ] Logo o firma (SVG o PNG transparente)
- [ ] Su personaje/autorretrato recortado para la portada
- [ ] Fotos recortadas (PNG sin fondo) de objetos de su mesa: frasco de glitter, entrada de concierto, pincel, frasco de pinceles
- [ ] Una fresa recortada para el título de la portada
- [ ] Su sello o logo dibujado a mano para el centro de la cabecera
- [ ] 3 fotos suyas para "Un vistazo a mi mundo"
- [ ] Letras recortadas de verdad para "GLENN", si quiere sustituir las tipográficas
- [ ] Un dato curioso para el reverso de la polaroid
- [ ] 15–30 obras con: título, categoría, técnica, tamaño, año, disponible sí/no
- [ ] Fotos del proceso de 1 pieza (boceto → base → capas → detalle)
- [ ] Un timelapse corto (opcional)
- [ ] Foto o autorretrato para "Sobre mí" y un texto breve
- [ ] Tarifas reales para la calculadora (los precios de la maqueta son de ejemplo), plazos, qué dibuja y qué no, métodos de pago
- [ ] Texturas escaneadas (papel, cinta) si quiere más efecto collage
- [ ] Enlaces de redes

**Formato:** fotos a 2000 px en el lado largo; la web generará WebP/AVIF. Escanear
el mixed media en vez de fotografiarlo, para que se vea la textura.

## 7. Stack propuesto

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | **Astro** | Web estática, muy rápida, optimiza imágenes sola y no carga JS si no hace falta. |
| Contenido | Astro Content Collections (una carpeta por obra con Markdown) | Añadir una obra es soltar la imagen y rellenar 6 campos. |
| Panel para ella (opcional) | Sveltia CMS o Decap CMS | Que suba obras desde el navegador sin tocar código. |
| Formulario | Formspree o Web3Forms (gratis) | Llega al correo sin backend propio. |
| Hosting | Vercel o Netlify | Gratis, deploy al hacer push. |
| Dominio | `.com` o `.art` | ~10–20 USD/año. |

## 8. Fases

| Fase | Entregable | Depende de |
|---|---|---|
| 0. Maqueta | Zine de 8 páginas en `mockup/` (hecha) | — |
| 1. Validar | Ella revisa la maqueta: secciones, textos, colores | Ella |
| 2. Assets | Logo, iconos y primeras 10 obras | Ella |
| 3. Base | Proyecto Astro, tokens, layout, galería con filtros | Fase 1 |
| 4. Encargos y contacto | Página de tarifas + formulario funcionando | Tarifas |
| 5. Pulido | Accesibilidad, SEO, Open Graph, rendimiento (Lighthouse > 90) | — |
| 6. Publicar | Dominio y deploy | — |
| Futuro | Tienda de prints/stickers, blog/devlog, versión en inglés | — |

## 9. Checklist de calidad (de `ui-ux-pro-max`)

- Texto a 4.5:1 de contraste como mínimo; foco visible en todo lo navegable con teclado.
- Todas las obras con `alt` descriptivo.
- Objetivos táctiles de 44 px como mínimo; nada que dependa solo de hover.
- Imágenes con `width`/`height` o `aspect-ratio` para evitar saltos; lazy loading.
- Formulario con etiquetas visibles, error junto al campo y confirmación al enviar.
- Respetar `prefers-reduced-motion`.
- Probar a 375, 768, 1024 y 1440 px.
