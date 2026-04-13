/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  base: "/KiimDoHyun-portfolio_window/",
  server: {
    port: 8080,
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    css: false,
    alias: {
      "@styled-system/css": path.resolve(
        import.meta.dirname,
        "src/__mocks__/styledSystemCss.js",
      ),
    },
  },
});
