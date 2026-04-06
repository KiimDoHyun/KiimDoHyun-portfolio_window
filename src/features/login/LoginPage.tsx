import Login from "./Login";
import Samsung_wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import FullScreenBox from "@shared/ui/FullScreenBox";
import WallPaper from "@shared/ui/WallPaper/WallPaper";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FADE_OUT_DURATION = 400;

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isUnlocked = searchParams.get("isUnlocked") === "true";
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleUnlock = useCallback(() => {
    setSearchParams({ isUnlocked: "true" }, { replace: true });
  }, [setSearchParams]);

  const handleLogin = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      navigate("/window/desktop", { replace: true });
    }, FADE_OUT_DURATION);
  }, [navigate]);

  return (
    <FullScreenBox
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: `opacity ${FADE_OUT_DURATION}ms ease`,
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
