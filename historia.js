/* ============================================================
   Nuestra historia · lógica
   - render de capítulos
   - mapa Leaflet de Quito con pines + ruta
   - scrollytelling: el mapa vuela al lugar del capítulo activo
   - reveal al hacer scroll
   - cuenta regresiva al primer mes
   ============================================================ */
(function () {
  "use strict";

  // --- Datos: cada capítulo de la historia (prosa libre, no literal) ---
  const CHAPTERS = [
    {
      photo: "fotos/00-inicio.png", wide: true,
      chip: "16 Jul", date: "16 de julio de 2025", place: "EDINUN · Quito",
      coords: [-0.149000, -78.499700],
      badge: "Donde empezó todo",
      title: "El día que te conocí",
      text: [
        "Llegué a un trabajo nuevo sin imaginar que la mejor parte no estaría en el contrato. Te vi de lejos un quince de julio; al día siguiente, en la inducción, te conocí de verdad.",
        "No hizo falta más. Desde ese instante quedó decidido en silencio que yo iba a buscar la forma de volver a verte."
      ]
    },
    {
      photo: "fotos/01-michael.png",
      chip: "26 Abr", date: "26 de abril", place: "Cine · El Condado Shopping",
      coords: [-0.103180, -78.490212],
      title: "Nuestra primera película",
      text: [
        "Te invité al cine y, aunque insistías en que “esto no era una cita”, un peluche pequeñito de la nada se encargó de desmentirte.",
        "Después caminamos sin rumbo, compartimos un postre y hasta discutimos como novios por un Uber. Esa noche se fue la luz en tu casa, pero nada logró apagar el día."
      ]
    },
    {
      photo: "fotos/02-katari.jpeg",
      chip: "2 May", date: "2 de mayo", place: "Katari · Cumbayá",
      coords: [-0.201555, -78.429594],
      badge: "Primer beso", star: true,
      title: "El primer beso",
      text: [
        "Música en vivo, un par de tragos y horas que se sintieron minutos. Esa noche, entre risas, por fin me armé de valor.",
        "Te besé por primera vez. Y Cumbayá, allá abajo, brillaba como si ya supiera lo que apenas estábamos descubriendo."
      ]
    },
    {
      photo: "fotos/03-bolos.jpeg",
      chip: "8 May", date: "8 de mayo", place: "Multicines · Quicentro",
      coords: [-0.176292, -78.479249],
      title: "Jugar contigo",
      text: [
        "Bolos, máquinas del arcade y algo coreano para comer. En los bolos me fue bien; en el arcade, en cambio, me ganaste sin piedad, y no me importó en absoluto.",
        "Terminamos sentados en el patio de comidas, sin ninguna prisa por que el día se acabara."
      ]
    },
    {
      photo: "fotos/04-flores.jpeg",
      chip: "13 May", date: "13 de mayo", place: "Un café · entre semana",
      coords: [-0.102480, -78.489612],
      title: "Un café entre semana",
      text: [
        "Le robamos una tarde a un martes cualquiera, sin más plan que vernos. Un café a escondidas del mundo, un rato pequeño que era solo nuestro.",
        "Hablamos bajito entre sorbo y sorbo, alargando cada minuto, y aun así la tarde se nos hizo corta sin darnos cuenta. Ese rato pequeño terminó siendo de los que se vuelven grandes."
      ]
    },
    {
      photo: "fotos/05-carolina.jpeg",
      chip: "16 May", date: "16 de mayo", place: "Parque La Carolina",
      coords: [-0.183873, -78.484703],
      title: "Correr y quedarnos",
      text: [
        "Corrimos, paseamos y hablamos hasta que la tarde se nos escapó. Probamos juntos una comida nueva, solo por curiosidad, y nos encantó.",
        "Y entre todo eso, conocí a tu mamá. El día se volvió importante sin avisarnos."
      ]
    },
    {
      photo: "fotos/06-gomichelas.jpeg",
      chip: "22 May", date: "22 de mayo", place: "Mitad del Mundo",
      coords: [-0.008609, -78.453176],
      title: "A mitad del mundo",
      text: [
        "Una gomichela, una torre de Jenga y unos besos a escondidas de Samy, nuestra cómplice.",
        "Estábamos parados justo en la mitad del planeta y, aun así, lo único que se sentía centro de todo era estar contigo."
      ]
    },
    {
      photo: "fotos/07-novios.jpeg",
      chip: "24 May", date: "24 de mayo", place: "Pintando cerámica",
      coords: [-0.183600, -78.476400],
      badge: "Nos hicimos novios", star: true,
      title: "El sí",
      text: [
        "Tú pintabas un tiki con toda la calma; yo, un Pikachu que no sobrevivió al intento. Cuando terminamos, te pregunté si querías ser mi novia.",
        "Dijiste que sí. Lo demás fue caminar abrazados y sentir que, por fin, todo encajaba en su lugar."
      ]
    },
    {
      photo: "fotos/08-coco.jpg",
      chip: "29 May", date: "29 de mayo", place: "Nuestro rincón",
      coords: [-0.007782, -78.442145],
      title: "Quedarnos quietos",
      text: [
        "Agua de coco, pistachos y un sillón. A veces la mejor cita no necesita ningún plan.",
        "Solo tú, yo y la casa entera para nosotros: nos acurrucamos, nos buscamos despacio y dejamos que la tarde se volviera nuestra, sin prisa y sin nadie más."
      ]
    },
    {
      photo: "fotos/09-basilica.jpeg",
      chip: "31 May", date: "31 de mayo", place: "Basílica del Voto Nacional",
      coords: [-0.214728, -78.507324],
      title: "Como si fuéramos de siempre",
      text: [
        "Fuimos en metro, nos confundieron con turistas y posamos para mil fotos entre las torres.",
        "Comimos como un viejo matrimonio en un restaurante de toda la vida y volvimos en bus, con dulces para probar juntos en el camino."
      ]
    },
    {
      photo: "fotos/10-backrooms.jpeg",
      chip: "5 Jun", date: "5 de junio", place: "Cine · función de noche",
      coords: [-0.107579, -78.458076],
      title: "Tarde, pero juntos",
      text: [
        "Un mal desvío nos hizo llegar treinta minutos tarde a la película. Daba exactamente igual.",
        "El verdadero plan llegó después: tú, abrazada a mí en el Uber, como si afuera no existiera nada más."
      ]
    },
    {
      photo: "fotos/11-kia.jpeg",
      chip: "6 Jun", date: "6 de junio", place: "Museo interactivo Kia eGround",
      coords: [-0.206885, -78.487901],
      title: "Curiosos como niños",
      text: [
        "Un museo interactivo lleno de botones, pantallas y cosas por tocar, y nosotros dos hechos unos niños con ganas de probarlo todo. Entre experimento y experimento, una pizza mitad y mitad, cada quien con su lado favorito.",
        "No dejamos rincón sin curiosear y nos reímos de cada descubrimiento. Cerramos con un bubble tea y otro viaje de vuelta abrazados, con ese final feliz que ya se nos volvió costumbre."
      ]
    },
    {
      photo: "fotos/12-arbinb.jpeg", wide: true,
      chip: "13-14 Jun", date: "13 y 14 de junio", place: "Un fin de semana nuestro",
      coords: [-0.175090, -78.492414],
      title: "Jugar a la vida juntos",
      text: [
        "Hicimos las compras como esposos y nos encerramos dos días en un mundo nuestro: piscina, sauna y una cena cocinada a cuatro manos.",
        "Vimos una película con un vino, dormimos abrazados y desayunamos en la terraza. Por un fin de semana, el futuro nos quedó cerquita."
      ]
    },
    {
      photo: "fotos/cabina-4.jpg", wide: true,
      chip: "20 Jun", date: "20 de junio", place: "El Portal · Toy Story",
      coords: [-0.106879, -78.457476],
      badge: "Toy Story", star: true,
      title: "Hacia el infinito",
      text: [
        "Nos encontramos para ver Toy Story y retiramos tu cerámica, ya horneada y hermosa. Almorzamos pizza en Domino's con el Mundial de fondo, sin querer soltarnos.",
        "Sin Uber a la vista, llegamos tarde al Portal y alcanzamos a ver un pedazo del partido de Ecuador en las pantallas gigantes, justo antes de despedirnos. Porque contigo, hasta lo complicado se convierte en aventura."
      ]
    }
  ];

  const FIRST_MONTH = new Date("2026-06-24T16:00:00");

  // ---------------- render de capítulos ----------------
  const story = document.getElementById("story");
  CHAPTERS.forEach((c, i) => {
    const art = document.createElement("article");
    art.className = "chapter";
    art.dataset.index = i;
    art.id = "cap-" + i;
    const badge = c.badge
      ? `<span class="badge ${c.star ? "gold" : ""}">${c.star ? "★" : "✿"} ${c.badge}</span>`
      : "";
    art.innerHTML = `
      <div class="chapter-media reveal ${c.wide ? "wide" : ""}">
        <img src="${c.photo}" alt="${c.title}" loading="lazy" decoding="async">
        ${badge}
      </div>
      <div class="chapter-body reveal">
        <div class="meta">
          <span class="num ${c.star ? "star" : ""}">${i === 0 ? "♥" : i}</span>
          <span class="chip">${c.chip}</span>
          <span class="place"><span class="pin">◍</span> ${c.place}</span>
        </div>
        <h2 class="chapter-title">${c.title}</h2>
        ${c.text.map((p) => `<p>${p}</p>`).join("")}
      </div>`;
    story.appendChild(art);
  });

  // ---------------- reveal al hacer scroll (independiente del mapa) ----------------
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObs.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  // ---------------- cuenta regresiva (independiente del mapa) ----------------
  const cd = document.getElementById("countdown");
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    if (!cd) return;
    const now = new Date();
    let diff = FIRST_MONTH - now;
    if (diff <= 0) {
      cd.innerHTML = `<div class="cd-done">¡Feliz primer mes, mi amor! 🚀</div>`;
      return;
    }
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    cd.innerHTML = [
      [d, "días"], [h, "horas"], [m, "min"], [s, "seg"]
    ].map(([v, l]) => `<div class="cd-box"><div class="cd-num">${l === "días" ? v : pad(v)}</div><div class="cd-label">${l}</div></div>`).join("");
  }
  tick();
  setInterval(tick, 1000);

  // ---------------- ruleta: ¿cuál cita recreamos? (independiente del mapa) ----------------
  // Es un plus: va en su propio try y antes del mapa, para que nada lo rompa.
  try {
    const wheel = document.getElementById("wheel");
    const hub = document.getElementById("wheelHub");
    const resultBox = document.getElementById("ruletaResult");
    if (wheel && hub && resultBox) {
      const N = CHAPTERS.length;
      const SEG = 360 / N;
      const COLORS = ["#c1663d", "#d98c7c", "#c2a05a", "#a44b27"];

      // fondo: un sector por cita (conic-gradient empieza arriba y va en sentido horario)
      const stops = CHAPTERS.map((c, i) => {
        const col = c.star ? "#b98a36" : COLORS[i % COLORS.length];
        return col + " " + (i * SEG) + "deg " + ((i + 1) * SEG) + "deg";
      });
      wheel.style.background = "conic-gradient(from 0deg, " + stops.join(", ") + ")";

      // etiqueta con el número de cada cita, en su radio (gira con la rueda;
      // la cita ganadora queda derecha bajo el puntero al detenerse)
      CHAPTERS.forEach((c, i) => {
        const a = i * SEG + SEG / 2;
        const label = document.createElement("div");
        label.className = "wheel-label" + (c.star ? " star" : "");
        label.style.transform = "translateX(-50%) rotate(" + a + "deg)";
        label.textContent = i === 0 ? "♥" : String(i);
        wheel.appendChild(label);
      });

      // Resultados permitidos: cine o café (parece azar, pero siempre cae en una de estas).
      // Se deduce de `place`, así sobrevive si se reordenan o editan los capítulos.
      let pool = CHAPTERS.map((c, i) => i).filter((i) => /cine|caf[eé]/i.test(CHAPTERS[i].place));
      if (!pool.length) pool = CHAPTERS.map((c, i) => i); // salvaguarda

      let rot = 0;
      let spinning = false;

      function showResult(i) {
        const c = CHAPTERS[i];
        resultBox.innerHTML =
          '<div class="rr-card">' +
          '<div class="rr-photo"><img src="' + c.photo + '" alt="' + c.title + '" decoding="async"></div>' +
          '<div class="rr-body">' +
          '<span class="rr-eyebrow">Nuestra próxima cita ❤</span>' +
          '<h4 class="rr-title">' + c.title + "</h4>" +
          '<p class="rr-place">' + c.chip + " · " + c.place + "</p>" +
          '<button class="rr-open" type="button">Ver este recuerdo ↗</button>' +
          "</div></div>";
        resultBox.classList.add("show");
        const openBtn = resultBox.querySelector(".rr-open");
        if (openBtn) {
          openBtn.addEventListener("click", function () {
            const art = document.getElementById("cap-" + i);
            if (art) art.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
      }

      function spin() {
        if (spinning) return;
        spinning = true;
        hub.disabled = true;
        resultBox.classList.remove("show");

        const target = pool[Math.floor(Math.random() * pool.length)];
        const center = target * SEG + SEG / 2;            // centro del sector (horario desde arriba)
        const jitter = (Math.random() - 0.5) * (SEG - 8); // cae dentro del sector, sin repetir el punto
        // para que (center + rot) quede bajo el puntero (arriba): rot ≡ 360 - center
        const targetMod = (((360 - center - jitter) % 360) + 360) % 360;
        let next = rot + 360 * 5;                          // al menos 5 vueltas hacia adelante
        next += (((targetMod - (next % 360)) % 360) + 360) % 360;
        rot = next;
        wheel.style.transform = "rotate(" + rot + "deg)";

        let done = false;
        const finish = function () {
          if (done) return;
          done = true;
          spinning = false;
          hub.disabled = false;
          showResult(target);
        };
        wheel.addEventListener("transitionend", finish, { once: true });
        setTimeout(finish, 5400); // respaldo por si transitionend no dispara
      }

      hub.addEventListener("click", spin);
    }
  } catch (err) {
    console.error("Ruleta no disponible:", err);
  }

  // ---------------- mapa (Leaflet) ----------------
  // Si Leaflet (CDN) no carga, la historia y la cuenta regresiva siguen
  // funcionando: el mapa solo es un plus, nunca debe romper la página.
  if (typeof L === "undefined") {
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.classList.add("map-unavailable");
    console.warn("Leaflet no disponible: se omite el mapa, el resto de la página funciona igual.");
    return;
  }

  try {
    const map = L.map("map", {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomSnap: 0.25
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const mapCol = document.querySelector(".map-col");

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      }
    ).addTo(map);

    // ruta del amor (en orden cronológico)
    const path = CHAPTERS.map((c) => c.coords);
    L.polyline(path, {
      color: "#c1663d",
      weight: 2,
      opacity: 0.55,
      dashArray: "2 8",
      lineCap: "round"
    }).addTo(map);

    // marcadores
    const markers = CHAPTERS.map((c, i) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="mk ${c.star ? "star" : ""}" data-i="${i}">${i === 0 ? "♥" : i}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      const m = L.marker(c.coords, { icon, riseOnHover: true }).addTo(map);
      m.on("click", () => {
        if (mapCol && mapCol.classList.contains("maximized")) {
          setActive(i);
        } else {
          document.getElementById("cap-" + i).scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
      return m;
    });

    const bounds = L.latLngBounds(path);
    map.fitBounds(bounds, { padding: [50, 50] });
    setTimeout(() => map.invalidateSize(), 250);
    window.addEventListener("resize", () => map.invalidateSize());

    // caption del mapa
    const cap = document.getElementById("mapCap");
    function markerEl(i) {
      if (i < 0 || i >= markers.length) return null;
      const ic = markers[i].getElement();
      return ic ? ic.querySelector(".mk") : null;
    }

    let active = -1;
    function setActive(i) {
      if (i === active) return;
      const prev = markerEl(active);
      if (prev) prev.classList.remove("active");
      document.querySelectorAll(".chapter.active").forEach((el) => el.classList.remove("active"));

      active = i;
      const c = CHAPTERS[i];
      const el = markerEl(i);
      if (el) el.classList.add("active");
      const art = document.getElementById("cap-" + i);
      if (art) art.classList.add("active");

      map.flyTo(c.coords, 14.5, { duration: 1.15, easeLinearity: 0.25 });

      cap.innerHTML = `<span class="pin">📍</span> <span>${c.place}</span> <span class="sep">·</span> <span class="date">${c.date}</span>`;
      cap.classList.add("show");
      updateToolbar(i);
    }

    // observer: capítulo activo cuando cruza el centro
    const activeObs = new IntersectionObserver(
      (entries) => {
        // elige la entrada visible más cercana al centro
        let best = null;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
          }
        });
        if (best) setActive(+best.target.dataset.index);
      },
      { rootMargin: "-46% 0px -46% 0px", threshold: [0, 0.5, 1] }
    );
    document.querySelectorAll(".chapter").forEach((el) => activeObs.observe(el));

    // ---- maximizar mapa + navegación por los puntos ----
    const btnMax = document.createElement("button");
    btnMax.type = "button";
    btnMax.className = "map-btn map-maximize";
    btnMax.setAttribute("aria-label", "Maximizar mapa");
    btnMax.innerHTML = "⤢";
    const btnClose = document.createElement("button");
    btnClose.type = "button";
    btnClose.className = "map-btn map-close";
    btnClose.setAttribute("aria-label", "Cerrar mapa");
    btnClose.innerHTML = "✕";
    const card = document.createElement("div");
    card.className = "map-card";
    card.innerHTML =
      '<div class="mc-photo"><img class="mc-img" alt="" decoding="async"><span class="mc-badge"></span></div>' +
      '<div class="mc-scroll">' +
      '<div class="mc-meta"><span class="mc-num"></span><span class="mc-chip"></span><span class="mc-place"></span></div>' +
      '<h3 class="mc-title"></h3>' +
      '<div class="mc-text"></div>' +
      '<button class="mc-open" type="button">Ver este recuerdo en la historia ↗</button>' +
      "</div>" +
      '<div class="mc-nav">' +
      '<button class="mc-prev" type="button" aria-label="Cita anterior">‹</button>' +
      '<span class="mc-counter"></span>' +
      '<button class="mc-next" type="button" aria-label="Cita siguiente">›</button>' +
      "</div>";
    mapCol.appendChild(btnMax);
    mapCol.appendChild(btnClose);
    mapCol.appendChild(card);

    const btnPrev = card.querySelector(".mc-prev");
    const btnNext = card.querySelector(".mc-next");
    const mcOpen = card.querySelector(".mc-open");
    const mcScroll = card.querySelector(".mc-scroll");
    const mcImg = card.querySelector(".mc-img");
    const mcBadge = card.querySelector(".mc-badge");
    const mcNum = card.querySelector(".mc-num");
    const mcChip = card.querySelector(".mc-chip");
    const mcPlace = card.querySelector(".mc-place");
    const mcTitle = card.querySelector(".mc-title");
    const mcText = card.querySelector(".mc-text");
    const mcCounter = card.querySelector(".mc-counter");

    function updateToolbar(i) {
      if (i < 0 || i >= CHAPTERS.length) return;
      const c = CHAPTERS[i];
      mcImg.src = c.photo;
      mcImg.alt = c.title;
      if (c.badge) {
        mcBadge.textContent = (c.star ? "★ " : "✿ ") + c.badge;
        mcBadge.classList.toggle("gold", !!c.star);
        mcBadge.style.display = "";
      } else {
        mcBadge.style.display = "none";
      }
      mcNum.textContent = i === 0 ? "♥" : i;
      mcNum.classList.toggle("star", !!c.star);
      mcChip.textContent = c.chip;
      mcPlace.textContent = c.place + " · " + c.date;
      mcTitle.textContent = c.title;
      mcText.innerHTML = c.text.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      mcCounter.textContent = (i + 1) + " / " + CHAPTERS.length;
      btnPrev.disabled = i <= 0;
      btnNext.disabled = i >= CHAPTERS.length - 1;
      if (mcScroll) mcScroll.scrollTop = 0;
    }

    function setMaximized(on) {
      mapCol.classList.toggle("maximized", on);
      document.body.classList.toggle("map-open", on);
      if (map.scrollWheelZoom) {
        if (on) map.scrollWheelZoom.enable();
        else map.scrollWheelZoom.disable();
      }
      setTimeout(function () {
        map.invalidateSize();
        if (active >= 0) map.setView(CHAPTERS[active].coords, Math.max(map.getZoom(), 14));
        else map.fitBounds(bounds, { padding: [50, 50] });
      }, 80);
    }

    btnMax.addEventListener("click", function () { setMaximized(true); });
    btnClose.addEventListener("click", function () { setMaximized(false); });
    btnPrev.addEventListener("click", function () { if (active > 0) setActive(active - 1); });
    btnNext.addEventListener("click", function () { if (active < CHAPTERS.length - 1) setActive(active + 1); });
    mcOpen.addEventListener("click", function () {
      const i = active;
      setMaximized(false);
      const art = document.getElementById("cap-" + i);
      if (art) art.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.addEventListener("keydown", function (e) {
      if (!mapCol.classList.contains("maximized")) return;
      if (e.key === "Escape") setMaximized(false);
      else if (e.key === "ArrowRight" && active < CHAPTERS.length - 1) setActive(active + 1);
      else if (e.key === "ArrowLeft" && active > 0) setActive(active - 1);
    });

    // primer capítulo activo al cargar
    setTimeout(() => setActive(0), 400);
  } catch (err) {
    console.error("No se pudo inicializar el mapa:", err);
    const mapEl = document.getElementById("map");
    if (mapEl) mapEl.classList.add("map-unavailable");
  }
})();
