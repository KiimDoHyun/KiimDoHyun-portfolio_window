import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ProgramId, RunningProgram } from "@shared/types/program";

interface RunningProgramsState {
    byId: Record<ProgramId, RunningProgram>;
    order: Array<ProgramId>;
    activeId: ProgramId | null;
    zIndexCounter: number;
}

interface RunningProgramsActions {
    open: (id: ProgramId) => void;
    close: (id: ProgramId) => void;
    closeAll: () => void;
    activate: (id: ProgramId) => void;
    minimize: (id: ProgramId) => void;
    toggleFromTaskbar: (id: ProgramId) => void;
    requestZIndex: () => number;
    reset: () => void;
}

export type RunningProgramsStore = RunningProgramsState & RunningProgramsActions;

export const useRunningProgramsStore = create<RunningProgramsStore>()(
    immer((set, get) => ({
        byId: {},
        order: [],
        activeId: null,
        zIndexCounter: 1,

        open: (id) => {
            set((draft) => {
                draft.zIndexCounter += 1;
                const z = draft.zIndexCounter;
                const existing = draft.byId[id];
                if (existing) {
                    existing.status = "active";
                    existing.zIndex = z;
                } else {
                    draft.byId[id] = { id, status: "active", zIndex: z };
                    draft.order.push(id);
                }
                draft.activeId = id;
            });
        },

        close: (id) => {
            set((draft) => {
                delete draft.byId[id];
                draft.order = draft.order.filter((x) => x !== id);
                if (draft.activeId === id) draft.activeId = null;
            });
        },

        closeAll: () => {
            set((draft) => {
                for (const id of Object.keys(draft.byId)) {
                    draft.byId[id].status = "min";
                }
                draft.activeId = null;
            });
        },

        activate: (id) => {
            set((draft) => {
                const node = draft.byId[id];
                if (!node) return;
                draft.zIndexCounter += 1;
                node.zIndex = draft.zIndexCounter;
                node.status = "active";
                draft.activeId = id;
            });
        },

        minimize: (id) => {
            set((draft) => {
                const node = draft.byId[id];
                if (!node) return;
                node.status = "min";
                if (draft.activeId === id) draft.activeId = null;
            });
        },

        toggleFromTaskbar: (id) => {
            const s = get();
            const node = s.byId[id];
            if (!node) return;
            if (node.status === "min") {
                get().activate(id);
                return;
            }
            if (s.activeId === id) {
                get().minimize(id);
            } else {
                get().activate(id);
            }
        },

        requestZIndex: () => {
            let next = 0;
            set((draft) => {
                draft.zIndexCounter += 1;
                next = draft.zIndexCounter;
            });
            return next;
        },

        reset: () => {
            set((draft) => {
                draft.byId = {};
                draft.order = [];
                draft.activeId = null;
                draft.zIndexCounter = 1;
            });
        },
    })),
);
