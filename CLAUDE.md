# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio de una sola página (español) para celebrar el **primer mes de noviazgo**:
un **mapa interactivo de Quito** con *scrollytelling*. Al desplazar, el relato
avanza capítulo por capítulo y el mapa "vuela" al lugar de cada cita. Sitio
estático puro: **sin framework, sin build, sin package manager** — solo HTML, CSS
y un archivo JS. La única dependencia es Leaflet, cargado por CDN.

## Correr localmente

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

Cualquier servidor estático sirve. Necesita internet: las fuentes (Google Fonts),
Leaflet y los *tiles* del mapa (CARTO) vienen por CDN. Se despliega en GitHub
Pages (ver `og:url` en [index.html](index.html): `estefano23444.github.io/nuestra-historia/`).

## Arquitectura

Tres archivos forman el sitio publicado; el resto es local (ver "Archivos locales").

- [index.html](index.html) — estructura fija: hero, preludio, el `.stage`
  (mapa *sticky* + columna de historia), el `finale` con contador y collage, y
  footer. El contenedor `#story` se inyecta por JS; `#map` lo monta Leaflet.
- [historia.css](historia.css) — paleta cálida (terracota/rosa/dorado) en
  variables `:root`. El mapa es `position:sticky`; en móvil va arriba a `42vh`,
  en escritorio (`min-width:1000px`) pasa a columna lateral a `100vh` reordenada
  con `order`. Los *tiles* llevan un tinte sepia vía `filter` en `.leaflet-tile-pane`.
- [historia.js](historia.js) — IIFE con toda la lógica. **`CHAPTERS` (al inicio)
  es la única fuente de verdad.**

### `CHAPTERS`: una sola fuente para historia y mapa

El array `CHAPTERS` alimenta a la vez (1) el render de las tarjetas de historia,
(2) los marcadores del mapa y (3) la polilínea de la "ruta del amor". Cada objeto:

```js
{ photo, wide?, chip, date, place, coords:[lat,lng], badge?, star?, title, text:[...] }
```

- `coords` posiciona el pin y traza la ruta — **debe ser un par `[lat, lng]` válido**.
- `text` es un array de párrafos (prosa libre reescrita desde las notas, no literal).
- `star: true` → estilo dorado (pin, número y `badge` en oro); reservado a los
  momentos clave (primer beso, el "sí", Toy Story). `badge` es la etiqueta visible.
- `wide: true` → la foto usa `aspect-ratio:3/2` en vez de `4/5`.
- El **índice 0 se numera con ♥**; el resto muestra su índice (`1, 2, 3…`).
- El **orden es narrativo/cronológico de la relación**, no de fechas calendario:
  el capítulo 0 (16 jul 2025, cuando se conocieron) va primero aunque las citas
  del noviazgo sean de abril–junio. No reordenar por fecha.

### Scroll y mapa (dos IntersectionObservers independientes)

- `revealObs` añade `.in` a los elementos `.reveal` al entrar al viewport (animación
  de aparición). Es independiente del mapa.
- `activeObs` (con `rootMargin` que mira la franja central) marca el capítulo
  activo y dispara `setActive(i)`. **`setActive` es el centro de todo**: resalta
  pin + tarjeta, hace `map.flyTo(coords)`, actualiza el caption (`#mapCap`) y
  llama a `updateToolbar(i)` para rellenar la card del mapa maximizado.
- Click en un pin: si el mapa **no** está maximizado, hace `scrollIntoView` a su
  capítulo; si **sí** lo está, llama `setActive(i)` (navega dentro del overlay).

### Mapa maximizado (overlay + card + navegación)

Construido por completo en JS dentro del mismo `try` (botones, card y listeners se
crean con `createElement`/`innerHTML` y se cuelgan de `.map-col`). El estado vive
en dos clases CSS: `.map-col.maximized` (overlay a pantalla completa, `z-index`
alto) y `body.map-open` (bloquea el scroll de fondo). `setMaximized(on)` alterna
ambas, habilita/inhabilita `scrollWheelZoom` y llama `invalidateSize()`.

