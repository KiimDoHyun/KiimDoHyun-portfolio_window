import { Login } from "@fsd/window/3_widgets/Window10/Login";
import Samsung_wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { FullScreenBox } from "../6_common/Layout";
import { WallPaper } from "../6_common/components";

export default function LoginPage() {
  return (
    <FullScreenBox>
      <WallPaper wallpaper={Samsung_wallpaper} />
      <Login />
    </FullScreenBox>
  );
}
