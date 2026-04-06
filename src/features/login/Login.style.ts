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
    transform: `translateY(var(${TRANSLATE_Y_CSS_VAR}, 0))`,
  },
  variants: {
    animated: {
      true: {
        transition: `transform var(--duration, ${ANIMATION_DURATION}s)`,
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
