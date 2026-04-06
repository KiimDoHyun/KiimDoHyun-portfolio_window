import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const statusBarRecipe = cva({
  base: {
    "& p": {
      margin: 0,
    },

    position: "absolute",
    left: 0,
    width: "650px",
    height: "500px",
    boxShadow: "0px -3px 20px 3px #00000061",

    transition: "0.4s",
    transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
    backgroundColor: "#393a3b",

    display: "flex",
    gap: "10px",

    paddingTop: "5px",
    boxSizing: "border-box",

    "& .statusBarBoxArea": {
      height: "100%",
    },

    "& .statusBox": {
      boxSizing: "border-box",
    },

    "& .statusBox:hover": {
      backgroundColor: "#ffffff24",
    },

    "& .leftArea": {
      position: "relative",
      width: "50px",
    },

    "& .leftArea_Contents": {
      position: "absolute",
      backgroundColor: "#393a3b",
      width: "100%",
      height: "100%",
      transition: "0.1s",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },

    "& .leftArea_Contents_Wide": {
      width: "220px",
      zIndex: 10,
      boxShadow: "0px 9px 20px 0px #181818",
    },

    "& .centerArea": {
      backgroundColor: "transparent",
      width: "270px",
      overflowY: "scroll",
    },

    "& .rightArea": {
      width: "330px",
      overflowY: "scroll",
    },

    "& .rightArea_title": {
      height: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      color: "#e8e8e8",
      cursor: "pointer",
      margin: "10px 0",
      paddingLeft: "5px",
    },

    "& .rightArea_boxArea": {
      display: "flex",
      flexWrap: "wrap",
      alignContent: "flex-start",
      gap: "5px",
      padding: "5px",
      marginBottom: "30px",
    },

    "& .show_animation": {
      animationDuration: "0.4s",
      animationTimingFunction: "cubic-bezier(0, 0.65, 0.35, 1)",
      animationName: "show_from_bottom",
    },

    "& .rightArea::-webkit-scrollbar, & .centerArea::-webkit-scrollbar": {
      width: "2px",
    },

    "& .rightArea::-webkit-scrollbar-thumb, & .centerArea::-webkit-scrollbar-thumb":
      {
        backgroundColor: "#acacac",
      },
  },
  variants: {
    active: {
      true: {
        bottom: "50px",
        opacity: 1,
        pointerEvents: "auto",
        zIndex: 999,
      },
      false: {
        bottom: "-150px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 0,
      },
    },
  },
});

export const StatusBarBlock = styled("div", statusBarRecipe);
