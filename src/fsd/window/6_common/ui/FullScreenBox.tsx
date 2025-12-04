import { ReactNode } from "react";
import { css } from "@styled-system/css";

interface FullScreenBoxProps {
  children: ReactNode;
}

const fullScreenStyles = css({
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
});

export default function FullScreenBox({ children }: FullScreenBoxProps) {
  return <div className={fullScreenStyles}>{children}</div>;
}
