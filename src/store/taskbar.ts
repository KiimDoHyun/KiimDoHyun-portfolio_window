import { atom } from "recoil";

// 시작 메뉴바 활성화 여부
export const rc_taskbar_statusBar_active = atom({
    key: "rc_taskbar_statusBar_active",
    default: false,
});

// 시간 메뉴바 활성화 여부
export const rc_taskbar_timeBar_active = atom({
    key: "rc_taskbar_timeBar_active",
    default: false,
});

// 정보 바 활성화 여부
export const rc_taskbar_infoBar_active = atom({
    key: "rc_taskbar_infoBar_active",
    default: false,
});

// 숨겨진 아이콘 활성화 여부
export const rc_taskbar_hiddenIcon_active = atom({
    key: "rc_taskbar_hiddenIcon_active",
    default: false,
});

// 미리보기 활성화 여부
export const rc_taskbar_preview_active = atom({
    key: "rc_taskbar_preview_active",
    default: false,
});
