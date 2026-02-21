import { Login } from "@fsd/window/3_widgets/Window10/Login";
import Samsung_wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { FullScreenBox } from "../6_common/Layout";
import { WallPaper } from "../6_common/components";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isUnlocked = searchParams.get("isUnlocked") === "true";

  const handleUnlock = useCallback(() => {
    setSearchParams({ isUnlocked: "true" });
  }, [setSearchParams]);

  return (
    <FullScreenBox>
      <WallPaper wallpaper={Samsung_wallpaper} blur={isUnlocked} />
      <Login isUnlocked={isUnlocked} onUnlock={handleUnlock} />
    </FullScreenBox>
  );
}
