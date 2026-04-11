import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const ANIMATION_DURATION = 0.2;
export const TRANSLATE_Y_CSS_VAR = "--translate-y";
const animatedBoxRecipe = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    transform: "translateY(var(--translate-y, 0))",
  },
  variants: {
    animated: {
      true: {
        // 원본은 transform 전용 transition. fast 유틸은 all 속성이라 명시 전개.
        transitionProperty: "transform",
        transitionDuration: "fast",
        transitionTimingFunction: "standard",
      },
      false: {
        transition: "none",
      },
    },
  },
  defaultVariants: {
    animated: false,
  },
});

export const LoginBox = styled("div", animatedBoxRecipe);
