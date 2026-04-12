import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const programComponentRecipe = cva({
  base: {
    left: "calc(50% - token(sizes.program.default) / 2)",
    top: "calc(50% - token(sizes.program.default) / 2)",
    height: "program.default",
    width: "program.default",

    boxShadow: "windowFrame",
    position: "absolute",

    border: "1px solid token(colors.windowChrome.border)",
    boxSizing: "border-box",

    backgroundColor: "windowChrome.bg",

    display: "grid",
    gridTemplateRows:
      "token(sizes.windowHeader) token(sizes.program.headerSub) 1fr token(sizes.windowBottom)",

    animation: "open 0.25s 0s",

    "& .modiSize": {
      position: "absolute",
      width: "4px",
      height: "4px",
      cursor: "pointer",
    },

    "& .top_left": {
      top: 0,
      left: 0,
      cursor: "nw-resize",
    },

    "& .top_right": {
      top: 0,
      right: 0,
      cursor: "ne-resize",
    },

    "& .bottom_left": {
      bottom: 0,
      left: 0,
      cursor: "ne-resize",
    },

    "& .bottom_right": {
      bottom: 0,
      right: 0,
      cursor: "nw-resize",
    },

    "& .infoArea": {
      display: "flex",
      alignItems: "center",
      gap: "4",
      height: "100%",
      marginLeft: "8",
    },

    "& .infoArea img": {
      width: "20px",
      height: "20px",
    },

    "& .infoArea div": {
      fontSize: "14px",
    },

    "& .headerArea": {
      width: "100%",
      height: "windowHeader",

      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      boxSizing: "border-box",
    },

    "& .headerArea2": {
      gap: "8",
      py: "0",
      px: "8",

      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    "& .programTitle": {},

    "& .dragArea": {
      flex: 1,
      height: "100%",
    },

    "& .buttonArea": {
      height: "100%",
      display: "flex",
    },

    "& .min div": {
      width: "11px",
      height: "1px",
      backgroundColor: "windowChrome.border",
    },

    "& .max div": {
      width: "8px",
      height: "8px",
      border: "1px solid token(colors.windowChrome.border)",
    },

    "& .close div": {
      width: "14px",
      height: "1px",
      backgroundColor: "windowChrome.border",
    },

    "& .close div:nth-child(1)": {
      position: "absolute",
      rotate: "45deg",
    },

    "& .close div:nth-child(2)": {
      rotate: "135deg",
    },

    "& .buttonArea > div": {
      height: "100%",
      width: "45px",
      transition: "fast",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    "& .buttonArea > div > img": {
      width: "14px",
    },

    "& .buttonArea .buttonIcon:hover": {
      backgroundColor: "windowChrome.buttonHover",
    },

    "& .buttonArea > .close:hover": {
      backgroundColor: "windowChrome.closeHover",
    },

    "& .contentsArea_Cover": {
      width: "100%",
      height: "100%",
      overflow: "scroll",
      position: "relative",
    },

    "& .bottomArea": {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      fontSize: "12px",
      py: "0",
      px: "8",
    },
  },
  variants: {
    isClose: {
      true: {
        opacity: 0,
        transform: "scale(0.9)",
      },
      false: {},
    },
  },
});

export const ProgramComponent = styled("div", programComponentRecipe);
