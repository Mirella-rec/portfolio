// "Quem sou eu": texto curto que acende palavra por palavra conforme o scroll,
// números que contam ao aparecer e uma forma orgânica de vidro rosa-bebê
// flutuando por cima do texto (segue o scroll e, no celular, o dedo).

const fmt = (n, lang) => n.toLocaleString(lang === "en" ? "en-US" : "pt-BR");

export function createAbout(root) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lede = root.querySelector(".about-lede");
  const list = root.querySelector(".about-stats");
  const blob = root.querySelector(".about-blob");
  let words = [];
  let lang = "pt";

  // ---------- texto que acende no scroll ----------
  function renderLede(text) {
    lede.textContent = "";
    words = text.split(" ").map((w, i, all) => {
      const s = document.createElement("span");
      s.textContent = w + (i < all.length - 1 ? " " : "");
      lede.appendChild(s);
      return s;
    });
  }

  function lightWords() {
    if (reduced) { words.forEach(w => w.classList.add("on")); return; }
    const r = lede.getBoundingClientRect();
    const vh = innerHeight;
    // começa a acender quando o texto entra pela parte de baixo e termina antes do meio da tela
    const p = (vh * 0.9 - r.top) / (r.height + vh * 0.35);
    const lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));
  }

  // ---------- números que contam ----------
  function renderStats(stats) {
    list.innerHTML = "";
    stats.forEach(st => {
      const li = document.createElement("li");
      li.innerHTML = `<b></b><span></span>`;
      const b = li.querySelector("b");
      if (typeof st.n === "number") {
        b.dataset.n = st.n;
        b.dataset.pre = st.pre || "";
        b.dataset.suf = st.suf || "";
        b.textContent = (st.pre || "") + "0" + (st.suf || "");
      } else {
        b.textContent = st.big;
        b.classList.add("word");
      }
      li.querySelector("span").textContent = st.label;
      list.appendChild(li);
      seen.observe(li);
    });
  }

  function count(b) {
    const end = +b.dataset.n, pre = b.dataset.pre, suf = b.dataset.suf;
    if (reduced) { b.textContent = pre + fmt(end, lang) + suf; return; }
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / 1400);
      b.textContent = pre + fmt(Math.round(end * (1 - Math.pow(1 - p, 4))), lang) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const seen = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const b = e.target.querySelector("b[data-n]");
      if (b) count(b);
      seen.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  // ---------- forma de vidro flutuante ----------
  // posição alvo: desce em zigue-zague pelo bloco conforme o scroll; o dedo puxa a forma
  let x = 0, y = 0, tx = 0, ty = 0, finger = null, fingerUntil = 0, visible = false;

  function target() {
    const r = root.getBoundingClientRect();
    const size = blob.offsetWidth;
    const p = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / (r.height)));
    if (finger && performance.now() < fingerUntil) {
      tx = finger.x - r.left - size / 2;
      ty = finger.y - r.top - size / 2;
    } else {
      tx = (0.62 - 0.5 * Math.sin(p * Math.PI * 1.6)) * (r.width - size);
      ty = p * (r.height - size * 0.9) - size * 0.15;
    }
  }

  function frame() {
    if (!visible) return;
    lightWords();
    target();
    x += (tx - x) * 0.06;
    y += (ty - y) * 0.06;
    blob.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    requestAnimationFrame(frame);
  }

  new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (visible && !was) {
      if (reduced) { lightWords(); target(); blob.style.transform = `translate3d(${tx}px, ${ty}px, 0)`; visible = false; return; }
      target(); x = tx; y = ty;
      requestAnimationFrame(frame);
    }
  }, { rootMargin: "120px 0px" }).observe(root);

  const point = (cx, cy) => { finger = { x: cx, y: cy }; fingerUntil = performance.now() + 1600; };
  root.addEventListener("touchmove", e => point(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  root.addEventListener("touchstart", e => point(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  root.addEventListener("pointermove", e => { if (e.pointerType === "mouse") point(e.clientX, e.clientY); });

  return {
    setContent(sobre, nextLang) {
      lang = nextLang;
      renderLede(sobre.lede);
      renderStats(sobre.stats);
      lightWords();
    },
  };
}
