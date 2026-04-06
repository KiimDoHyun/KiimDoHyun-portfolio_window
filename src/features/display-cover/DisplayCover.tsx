import React from "react";
import { useRecoilValue } from "recoil";
import { css } from "@styled-system/css";
import { rc_global_DisplayLight } from "@store/global";

const displayCoverStyle = css({
  width: "100vw",
  height: "100vh",
  position: "absolute",
  left: 0,
  top: 0,
  backgroundColor: "black",
  zIndex: 10000000000,
  pointerEvents: "none",
  opacity: "var(--cover-opacity)",
});

const DisplayCover = () => {
  const displayLight = useRecoilValue(rc_global_DisplayLight);

  const computedOpacity =
    displayLight <= 30 ? 0.7 : 1 - displayLight / 100;

  return (
    <div
      className={displayCoverStyle}
      style={{ "--cover-opacity": computedOpacity } as React.CSSProperties}
    />
  );
};

export default DisplayCover;
