import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const loginInputBoxRecipe = cva({
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
    height: "100%",
    transition: "0.4s",
  },
  variants: {
    visible: {
      true: { opacity: 1 },
      false: { opacity: 0 },
    },
  },
  defaultVariants: {
    visible: false,
  },
});

export const LoginInputBox = styled("div", loginInputBoxRecipe);
