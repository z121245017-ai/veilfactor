import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  base: "./",
  plugins: [react(), wasm()],
  build: {
    target: "esnext",
    outDir: "dist",
  },
  optimizeDeps: {
    exclude: ["@midnight-ntwrk/onchain-runtime-v4"],
  },
});
