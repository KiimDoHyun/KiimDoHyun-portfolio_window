import { css } from "@styled-system/css";

export const taskBarStyle = css({
  display: "grid",
  gridTemplateColumns: "token(sizes.taskbar) auto 200px",
  height: "100%",
  position: "relative",

  "& .shortCutIcon": {
    transition: "fast",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    width: "taskbar",
    position: "relative",
  },

  "& .shotCut_Hover": {
    position: "absolute",
    width: "200px",
    height: "0px",
    backgroundColor: "transparent",
    top: "var(--shotcut-hover-top)",
    left: "var(--shotcut-hover-left)",
    pointerEvents: "var(--shotcut-hover-pointer-events)",
  },

  "& .shortCutIcon:hover .shotCut_Hover": {
    height: "225px !important",
  },

  "& .buttonCover": {
    position: "absolute",
    right: 0,
    width: "40px",
    height: "40px",
    backgroundColor: "transparent",
  },

  "& .bodyCover": {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "200px",
  },

  "& .box2": {
    display: "flex",
    zIndex: 2,
  },

  "& .activeIcon": {
    backgroundColor: "overlay.active",
  },
  "& .activeIcon .shortCut_BottomLine": {
    width: "95%",
  },

  "& .activeShortCutIcon": {
    backgroundColor: "overlay.hover",
  },

  "& .shortCutIcon:hover .shortCut_BottomLine": {
    width: "95%",
  },
  "& .activeShortCutIcon .shortCut_BottomLine": {
    width: "70%",
  },

  "& .shortCut_Img": {
    width: "100%",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  "& .shortCut_Img img": {
    width: "25px",
    height: "25px",
  },

  "& .shortCut_Test": {
    width: "25px",
    height: "25px",
    backgroundColor: "yellow",
  },

  "& .shortCut_BottomLine": {
    transition: "fast",
    width: "80%",
    height: "3px",
    backgroundColor: "accent.underline",
  },

});
