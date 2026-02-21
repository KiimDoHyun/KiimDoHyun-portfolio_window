import { CSSProperties, ReactNode } from "react";
import { css } from "@styled-system/css";

interface FullScreenBoxProps {
  children: ReactNode;
  style?: CSSProperties;
}

const fullScreenStyles = css({
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
});

export default function FullScreenBox({ children, style }: FullScreenBoxProps) {
  return <div className={fullScreenStyles} style={style}>{children}</div>;
}
