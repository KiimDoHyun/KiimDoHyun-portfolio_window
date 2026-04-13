import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/KiimDoHyun-portfolio_window/",
  server: {
    port: 8080,
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
