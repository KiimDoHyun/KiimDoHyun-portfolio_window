# Domain Types & Normalized Store — Phase A Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Introduce a unified domain type layer (`ProgramNode` discriminated union), a normalized `FileSystemState`, tree↔normalized adapters, and a Zustand store skeleton — without touching any existing feature code.

**Architecture:** Single source-of-truth domain types live in `src/shared/types/`. Authoring format is a recursive `PortfolioSchema` (JSON-friendly tree). Runtime format is normalized (`nodes` map + `childrenByParent` index) for O(1) CRUD. `buildFileSystem` / `exportFileSystem` are pure functions that convert between the two. A Zustand store wraps `FileSystemState` and exposes `hydrate` / `export` / CRUD actions. Phase A is **strictly additive** — no existing file is modified except `package.json`.

**Tech Stack:** TypeScript, React (CRA + craco), Jest + @testing-library, Zustand + immer middleware (new dependency). Recoil is **not** removed in this phase.

**Reference design:** [docs/plans/2026-04-08-domain-types-and-store-design.md](2026-04-08-domain-types-and-store-design.md)

**Project conventions to honor:**
- Prop types use destructured `({...}: Props)` form, never `React.FC` (memory: feedback_react_fc).
- Array types use `Array<T>`, never `T[]` (memory: feedback_array_type_syntax).
- Frontend conventions live under `docs/rules/` — invoke the `frontend-conventions` skill before writing code.

---

## Pre-flight

### Task 0: Verify clean baseline

**Step 1:** Check git status is clean.

Run: `git status`
Expected: `nothing to commit, working tree clean` on branch `chore/remove-plan-docs` (or a fresh branch off master).

**Step 2:** Run the existing test suite to confirm green baseline.

Run: `npm test -- --watchAll=false`
Expected: all tests pass. Record the count for later comparison.

**Step 3:** Run typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**No commit.** This is verification only.

---

## Task 1: Add zustand + immer dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1:** Install dependencies.

Run: `npm install zustand immer`
Expected: both packages added to `dependencies`. Zustand v4+, immer v10+.

**Step 2:** Verify install.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 3:** Commit.

```bash
git add package.json package-lock.json
git commit -m "chore: add zustand and immer dependencies"
```

---

## Task 2: Define `ProgramType` and `ProgramStatus` literals

**Files:**
- Create: `src/shared/types/program.ts`

