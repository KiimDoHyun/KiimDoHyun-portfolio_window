import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const hiddenIconRecipe = cva({
  base: {
    position: "absolute",
    right: "125px",
    width: "120px",
    // gray.900 반투명 변형. 현재 규칙상 전환하려면 새 semantic 필요 — Phase 6에서 정리
    backgroundColor: "rgba(57, 58, 59, 0.88)",
    border: "1px solid token(colors.shell.border)",
    display: "flex",
    flexWrap: "wrap",
    padding: "4",

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
