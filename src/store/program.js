import { atom } from "recoil";

/*
현재 열린 폴더를 담는다.

Compoent: 활성화할 컴포넌트
key: 고유 키값
status: 현재 상태(열림 active, 최소화 min)
*/
export const rc_program_programList = atom({
    key: "rc_program_programList",
    default: [],
});

export const rc_program_activeProgram = atom({
    key: "rc_program_activeProgram",
    default: "",
});

export const rc_program_zIndexCnt = atom({
    key: "rc_program_zIndexCnt",
    default: 1,
});
