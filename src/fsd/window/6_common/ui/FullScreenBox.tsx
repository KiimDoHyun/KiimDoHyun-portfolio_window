import styled from "styled-components";
import { ReactNode } from "react";

interface FullScreenBoxProps {
  children: ReactNode;
}

export default function FullScreenBox({ children }: FullScreenBoxProps) {
  return <FullScreenBoxContainer>{children}</FullScreenBoxContainer>;
}

const FullScreenBoxContainer = styled.div`
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* 모바일 동적 뷰포트 높이 지원 */
  position: relative;
  overflow: hidden;
`;