**Step 1:** Create the file with literal unions only (no node types yet — we'll TDD those next).

```ts
// src/shared/types/program.ts
export type ProgramId = string;

export type ProgramType =
  | "FOLDER"
  | "DOC"
  | "IMAGE"
  | "INFO"
  | "BROWSER";

export type ProgramStatus = "active" | "min";
```

**Step 2:** Verify typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 3:** Commit.

```bash
git add src/shared/types/program.ts
git commit -m "feat(types): add ProgramType and ProgramStatus literal unions"
```

---

## Task 3: Add content payload types (`ProjectData`, `ResumeData`)

**Files:**
- Create: `src/shared/types/content.ts`

**Note:** We are duplicating `ProjectData` here, NOT moving the existing one in [src/features/program-doc/DOCProgram.types.ts](../../src/features/program-doc/DOCProgram.types.ts). Phase A must not touch existing feature files. Phase B will swap imports and delete the duplicate.

**Step 1:** Create the file.

```ts
// src/shared/types/content.ts

export interface ProjectResult {
    title: string;
    content: string;
}

export interface ProjectStack {
    name: string;
    img: string;
}

export interface ProjectData {
    projectName: string;
    projectDesc: string;
    projectImages: Array<string>;
    projectTerm: Array<string>;
    projectType: string;
    projectReulst: Array<ProjectResult>;
    role: Array<string>;
    department: string;
    stack: Array<ProjectStack>;
    url: string;
}

// Placeholder — final shape decided in Phase B/C when INFO program is built out.
export type ResumeData = Record<string, unknown>;
```

> Note: `projectReulst` typo is preserved intentionally — it matches the existing field name. Renaming is out of scope for Phase A.

**Step 2:** Verify typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 3:** Commit.

```bash
git add src/shared/types/content.ts
git commit -m "feat(types): add content payload types (ProjectData, ResumeData)"
```

---

## Task 4: Define `ProgramNode` discriminated union and `FileSystemState`

**Files:**
- Modify: `src/shared/types/program.ts`

**Step 1:** Append to `src/shared/types/program.ts`:

```ts
import type { ProjectData, ResumeData } from "./content";

interface ProgramBase {
    id: ProgramId;
    parentId: ProgramId | null;
    name: string;
    icon: string;
}

export type ProgramNode =
    | (ProgramBase & { type: "FOLDER" })
    | (ProgramBase & { type: "DOC"; contents: ProjectData })
    | (ProgramBase & { type: "IMAGE"; src: string })
    | (ProgramBase & { type: "INFO"; contents: ResumeData })
    | (ProgramBase & { type: "BROWSER"; url: string });

export interface RunningProgram {
    id: ProgramId;
    status: ProgramStatus;
    zIndex: number;
}

export interface FileSystemState {
    rootId: ProgramId;
    nodes: Record<ProgramId, ProgramNode>;
    childrenByParent: Record<ProgramId, Array<ProgramId>>;
}
```

**Step 2:** Write a compile-time exhaustiveness sanity check (temporary file, will be deleted in step 4).

Create: `src/shared/types/__exhaustive_check.ts`

```ts
import type { ProgramNode } from "./program";

// Compile-time check: switching on `type` must narrow correctly.
function _check(node: ProgramNode): string {
    switch (node.type) {
        case "FOLDER":  return node.name;
        case "DOC":     return node.contents.projectName;
        case "IMAGE":   return node.src;
        case "INFO":    return node.name;
        case "BROWSER": return node.url;
    }
}
void _check;
```

**Step 3:** Run typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors. If `_check` doesn't compile, the union is wrong — fix `program.ts`.

**Step 4:** Delete the sanity check file.

Run: `rm src/shared/types/__exhaustive_check.ts`

**Step 5:** Commit.

```bash
git add src/shared/types/program.ts
git commit -m "feat(types): add ProgramNode discriminated union and FileSystemState"
```

---

## Task 5: Define `PortfolioSchema` (authoring tree)

**Files:**
- Create: `src/shared/types/portfolio-schema.ts`

**Step 1:** Create file.

```ts
// src/shared/types/portfolio-schema.ts
import type { ProjectData, ResumeData } from "./content";

export type AuthoringNode =
    | { type: "FOLDER"; name: string; icon: string; children: Array<AuthoringNode> }
    | { type: "DOC"; name: string; icon: string; contents: ProjectData }
    | { type: "IMAGE"; name: string; icon: string; src: string }
    | { type: "INFO"; name: string; icon: string; contents: ResumeData }
    | { type: "BROWSER"; name: string; icon: string; url: string };

export interface PortfolioSchema {
    version: 1;
    root: AuthoringNode;
}
```

**Step 2:** Typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 3:** Commit.

```bash
git add src/shared/types/portfolio-schema.ts
git commit -m "feat(types): add PortfolioSchema authoring tree types"
```

---

## Task 6: TDD `buildFileSystem` — failing test first

**Files:**
- Create: `src/shared/lib/file-system/__tests__/buildFileSystem.test.ts`

**Step 1:** Write the failing test.

```ts
// src/shared/lib/file-system/__tests__/buildFileSystem.test.ts
import { buildFileSystem } from "../buildFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "root.png",
        children: [
            {
                type: "FOLDER",
                name: "projects",
                icon: "folder.png",
                children: [
                    { type: "BROWSER", name: "github", icon: "gh.png", url: "https://github.com" },
                ],
            },
            { type: "IMAGE", name: "selfie", icon: "img.png", src: "/me.png" },
        ],
    },
};

describe("buildFileSystem", () => {
    it("creates a normalized state with a root id", () => {
        const state = buildFileSystem(schema);
        expect(state.rootId).toBeDefined();
        expect(state.nodes[state.rootId]).toBeDefined();
        expect(state.nodes[state.rootId].type).toBe("FOLDER");
        expect(state.nodes[state.rootId].parentId).toBeNull();
    });

    it("indexes children under their parent in declared order", () => {
        const state = buildFileSystem(schema);
        const rootChildren = state.childrenByParent[state.rootId];
        expect(rootChildren).toHaveLength(2);
        expect(state.nodes[rootChildren[0]].name).toBe("projects");
        expect(state.nodes[rootChildren[1]].name).toBe("selfie");
    });

    it("recursively flattens nested folders", () => {
        const state = buildFileSystem(schema);
        const projectsId = state.childrenByParent[state.rootId][0];
        const projectsChildren = state.childrenByParent[projectsId];
        expect(projectsChildren).toHaveLength(1);
        const githubNode = state.nodes[projectsChildren[0]];
        expect(githubNode.type).toBe("BROWSER");
        if (githubNode.type === "BROWSER") {
            expect(githubNode.url).toBe("https://github.com");
        }
    });

    it("assigns unique ids to every node", () => {
        const state = buildFileSystem(schema);
        const ids = Object.keys(state.nodes);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toHaveLength(4); // root + projects + github + selfie
    });

    it("sets parentId correctly on nested nodes", () => {
        const state = buildFileSystem(schema);
        const projectsId = state.childrenByParent[state.rootId][0];
        expect(state.nodes[projectsId].parentId).toBe(state.rootId);
        const githubId = state.childrenByParent[projectsId][0];
        expect(state.nodes[githubId].parentId).toBe(projectsId);
    });
});
```

**Step 2:** Run the test, expect it to fail (module not found).

Run: `npm test -- --watchAll=false --testPathPattern=buildFileSystem`
Expected: FAIL — `Cannot find module '../buildFileSystem'`.

**No commit yet.**

---

## Task 7: Implement `buildFileSystem` to make tests pass

**Files:**
- Create: `src/shared/lib/file-system/buildFileSystem.ts`

**Step 1:** Implement.

```ts
// src/shared/lib/file-system/buildFileSystem.ts
import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import type { AuthoringNode, PortfolioSchema } from "@shared/types/portfolio-schema";

let counter = 0;
function nextId(): ProgramId {
    counter += 1;
    return `node_${counter}`;
}

// Exposed for tests that need deterministic ids.
export function _resetIdCounterForTests(): void {
    counter = 0;
}

export function buildFileSystem(schema: PortfolioSchema): FileSystemState {
    const nodes: Record<ProgramId, ProgramNode> = {};
    const childrenByParent: Record<ProgramId, Array<ProgramId>> = {};

    function visit(authoring: AuthoringNode, parentId: ProgramId | null): ProgramId {
        const id = nextId();

        if (authoring.type === "FOLDER") {
            const node: ProgramNode = {
                id,
                parentId,
                type: "FOLDER",
                name: authoring.name,
                icon: authoring.icon,
            };
            nodes[id] = node;
            childrenByParent[id] = authoring.children.map((child) => visit(child, id));
            return id;
        }

        let node: ProgramNode;
        switch (authoring.type) {
            case "DOC":
                node = { id, parentId, type: "DOC", name: authoring.name, icon: authoring.icon, contents: authoring.contents };
                break;
            case "IMAGE":
                node = { id, parentId, type: "IMAGE", name: authoring.name, icon: authoring.icon, src: authoring.src };
                break;
            case "INFO":
                node = { id, parentId, type: "INFO", name: authoring.name, icon: authoring.icon, contents: authoring.contents };
                break;
            case "BROWSER":
                node = { id, parentId, type: "BROWSER", name: authoring.name, icon: authoring.icon, url: authoring.url };
                break;
        }
        nodes[id] = node;
        return id;
    }

    const rootId = visit(schema.root, null);
    return { rootId, nodes, childrenByParent };
}
```

> **Path alias check:** Verify `@shared/*` path alias exists in `tsconfig.json` / `craco.config.*`. If not, use relative imports (`../../types/program`). Run `grep '"@shared' tsconfig.json` to confirm.

**Step 2:** Run the test.

Run: `npm test -- --watchAll=false --testPathPattern=buildFileSystem`
Expected: PASS (all 5 tests).

**Step 3:** Run full typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 4:** Commit.

```bash
git add src/shared/lib/file-system/buildFileSystem.ts src/shared/lib/file-system/__tests__/buildFileSystem.test.ts
git commit -m "feat(file-system): add buildFileSystem tree-to-normalized adapter"
```

---

## Task 8: TDD `exportFileSystem` — failing test first

**Files:**
- Create: `src/shared/lib/file-system/__tests__/exportFileSystem.test.ts`

**Step 1:** Write the test.

```ts
// src/shared/lib/file-system/__tests__/exportFileSystem.test.ts
import { buildFileSystem } from "../buildFileSystem";
import { exportFileSystem } from "../exportFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "root.png",
        children: [
            {
                type: "FOLDER",
                name: "projects",
                icon: "folder.png",
                children: [
                    { type: "BROWSER", name: "github", icon: "gh.png", url: "https://github.com" },
                ],
            },
            { type: "IMAGE", name: "selfie", icon: "img.png", src: "/me.png" },
        ],
    },
};

describe("exportFileSystem", () => {
    it("round-trips: export(build(schema)) deeply equals schema", () => {
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        expect(exported).toEqual(schema);
    });

    it("preserves child order", () => {
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        if (exported.root.type !== "FOLDER") throw new Error("expected FOLDER");
        expect(exported.root.children.map((c) => c.name)).toEqual(["projects", "selfie"]);
    });

    it("does not leak ids into the output", () => {
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        const json = JSON.stringify(exported);
        expect(json).not.toContain("node_");
        expect(json).not.toContain('"id"');
        expect(json).not.toContain("parentId");
    });
});
```

**Step 2:** Run, expect fail (module not found).

Run: `npm test -- --watchAll=false --testPathPattern=exportFileSystem`
Expected: FAIL.

---

## Task 9: Implement `exportFileSystem`

**Files:**
- Create: `src/shared/lib/file-system/exportFileSystem.ts`

**Step 1:** Implement.

```ts
// src/shared/lib/file-system/exportFileSystem.ts
import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import type { AuthoringNode, PortfolioSchema } from "@shared/types/portfolio-schema";

export function exportFileSystem(state: FileSystemState): PortfolioSchema {
    function visit(id: ProgramId): AuthoringNode {
        const node: ProgramNode = state.nodes[id];

        if (node.type === "FOLDER") {
            const childIds = state.childrenByParent[id] ?? [];
            return {
                type: "FOLDER",
                name: node.name,
                icon: node.icon,
                children: childIds.map(visit),
            };
        }

        switch (node.type) {
            case "DOC":
                return { type: "DOC", name: node.name, icon: node.icon, contents: node.contents };
            case "IMAGE":
                return { type: "IMAGE", name: node.name, icon: node.icon, src: node.src };
            case "INFO":
                return { type: "INFO", name: node.name, icon: node.icon, contents: node.contents };
            case "BROWSER":
                return { type: "BROWSER", name: node.name, icon: node.icon, url: node.url };
        }
    }

    return { version: 1, root: visit(state.rootId) };
}
```

**Step 2:** Run test.

Run: `npm test -- --watchAll=false --testPathPattern=exportFileSystem`
Expected: PASS (3 tests).

**Step 3:** Typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 4:** Commit.

```bash
git add src/shared/lib/file-system/exportFileSystem.ts src/shared/lib/file-system/__tests__/exportFileSystem.test.ts
git commit -m "feat(file-system): add exportFileSystem normalized-to-tree adapter"
```

---

## Task 10: TDD `fileSystemStore` — hydrate / export

**Files:**
- Create: `src/store/__tests__/fileSystemStore.test.ts`

**Step 1:** Write the failing test.

```ts
// src/store/__tests__/fileSystemStore.test.ts
import { useFileSystemStore } from "../fileSystemStore";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "root.png",
        children: [
            { type: "BROWSER", name: "gh", icon: "gh.png", url: "https://github.com" },
        ],
    },
};

describe("fileSystemStore", () => {
    beforeEach(() => {
        useFileSystemStore.setState({ rootId: "", nodes: {}, childrenByParent: {} });
    });

    it("hydrate populates state from a schema", () => {
        useFileSystemStore.getState().hydrate(schema);
        const state = useFileSystemStore.getState();
        expect(state.rootId).toBeTruthy();
        expect(Object.keys(state.nodes)).toHaveLength(2);
    });

    it("export returns a schema deeply equal to the original", () => {
        useFileSystemStore.getState().hydrate(schema);
        const exported = useFileSystemStore.getState().exportSchema();
        expect(exported).toEqual(schema);
    });

    it("addNode appends a child under the given parent", () => {
        useFileSystemStore.getState().hydrate(schema);
        const rootId = useFileSystemStore.getState().rootId;
        const newId = useFileSystemStore.getState().addNode(rootId, {
            type: "IMAGE",
            name: "new",
            icon: "i.png",
            src: "/x.png",
        });
        const state = useFileSystemStore.getState();
        expect(state.nodes[newId]).toBeDefined();
        expect(state.nodes[newId].parentId).toBe(rootId);
        expect(state.childrenByParent[rootId]).toContain(newId);
    });

    it("renameNode changes only the name", () => {
        useFileSystemStore.getState().hydrate(schema);
        const rootId = useFileSystemStore.getState().rootId;
        const childId = useFileSystemStore.getState().childrenByParent[rootId][0];
        useFileSystemStore.getState().renameNode(childId, "renamed");
        expect(useFileSystemStore.getState().nodes[childId].name).toBe("renamed");
    });

    it("deleteNode removes the node and its descendants", () => {
        useFileSystemStore.getState().hydrate(schema);
        const rootId = useFileSystemStore.getState().rootId;
        const childId = useFileSystemStore.getState().childrenByParent[rootId][0];
        useFileSystemStore.getState().deleteNode(childId);
        const state = useFileSystemStore.getState();
        expect(state.nodes[childId]).toBeUndefined();
        expect(state.childrenByParent[rootId]).not.toContain(childId);
    });

    it("moveNode reparents and updates indices", () => {
        const nestedSchema: PortfolioSchema = {
            version: 1,
            root: {
                type: "FOLDER",
                name: "root",
                icon: "r.png",
                children: [
                    { type: "FOLDER", name: "a", icon: "a.png", children: [] },
                    { type: "FOLDER", name: "b", icon: "b.png", children: [
                        { type: "IMAGE", name: "img", icon: "i.png", src: "/i.png" },
                    ] },
                ],
            },
        };
        useFileSystemStore.getState().hydrate(nestedSchema);
        const rootId = useFileSystemStore.getState().rootId;
        const aId = useFileSystemStore.getState().childrenByParent[rootId][0];
        const bId = useFileSystemStore.getState().childrenByParent[rootId][1];
        const imgId = useFileSystemStore.getState().childrenByParent[bId][0];

        useFileSystemStore.getState().moveNode(imgId, aId);

        const state = useFileSystemStore.getState();
        expect(state.nodes[imgId].parentId).toBe(aId);
        expect(state.childrenByParent[aId]).toContain(imgId);
        expect(state.childrenByParent[bId]).not.toContain(imgId);
    });
});
```

**Step 2:** Run, expect fail (module not found).

Run: `npm test -- --watchAll=false --testPathPattern=fileSystemStore`
Expected: FAIL.

---

## Task 11: Implement `fileSystemStore`

**Files:**
- Create: `src/store/fileSystemStore.ts`

**Step 1:** Implement.

```ts
// src/store/fileSystemStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
    FileSystemState,
    ProgramId,
    ProgramNode,
} from "@shared/types/program";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";
import { buildFileSystem } from "@shared/lib/file-system/buildFileSystem";
import { exportFileSystem } from "@shared/lib/file-system/exportFileSystem";

export type NewNodeInput =
    | { type: "FOLDER"; name: string; icon: string }
    | { type: "DOC"; name: string; icon: string; contents: ProgramNode extends { type: "DOC"; contents: infer C } ? C : never }
    | { type: "IMAGE"; name: string; icon: string; src: string }
    | { type: "INFO"; name: string; icon: string; contents: ProgramNode extends { type: "INFO"; contents: infer C } ? C : never }
    | { type: "BROWSER"; name: string; icon: string; url: string };

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
                let node: ProgramNode;
                switch (input.type) {
                    case "FOLDER":
                        node = { ...base, type: "FOLDER" };
                        draft.childrenByParent[id] = [];
                        break;
                    case "DOC":
                        node = { ...base, type: "DOC", contents: input.contents };
                        break;
                    case "IMAGE":
                        node = { ...base, type: "IMAGE", src: input.src };
                        break;
                    case "INFO":
                        node = { ...base, type: "INFO", contents: input.contents };
                        break;
                    case "BROWSER":
                        node = { ...base, type: "BROWSER", url: input.url };
                        break;
                }
                draft.nodes[id] = node;
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
```

**Step 2:** Run the store tests.

Run: `npm test -- --watchAll=false --testPathPattern=fileSystemStore`
Expected: PASS (7 tests).

**Step 3:** Typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

> **If `@shared/*` alias is missing:** the implementation file imports use `@shared/*` — replace with relative paths if your `tsconfig.json` doesn't define them. Check first with `grep '"@shared' tsconfig.json package.json craco.config.*`.

**Step 4:** Commit.

```bash
git add src/store/fileSystemStore.ts src/store/__tests__/fileSystemStore.test.ts
git commit -m "feat(store): add Zustand fileSystemStore with CRUD actions"
```

---

## Task 12: Author seed JSON

**Files:**
- Create: `src/data/portfolio.json`

**Step 1:** Read the existing hard-coded directory data to use as the basis.

Run: read [src/pages/DesktopPage/DesktopPage.tsx](../../src/pages/DesktopPage/DesktopPage.tsx) and any sibling file that builds the initial `directory` / `directoryTree` (likely `DesktopDataContext.tsx` consumer or a constants file). Identify the items, their `type`, `icon`, `parent`, and any `route`/contents.

**Step 2:** Translate that flat structure into a recursive `PortfolioSchema` JSON shape:

```json
{
  "version": 1,
  "root": {
    "type": "FOLDER",
    "name": "root",
    "icon": "<existing root icon path>",
    "children": [
      // ... translated children
    ]
  }
}
```

> Phase A only requires this file to **parse and validate against the type**. It does not need to be wired into the app yet.

**Step 3:** Write a one-shot validation test.

Create: `src/data/__tests__/portfolio.test.ts`

```ts
import portfolio from "../portfolio.json";
import { buildFileSystem } from "@shared/lib/file-system/buildFileSystem";
import { exportFileSystem } from "@shared/lib/file-system/exportFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

describe("portfolio.json", () => {
    it("conforms to PortfolioSchema and round-trips", () => {
        const schema = portfolio as PortfolioSchema;
        const state = buildFileSystem(schema);
        const exported = exportFileSystem(state);
        expect(exported).toEqual(schema);
    });
});
```

**Step 4:** Ensure JSON imports are enabled. CRA enables this by default; verify `tsconfig.json` has `"resolveJsonModule": true`. If not, add it.

**Step 5:** Run the test.

Run: `npm test -- --watchAll=false --testPathPattern=portfolio`
Expected: PASS.

If it fails on type assertion, fix the JSON until it conforms.

**Step 6:** Commit.

```bash
git add src/data/portfolio.json src/data/__tests__/portfolio.test.ts
git commit -m "feat(data): add portfolio seed JSON conforming to PortfolioSchema"
```

> Note: If the CRA test runner refuses JSON imports from `src/data/`, fall back to inlining a `const schema: PortfolioSchema = { ... }` in the test instead, and keep the `.json` file as-is. The point is to validate the JSON shape against the type system; the wiring happens in Phase B.

---

## Task 13: Phase A isolation guard

**Goal:** Prove no existing feature file accidentally imports new code.

**Step 1:** Search for cross-imports.

Run: `grep -r "@shared/types/program\|@shared/types/portfolio\|@shared/lib/file-system\|store/fileSystemStore" src/features src/pages src/app`
Expected: NO matches. If any appear, that's a Phase B leak — revert it.

**Step 2:** Run full test suite.

Run: `npm test -- --watchAll=false`
Expected: ALL tests pass — both pre-existing and new. Test count = baseline (Task 0) + new tests added in this plan.

**Step 3:** Run typecheck.

Run: `npx tsc --noEmit`
Expected: 0 errors.

**Step 4:** Run lint if configured.

Run: `npm run lint` (skip if script doesn't exist).
Expected: clean.

**No commit** — verification only.

---

## Task 14: Final review & summary

**Step 1:** Review the diff against `master`.

Run: `git log --oneline master..HEAD` and `git diff master --stat`
Expected: ~10 commits, all additive. Modified files limited to `package.json` / `package-lock.json`.

**Step 2:** Confirm Phase A acceptance criteria from the design doc:

- [ ] `tsc --noEmit` passes
- [ ] All new unit tests pass
- [ ] `exportFileSystem(buildFileSystem(seed)) === seed` (round-trip)
- [ ] Pre-existing tests still pass
- [ ] No feature file imports new code (Task 13 grep is empty)
- [ ] `zustand` + `immer` added to `package.json`
- [ ] Recoil is **still installed** (Phase B will remove it)

**Step 3:** STOP. Do not start Phase B. Report completion to the user with:
- list of commits
- test count delta
- any notes about deviations from this plan

---

## Out of scope (explicit non-goals)

- ❌ Removing Recoil
- ❌ Modifying `DesktopDataContext`, Taskbar, WindowShell, navigation hooks, or any feature file
- ❌ Deleting existing per-feature `*.types.ts` files
- ❌ Building right-click context menu UI
- ❌ Wiring the seed JSON into app boot
- ❌ Persisting store to localStorage (`persist` middleware)
- ❌ Renaming `projectReulst` typo

All of the above belong to Phase B or Phase C.
