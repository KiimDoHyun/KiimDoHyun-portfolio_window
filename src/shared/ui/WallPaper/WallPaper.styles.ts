import { css, cva } from "@styled-system/css";

export const wallPaperStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

export const wallPaperImageStyle = cva({
  base: {
    width: "100%",
    height: "100%",
    transition: "1s",
    filter: "blur(0px)",
    transform: "scale(1)",
  },
  variants: {
    blur: {
      true: {
        filter: "blur(20px)",
        transform: "scale(1.05)",
      },
      false: {
        filter: "none",
        transform: "scale(1)",
      },
    },
  },
});
