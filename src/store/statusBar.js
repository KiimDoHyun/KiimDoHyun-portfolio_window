import { atom } from "recoil";

// 시작 메뉴바 활성화 여부
export const rc_statusBar_active = atom({
    key: "rc_statusBar_active",
    default: false,
});
