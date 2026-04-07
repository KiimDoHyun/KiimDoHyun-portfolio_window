import { Navigate, Route, Routes } from "react-router-dom";
import { DesktopPage } from "@pages/DesktopPage";
import LoginPage from "@features/login/LoginPage";
import ErrorPage from "@app/ErrorPage";

export default function WindowRouter() {
  return (
    <Routes>
      <Route path="desktop" element={<DesktopPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="error" replace />} />
    </Routes>
  );
}
