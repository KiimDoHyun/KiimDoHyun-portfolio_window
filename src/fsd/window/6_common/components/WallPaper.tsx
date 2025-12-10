import { css } from "@styled-system/css";

export default function WallPaper({ wallpaper }: { wallpaper: string }) {
  return (
    <div
      className={css({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      })}
    >
      <img
        src={wallpaper}
        alt="wallpaper"
        className={css({ width: "100%", height: "100%" })}
      />
    </div>
  );
}
