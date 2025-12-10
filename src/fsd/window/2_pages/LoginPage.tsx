import { Login } from "@fsd/window/3_widgets/Window10/Login";
import Samsung_wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { FullScreenBox } from "../6_common/Layout";
import { WallPaper } from "../6_common/components";
import { useState } from "react";

export default function LoginPage() {
  const [wallpaperBlur, setWallpaperBlur] = useState(false);
  return (
    <FullScreenBox>
      <WallPaper wallpaper={Samsung_wallpaper} blur={wallpaperBlur} />
      <Login
        onDragUpToEnd={() => {
          setWallpaperBlur(true);
        }}
      />
    </FullScreenBox>
  );
}
