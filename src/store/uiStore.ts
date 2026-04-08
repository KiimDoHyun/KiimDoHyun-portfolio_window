import { create } from "zustand";

interface UiState {
    statusBarOpen: boolean;
    timeBarOpen: boolean;
    infoBarOpen: boolean;
    hiddenIconOpen: boolean;
    previewActive: boolean;
    displayLight: number;
}

interface UiActions {
    toggleStatusBar: () => void;
    toggleTimeBar: () => void;
    toggleInfoBar: () => void;
    toggleHiddenIcon: () => void;
    closeAllMenus: () => void;
    setPreviewActive: (next: boolean) => void;
    setDisplayLight: (next: number) => void;
}

export type UiStore = UiState & UiActions;

const CLOSED = {
    statusBarOpen: false,
    timeBarOpen: false,
    infoBarOpen: false,
    hiddenIconOpen: false,
};

export const useUiStore = create<UiStore>((set) => ({
    statusBarOpen: false,
    timeBarOpen: false,
    infoBarOpen: false,
    hiddenIconOpen: false,
    previewActive: false,
    displayLight: 100,

    toggleStatusBar: () =>
        set((s) => ({ ...CLOSED, statusBarOpen: !s.statusBarOpen })),
    toggleTimeBar: () =>
        set((s) => ({ ...CLOSED, timeBarOpen: !s.timeBarOpen })),
    toggleInfoBar: () =>
        set((s) => ({ ...CLOSED, infoBarOpen: !s.infoBarOpen })),
    toggleHiddenIcon: () =>
        set((s) => ({ ...CLOSED, hiddenIconOpen: !s.hiddenIconOpen })),
    closeAllMenus: () => set(() => ({ ...CLOSED })),
    setPreviewActive: (next) => set({ previewActive: next }),
    setDisplayLight: (next) => set({ displayLight: next }),
}));
