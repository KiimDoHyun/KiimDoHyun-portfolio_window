import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const infoBarRecipe = cva({
  base: {
    "& h4, & h2, & p": {
      margin: 0,
    },

    display: "grid",
    gridTemplateRows: "1fr 100px",
    borderLeft: "1px solid token(colors.shell.border)",

    position: "absolute",
    bottom: "token(sizes.taskbar)",
    width: "infobar.width",
    height: "calc(100% - token(sizes.taskbar))",

    transition: "slow",
    backgroundColor: "shell.bg",

    "& > div": {
      boxSizing: "border-box",
      padding: "20",
    },

    "& .commitArea": {
      overflow: "scroll",
    },

    "& .displayLightArea": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
    },

    "& .displayLightArea .iconCover": {
      width: "30px",
      height: "30px",
    },

    "& .displayLightArea .iconCover img": {
      width: "100%",
      height: "100%",
    },

    "& .displayLightArea input": {
      width: "70%",
    },
  },
  variants: {
    active: {
      true: {
        right: "0px",
        pointerEvents: "auto",
        zIndex: 99999,
      },
      false: {
        right: "-401px",
        pointerEvents: "none",
        zIndex: 0,
      },
    },
  },
});

export const InfoBarBlock = styled("div", infoBarRecipe);
