import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
    FileSystemState,
    ProgramId,
    ProgramNode,
} from "@shared/types/program";
import type { AuthoringNode } from "@shared/types/portfolio-schema";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";
import { buildFileSystem } from "@shared/lib/file-system/buildFileSystem";
import { exportFileSystem } from "@shared/lib/file-system/exportFileSystem";
import { pickExtraFields } from "@shared/lib/programMeta";

export type NewNodeInput =
    | { type: "FOLDER"; name: string; icon: string }
    | Exclude<AuthoringNode, { type: "FOLDER" }>;

export type UpdateNodeInput = Partial<Omit<ProgramNode, "id" | "parentId" | "type">>;

interface FileSystemActions {
    hydrate: (schema: PortfolioSchema) => void;
    exportSchema: () => PortfolioSchema;
    addNode: (parentId: ProgramId, input: NewNodeInput) => ProgramId;
    updateNode: (id: ProgramId, patch: UpdateNodeInput) => void;
    deleteNode: (id: ProgramId) => void;
    moveNode: (id: ProgramId, newParentId: ProgramId, index?: number) => void;
    renameNode: (id: ProgramId, name: string) => void;
}

export type FileSystemStore = FileSystemState & FileSystemActions;

let runtimeIdCounter = 0;
function nextRuntimeId(): ProgramId {
    runtimeIdCounter += 1;
    return `rt_${runtimeIdCounter}`;
}

export const useFileSystemStore = create<FileSystemStore>()(
    immer((set, get) => ({
        rootId: "",
        nodes: {},
        childrenByParent: {},

        hydrate: (schema) => {
            const fresh = buildFileSystem(schema);
            set((draft) => {
                draft.rootId = fresh.rootId;
                draft.nodes = fresh.nodes;
                draft.childrenByParent = fresh.childrenByParent;
            });
        },

        exportSchema: () => exportFileSystem(get()),

        addNode: (parentId, input) => {
            const id = nextRuntimeId();
            set((draft) => {
                const base = { id, parentId, name: input.name, icon: input.icon };

                if (input.type === "FOLDER") {
                    draft.nodes[id] = { ...base, type: "FOLDER" };
                    draft.childrenByParent[id] = [];
                } else {
                    const extra = pickExtraFields(input.type, input as Record<string, unknown>);
                    draft.nodes[id] = { ...base, type: input.type, ...extra } as ProgramNode;
                }

                if (!draft.childrenByParent[parentId]) {
                    draft.childrenByParent[parentId] = [];
                }
                draft.childrenByParent[parentId].push(id);
            });
            return id;
        },

        updateNode: (id, patch) => {
            set((draft) => {
                const node = draft.nodes[id];
                if (!node) return;
                Object.assign(node, patch);
            });
        },

        renameNode: (id, name) => {
            set((draft) => {
                const node = draft.nodes[id];
                if (node) node.name = name;
            });
        },

        deleteNode: (id) => {
            set((draft) => {
                const collect = (nid: ProgramId, acc: Array<ProgramId>): Array<ProgramId> => {
                    acc.push(nid);
                    const kids = draft.childrenByParent[nid] ?? [];
                    kids.forEach((k) => collect(k, acc));
                    return acc;
                };
                const toRemove = collect(id, []);
                const node = draft.nodes[id];
                if (node && node.parentId !== null) {
                    const siblings = draft.childrenByParent[node.parentId];
                    if (siblings) {
                        draft.childrenByParent[node.parentId] = siblings.filter((sid) => sid !== id);
                    }
                }
                toRemove.forEach((rid) => {
                    delete draft.nodes[rid];
                    delete draft.childrenByParent[rid];
                });
            });
        },

        moveNode: (id, newParentId, index) => {
            set((draft) => {
                const node = draft.nodes[id];
                if (!node || node.parentId === null) return;
                const oldParent = node.parentId;
                draft.childrenByParent[oldParent] = (draft.childrenByParent[oldParent] ?? []).filter((sid) => sid !== id);
                node.parentId = newParentId;
                if (!draft.childrenByParent[newParentId]) {
                    draft.childrenByParent[newParentId] = [];
                }
                const target = draft.childrenByParent[newParentId];
                if (index === undefined) {
                    target.push(id);
                } else {
                    target.splice(index, 0, id);
                }
            });
        },
    })),
);
