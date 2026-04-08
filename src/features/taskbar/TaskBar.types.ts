import type { ReactNode } from "react";
import type {
    ProgramId,
    ProgramNode,
    RunningProgram,
} from "@shared/types/program";

export interface TaskbarEntry {
    node: ProgramNode;
    running: RunningProgram;
}

export interface HoverTarget {
    id: ProgramId | null;
    idx: number;
}

export interface TaskBarProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
    hiddenIcon: boolean;
    onClickStartIcon: () => void;
    onClickTime: () => void;
    onClickInfo: () => void;
    onClickHiddenIcon: () => void;
    onClickCloseAll: () => void;
    /** taskbar 아이콘 클릭: 최소화/활성화 토글 */
    onClickTaskIcon: (entry: TaskbarEntry) => void;
    /** 미리보기 X 버튼: 해당 프로그램 제거 */
    onCloseProgram: (id: ProgramId) => void;
    /** hover 상태 변경 통지 (true=진입, false=이탈) */
    onPreviewChange: (active: boolean) => void;
    /** 미리보기 팝업에 표시할 content 렌더러 */
    renderPreviewContent: (entry: TaskbarEntry) => ReactNode;
}
