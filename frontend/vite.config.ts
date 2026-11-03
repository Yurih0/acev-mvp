import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Gera um site estatico (SPA) para ser servido pelo FastAPI
    spa: { enabled: true },
  },
});
