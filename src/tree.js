// Árvore de pastas da aba Projetos: galhos e folhagem pixelados num canvas,
// pastas como botões que "brotam" quando o galho chega até elas.

// Forma dos galhos em coordenadas normalizadas (0–1, y para baixo). Os nomes vêm do content/*.json.
const SHAPES = {
  moda: { from: [0.495, 0.80], c: [0.30, 0.82], to: [0.15, 0.57], start: 0.9 },
  eventos: { from: [0.50, 0.70], c: [0.70, 0.74], to: [0.85, 0.47], start: 1.2 },
  social: { from: [0.50, 0.55], c: [0.32, 0.52], to: [0.20, 0.20], start: 1.5 },
  teatro: { from: [0.50, 0.47], c: [0.70, 0.46], to: [0.80, 0.15], start: 1.8 },
  retrospectivas: { from: [0.50, 0.62], c: [0.40, 0.66], to: [0.36, 0.86], start: 2.1 },
};
const TRUNK = { from: [0.50, 1.02], c: [0.47, 0.72], to: [0.50, 0.40], start: 0, dur: 1.3, w0: 3.4, w1: 1.6 };
const BRANCH_DUR = 1.4;
const FINAL = 99;

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const bezier = (a, c, b, t) => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
const ease = t => 1 - Math.pow(1 - t, 3);
const clamp01 = t => Math.max(0, Math.min(1, t));

