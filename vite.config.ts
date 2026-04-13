/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import type { Plugin } from "vite";

function devBranchTitlePlugin(): Plugin {
  return {
    name: "dev-branch-title",
    apply: "serve",
    transformIndexHtml(html) {
      try {
        const branch = execSync("git rev-parse --abbrev-ref HEAD", {
          encoding: "utf-8",
        }).trim();
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>[${branch}] $1</title>`,
        );
      } catch {
        return html;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), devBranchTitlePlugin()],
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
        path.dirname(fileURLToPath(import.meta.url)),
        "src/__mocks__/styledSystemCss.js",
      ),
    },
  },
});
