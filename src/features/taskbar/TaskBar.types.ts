import type { ComponentType } from "react";

export type ProgramStatus = "active" | "min";

export type ProgramType =
    | "IMAGE"
    | "FOLDER"
    | "DOC"
    | "INFO"
    | "BROWSER"
    | string;

export interface TaskbarProgramItem {
    name: string;
    type: ProgramType;
    icon?: string;
    parent?: string;
    status?: ProgramStatus;
    Component?: ComponentType<{ item: TaskbarProgramItem }>;
}

export interface HoverTarget {
    name: string;
    idx: number;
}

export interface TaskBarProps {
    programList: Array<TaskbarProgramItem>;
    activeProgram: string;
    hiddenIcon: boolean;
    onClickStartIcon: () => void;
    onClickTime: () => void;
    onClickInfo: () => void;
    onClickHiddenIcon: () => void;
    onClickCloseAll: () => void;
    /** taskbar 아이콘 클릭: 최소화/활성화 토글 */
    onClickTaskIcon: (item: TaskbarProgramItem) => void;
    /** 미리보기 X 버튼: 해당 프로그램 제거 */
    onCloseProgram: (name: string) => void;
    /** hover 상태 변경 통지 (true=진입, false=이탈) */
    onPreviewChange: (active: boolean) => void;
}
