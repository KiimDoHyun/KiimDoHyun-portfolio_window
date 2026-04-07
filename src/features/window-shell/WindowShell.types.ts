import type { ReactNode } from "react";

export type WindowStatus = "active" | "min";

export interface WindowShellItem {
  name: string;
  type: string;
  status?: WindowStatus;
  icon?: string;
  parent?: string;
  contents?: unknown;
}

export interface WindowShellProps {
  item: WindowShellItem;
  /** 헤더에 표시할 타이틀 */
  title: string;
  /** 헤더 아이콘 경로 */
  iconSrc: string;
  /** 현재 활성 프로그램 이름 */
  activeProgram: string;
  /** 이 창의 content 영역 */
  children?: ReactNode;
  /** BROWSER 처럼 헤더 바로 아래 서브 헤더가 필요할 때 */
  subHeader?: ReactNode;
  /** 창 클릭 시 활성화 */
  onActivate: (name: string) => void;
  /** 최소화 버튼 */
  onMinimize: (name: string) => void;
  /** 닫기 버튼 */
  onClose: (name: string) => void;
  /** 다음 z-index 를 증가시키고 현재 값을 반환 */
  onRequestZIndex: () => number;
}
