import { atom } from "recoil";

/*
현재 열린 폴더를 담는다.

Compoent: 활성화할 컴포넌트
key: 고유 키값
status: 현재 상태(열림 active, 최소화 min)
*/

// 현재 활성화된 모든 프로그램
export const rc_program_programList = atom({
    key: "rc_program_programList",
    default: [],
});

// 현재 활성화된 가장 앞에 있는 프로그램
export const rc_program_activeProgram = atom({
    key: "rc_program_activeProgram",
    default: "",
});

export const rc_program_zIndexCnt = atom({
    key: "rc_program_zIndexCnt",
    default: 1,
});
