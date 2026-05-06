import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const programComponentRecipe = cva({
  base: {
    left: 0,
    top: 0,
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

    "& .modiSize": {
      position: "absolute",
      // 헤더 dragArea (z-index 미지정 = 0) 위로 올려 헤더 상단 변 핸들이 우선
      zIndex: 10,
    },

    // 4 변 (edge): 두께 8px, 안 4 / 밖 4
    "& .modiSize.top": {
      top: "-4px",
      left: 0,
      right: 0,
      height: "8px",
      cursor: "ns-resize",
    },

    "& .modiSize.right": {
      top: 0,
      bottom: 0,
      right: "-4px",
      width: "8px",
      cursor: "ew-resize",
    },

    "& .modiSize.bottom": {
      bottom: "-4px",
      left: 0,
      right: 0,
      height: "8px",
      cursor: "ns-resize",
    },

    "& .modiSize.left": {
      top: 0,
      bottom: 0,
      left: "-4px",
      width: "8px",
      cursor: "ew-resize",
    },

    // 4 모서리 (corner): 14x14, 안 7 / 밖 7. 변보다 위 (z-index 우선)
    "& .modiSize.top_left": {
      top: "-7px",
      left: "-7px",
      width: "14px",
      height: "14px",
      cursor: "nw-resize",
      zIndex: 11,
    },

    "& .modiSize.top_right": {
      top: "-7px",
      right: "-7px",
      width: "14px",
      height: "14px",
      cursor: "ne-resize",
      zIndex: 11,
    },

    "& .modiSize.bottom_left": {
      bottom: "-7px",
      left: "-7px",
      width: "14px",
      height: "14px",
      cursor: "sw-resize",
      zIndex: 11,
    },

    "& .modiSize.bottom_right": {
      bottom: "-7px",
      right: "-7px",
      width: "14px",
      height: "14px",
      cursor: "se-resize",
      zIndex: 11,
    },

    "& .infoArea": {
      display: "flex",
      alignItems: "center",
      gap: "4",
      height: "100%",
      marginLeft: "8",
      minWidth: 0,
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

    "& .programTitle": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      minWidth: 0,
    },

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
      overflow: "auto",
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
      },
      false: {},
    },
  },
});

export const ProgramComponent = styled("div", programComponentRecipe);
