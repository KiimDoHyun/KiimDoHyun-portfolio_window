import { css } from "@styled-system/css";

const DEFAULT_BLUR = 20;

export default function WallPaperBlurCover({
  blur = DEFAULT_BLUR,
}: {
  blur?: number;
}) {
  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: `blur(${blur}px)`,
      })}
    ></div>
  );
}
