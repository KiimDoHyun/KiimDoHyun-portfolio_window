import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "./src/styled-system",

  // The JSX framework to use
  jsxFramework: "react",

  // Enable CSS variables for better theming
  cssVarRoot: ":root",

  theme: {
    extend: {
      keyframes: {
        open: {
          from: { opacity: 0, transform: "scale(0.9)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        show_from_bottom: {
          from: { scale: "1 1.5", translate: "0 200px" },
          to: { translate: "0 0px", scale: "1 1.0" },
        },
        prevView_coverTransform: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
});
