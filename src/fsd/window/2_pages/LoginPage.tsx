import { Login } from "@fsd/window/3_widgets/Window10/Login";
import Samsung_wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { FullScreenBox } from "../6_common/Layout";
import { WallPaper } from "../6_common/components";
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