export function createTree({ stage, canvas, side, count, replay, panel }) {
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = getComputedStyle(document.documentElement);
  const color = name => css.getPropertyValue(name).trim();
  const C = {
    bark: color("--tinta"),
    // do mais escuro ao mais claro; o último é o "acender" da folha nova
    leaves: [color("--musgo"), color("--folha"), color("--folha-media"), color("--folha-clara")],
  };

  let text = null;
  let cols, rows, cell, segs = [], leaves = [], nodes = [];
  let t0 = null, playing = false, started = false;

  function build() {
    if (!text) return;
    const narrow = innerWidth <= 700;
    cols = narrow ? 54 : 104;
    const r = stage.getBoundingClientRect();
    rows = Math.round(cols * r.height / r.width);
    cell = r.width / cols;
    const dpr = devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const k = cols / 104;
    const rand = rng(7);

    segs = [{ ...TRUNK, w0: TRUNK.w0 * k * 1.4, w1: TRUNK.w1 * k * 1.4 }];
    leaves = [];
    nodes.forEach(n => n.el.remove());
    nodes = [];

    text.branches.forEach((b, bi) => {
      const s = SHAPES[b.id];
      if (!s) return;
      segs.push({ from: s.from, c: s.c, to: s.to, start: s.start, dur: BRANCH_DUR, w0: 1.8 * k * 1.3, w1: 0.6 });
      addNode(s.to, b.label, true, s.start + BRANCH_DUR, b);
      leafCluster(s.to, 7 * k + 2, s.start + BRANCH_DUR - 0.2, rand);

      const n = b.items.length;
      b.items.forEach((name, i) => {
        const t = n > 1 ? 0.38 + i * (0.5 / (n - 1)) : 0.6;
        const p = bezier(s.from, s.c, s.to, t);
        const dir = i % 2 ? -1 : 1;
        const end = [p[0] + 0.021 * (bi % 2 ? 1 : -1), p[1] + dir * (narrow ? 0.06 : 0.085)];
        const mid = [(p[0] + end[0]) / 2 + 0.02 * dir, (p[1] + end[1]) / 2];
        const start = s.start + t * BRANCH_DUR;
        segs.push({ from: p, c: mid, to: end, start, dur: 0.55, w0: 0.9, w1: 0.5 });
        addNode(end, name, false, start + 0.5, b);
        leafCluster(end, 3.5 * k + 1.5, start + 0.35, rand);
      });
      for (let u = 0.25; u < 1; u += 0.12) {
        const p = bezier(s.from, s.c, s.to, u);
        leafCluster([p[0] + (rand() - .5) * .03, p[1] - rand() * .03], (2 + rand() * 3) * k + 1, s.start + u * BRANCH_DUR + 0.2, rand);
      }
    });
    leafCluster([0.5, 0.36], 9 * k + 2, 1.2, rand);
    leafCluster([0.46, 0.30], 6 * k + 2, 1.5, rand);
    leafCluster([0.55, 0.28], 6 * k + 2, 1.7, rand);

    count.textContent = text.count
      .replace("{branches}", text.branches.length)
      .replace("{folders}", nodes.filter(n => !n.main).length);
  }

  function leafCluster(center, radius, appear, rand) {
    const cx = center[0] * cols, cy = center[1] * rows;
    const R = Math.ceil(radius);
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      const d = Math.hypot(x, y * 1.15) / radius;
      if (d > 1 || rand() < d * 0.75) continue;
      const shade = Math.max(0, Math.min(2, Math.round(1.2 - y / radius * 1.1 + (rand() - .5) * 1.4)));
      leaves.push({ x: Math.round(cx + x), y: Math.round(cy + y), shade, t: appear + d * 0.5 + rand() * 0.35 });
    }
  }

  function addNode(pos, label, main, appear, branch) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "node" + (main ? " main" : "");
    el.style.left = pos[0] * 100 + "%";
    el.style.top = pos[1] * 100 + "%";
    el.innerHTML = `<span class="ico"></span><span class="lbl"></span>`;
    el.querySelector(".lbl").textContent = label;
    el.setAttribute("aria-label", label);
    el.addEventListener("click", () => openFolder(main ? branch.label : label, main ? branch.items : [label]));
    stage.appendChild(el);
    nodes.push({ el, appear, main, branch: branch.id });
  }

  function px(x, y, fill) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    const x0 = Math.round(x * cell), y0 = Math.round(y * cell);
    ctx.fillStyle = fill;
    ctx.fillRect(x0, y0, Math.round((x + 1) * cell) - x0, Math.round((y + 1) * cell) - y0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const wood = new Set();
    for (const s of segs) {
      const p = ease(clamp01((time - s.start) / s.dur));
      if (p <= 0) continue;
      const steps = 80;
      for (let i = 0; i <= steps * p; i++) {
        const u = i / steps;
        const [x, y] = bezier(s.from, s.c, s.to, u);
        const w = s.w0 + (s.w1 - s.w0) * u;
        const cx = x * cols, cy = y * rows, R = Math.max(0.5, w / 2);
        for (let yy = Math.floor(cy - R); yy <= cy + R; yy++)
          for (let xx = Math.floor(cx - R); xx <= cx + R; xx++)
            if (Math.hypot(xx + .5 - cx, yy + .5 - cy) <= R + .35) wood.add(xx + "," + yy);
      }
    }
    wood.forEach(key => { const [x, y] = key.split(","); px(+x, +y, C.bark); });

    // folha nova acende clara e assenta no tom final; depois, um brilho sutil
    const shimmer = Math.floor(time * 2.2);
    for (const l of leaves) {
      const age = time - l.t;
      if (age < 0) continue;
      let s = age < 0.18 ? 3 : l.shade;
      if (!reduced && age > 1 && ((l.x * 31 + l.y * 17 + shimmer) % 97) === 0) s = 3;
      px(l.x, l.y, C.leaves[s]);
    }
    nodes.forEach(n => n.el.classList.toggle("on", time >= n.appear));
  }

  function frame(now) {
    if (t0 === null) t0 = now;
    draw((now - t0) / 1000);
    requestAnimationFrame(frame);
  }

  function play() {
    started = true;
    t0 = null;
    if (reduced) { draw(FINAL); return; }
    if (!playing) { playing = true; requestAnimationFrame(frame); }
  }

  function renderSide() {
    side.querySelectorAll("button").forEach(b => b.remove());
    text.branches.forEach(b => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = `<i></i><span></span>`;
      btn.querySelector("span").textContent = b.label;
      btn.addEventListener("click", () => {
        side.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === btn));
        nodes.forEach(n => n.el.classList.toggle("pulse", n.branch === b.id));
      });
      side.appendChild(btn);
    });
  }

  // Pasta aberta: só vídeos + legenda curta (vídeos ainda são espaços reservados)
  const reel = panel.querySelector("#folder-reel");
  function openFolder(title, items) {
    panel.querySelector("#folder-title").textContent = title;
    reel.innerHTML = "";
    const list = items.length > 1 ? items : [items[0], items[0], items[0]];
    list.forEach((name, i) => {
      const f = document.createElement("figure");
      f.innerHTML = `<div class="vid"></div><figcaption></figcaption>`;
      f.querySelector(".vid").textContent = text.video;
      f.querySelector("figcaption").textContent = items.length > 1 ? name : `${name} — ${text.take} ${i + 1}`;
      reel.appendChild(f);
    });
    panel.classList.add("on");
    panel.querySelector("#folder-close").focus();
  }
  const closeFolder = () => panel.classList.remove("on");
  panel.querySelector("#folder-close").addEventListener("click", closeFolder);
  addEventListener("keydown", e => { if (e.key === "Escape") closeFolder(); });

  replay.addEventListener("click", play);

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !started && text) play();
  }, { threshold: 0.35 }).observe(stage);

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { build(); if (!playing) draw(started ? FINAL : 0); }, 120);
  });

  return {
    setContent(projetos) {
      text = projetos;
      closeFolder();
      renderSide();
      build();
      if (!playing) draw(started ? FINAL : 0);
    },
  };
}
