import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const programComponentRecipe = cva({
  base: {
    left: "calc(50% - 250px)",
    top: "calc(50% - 250px)",
    height: "500px",
    width: "500px",

    boxShadow: "0px 0px 20px 3px #00000061",
    position: "absolute",

    border: "1px solid black",
    boxSizing: "border-box",

    backgroundColor: "white",

    display: "grid",
    gridTemplateRows: "32px 25px 1fr 20px",

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
      gap: "5px",
      height: "100%",
      marginLeft: "10px",
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
      height: "32px",

      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      padding: "1px 1px 0 1px",
      boxSizing: "border-box",
    },

    "& .headerArea2": {
      gap: "10px",
      padding: "0 10px",

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
      gap: "1px",
    },

    "& .min div": {
      width: "11px",
      height: "1px",
      backgroundColor: "black",
    },

    "& .max div": {
      width: "8px",
      height: "8px",
      border: "1px solid black",
    },

    "& .close div": {
      width: "14px",
      height: "1px",
      backgroundColor: "black",
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
      transition: "0.2s",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    "& .buttonArea > div > img": {
      width: "14px",
    },

    "& .buttonArea .buttonIcon:hover": {
      backgroundColor: "#ddddddb3",
    },

    "& .buttonArea > .close:hover": {
      backgroundColor: "#ff1010",
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
      padding: "0 10px",
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
