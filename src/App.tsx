import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SetDirectory from "./pages/DesktopPage/SetDirectory";
import WindowRouter from "./app/routers/WindowRouter";

function App() {
  return (
    <div className="App">
      <SetDirectory />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/window/login" replace />} />
          <Route path="/window/*" element={<WindowRouter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// npx madge --image graph3.svg ./src/App.tsx
