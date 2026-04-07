import { atom } from "recoil";
import type { WindowShellItem } from "@features/window-shell";

/*
현재 열린 프로그램(윈도우) 목록.

데이터만 담고, 실제 렌더링은 pages/DesktopPage 에서 처리한다.
*/

// 현재 활성화된 모든 프로그램
export const rc_program_programList = atom<Array<WindowShellItem>>({
    key: "rc_program_programList",
    default: [],
});

// 현재 활성화된 가장 앞에 있는 프로그램
export const rc_program_activeProgram = atom<string>({
    key: "rc_program_activeProgram",
    default: "",
});

export const rc_program_zIndexCnt = atom<number>({
    key: "rc_program_zIndexCnt",
    default: 1,
});
