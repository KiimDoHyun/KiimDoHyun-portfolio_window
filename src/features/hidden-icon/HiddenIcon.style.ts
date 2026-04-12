import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const hiddenIconRecipe = cva({
  base: {
    position: "absolute",
    right: "125px",
    width: "120px",
    backgroundColor: "shell.bgMuted",
    border: "1px solid token(colors.shell.border)",
    display: "flex",
    flexWrap: "wrap",
    padding: "4",

  },
  variants: {
    active: {
      true: {
        bottom: "token(sizes.taskbar)",
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
