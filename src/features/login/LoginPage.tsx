import Login from "./Login";
import Samsung_wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import FullScreenBox from "@shared/ui/FullScreenBox";
import WallPaper from "@shared/ui/WallPaper/WallPaper";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FADE_IN_DURATION_MS = 400;
const FADE_OUT_DURATION_MS = 400;

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isUnlocked = searchParams.get("isUnlocked") === "true";
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleUnlock = useCallback(() => {
    setSearchParams({ isUnlocked: "true" }, { replace: true });
  }, [setSearchParams]);

  const handleLogin = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      navigate("/window/desktop", { replace: true });
    }, FADE_OUT_DURATION_MS);
  }, [navigate]);

  return (
    <FullScreenBox
      style={{
        opacity: isMounted && !isFadingOut ? 1 : 0,
        transition: `opacity ${isFadingOut ? FADE_OUT_DURATION_MS : FADE_IN_DURATION_MS}ms ease`,
      }}
    >
      <WallPaper wallpaper={Samsung_wallpaper} blur={isUnlocked} />
      <Login
        isUnlocked={isUnlocked}
        onUnlock={handleUnlock}
        onLogin={handleLogin}
      />
    </FullScreenBox>
  );
}
