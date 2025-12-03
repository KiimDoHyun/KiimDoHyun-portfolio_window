import { Navigate, Route, Routes } from "react-router-dom";
import { DesktopPage } from "@fsd/window/2_pages";
import { LoginPage } from "@fsd/window/2_pages";
import { ErrorPage } from "@fsd/window/2_pages";

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
