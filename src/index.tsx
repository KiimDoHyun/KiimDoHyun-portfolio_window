import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import portfolio from "./data/portfolio.json";
import { useFileSystemStore } from "./store/fileSystemStore";
import type { PortfolioSchema } from "./shared/types/portfolio-schema";

useFileSystemStore.getState().hydrate(portfolio as PortfolioSchema);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

