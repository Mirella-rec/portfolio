import { createTree } from "./tree.js";
import { createDeck } from "./deck.js";

// Textos ficam em content/*.json (CLAUDE.md, seção 6)
const CONTENT_URLS = {
  pt: new URL("../content/pt.json", import.meta.url).href,
  en: new URL("../content/en.json", import.meta.url).href,
};

const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

function readLang() {
  try { return localStorage.getItem("lang") === "en" ? "en" : "pt"; } catch { return "pt"; }
}
function saveLang(lang) {
  try { localStorage.setItem("lang", lang); } catch {}
}

const cache = {};
async function loadContent(lang) {
  if (!cache[lang]) cache[lang] = await fetch(CONTENT_URLS[lang]).then(r => r.json());
  return cache[lang];
}

function applyText(t, lang) {
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  document.title = t.meta.title;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const value = get(t, el.dataset.i18n);
    if (typeof value === "string") el.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const value = get(t, el.dataset.i18nAria);
    if (typeof value === "string") el.setAttribute("aria-label", value);
  });
}

let lang = readLang();
const tree = createTree({
  stage: document.getElementById("tree-stage"),
  canvas: document.getElementById("tree-canvas"),
  side: document.getElementById("tree-side"),
  count: document.getElementById("tree-count"),
  replay: document.getElementById("tree-replay"),
  panel: document.getElementById("folder-panel"),
});

const deck = createDeck({
  root: document.getElementById("deck"),
  sheet: document.getElementById("sheet"),
});

async function setLang(next) {
  lang = next;
  const t = await loadContent(lang);
  applyText(t, lang);
  tree.setContent(t.projetos);
  deck.setContent(t.projetos);
  saveLang(lang);
}

document.getElementById("lang").addEventListener("click", () => setLang(lang === "pt" ? "en" : "pt"));

setLang(lang);
