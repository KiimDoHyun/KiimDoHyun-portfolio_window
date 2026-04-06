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

    "& .skillIcon": {
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.1s",
    },

    "& .skillIcon:hover": {
      backgroundColor: "#515151",
    },

    "& .skillIcon img": {
      width: "60%",
      height: "60%",
    },
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
