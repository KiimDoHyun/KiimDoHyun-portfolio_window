import { css } from "@styled-system/css";

export const taskBarStyle = css({
  display: "grid",
  gridTemplateColumns: "50px auto 200px",
  height: "100%",
  position: "relative",

  "& .shortCutIcon": {
    transition: "0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    width: "50px",
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

  "& .box1": {
    width: "50px",
    height: "50px",
    padding: "15px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },

  "& .box1:hover path": {
    fill: "accent.hover",
  },
  "& .box1:active path": {
    fill: "accent.solid",
  },
  "& .box1 svg": {
    width: "100%",
    height: "100%",
  },
  "& .box1 path": {
    fill: "shell.text",
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

  "& .prevView": {
    position: "absolute",
    width: "200px",
    height: "225px",
    backgroundColor: "shell.bgAlt",
    zIndex: 1,
    top: "var(--prevview-top)",
    opacity: "var(--prevview-opacity)",
    left: "var(--prevview-left)",
    pointerEvents: "var(--prevview-pointer-events)",
    padding: "10px 15px 15px 15px",
    boxSizing: "border-box",
    transition: "0.2s",
  },

  "& .prevViewHeader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  "& .prevViewHeader .text": {
    color: "shell.text",
    fontSize: "14px",
  },
  "& .prevViewHeader .button": {
    width: "20px",
    height: "20px",
  },
  "& .prevViewHeader .button img": {
    width: "100%",
    height: "100%",
  },

  "& .prevView .cover": {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  "& .prevView .cover > div": {
    position: "absolute",
    left: "-165px !important",
    top: "-150px !important",
    transform: "scale(0.35) !important",
    animation: "prevView_coverTransform 0.2s",
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
    transition: "0.2s",
    width: "80%",
    height: "3px",
    backgroundColor: "accent.underline",
  },

  "& .box3": {
    display: "grid",
    gridTemplateColumns: "1fr 4fr 50px 5px",
    gap: "5px",
  },

  "& .taskHoverEffect": {
    transition: "0.2s",
  },
  "& .taskHoverEffect:hover": {
    backgroundColor: "overlay.hover",
  },

  "& .arrowUpIcon": {
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },

  "& .arrowUpIcon img": {
    width: "100%",
  },

  "& .dateInfo": {
    padding: "3px",
    fontSize: "13px",
    color: "shell.text",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  "& .dateInfo > div": {
    cursor: "default",
  },

  "& .closeAllButton": {
    borderLeft: "1px solid token(colors.shell.border)",
  },

  "& .info": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  "& .info img": {
    width: "50%",
    objectFit: "cover",
  },
});
