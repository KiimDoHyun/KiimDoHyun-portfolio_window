import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const hiddenIconRecipe = cva({
  base: {
    position: "absolute",
    right: "125px",
    width: "120px",
    backgroundColor: "#393a3be0",
    border: "1px solid #4d4d4d",
    display: "flex",
    flexWrap: "wrap",
    padding: "2px",

  },
  variants: {
    active: {
      true: {
        bottom: "50px",
        zIndex: 99999,
      },
      false: {
        bottom: "-500px",
        zIndex: 0,
      },
    },
  },
});

export const HiddenIconBlock = styled("div", hiddenIconRecipe);
