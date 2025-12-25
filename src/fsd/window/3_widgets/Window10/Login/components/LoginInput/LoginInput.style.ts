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

const ICON_BOX_SIZE = 100;
const userIconBoxRecipe = cva({
  base: {
    width: `${ICON_BOX_SIZE}px`,
    height: `${ICON_BOX_SIZE}px`,
    backgroundColor: "white",
    borderRadius: "100%",
    boxShadow: "0 0 16px 4px rgb(0 0 0 /40%)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
  },
});

export const UserIconBox = styled("div", userIconBoxRecipe);

const loginButtonRecipe = cva({
  base: {
    width: "120px",
    height: "40px",
    backgroundColor: "white",
    border: "2px solid white",
    borderRadius: "4px",
    color: "#505050",
    fontSize: "14px",
    fontWeight: 400,
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    "&:hover": {
      borderColor: "#d0d0d0",
    },
    "&:focus-visible": {
      outline: "2px solid black",
      outlineOffset: "2px",
      borderColor: "black",
    },
  },
});

export const LoginButton = styled("button", loginButtonRecipe);
