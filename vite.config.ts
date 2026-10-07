/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    // Phaser sozinho passa de 1 MB; o aviso padrão (500 kB) não ajuda aqui.
    chunkSizeWarningLimit: 2000,
  },
  test: {
    environment: "node",
  },
});
