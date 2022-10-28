import { atom } from "recoil";

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
