import { ReactNode } from "react";
import { css } from "@styled-system/css";

interface FullScreenBoxProps {
  children: ReactNode;
}

const fullScreenStyles = css({
  width: "100vw",
  height: "100vh",
  // 모바일 동적 뷰포트 높이 지원
  "@supports (height: 100dvh)": {
    height: "100dvh",
  },
  position: "relative",
  overflow: "hidden",
});

export default function FullScreenBox({ children }: FullScreenBoxProps) {
  return <div className={fullScreenStyles}>{children}</div>;
}