- En móvil el overlay apila mapa arriba y card abajo; en escritorio
  (`min-width:1000px`) pasa a **vista dividida** (`flex-direction:row`): mapa a un
  lado, card al otro.
- La `.map-card` (clases `mc-*`) replica el capítulo completo (foto, badge, meta,
  título, párrafos) y la rellena `updateToolbar(i)` desde `CHAPTERS[i]` — **no es
  una segunda fuente de datos**, solo otra vista del mismo array.
- Navegación: botones `‹/›` (`mc-prev`/`mc-next`), contador `i+1 / total`, flechas
  del teclado, `Esc` para cerrar y `mc-open` ("ver en la historia") que cierra el
  overlay y hace `scrollIntoView` al capítulo. Todo pasa por `setActive`.

### Contador

`FIRST_MONTH` (constante `Date`) controla la cuenta regresiva del `finale`; está
fijada al **24 jun 2026 a las 16:00**, la hora exacta en que se hicieron novios
(un mes antes). Al llegar a cero muestra el mensaje de felicitación. Vive aparte
del mapa y siempre corre.

### Ruleta del `finale` ("¿cuál cita recreamos?")

Vive en el `finale`, encima del botón "Volver a vivirlo". Como el resto, se arma
desde `CHAPTERS` (un sector del `conic-gradient` y un número por cita). Va en su
propio `try` y **antes del guard de Leaflet**, para no depender del mapa.

- **Está trucada a propósito**: aunque parece azar, siempre cae en una cita de
  cine o café. El pool de ganadoras se deduce de `place` con `/cine|caf[eé]/i`
  (hoy: índices 1, 4 y 10), así sobrevive si se reordenan o editan los capítulos;
  cada giro elige una al azar dentro de ese pool.
- La rotación se calcula para que el sector elegido quede bajo el puntero (5 a 6
  vueltas más un pequeño jitter dentro del sector); la cita ganadora queda derecha.
- El resultado se pinta en `.rr-card` (otra vista de `CHAPTERS[i]`, no una segunda
  fuente) con un botón que hace `scrollIntoView` al capítulo.

### Degradación elegante (importante)

El mapa es un *plus* que **nunca debe romper la página**. Si Leaflet (CDN) no carga,
el JS lo detecta (`typeof L === "undefined"`), marca `#map` con `.map-unavailable`
(muestra "❤ Nuestro mapa de Quito") y retorna; la historia, el *reveal* y el
contador siguen funcionando. Todo el bloque del mapa va dentro de un `try/catch`
con el mismo *fallback*. Preservar este patrón al modificar el mapa.

## Fotos

Las imágenes van en [fotos/](fotos/) y **el campo `photo` de cada capítulo debe
coincidir exactamente** con el archivo (incluida la extensión: hay `.png`,
`.jpeg` y `.jpg` mezclados). El hero y el collage del `finale` referencian
`fotos/cabina-*.jpg` directamente en el HTML.

## Archivos locales (gitignored — no se publican)

Listados en [.gitignore](.gitignore); existen solo en disco:

- `NuestraHistoria.txt` — notas privadas crudas; **fuente original** de la que se
  reescribió la prosa de `CHAPTERS`. No publicar.
- `_originales/` — respaldo de las fotos sin optimizar (algunas con otra extensión
  que su versión en `fotos/`).
- `_borrador-anterior/` — **versión vieja archivada** (timeline con `script.js` /
  `styles.css` / arrays `CONFIG`+`RECUERDOS`). Su `CLAUDE.md` describe esa
  arquitectura anterior, **no la actual**. Ignorar para el sitio en uso.
- `.claude/` — config local de herramientas.

## Tono

Copy en español, cálido y personal, en primera persona (de él para ella).
Preservar ese tono al editar `title`/`text` de los capítulos.
