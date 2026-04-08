import type { ReactNode } from "react";
import type {
    ProgramId,
    ProgramNode,
    RunningProgram,
} from "@shared/types/program";

export type WindowStatus = "active" | "min";

export interface WindowShellProps {
    /** 이 창이 표현하는 파일시스템 노드 */
    node: ProgramNode;
    /** 실행 중 상태 (status / zIndex) */
    running: RunningProgram;
    /** 헤더에 표시할 타이틀 */
    title: string;
    /** 헤더 아이콘 경로 */
    iconSrc: string;
    /** 현재 활성 프로그램 id */
    activeId: ProgramId | null;
    /** 이 창의 content 영역 */
    children?: ReactNode;
    /** BROWSER 처럼 헤더 바로 아래 서브 헤더가 필요할 때 */
    subHeader?: ReactNode;
    /** 창 클릭 시 활성화 */
    onActivate: (id: ProgramId) => void;
    /** 최소화 버튼 */
    onMinimize: (id: ProgramId) => void;
    /** 닫기 버튼 */
    onClose: (id: ProgramId) => void;
    /** 다음 z-index 를 증가시키고 현재 값을 반환 */
    onRequestZIndex: () => number;
}
