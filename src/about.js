// "Quem sou eu": história curta em DM Mono que acende palavra por palavra no scroll,
// números que contam ao aparecer e uma forma orgânica de vidro rosa-bebê
// que vaga livremente, só dentro do bloco da história (não segue o dedo).

const fmt = (n, lang) => n.toLocaleString(lang === "en" ? "en-US" : "pt-BR");

export function createAbout(root) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const story = root.querySelector(".about-story");
  const textBox = root.querySelector(".about-text");
  const list = root.querySelector(".about-stats");
  const blob = root.querySelector(".about-blob");
  let words = [];
  let lang = "pt";

  // ---------- história que acende no scroll ----------
  function renderStory(paragraphs) {
    textBox.innerHTML = "";
    words = [];
    paragraphs.forEach(text => {
      const p = document.createElement("p");
      text.split(" ").forEach((w, i, all) => {
        const s = document.createElement("span");
        s.textContent = w + (i < all.length - 1 ? " " : "");
        p.appendChild(s);
        words.push(s);
      });
      textBox.appendChild(p);
    });
  }

  function lightWords() {
    if (reduced) { words.forEach(w => w.classList.add("on")); return; }
    // cada palavra acende quando passa um pouco acima do meio da tela
    const line = innerHeight * 0.68;
    words.forEach(w => w.classList.toggle("on", w.getBoundingClientRect().top < line));
  }
  addEventListener("scroll", () => requestAnimationFrame(lightWords), { passive: true });

  // ---------- números que contam ----------
  function renderStats(stats) {
    list.innerHTML = "";
    stats.forEach(st => {
      const li = document.createElement("li");
      li.innerHTML = `<b></b><span class="lbl"></span>`;
      const b = li.querySelector("b");
      if (typeof st.n === "number") {
        Object.assign(b.dataset, { n: st.n, pre: st.pre || "", suf: st.suf || "" });
        b.textContent = (st.pre || "") + "0" + (st.suf || "");
      } else {
        b.textContent = st.big;
        b.classList.add("word");
      }
      li.querySelector(".lbl").textContent = st.label;
      if (st.note) {
        const n = document.createElement("span");
        n.className = "note";
        n.textContent = st.note;
        li.appendChild(n);
      }
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

  // ---------- bolha de vidro vagando dentro do bloco da história ----------
  // soma de senos lentos com períodos diferentes: um caminho que não se repete de forma óbvia
  const wander = t => 0.5 + 0.32 * Math.sin(t) + 0.18 * Math.sin(t * 2.3 + 1.7);
  let visible = false, t0 = performance.now();

  function place(now) {
    const w = story.clientWidth, h = story.clientHeight, size = blob.offsetWidth;
    const t = (now - t0) / 1000;
    const x = wander(t * 0.23) * Math.max(0, w - size);
    const y = wander(t * 0.17 + 4) * Math.max(0, h - size);
    blob.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }
  function frame(now) {
    if (!visible) return;
    place(now);
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    const was = visible;
    visible = e.isIntersecting;
    if (reduced) { place(t0); visible = false; return; }
    if (visible && !was) requestAnimationFrame(frame);
  }, { rootMargin: "80px 0px" }).observe(story);

  return {
    setContent(sobre, nextLang) {
      lang = nextLang;
      renderStory(sobre.story);
      renderStats(sobre.stats);
      lightWords();
      place(performance.now());
    },
  };
}
