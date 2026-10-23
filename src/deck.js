// Projetos no celular (≤700px): pastas de vidro fosco empilhadas na vertical,
// cada uma surge em fade-in conforme a pessoa rola a tela.
// Cada card é um galho; o fundo é um gradiente "líquido" nas cores da marca,
// a pasta tem frente de vidro, e o rodapé do card tem desfoque progressivo.
// Ao tocar, a pasta abre numa folha que desdobra como papel.

const PALETTES = {
  moda: ["var(--rosa)", "var(--rosa-sombra)", "#FBEDE6"],
  eventos: ["var(--folha-clara)", "var(--folha-media)", "var(--rosa)"],
  social: ["#FBE3D6", "var(--rosa)", "var(--folha-clara)"],
  teatro: ["var(--folha-media)", "var(--folha-clara)", "var(--rosa-sombra)"],
};

function liquid(colors) {
  const l = document.createElement("div");
  l.className = "liquid";
  l.setAttribute("aria-hidden", "true");
  colors.forEach((c, i) => {
    const s = document.createElement("span");
    s.style.setProperty("--c", c);
    s.className = "blob b" + (i + 1);
    l.appendChild(s);
  });
  return l;
}

function progressiveBlur() {
  const p = document.createElement("div");
  p.className = "pblur";
  p.setAttribute("aria-hidden", "true");
  p.innerHTML = "<i></i><i></i><i></i><i></i>";
  return p;
}

export function createDeck({ root, sheet }) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = root.querySelector(".deck-track");
  let text = null;
  let cards = [];

  // ---------- cards ----------
  function render() {
    track.innerHTML = "";
    cards = text.branches.map((b, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "gcard";
      card.style.setProperty("--i", i);
      card.setAttribute("aria-label", `${text.open}: ${b.label}`);

      card.appendChild(liquid(PALETTES[b.id] || PALETTES.moda));

      const top = document.createElement("div");
      top.className = "gcard-top";
      top.innerHTML = `<h3 class="gcard-title"></h3><span class="gcard-pill"></span>`;
      top.querySelector(".gcard-title").textContent = b.label;
      top.querySelector(".gcard-pill").textContent = text.open;

      const folder = document.createElement("div");
      folder.className = "gfolder";
      folder.setAttribute("aria-hidden", "true");
      folder.innerHTML = `<span class="gfolder-back"></span><span class="gfolder-front"></span>`;

      const foot = document.createElement("div");
      foot.className = "gcard-foot";
      foot.innerHTML = `<ul></ul>`;
      b.items.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        foot.querySelector("ul").appendChild(li);
      });

      card.append(top, folder, progressiveBlur(), foot);
      card.addEventListener("click", () => openSheet(b, i, card));
      track.appendChild(card);
      reveal.observe(card);
      return card;
    });
  }

  // ---------- cada pasta surge em fade-in ao entrar na tela ----------
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.addEventListener("transitionend", () => e.target.classList.add("settled"), { once: true });
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

  // ---------- folha que desdobra ----------
  const fold = sheet.querySelector(".sheet-fold");
  const media = sheet.querySelector(".sheet-media");
  const reel = sheet.querySelector(".sheet-reel");
  const closeBtn = sheet.querySelector(".sheet-close");
  let lastCard = null;

  function openSheet(b, i, card) {
    lastCard = card;
    sheet.querySelector(".sheet-title").textContent = b.label;
    sheet.querySelector(".sheet-sub").textContent = text.statusNote;
    media.querySelector(".liquid")?.remove();
    media.prepend(liquid(PALETTES[b.id] || PALETTES.moda));

    reel.innerHTML = "";
    b.items.forEach(name => {
      const f = document.createElement("figure");
      f.innerHTML = `<div class="vid"><span></span></div><figcaption></figcaption>`;
      f.querySelector(".vid span").textContent = text.video;
      f.querySelector("figcaption").textContent = name;
      reel.appendChild(f);
    });

    sheet.hidden = false;
    document.documentElement.classList.add("sheet-open");
    closeBtn.focus({ preventScroll: true });
    if (reduced) { sheet.classList.add("on"); return; }

    sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "forwards" });
    fold.animate(
      [{ transform: "translateY(60%) scale(.92)" }, { transform: "translateY(0) scale(1)" }],
      { duration: 520, easing: "cubic-bezier(.2,.9,.25,1)", fill: "forwards" }
    );
    // a parte de cima começa dobrada para trás e desdobra
    media.animate(
      [
        { transform: "rotateX(-120deg)", filter: "brightness(.75)" },
        { transform: "rotateX(-120deg)", filter: "brightness(.75)", offset: 0.25 },
        { transform: "rotateX(12deg)", filter: "brightness(1.04)", offset: 0.8 },
        { transform: "rotateX(0deg)", filter: "brightness(1)" },
      ],
      { duration: 900, easing: "cubic-bezier(.3,.8,.3,1)", fill: "forwards" }
    );
    sheet.querySelectorAll(".sheet-body > *, .sheet-reel figure").forEach((el, k) => {
      el.animate(
        [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
        { duration: 420, delay: 380 + k * 70, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }
      );
    });
    sheet.classList.add("on");
  }

  function closeSheet() {
    if (sheet.hidden) return;
    const done = () => {
      sheet.hidden = true;
      sheet.classList.remove("on");
      sheet.getAnimations({ subtree: true }).forEach(a => a.cancel());
      document.documentElement.classList.remove("sheet-open");
      lastCard?.focus({ preventScroll: true });
    };
    if (reduced) return done();
    media.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-110deg)", filter: "brightness(.75)" }],
      { duration: 380, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
    fold.animate([{ transform: "none" }, { transform: "translateY(70%) scale(.94)" }],
      { duration: 420, delay: 120, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
    sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 260, fill: "forwards" })
      .finished.then(done);
  }

  closeBtn.addEventListener("click", closeSheet);
  sheet.querySelector(".sheet-scrim").addEventListener("click", closeSheet);
  addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

  // arrastar a folha para baixo fecha
  let y0 = null;
  fold.addEventListener("touchstart", e => { y0 = reel.contains(e.target) ? null : e.touches[0].clientY; }, { passive: true });
  fold.addEventListener("touchend", e => {
    if (y0 !== null && e.changedTouches[0].clientY - y0 > 90) closeSheet();
    y0 = null;
  });

  return {
    setContent(projetos) {
      text = projetos;
      closeSheet();
      reveal.disconnect();
      render();
    },
  };
}
