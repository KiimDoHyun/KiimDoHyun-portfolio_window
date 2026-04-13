import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const statusBarRecipe = cva({
  base: {
    "& p": {
      margin: 0,
    },

    position: "absolute",
    left: 0,
    width: "statusbar.width",
    height: "statusbar.height",
    boxShadow: "panelUp",

    transition: "slow",
    backgroundColor: "shell.bg",

    display: "flex",
    gap: "8",

    paddingTop: "4",
    boxSizing: "border-box",

    "& .statusBarBoxArea": {
      height: "100%",
    },

    "& .statusBox": {
      boxSizing: "border-box",
    },

    "& .statusBox:hover": {
      backgroundColor: "overlay.active",
    },

    "& .leftArea": {
      position: "relative",
      width: "50px",
    },

    "& .leftArea_Contents": {
      position: "absolute",
      backgroundColor: "shell.bg",
      width: "100%",
      height: "100%",
      // 원래 0.1s였으나 설계 문서 Task 3-2 예외 분석에서 fast(0.2s)로 통합
      transition: "fast",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },

    "& .leftArea_Contents_Wide": {
      width: "220px",
      zIndex: 10,
      // 특이 shadow: 현재 토큰에 대응 없음. Phase 3/6에서 shadow 토큰 정비 시 재처리.
      boxShadow: "0px 9px 20px 0px rgba(24, 24, 24, 1)",
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
      color: "shell.text",
      cursor: "pointer",
      my: "8",
      mx: "0",
      paddingLeft: "4",
    },

    "& .rightArea_boxArea": {
      display: "flex",
      flexWrap: "wrap",
      alignContent: "flex-start",
      gap: "4",
      padding: "4",
      marginBottom: "32",
    },

    "& .leftArea_bottom": {
      borderTop: "1px solid token(colors.shell.border)",
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
        backgroundColor: "shell.border",
      },
  },
  variants: {
    active: {
      true: {
        bottom: "token(sizes.taskbar)",
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
