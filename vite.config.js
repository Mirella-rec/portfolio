import { defineConfig } from "vite";

// O build vai para preview/ (fluxo SALVAR ALTERAÇÃO, CLAUDE.md seção 7)
export default defineConfig({
  build: {
    outDir: "preview",
    emptyOutDir: true,
  },
});
