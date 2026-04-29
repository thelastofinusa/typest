import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { typedAssets } from "@typest/vite/plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    typedAssets({
      sources: [{ dir: "public" }],
    }),
  ],
});
