import { Navigate, Route, Routes } from "react-router-dom";
import { DesktopPage } from "@pages/DesktopPage";
import LoginPage from "@features/login/LoginPage";
import ErrorPage from "@app/ErrorPage";
import wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";

export default function WindowRouter() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.4)",
          zIndex: -1,
        }}
      />
      <Routes>
        <Route path="desktop" element={<DesktopPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="error" replace />} />
      </Routes>
    </>
  );
}
