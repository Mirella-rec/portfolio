import { defineConfig } from "vite";

// O build vai para preview/ (fluxo SALVAR ALTERAÇÃO, CLAUDE.md seção 7)
export default defineConfig({
  // caminhos relativos: a prévia abre de qualquer endereço (link de prévia, subpasta)
  base: "./",
  build: {
    outDir: "preview",
    emptyOutDir: true,
  },
});
