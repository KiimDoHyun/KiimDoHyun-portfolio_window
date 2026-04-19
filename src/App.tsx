import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import WindowRouter from "./app/routers/WindowRouter";
import { ThemeProvider } from "./app/theme/ThemeProvider";
import { TooltipProvider } from "@shared/ui";

function App() {
  // 정식 테마 스위처 UI / persist 는 out of scope. 지금은 base 고정.
  // 나중에 스위처를 붙일 때 themeId 만 state 로 끌어올리면 된다.
  return (
    <ThemeProvider themeId="base">
      <TooltipProvider>
        <div className="App">
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Routes>
              <Route path="/" element={<Navigate to="/window/login" replace />} />
              <Route path="/window/*" element={<WindowRouter />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

// npx madge --image graph3.svg ./src/App.tsx
