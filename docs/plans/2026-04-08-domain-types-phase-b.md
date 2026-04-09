# Domain Types & Normalized Store — Phase B Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove Recoil entirely, replace `DesktopDataContext` with a Zustand-based normalized store stack, and migrate every feature to the new `ProgramNode` / `RunningProgram` / id-based domain types introduced in Phase A — without regressing any existing behavior.

**Architecture:** Three-stage migration gated by an adapter layer.
- **B-1**: build new stores (`runningProgramsStore`, `uiStore`), pure helpers (`getRoute`), hydrate seed JSON at boot, and rewrite `useDesktopData` **internally** to sit on top of the new stores while keeping its public signature. `DesktopPage` flips off Recoil domain atoms. Features are untouched.
- **B-2**: migrate each feature one at a time (TDD) to consume the new stores directly with `ProgramNode`/id-based APIs. Adapter still serves un-migrated features.
- **B-3**: delete the adapter, the old types, UI-toggle Recoil atoms, time atoms, `<RecoilRoot>`, React 19 polyfill, and the `recoil` dependency itself.

**Tech Stack:** TypeScript, React (CRA + craco), Jest + @testing-library, Zustand + immer (installed in Phase A), Recoil (to be removed).

**Reference design:** [docs/plans/2026-04-08-domain-types-phase-b-design.md](2026-04-08-domain-types-phase-b-design.md)
**Phase A plan:** [docs/plans/2026-04-08-domain-types-phase-a.md](2026-04-08-domain-types-phase-a.md)

---

## Project conventions (honor throughout)

- **No `React.FC`** — prop types use destructured `({...}: Props)` form.
- **Array types use `Array<T>`**, never `T[]`. `[]` is tuples only.
- **Package manager is `pnpm`**. Never run `npm install`.
- Invoke the `frontend-conventions` skill before writing code in any task.
- Invoke `superpowers:test-driven-development` for every task that has a test step.
- Invoke `superpowers:verification-before-completion` before claiming a task done.

## Commit discipline

- Each task ends in exactly **one commit** unless stated otherwise.
- Commit message format: `<type>(<scope>): <summary>` (e.g. `feat(store): add runningProgramsStore`).
- Do NOT squash across tasks. The plan's commit sequence is the audit trail.

## Path aliases

Verify at Task 0 that the following aliases resolve (they are used throughout the plan). If any is missing, use relative imports instead and note the deviation.

- `@shared/*` → `src/shared/*`
- `@features/*` → `src/features/*`
- `@pages/*` → `src/pages/*`
- `@store/*` → `src/store/*`
- `@images/*` → `src/assets/images/*` (or equivalent)

Check with: `grep -E '"@(shared|features|pages|store|images)' tsconfig.json craco.config.*`

---

## Pre-flight

### Task 0: Verify clean baseline

**Step 1:** Git clean.

Run: `git status`
Expected: clean working tree on a branch off `master` (or the current Phase A branch).

**Step 2:** Baseline tests.

Run: `pnpm test -- --watchAll=false`
Expected: all green. Record the test count (will be called `BASELINE_TEST_COUNT` in later tasks).

**Step 3:** Baseline typecheck.

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors.

**Step 4:** Confirm Phase A artifacts exist.

Run: `ls src/shared/types/program.ts src/shared/types/content.ts src/shared/types/portfolio-schema.ts src/shared/lib/file-system/buildFileSystem.ts src/shared/lib/file-system/exportFileSystem.ts src/store/fileSystemStore.ts src/data/portfolio.json`
Expected: all files present.

**Step 5:** Confirm Phase A's `grep` isolation guard still holds.

Run: `grep -r "@shared/types/program\|@shared/lib/file-system\|store/fileSystemStore" src/features src/pages src/app 2>/dev/null`
Expected: no matches (Phase A's "no feature uses new code" invariant).

**No commit.** Verification only.

---

# Stage B-1 — Stores + adapter (features untouched)

## Task 1: `runningProgramsStore` (Zustand + immer) with tests

**Files:**
- Create: `src/store/runningProgramsStore.ts`
- Create: `src/store/__tests__/runningProgramsStore.test.ts`

**Purpose:** Replace `rc_program_programList` / `rc_program_activeProgram` / `rc_program_zIndexCnt`. Uses id-based addressing (`ProgramId` from Phase A) — no `name` keys.

**Step 1:** Write the failing test.

```ts
// src/store/__tests__/runningProgramsStore.test.ts
import { useRunningProgramsStore } from "../runningProgramsStore";

describe("runningProgramsStore", () => {
    beforeEach(() => {
        useRunningProgramsStore.setState({
            byId: {},
            order: [],
            activeId: null,
            zIndexCounter: 1,
        });
    });

    it("open() adds a new running program with status 'active' and sets activeId", () => {
        useRunningProgramsStore.getState().open("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"]).toMatchObject({ id: "n1", status: "active" });
        expect(s.order).toEqual(["n1"]);
        expect(s.activeId).toBe("n1");
        expect(s.zIndexCounter).toBe(2);
        expect(s.byId["n1"].zIndex).toBe(2);
    });

    it("open() on an already-open minimized program restores it and increments zIndex", () => {
        const { open, minimize } = useRunningProgramsStore.getState();
        open("n1");
        minimize("n1");
        open("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"].status).toBe("active");
        expect(s.activeId).toBe("n1");
        expect(s.order).toEqual(["n1"]); // no duplicate
        expect(s.zIndexCounter).toBe(3);
    });

    it("activate() changes activeId and bumps zIndex for that program only", () => {
        const { open, activate } = useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        const prevCounter = useRunningProgramsStore.getState().zIndexCounter;
        activate("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.activeId).toBe("n1");
        expect(s.byId["n1"].zIndex).toBe(prevCounter + 1);
        expect(s.zIndexCounter).toBe(prevCounter + 1);
    });

    it("minimize() sets status='min' and clears activeId if it was active", () => {
        const { open, minimize } = useRunningProgramsStore.getState();
        open("n1");
        minimize("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"].status).toBe("min");
        expect(s.activeId).toBeNull();
    });

    it("close() removes the program from byId and order", () => {
        const { open, close } = useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        close("n1");
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"]).toBeUndefined();
        expect(s.order).toEqual(["n2"]);
    });

    it("close() on the currently active program clears activeId", () => {
        const { open, close } = useRunningProgramsStore.getState();
        open("n1");
        close("n1");
        expect(useRunningProgramsStore.getState().activeId).toBeNull();
    });

    it("closeAll() sets every program's status to 'min' and clears activeId", () => {
        const { open, closeAll } = useRunningProgramsStore.getState();
        open("n1");
        open("n2");
        closeAll();
        const s = useRunningProgramsStore.getState();
        expect(s.byId["n1"].status).toBe("min");
        expect(s.byId["n2"].status).toBe("min");
        expect(s.activeId).toBeNull();
    });

    it("toggleFromTaskbar(): minimized → active; active and is activeId → minimize; active and not activeId → activate", () => {
        const { open, minimize, toggleFromTaskbar } =
            useRunningProgramsStore.getState();
        open("n1");
        open("n2"); // activeId=n2
        // case 1: toggling n2 (active + activeId) → minimize
        toggleFromTaskbar("n2");
        expect(useRunningProgramsStore.getState().byId["n2"].status).toBe("min");
        expect(useRunningProgramsStore.getState().activeId).toBeNull();
        // case 2: toggling minimized n2 → active
        toggleFromTaskbar("n2");
        expect(useRunningProgramsStore.getState().byId["n2"].status).toBe("active");
        expect(useRunningProgramsStore.getState().activeId).toBe("n2");
        // case 3: n1 active but not activeId → activate
        minimize("n2"); // activeId=null, n1 still active
        useRunningProgramsStore.setState((draft) => {
            draft.byId["n1"].status = "active";
        });
        toggleFromTaskbar("n1");
        expect(useRunningProgramsStore.getState().activeId).toBe("n1");
    });

    it("requestZIndex() increments and returns the new counter", () => {
        const next = useRunningProgramsStore.getState().requestZIndex();
        expect(next).toBe(2);
        expect(useRunningProgramsStore.getState().zIndexCounter).toBe(2);
    });
});
```

**Step 2:** Run, expect failure.

Run: `pnpm test -- --watchAll=false --testPathPattern=runningProgramsStore`
Expected: FAIL — `Cannot find module '../runningProgramsStore'`.

**Step 3:** Implement.

```ts
// src/store/runningProgramsStore.ts
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
    })),
);
```

**Step 4:** Run the test, expect pass.

Run: `pnpm test -- --watchAll=false --testPathPattern=runningProgramsStore`
Expected: PASS (all cases).

**Step 5:** Typecheck.

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors.

**Step 6:** Commit.

```bash
git add src/store/runningProgramsStore.ts src/store/__tests__/runningProgramsStore.test.ts
git commit -m "feat(store): add runningProgramsStore with id-based CRUD and z-index"
```

---

## Task 2: `uiStore` with tests

**Files:**
- Create: `src/store/uiStore.ts`
- Create: `src/store/__tests__/uiStore.test.ts`

**Purpose:** Replace the five taskbar toggle atoms (`rc_taskbar_statusBar_active`, `rc_taskbar_timeBar_active`, `rc_taskbar_infoBar_active`, `rc_taskbar_hiddenIcon_active`, `rc_taskbar_preview_active`) and `rc_global_DisplayLight`. Encodes the mutual-exclusion rule directly in actions so `DesktopPage` no longer needs five separate handlers.

**Step 1:** Failing test.

```ts
// src/store/__tests__/uiStore.test.ts
import { useUiStore } from "../uiStore";

const INITIAL = {
    statusBarOpen: false,
    timeBarOpen: false,
    infoBarOpen: false,
    hiddenIconOpen: false,
    previewActive: false,
    displayLight: 100,
};

describe("uiStore", () => {
    beforeEach(() => {
        useUiStore.setState({ ...INITIAL });
    });

    it("toggleStatusBar() toggles statusBar and closes the other three menus", () => {
        useUiStore.setState({
            timeBarOpen: true,
            infoBarOpen: true,
            hiddenIconOpen: true,
        });
        useUiStore.getState().toggleStatusBar();
        const s = useUiStore.getState();
        expect(s.statusBarOpen).toBe(true);
        expect(s.timeBarOpen).toBe(false);
        expect(s.infoBarOpen).toBe(false);
        expect(s.hiddenIconOpen).toBe(false);
    });

    it("toggleTimeBar() toggles timeBar and closes the other three menus", () => {
        useUiStore.getState().toggleTimeBar();
        expect(useUiStore.getState().timeBarOpen).toBe(true);
        useUiStore.getState().toggleTimeBar();
        expect(useUiStore.getState().timeBarOpen).toBe(false);
    });

    it("toggleInfoBar() and toggleHiddenIcon() behave symmetrically", () => {
        useUiStore.getState().toggleInfoBar();
        expect(useUiStore.getState().infoBarOpen).toBe(true);
        expect(useUiStore.getState().hiddenIconOpen).toBe(false);
        useUiStore.getState().toggleHiddenIcon();
        expect(useUiStore.getState().hiddenIconOpen).toBe(true);
        expect(useUiStore.getState().infoBarOpen).toBe(false);
    });

    it("closeAllMenus() sets all four menus false but leaves previewActive/displayLight alone", () => {
        useUiStore.setState({
            statusBarOpen: true,
            timeBarOpen: true,
            infoBarOpen: true,
            hiddenIconOpen: true,
            previewActive: true,
            displayLight: 42,
        });
        useUiStore.getState().closeAllMenus();
        const s = useUiStore.getState();
        expect(s.statusBarOpen).toBe(false);
        expect(s.timeBarOpen).toBe(false);
        expect(s.infoBarOpen).toBe(false);
        expect(s.hiddenIconOpen).toBe(false);
        expect(s.previewActive).toBe(true);
        expect(s.displayLight).toBe(42);
    });

    it("setPreviewActive() and setDisplayLight() update their fields", () => {
        useUiStore.getState().setPreviewActive(true);
        expect(useUiStore.getState().previewActive).toBe(true);
        useUiStore.getState().setDisplayLight(50);
        expect(useUiStore.getState().displayLight).toBe(50);
    });
});
```

**Step 2:** Run, expect fail.

Run: `pnpm test -- --watchAll=false --testPathPattern=uiStore`

**Step 3:** Implement.

```ts
// src/store/uiStore.ts
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
```

**Step 4:** Run test, expect pass.

**Step 5:** Typecheck.

**Step 6:** Commit.

```bash
git add src/store/uiStore.ts src/store/__tests__/uiStore.test.ts
git commit -m "feat(store): add uiStore for taskbar menu toggles and displayLight"
```

---

## Task 3: `getRoute` pure helper

**Files:**
- Create: `src/shared/lib/file-system/getRoute.ts`
- Create: `src/shared/lib/file-system/__tests__/getRoute.test.ts`

**Purpose:** Replace `SetDirectory.tsx`'s DFS that computed `"/ KDH / 프로젝트 / ..."` route strings. Walks `parentId` chain up to the root and joins names with `" / "`, prefixed with `"/ KDH"` to match the current route format.

**Step 1:** Failing test.

```ts
// src/shared/lib/file-system/__tests__/getRoute.test.ts
import { getRoute } from "../getRoute";
import { buildFileSystem } from "../buildFileSystem";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER",
        name: "root",
        icon: "",
        children: [
            {
                type: "FOLDER",
                name: "프로젝트",
                icon: "",
                children: [
                    {
                        type: "FOLDER",
                        name: "(주)아라온소프트",
                        icon: "",
                        children: [
                            { type: "DOC", name: "LHWS", icon: "", contents: {} as any },
                        ],
                    },
                ],
            },
        ],
    },
};

describe("getRoute", () => {
    const state = buildFileSystem(schema);
    const rootId = state.rootId;
    const findByName = (name: string) =>
        Object.values(state.nodes).find((n) => n.name === name)!;

    it("returns '/ KDH / root' for the root node", () => {
        expect(getRoute(state, rootId)).toBe("/ KDH / root");
    });

    it("joins ancestor names with ' / ' for nested nodes", () => {
        const lhws = findByName("LHWS");
        expect(getRoute(state, lhws.id)).toBe(
            "/ KDH / root / 프로젝트 / (주)아라온소프트 / LHWS"
        );
    });

    it("returns '' for an unknown id", () => {
        expect(getRoute(state, "does-not-exist")).toBe("");
    });
});
```

**Step 2:** Run, expect fail.

**Step 3:** Implement.

```ts
// src/shared/lib/file-system/getRoute.ts
import type { FileSystemState, ProgramId } from "@shared/types/program";

export function getRoute(state: FileSystemState, id: ProgramId): string {
    if (!state.nodes[id]) return "";
    const chain: Array<string> = [];
    let cursor: ProgramId | null = id;
    while (cursor) {
        const node = state.nodes[cursor];
        if (!node) break;
        chain.unshift(node.name);
        cursor = node.parentId;
    }
    return `/ KDH / ${chain.join(" / ")}`;
}
```

**Step 4:** Run test, expect pass.

**Step 5:** Typecheck.

**Step 6:** Commit.

```bash
git add src/shared/lib/file-system/getRoute.ts src/shared/lib/file-system/__tests__/getRoute.test.ts
git commit -m "feat(file-system): add getRoute helper for ancestor path strings"
```

---

## Task 4: Round-trip validate `portfolio.json` against existing `directory`

**Files:**
- Create: `src/data/__tests__/portfolio-parity.test.ts`

**Purpose:** Before we rely on `portfolio.json` as the single source of truth, prove its node set is parity-equal to the current `@shared/lib/data.ts` `directory` array (same names, types, parents, icons). This protects against silent drift when we cut over in Task 7.

**Step 1:** Write the parity test.

```ts
// src/data/__tests__/portfolio-parity.test.ts
import portfolio from "../portfolio.json";
import { buildFileSystem } from "@shared/lib/file-system/buildFileSystem";
import { directory } from "@shared/lib/data";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

describe("portfolio.json parity with legacy directory", () => {
    const state = buildFileSystem(portfolio as PortfolioSchema);
    const nodesByName = new Map(
        Object.values(state.nodes).map((n) => [n.name, n])
    );

    it("every legacy directory entry exists in portfolio.json with matching type/parent/icon", () => {
        const missing: Array<string> = [];
        const mismatched: Array<string> = [];
        for (const item of directory) {
            const node = nodesByName.get(item.name);
            if (!node) {
                missing.push(item.name);
                continue;
            }
            if (node.type !== item.type) {
                mismatched.push(`${item.name}: type ${node.type} vs ${item.type}`);
            }
            const parentNode = node.parentId ? state.nodes[node.parentId] : null;
            const parentName = parentNode ? parentNode.name : "KDH";
            if (parentName !== item.parent) {
                mismatched.push(
                    `${item.name}: parent ${parentName} vs ${item.parent}`
                );
            }
            if ((node as any).icon !== (item.icon ?? "")) {
                mismatched.push(`${item.name}: icon mismatch`);
            }
        }
        expect({ missing, mismatched }).toEqual({ missing: [], mismatched: [] });
    });
});
```

**Step 2:** Run the test.

Run: `pnpm test -- --watchAll=false --testPathPattern=portfolio-parity`

**If it fails:** the seed JSON (authored in Phase A) is drifting from the legacy data. Fix `src/data/portfolio.json` (do NOT fix the test, and do NOT edit `data.ts`) until parity holds. This test will be deleted in Task 18 when `data.ts`'s `directory` is removed.

**Step 3:** Commit.

```bash
git add src/data/__tests__/portfolio-parity.test.ts
git commit -m "test(data): assert portfolio.json parity with legacy directory"
```

> **Note:** if the existing `data.ts` `directory` has the KDH-as-root quirk (root node's parent is "KDH"), that's expected — the legacy DFS in `SetDirectory.tsx` treated "KDH" as the synthetic super-root. Our `portfolio.json` root should be the `root` node whose legacy `parent` is `"KDH"`; the comparison above handles that via `parentName ?? "KDH"`.

---

## Task 5: Seed hydrate at boot

**Files:**
- Modify: `src/index.tsx`

**Purpose:** Hydrate `fileSystemStore` from `portfolio.json` **before** `<App/>` renders. `<RecoilRoot>` stays in place in this task — it is removed in Task 19.

**Step 1:** Edit `src/index.tsx`. Add hydrate call between the polyfill block and `root.render`.

```ts
import portfolio from "./data/portfolio.json";
import { useFileSystemStore } from "./store/fileSystemStore";
import type { PortfolioSchema } from "./shared/types/portfolio-schema";

// ... existing polyfill block ...

useFileSystemStore.getState().hydrate(portfolio as PortfolioSchema);

const root = ReactDOM.createRoot(/* ... */);
```

Use relative paths rather than aliases — `src/index.tsx` sits at the alias root and some CRA configs don't resolve `@shared/*` from the entry file.

**Step 2:** Typecheck.

Run: `pnpm exec tsc --noEmit`

**Step 3:** Full test suite (no consumer yet — nothing should break).

Run: `pnpm test -- --watchAll=false`

**Step 4:** Smoke start (optional).

Run: `pnpm start` → app renders unchanged → kill.

**Step 5:** Commit.

```bash
git add src/index.tsx
git commit -m "feat(boot): hydrate fileSystemStore from portfolio.json on startup"
```

---

## Task 6: Rewrite `useDesktopData` as adapter over the new stores

**Files:**
- Modify: `src/pages/DesktopPage/useDesktopData.ts`

**Purpose:** Keep the public signature `{ directory, directoryTree, openProgram }` and `DirectoryItem`/`DirectoryTree` shapes exactly as they are today, but recompute them on the fly from `useFileSystemStore` + `useRunningProgramsStore`. This is the linchpin of B-1: existing features continue to work unchanged.

**Background:** Today a `<DesktopDataContext.Provider>` wraps the tree in `DesktopPage.tsx`. In Task 7 we stop providing it. Feature tests in `program-folder` / `program-image` also wrap their subject in the Provider with mock data — those tests MUST keep passing until B-2 rewrites them.

**Strategy — Context fallback:** The new `useDesktopData` first tries `useContext(DesktopDataContext)`. If a non-null value is present (= a test provided one), return it verbatim. Otherwise derive everything from the Zustand stores.

**Step 1:** Rewrite `useDesktopData.ts`.

```ts
// src/pages/DesktopPage/useDesktopData.ts
import { useContext, useMemo, useCallback } from "react";
import { DesktopDataContext } from "./DesktopDataContext";
import type {
    DesktopDataValue,
    DirectoryItem,
    DirectoryTree,
} from "./DesktopDataContext";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { getRoute } from "@shared/lib/file-system/getRoute";
import type { ProgramNode } from "@shared/types/program";

function nodeIcon(node: ProgramNode): string {
    return (node as unknown as { icon?: string }).icon ?? "";
}

export const useDesktopData = (): DesktopDataValue => {
    // 1. Context fallback for legacy feature tests.
    const ctx = useContext(DesktopDataContext);

    // 2. Store-derived values.
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const rootId = useFileSystemStore((s) => s.rootId);

    const derived = useMemo(() => {
        if (ctx) return null;
        const directory: Array<DirectoryItem> = [];
        const directoryTree: DirectoryTree = {};
        if (!rootId) return { directory, directoryTree };

        const visit = (id: string) => {
            const node = nodes[id];
            if (!node) return;
            const parentNode = node.parentId ? nodes[node.parentId] : null;
            const parentName = parentNode ? parentNode.name : "KDH";
            const route = getRoute({ rootId, nodes, childrenByParent }, id);
            const item: DirectoryItem = {
                name: node.name,
                type: node.type,
                icon: nodeIcon(node),
                parent: parentName,
                route,
            };
            directory.push(item);
            if (!directoryTree[parentName]) directoryTree[parentName] = [];
            directoryTree[parentName].push({
                name: node.name,
                type: node.type,
                icon: nodeIcon(node),
                parent: parentName,
            });
            (childrenByParent[id] ?? []).forEach(visit);
        };
        visit(rootId);
        return { directory, directoryTree };
    }, [ctx, nodes, childrenByParent, rootId]);

    const openProgram = useCallback(
        (item: DirectoryItem) => {
            if (ctx) {
                ctx.openProgram(item);
                return;
            }
            const node = Object.values(nodes).find((n) => n.name === item.name);
            if (!node) return;
            useRunningProgramsStore.getState().open(node.id);
        },
        [ctx, nodes]
    );

    if (ctx) return ctx;
    return {
        directory: derived!.directory,
        directoryTree: derived!.directoryTree,
        openProgram,
    };
};
```

**Step 2:** Run all tests.

Run: `pnpm test -- --watchAll=false`
Expected: all green. Feature tests using `DesktopDataContext.Provider` hit the Context branch; production code will hit the store branch after Task 7.

**Step 3:** Typecheck.

Run: `pnpm exec tsc --noEmit`

**Step 4:** Commit.

```bash
git add src/pages/DesktopPage/useDesktopData.ts
git commit -m "refactor(desktop-data): rewrite useDesktopData as adapter over new stores"
```

---

## Task 7: Flip `DesktopPage` off Recoil domain atoms

**Files:**
- Modify: `src/pages/DesktopPage/DesktopPage.tsx`
- Delete: `src/pages/DesktopPage/SetDirectory.tsx`
- Modify: `src/store/global.ts` (remove `rc_global_Directory_List` + `rc_global_Directory_Tree` only — keep time atoms and `rc_global_DisplayLight` until B-3)
- Delete: `src/store/program.ts` (if no remaining imports)
- Modify: wherever `SetDirectory` is currently mounted (`App.tsx` or similar) — remove the mount

**Purpose:** `DesktopPage` consumes `useFileSystemStore` / `useRunningProgramsStore` / `useUiStore` only. It stops wrapping the tree in `<DesktopDataContext.Provider>`. The directory-side Recoil atoms and `SetDirectory` bootstrap are deleted.

**Step 1:** Locate `SetDirectory` mount site.

Run: `grep -rn "SetDirectory" src/`
Expected: one mount site. Remove the JSX + import from that file.

**Step 2:** Rewrite `DesktopPage.tsx`. Key transformations (the tree it renders must stay identical to before — same children, same props):

- `programList: Array<WindowShellItem>` → compute from `order.map(id => ({ name: nodes[id].name, type: nodes[id].type, icon: nodes[id].icon ?? "", parent: nodes[id].parentId ? nodes[nodes[id].parentId!].name : "", status: byId[id].status }))`. This is a **temporary WindowShellItem shim** — B-2 replaces it with id-based props.
- `activeProgram: string` → `activeId ? (nodes[activeId]?.name ?? "") : ""`.
- `handleActivateWindow(name)` → resolve id by name, call `runningProgramsStore.activate(id)`.
- `handleMinimizeWindow(name)` → same with `minimize`.
- `handleCloseWindow(name)` → same with `close`.
- `handleClickTaskIcon(item)` → resolve by `item.name`, call `toggleFromTaskbar(id)`. Delete the local activeId-check branch — it lives in the store action now.
- `handleClickCloseAll` → `runningProgramsStore.closeAll()` + `uiStore.closeAllMenus()`.
- `openProgram(item)` → resolve id by name → `runningProgramsStore.open(id)`.
- `handleRequestZIndex` → `runningProgramsStore.requestZIndex()`.
- Start/Time/Info/HiddenIcon handlers → each becomes a single call to `useUiStore.getState().toggleXxx()`. The mutual-exclusion logic lives inside the action, so the five-line cascades collapse.
- `handlePreviewChange(active)` → `uiStore.setPreviewActive(active)`.
- `handleChangeDisplayLight(next)` → `uiStore.setDisplayLight(next)`.
- `windowCover` `onMouseDown` → `uiStore.closeAllMenus()`.

**Do NOT** wrap children in `<DesktopDataContext.Provider>` anymore.
**Do NOT** import Recoil atoms in `DesktopPage.tsx` after this task. Verify with: `grep -n "recoil\|rc_program_\|rc_global_Directory" src/pages/DesktopPage/DesktopPage.tsx` → empty.

**Step 3:** Delete `src/pages/DesktopPage/SetDirectory.tsx`.

**Step 4:** Edit `src/store/global.ts`: delete `rc_global_Directory_List`, `rc_global_Directory_Tree`, and the `import { directory } from "@shared/lib/data"` line. Keep `rc_global_DisplayLight` and time atoms.

**Step 5:** Delete `src/store/program.ts`. First verify:

Run: `grep -rn "@store/program\b\|store/program\"" src/`
Expected: no matches. If any straggler, fix it to use `useRunningProgramsStore`.

**Step 6:** Typecheck.

Run: `pnpm exec tsc --noEmit`

**Step 7:** Full tests.

Run: `pnpm test -- --watchAll=false`
Expected: all green. Feature tests still pass (Context fallback).

**Step 8:** Manual smoke test.

Run: `pnpm start` → verify:
- Desktop icons appear
- Double-click → window opens
- Minimize / close / activate from taskbar work
- Start/Time/Info/HiddenIcon menus toggle and are mutually exclusive
- Display light slider affects overlay

**Step 9:** Commit.

```bash
git add -A
git commit -m "refactor(desktop): migrate DesktopPage off Recoil to zustand stores"
```

---

## Task 8: B-1 isolation guard

**Verification only. No commit.**

**Step 1:** No feature file was modified in B-1.

Run: `git diff master..HEAD -- src/features/ --stat`
Expected: empty.

**Step 2:** Recoil still installed.

Run: `pnpm list recoil`
Expected: present.

**Step 3:** `DesktopPage` has no domain Recoil imports.

Run: `grep -n "rc_program_\|rc_global_Directory" src/pages/DesktopPage/DesktopPage.tsx`
Expected: empty.

**Step 4:** Full test + typecheck.

Run: `pnpm test -- --watchAll=false && pnpm exec tsc --noEmit`
Expected: green.

---

# Stage B-2 — feature migration (TDD, one feature per commit)

## General pattern for every B-2 task

Each feature migration follows the same rhythm. Internalize this once; below only the feature-specific details are called out.

1. **Read the existing feature code + its test file.** Understand the current behavior — these tests are the characterization contract. Your job is to preserve their intent while changing the shape.
2. **Delete the old Context-based test fixtures** and write new ones that mount the subject with id-based props or by hydrating `fileSystemStore`/`runningProgramsStore` directly.
3. **Write failing tests first.** They should encode the migrated API (id-based props, `ProgramNode` imports from `@shared/types/program`).
4. **Change the feature internals:** replace `DirectoryItem` with `ProgramNode`, replace `useDesktopData()` with direct store selectors where appropriate, accept `id: ProgramId` in place of `name: string` where it was used as an identifier.
5. **Run tests; iterate until green.**
6. **Typecheck.**
7. **Single commit per feature.**

After each feature migrates, the adapter's Context fallback is no longer needed for that feature (but still needed for the un-migrated ones). Do NOT remove the fallback until Task 18.

**Shared test helper** — create once in Task 9 and reuse across Tasks 9-12:

```ts
// src/test-utils/hydrateFileSystem.ts
import type { PortfolioSchema } from "@shared/types/portfolio-schema";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";

export function hydrateTestFileSystem(schema: PortfolioSchema) {
    useFileSystemStore.getState().hydrate(schema);
    useRunningProgramsStore.setState({
        byId: {},
        order: [],
        activeId: null,
        zIndexCounter: 1,
    });
}

export function findIdByName(name: string): string {
    const { nodes } = useFileSystemStore.getState();
    const node = Object.values(nodes).find((n) => n.name === name);
    if (!node) throw new Error(`test fixture: node '${name}' not found`);
    return node.id;
}
```

---

## Task 9: Migrate `program-folder`

**Files:**
- Create: `src/test-utils/hydrateFileSystem.ts` (shared helper — see above)
- Modify: `src/features/program-folder/hooks/useFolderNavigation.ts`
- Modify: `src/features/program-folder/FolderProgram.tsx`
- Modify: `src/features/program-folder/ui/FolderGrid.tsx`
- Rewrite: `src/features/program-folder/__tests__/FolderProgram.test.tsx`

**Target shape:**

- `FolderProgram` prop: `{ id: ProgramId }` (drop `type`/`name` — derivable from the node).
- `useFolderNavigation` params: `{ initialFolderId: ProgramId }`. Internally subscribes to `useFileSystemStore` selectors and `useRunningProgramsStore.open` instead of receiving `directory`/`directoryTree`/`onOpenProgram` from a parent. Returns `{ selectedId, folderContents: Array<ProgramNode>, currentFolder: ProgramNode | null, onClickItem(id), onClickLeft(), onDoubleClickItem(item: ProgramNode) }`.
- `FolderGrid` props: `items: Array<ProgramNode>`, `selectedId: ProgramId | null`, `onClickItem: (id: ProgramId) => void`, `onDoubleClickItem: (item: ProgramNode) => void`. Instead of a separate `directoryTree` prop for "is this folder empty" rendering, pass a helper `hasChildren: (id: ProgramId) => boolean` or compute inside the component via `useFileSystemStore((s) => s.childrenByParent)`.
- `onDoubleClickItem`: if `item.type === "FOLDER"`, navigate inside; otherwise `useRunningProgramsStore.getState().open(item.id)`.
- `onClickLeft`: navigate to `nodes[currentFolder.parentId]` if `parentId` is not null. Guard against root.

**Step 1:** Read existing test to extract the behaviors to preserve:
- Initial folder's children render
- Clicking an item selects it
- Double-clicking a folder navigates inside
- Back arrow navigates to parent
- Display-type select changes the grid className
- Empty folder shows "비어있습니다."

**Step 2:** Write the new failing test. Example skeleton:

```tsx
// src/features/program-folder/__tests__/FolderProgram.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { hydrateTestFileSystem, findIdByName } from "@/test-utils/hydrateFileSystem";
import FolderProgram from "../FolderProgram";
import type { PortfolioSchema } from "@shared/types/portfolio-schema";

const schema: PortfolioSchema = {
    version: 1,
    root: {
        type: "FOLDER", name: "root", icon: "",
        children: [
            {
                type: "FOLDER", name: "프로젝트", icon: "",
                children: [
                    {
                        type: "FOLDER", name: "(주)아라온소프트", icon: "",
                        children: [
                            { type: "DOC", name: "샘플DOC", icon: "", contents: {} as any },
                        ],
                    },
                    { type: "FOLDER", name: "빈폴더", icon: "", children: [] },
                ],
            },
        ],
    },
};

describe("FolderProgram", () => {
    beforeEach(() => hydrateTestFileSystem(schema));

    it("initial folder's children render", () => {
        render(<FolderProgram id={findIdByName("프로젝트")} />);
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("clicking an item selects it", () => {
        render(<FolderProgram id={findIdByName("프로젝트")} />);
        const el = screen.getByText("(주)아라온소프트").closest(".folder")!;
        fireEvent.click(el);
        expect(el).toHaveClass("folder_selected");
    });

    it("double-clicking a folder navigates inside", () => {
        render(<FolderProgram id={findIdByName("프로젝트")} />);
        const el = screen.getByText("(주)아라온소프트").closest(".folder")!;
        fireEvent.doubleClick(el);
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
    });

    it("back arrow navigates to parent folder", () => {
        render(<FolderProgram id={findIdByName("(주)아라온소프트")} />);
        expect(screen.getByText("샘플DOC")).toBeInTheDocument();
        fireEvent.click(screen.getByAltText("leftArrow"));
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("display-type select updates className", () => {
        const { container } = render(<FolderProgram id={findIdByName("프로젝트")} />);
        const select = container.querySelector("select")!;
        fireEvent.change(select, { target: { value: "BIG_ICON" } });
        expect(container.querySelector(".BIG_ICON.contentsArea_folder")).not.toBeNull();
    });

    it("empty folder shows '비어있습니다.'", () => {
        render(<FolderProgram id={findIdByName("빈폴더")} />);
        expect(screen.getByText("비어있습니다.")).toBeInTheDocument();
    });

    it("double-clicking a non-folder opens a running program", () => {
        const { useRunningProgramsStore } = require("@store/runningProgramsStore");
        render(<FolderProgram id={findIdByName("(주)아라온소프트")} />);
        const el = screen.getByText("샘플DOC").closest(".folder")!;
        fireEvent.doubleClick(el);
        expect(useRunningProgramsStore.getState().activeId).toBe(findIdByName("샘플DOC"));
    });
});
```

**Step 3:** Run, expect fail.

Run: `pnpm test -- --watchAll=false --testPathPattern=FolderProgram`

**Step 4:** Rewrite the hook and components to match. Key code moves:

- `useFolderNavigation`: subscribe with `useFileSystemStore((s) => s.nodes)`, `...childrenByParent`. State = `selectedId`, `currentFolderId`. Navigation functions derive `folderContents` from `childrenByParent[currentFolderId].map((id) => nodes[id])`.
- `FolderProgram`: reads its node via `const node = useFileSystemStore((s) => s.nodes[id])`, uses `node.type` for the `FolderHeader` `type` prop, and passes `currentFolder.route` via `getRoute(fileSystemState, currentFolderId)`.
- Delete `useDesktopData` import.

**Step 5:** Tests green.

Run: `pnpm test -- --watchAll=false --testPathPattern=FolderProgram`

**Step 6:** Full suite (make sure un-migrated features still pass).

Run: `pnpm test -- --watchAll=false`

**Step 7:** Typecheck.

Run: `pnpm exec tsc --noEmit`

**Step 8:** Commit.

```bash
git add -A
git commit -m "refactor(program-folder): migrate to ProgramNode + id-based API"
```

---

## Task 10: Migrate `program-image`

**Files:**
- Modify: `src/features/program-image/hooks/useImageNavigation.ts`
- Modify: `src/features/program-image/ImageProgram.tsx`
- Modify: `src/features/program-image/ImageProgram.types.ts`
- Modify: `src/features/program-image/ui/ImageViewer.tsx`
- Rewrite: `src/features/program-image/__tests__/ImageProgram.test.tsx`

**Target shape:**

- `ImageProgram` prop: `{ id: ProgramId }` — derives parent/name from `nodes[id]` and `nodes[parentId]`.
- `useImageNavigation` params: `{ id: ProgramId }`. Internally selects the parent id, filters siblings of `type === "IMAGE"` from `childrenByParent[parentId]`, finds the initial index by matching `id`.
- `ImageViewer` props: `imageArr: Array<ProgramNode>` (only IMAGE nodes), same presentation props.
- The rotation/zoom/arrow behaviors are unchanged — only the data source changes.

**Step 1:** Rewrite the test. Use `hydrateTestFileSystem` with a `갤러리` folder of three IMAGE nodes + one DOC. Assertions come directly from the existing characterization test — same behaviors, new prop shape (`id` instead of `parent`/`name`).

**Step 2:** Expect fail.

**Step 3:** Implement. `useImageNavigation`:

```ts
export const useImageNavigation = ({ id }: { id: ProgramId }) => {
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const self = nodes[id];
    const parentId = self?.parentId ?? null;

    const imageArr = useMemo<Array<ProgramNode>>(() => {
        if (!parentId) return [];
        return (childrenByParent[parentId] ?? [])
            .map((cid) => nodes[cid])
            .filter((n): n is ProgramNode => !!n && n.type === "IMAGE");
    }, [childrenByParent, nodes, parentId]);

    // ... rest of the existing logic with imageArr as ProgramNode[] ...
};
```

`ImageViewer` uses `currentImage.src` (from `ProgramNode & { type: "IMAGE" }`) instead of `currentImage.icon`. **Important behavioral change:** legacy code used `currentImage.icon` for the `<img src>`. The new `ProgramNode` discriminated union stores image data in `src` (as defined in Phase A). Update the test's assertion: `img.src` should contain the `src` field of the test fixture, not `icon`. This is a deliberate Phase B correction — the old code reused `icon` as a misnomer.

**Step 4:** Run tests, iterate.

**Step 5:** Typecheck + full suite.

**Step 6:** Commit.

```bash
git add -A
git commit -m "refactor(program-image): migrate to ProgramNode + id-based API"
```

---

## Task 11: Migrate `desktop` (DesktopWindow / Window / IconBox)

**Files:**
- Modify: `src/features/desktop/DesktopWindow.tsx`
- Modify: `src/features/desktop/components/Window.tsx`
- Modify: `src/features/desktop/components/IconBox.tsx`

**Target shape:**

- `DesktopWindow`: subscribe to `useFileSystemStore` → root's children. Map to `Array<ProgramNode>` and pass to `Window`. Use `useRunningProgramsStore.getState().open(node.id)` on double-click.
- `Window` props: `iconBoxArr: Array<ProgramNode>`, `onClickIcon: (node: ProgramNode) => void`, `onDoubleClickIcon: (node: ProgramNode) => void`.
- `IconBox` props: `item: ProgramNode`, callbacks typed on `ProgramNode`.

No existing test for `desktop` feature — add a minimal smoke test mounting `DesktopWindow` with a hydrated store and asserting the root folder's immediate children render as icons.

**Step 1:** Create `src/features/desktop/__tests__/DesktopWindow.test.tsx` with one or two cases:
- Root children render as icons (by `alt="iconImg"` count).
- Double-click on an icon calls `runningProgramsStore.open` with the correct id.

**Step 2:** Expect fail (types).

**Step 3:** Rewrite the three files to use `ProgramNode`. Remove `DirectoryItem` import. Note that `DesktopWindow.tsx` currently reads `(directoryTree as unknown as { root?: Array<DirectoryItem> }).root` — after migration it should read `childrenByParent[rootId].map((id) => nodes[id])`.

**Step 4:** Tests + full suite + typecheck.

**Step 5:** Commit.

```bash
git add -A
git commit -m "refactor(desktop): migrate DesktopWindow to ProgramNode selectors"
```

---

## Task 12: Migrate `statusbar`

**Files:**
- Modify: `src/features/statusbar/StatusBar.tsx`
- Possibly: `src/features/statusbar/components/StatusBar.tsx` (the view) if prop types change

**Target shape:** drop `useDesktopData`. Read directly from `useFileSystemStore`:

```ts
const nodes = useFileSystemStore((s) => s.nodes);
const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
const findIdByName = (name: string) => Object.values(nodes).find(n => n.name === name)?.id;
```

Legacy code pulls children of fixed folder names: `"금오공과대학교 셈틀꾼"`, `"금오공과대학교 컴퓨터공학과 학생회"`, `"(주)아라온소프트"`, `"MAIN_TECH"`, `"SUB_TECH"`. Replace with `childrenByParent[findIdByName(name)!].map(id => nodes[id])`. These lookups tolerate missing folders (empty arrays) — keep that behavior.

`onClickBox(parentName)` (legacy) → resolve by name → `runningProgramsStore.getState().open(id)`. Retain the `onClose` side-effect.

**Step 1:** No existing test for `statusbar`. Optional: add a smoke test with a tiny hydrated tree.

**Step 2:** Rewrite `StatusBar.tsx`.

**Step 3:** Full suite + typecheck.

**Step 4:** Commit.

```bash
git add -A
git commit -m "refactor(statusbar): migrate to fileSystemStore selectors"
```

---

## Task 13: Migrate `taskbar`

**Files:**
- Modify: `src/features/taskbar/TaskBar.types.ts` — delete `TaskbarProgramItem`, `ProgramStatus`, `ProgramType`. Add new prop shape using `ProgramNode` + `RunningProgram`.
- Modify: `src/features/taskbar/TaskBar.tsx`
- Modify: `src/features/taskbar/ui/ProgramIcons.tsx`
- Modify: `src/features/taskbar/ui/PreviewPopup.tsx`
- Modify: `src/features/taskbar/ui/PreviewWindowFrame.tsx` (if it references `TaskbarProgramItem`)
- Modify: `src/features/taskbar/hooks/useTaskbarHover.ts`
- Rewrite: `src/features/taskbar/__tests__/TaskBar.test.tsx`

**Target shape:**

```ts
// TaskBar.types.ts
import type { ProgramNode, ProgramId, RunningProgram } from "@shared/types/program";
import type { ReactNode } from "react";

export interface TaskbarEntry {
    node: ProgramNode;
    running: RunningProgram;
}

export interface HoverTarget {
    id: ProgramId | null;
    idx: number;
}

export interface TaskBarProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
    hiddenIcon: boolean;
    onClickStartIcon: () => void;
    onClickTime: () => void;
    onClickInfo: () => void;
    onClickHiddenIcon: () => void;
    onClickCloseAll: () => void;
    onClickTaskIcon: (entry: TaskbarEntry) => void;
    onCloseProgram: (id: ProgramId) => void;
    onPreviewChange: (active: boolean) => void;
    renderPreviewContent: (entry: TaskbarEntry) => ReactNode;
}
```

Everywhere inside taskbar components, `item.name` / `item.status` / `item.icon` become `entry.node.name` / `entry.running.status` / `entry.node.icon`. Identity comparisons use `entry.node.id` vs `activeId`. Hover target stores `id` instead of `name`.

**Step 1:** Rewrite `TaskBar.test.tsx` using the new prop shape — each test builds `entries` as `Array<TaskbarEntry>` by hand (no store needed for this unit test). Preserve every characterization assertion in the existing test; only change the shape.

Example builder:

```ts
const entries: Array<TaskbarEntry> = [
    {
        node: { id: "n1", parentId: null, type: "FOLDER", name: "내문서", icon: "" },
        running: { id: "n1", status: "active", zIndex: 2 },
    },
    {
        node: { id: "n2", parentId: null, type: "FOLDER", name: "프로젝트", icon: "" },
        running: { id: "n2", status: "min", zIndex: 3 },
    },
];
```

`onClickTaskIcon` assertion: `expect(onClickTaskIcon.mock.calls[0][0].node.name).toBe("프로젝트")`.

**Step 2:** Expect failing test.

**Step 3:** Rewrite taskbar components. Be thorough — every `TaskbarProgramItem` reference must go.

**Step 4:** DesktopPage already passes a legacy shim for `programList` (`Array<WindowShellItem>`) from Task 7. Update `DesktopPage.tsx` in this same task to build `entries` (array of `{ node, running }`) and pass to `<TaskBar entries={...} />` instead. Also update `renderProgramContent` signature in `src/pages/DesktopPage/renderProgramContent.tsx` to accept `TaskbarEntry` (or split: one function for preview `entry`, one for `WindowShell` item — decide based on simplicity).

> **Caveat:** touching `DesktopPage.tsx` here bleeds slightly outside the `features/taskbar` boundary. That's acceptable — `DesktopPage` is the wiring layer, not a feature. Keep the change minimal: only what's needed to make `TaskBar` compile and function.

**Step 5:** Tests + typecheck + smoke.

**Step 6:** Commit.

```bash
git add -A
git commit -m "refactor(taskbar): migrate to ProgramNode/RunningProgram entries"
```

---

## Task 14: Migrate `window-shell`

**Files:**
- Modify: `src/features/window-shell/WindowShell.types.ts` — delete `WindowShellItem`. New props use `ProgramNode` + `RunningProgram`.
- Modify: `src/features/window-shell/WindowShell.tsx`
- Modify: `src/features/window-shell/hooks/*` (if they accept `name` — change to `id`)
- Modify: `src/features/window-shell/ui/WindowHeader.tsx` (title/icon still passed as primitives; no change)
- Rewrite any existing WindowShell tests in `__tests__/`.
- Modify: `src/pages/DesktopPage/ProgramWindow.tsx` + `renderProgramContent.tsx` + `resolveProgramMeta.ts` to pass the new shape.

**Target shape:**

```ts
export interface WindowShellProps {
    node: ProgramNode;
    running: RunningProgram;
    title: string;
    iconSrc: string;
    activeId: ProgramId | null;
    children?: ReactNode;
    subHeader?: ReactNode;
    onActivate: (id: ProgramId) => void;
    onMinimize: (id: ProgramId) => void;
    onClose: (id: ProgramId) => void;
    onRequestZIndex: () => number;
}
```

- `isActive` computed as `activeId === node.id` instead of `activeProgram === item.name`.
- Inner handlers call `onActivate(node.id)` etc.
- `useWindowLifecycle` / `useWindowDrag` / `useWindowResize` take `id: ProgramId` instead of `name: string`. If they used `name` purely as a key for an internal Map, rename the parameter.

Update `resolveProgramMeta.ts` to take `ProgramNode` — reuse the existing switch on `type`; change the parameter type.

`renderProgramContent.tsx` (DesktopPage) currently switches on `item.type`. Change signature to `(node: ProgramNode)`. Inside, destructure per-branch:

```tsx
case "IMAGE":
    return <ImageProgram id={node.id} />;
case "FOLDER":
    return <FolderProgram id={node.id} />;
case "DOC":
    return <DOCProgram id={node.id} />;
case "INFO":
    return <InfoProgram />;
case "BROWSER":
    return <iframe ... />;
```

> **Investigate `program-doc`:** it was not migrated in earlier tasks. Check whether `DOCProgram` consumes `useDesktopData` or Recoil. If yes, migrate it in this same task (small add-on). If it only takes `{ type, name }` today, change to `{ id }` and read the node via `useFileSystemStore` to pull `contents: ProjectData`. This is the place where Phase A's discriminated union `{ type: "DOC"; contents: ProjectData }` finally pays off — `contents` is typed without casts. Expect the existing `DOCProgram` to currently import `ProjectData` from `@features/program-doc/DOCProgram.types.ts`; switch it to the shared `@shared/types/content` import.

Also migrate `InfoProgram` similarly if it references any legacy type.

**Step 1:** Rewrite tests, expect fail.

**Step 2:** Implement.

**Step 3:** Full suite + typecheck + smoke.

**Step 4:** Commit.

```bash
git add -A
git commit -m "refactor(window-shell): migrate to ProgramNode-based props"
```

---

## Task 15: Migrate `hidden-icon` (last Recoil holdout in features)

**Files:**
- Modify: `src/features/hidden-icon/HiddenIcon.tsx`

**Background:** This is the only feature file still importing `recoil`. Check what it reads and writes:

Run: `grep -n "recoil\|rc_" src/features/hidden-icon/HiddenIcon.tsx`

Based on the Phase A-era read, the component takes `active: boolean` as a prop and renders a static skill list — it does NOT actually use Recoil in the snippet read earlier. Re-check: if there is no Recoil import, this task is a no-op and can be skipped with a note. If Recoil is used (maybe via `useRecoilValue`), replace with `useUiStore((s) => s.hiddenIconOpen)` or use the existing `active` prop.

**Step 1:** Inspect the file.

**Step 2:** If Recoil is imported, remove it. Add a test case or reuse existing (none currently).

**Step 3:** Full suite + typecheck.

**Step 4:** Commit (or skip with `git commit --allow-empty -m "chore(hidden-icon): confirm no Recoil usage"` if no-op).

```bash
git add -A
git commit -m "refactor(hidden-icon): drop Recoil import"
```

---

## B-2 checkpoint (verification only)

Run after Task 15:

```bash
grep -rn "DirectoryItem\|WindowShellItem\|TaskbarProgramItem" src/features src/pages
```

Expected: empty (the types may still exist in their declaration files but nothing imports them).

```bash
grep -rn "useDesktopData" src/features
```

Expected: empty.

```bash
grep -rn "useRecoil\|recoil" src/features
```

Expected: empty.

If any of the above are non-empty, a B-2 task missed a consumer — go back and fix before moving on to B-3.

---

# Stage B-3 — Strip Recoil, adapter, and legacy types

## Task 16: Migrate taskbar UI toggles + displayLight consumers to `uiStore`

**Files:**
- Modify: `src/features/statusbar/StatusBar.tsx` (if it uses `rc_taskbar_statusBar_active` — likely receives `active` prop; no change)
- Modify: `src/features/timebar/TimeBar.tsx` (receives `active` prop — no change)
- Modify: `src/features/infobar/InfoBar.tsx` (receives `active`, `displayLight`, `onChangeDisplayLight` props — no change)
- Modify: `src/features/hidden-icon/HiddenIcon.tsx` (receives `active` prop — no change)
- Modify: `src/pages/DesktopPage/DesktopPage.tsx` — drop the `useRecoilState(rc_taskbar_*)` / `useRecoilState(rc_global_DisplayLight)` lines; use `useUiStore` selectors instead.
- Delete: `src/store/taskbar.ts`
- Modify: `src/store/global.ts` — remove `rc_global_DisplayLight` (leaving the file empty of displaylight but still containing time atoms; see Task 17).

**Purpose:** Kill the five `rc_taskbar_*` atoms and `rc_global_DisplayLight`. `DesktopPage` already uses `useUiStore.getState().toggleXxx()` (from Task 7) for setters, but it still reads the *values* from Recoil. Switch reads to `useUiStore`.

**Step 1:** Edit `DesktopPage.tsx`:

```ts
const statusBarOpen = useUiStore((s) => s.statusBarOpen);
const timeBarOpen = useUiStore((s) => s.timeBarOpen);
const infoBarOpen = useUiStore((s) => s.infoBarOpen);
const hiddenIconOpen = useUiStore((s) => s.hiddenIconOpen);
const displayLight = useUiStore((s) => s.displayLight);
```

Replace the `useRecoilState(rc_taskbar_*)` / `useRecoilState(rc_global_DisplayLight)` blocks entirely.

**Step 2:** Rename the local vars if needed to keep JSX unchanged (`statusBarOpen` vs legacy `activeStatus` — rename in JSX too).

**Step 3:** Delete `src/store/taskbar.ts`.

Run: `grep -rn "@store/taskbar\|store/taskbar" src/`
Expected: empty. If not, fix stragglers.

**Step 4:** Edit `src/store/global.ts` — delete `rc_global_DisplayLight`.

**Step 5:** Typecheck + full suite.

Run: `pnpm exec tsc --noEmit && pnpm test -- --watchAll=false`

**Step 6:** Smoke test.

Run: `pnpm start` → verify all menu toggles and display light slider still work.

**Step 7:** Commit.

```bash
git add -A
git commit -m "refactor: migrate taskbar toggles and displayLight to uiStore"
```

---

## Task 17: Delete unused time atoms

**Files:**
- Delete: `src/store/global.ts` entirely (if empty after Task 16) OR remove the remaining time atoms (`rc_global_year`, `rc_global_month`, `rc_global_day`, `rc_global_date`, `rc_global_hour`, `rc_global_min`, `rc_global_sec`, `rc_global_timeline`).

**Purpose:** Grep confirmed earlier that these atoms have no consumers — `TaskBar` and `TimeBar` use `useGetCurrentTime` (a self-contained hook) already. Just delete.

**Step 1:** Verify once more.

Run: `grep -rn "rc_global_year\|rc_global_month\|rc_global_day\|rc_global_date\|rc_global_hour\|rc_global_min\|rc_global_sec\|rc_global_timeline" src/`
Expected: only `src/store/global.ts`. If other files appear, migrate them to `useGetCurrentTime()` first.

**Step 2:** Delete `src/store/global.ts`.

Run: `grep -rn "@store/global\|store/global" src/`
Expected: empty.

**Step 3:** Typecheck + full suite.

**Step 4:** Commit.

```bash
git add -A
git commit -m "chore(store): delete unused time atoms (global.ts)"
```

---

## Task 18: Delete the adapter and all legacy domain types

**Files:**
- Delete: `src/pages/DesktopPage/DesktopDataContext.tsx`
- Delete: `src/pages/DesktopPage/useDesktopData.ts`
- Delete: `src/data/__tests__/portfolio-parity.test.ts` (parity check no longer meaningful — `data.ts` loses `directory`)
- Modify: `src/shared/lib/data.ts` — remove the `directory` export (keep `projectDatas` if it's still referenced; else delete the file).
- Modify: `src/features/window-shell/WindowShell.types.ts` — delete `WindowShellItem` export (if not already in Task 14).
- Modify: `src/features/taskbar/TaskBar.types.ts` — delete `TaskbarProgramItem` / `ProgramStatus` / `ProgramType` legacy exports (if not already in Task 13).
- Modify: `src/features/program-image/ImageProgram.types.ts` — delete `ImageItem = DirectoryItem` alias.

**Purpose:** Remove every shim the adapter layer needed. After this task, `DirectoryItem`/`DirectoryTree`/`WindowShellItem`/`TaskbarProgramItem` no longer exist anywhere in the codebase.

**Step 1:** Delete `DesktopDataContext.tsx` and `useDesktopData.ts`.

Run: `grep -rn "DesktopDataContext\|useDesktopData\|DirectoryItem\|DirectoryTree" src/`
Expected: empty. If any import remains, it's an un-migrated consumer — go fix it (shouldn't happen if B-2 was thorough).

**Step 2:** Delete `src/data/__tests__/portfolio-parity.test.ts`.

**Step 3:** Edit `src/shared/lib/data.ts`:
- Delete `export const directory = [...]`.
- Delete the `import monitor from ...` and any other imports only used by `directory`.
- If `projectDatas` is no longer referenced (`grep -rn "projectDatas" src/`), delete the whole file.

**Step 4:** Delete legacy types from `window-shell` / `taskbar` / `program-image` type files (if any survived).

**Step 5:** Typecheck.

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors. If errors cascade from a forgotten consumer, fix it before proceeding.

**Step 6:** Full suite.

**Step 7:** Commit.

```bash
git add -A
git commit -m "chore: delete DesktopDataContext adapter and legacy domain types"
```

---

## Task 19: Remove `<RecoilRoot>`, React 19 polyfill, and `recoil` dependency

**Files:**
- Modify: `src/index.tsx` — remove `<RecoilRoot>`, `import { RecoilRoot } from "recoil"`, and the entire React 19 internals polyfill block.
- Modify: `package.json` — `pnpm remove recoil` (let pnpm handle the edit).

**Step 1:** Confirm no Recoil usage anywhere.

Run: `grep -rn "recoil\|RecoilRoot\|useRecoil\|atom(" src/`
Expected: empty (the `atom(` check catches stray Recoil atom declarations, but watch for false positives from unrelated `.atom(` method calls — audit manually if hits appear).

**Step 2:** Edit `src/index.tsx`. After edit, the file should look roughly like:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import portfolio from "./data/portfolio.json";
import { useFileSystemStore } from "./store/fileSystemStore";
import type { PortfolioSchema } from "./shared/types/portfolio-schema";

useFileSystemStore.getState().hydrate(portfolio as PortfolioSchema);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<App />);

reportWebVitals();
```

No `<RecoilRoot>`, no polyfill, no `React as any` cast.

**Step 3:** Remove the dependency.

Run: `pnpm remove recoil`
Expected: `package.json` updated, `pnpm-lock.yaml` updated.

**Step 4:** Fresh install + typecheck + full suite.

Run: `pnpm install && pnpm exec tsc --noEmit && pnpm test -- --watchAll=false`
Expected: all green.

**Step 5:** Smoke test.

Run: `pnpm start` → verify everything works end-to-end.

**Step 6:** Commit.

```bash
git add -A
git commit -m "chore: remove Recoil and React 19 internals polyfill"
```

---

## Task 20: Final acceptance

**Verification only. No commit.**

**Step 1:** All Phase B acceptance criteria hold.

Run each and confirm expectation:

```bash
# 1. Typecheck
pnpm exec tsc --noEmit            # → 0 errors

# 2. Full test suite
pnpm test -- --watchAll=false     # → all green, count >= BASELINE_TEST_COUNT + all B-1/B-2 additions

# 3. Recoil is gone
grep -rn "recoil" src/            # → empty
pnpm list recoil                  # → not found

# 4. Adapter + legacy types are gone
grep -rn "DesktopDataContext\|useDesktopData\|DirectoryItem\|DirectoryTree\|WindowShellItem\|TaskbarProgramItem" src/
# → empty

# 5. No Recoil atoms
grep -rn "rc_global_\|rc_program_\|rc_taskbar_" src/   # → empty

# 6. SetDirectory is gone
grep -rn "SetDirectory" src/      # → empty

# 7. package.json is clean
grep '"recoil"' package.json      # → empty
```

**Step 2:** Manual smoke checklist (open `pnpm start` and exercise each):

- [ ] App boots with no console errors
- [ ] Desktop shows root folder icons (프로젝트, 기술스택, 구글, 내컴퓨터)
- [ ] Double-click opens a folder window
- [ ] Inside a folder, navigating deeper and using the back arrow works
- [ ] Double-clicking an IMAGE opens the image viewer with the correct image and sibling count
- [ ] Double-clicking a DOC opens the document viewer with the correct content
- [ ] Double-clicking "구글" (BROWSER) opens the iframe
- [ ] Double-clicking "내컴퓨터" (INFO) opens the info program
- [ ] Minimize / restore / close all work
- [ ] Taskbar icons toggle programs correctly (including min ↔ active via click)
- [ ] Taskbar hover preview shows and the X closes the program
- [ ] Start / Time / Info / HiddenIcon menus toggle and are mutually exclusive
- [ ] "Close all" minimizes all running programs
- [ ] Display light slider affects the overlay
- [ ] Clock in taskbar and the time bar show the current time

**Step 3:** Review the commit graph.

```bash
git log --oneline master..HEAD
git diff master --stat
```

Expected: roughly 20 commits, one per task that had a commit step. The diff should touch every feature file and delete ~8 files (SetDirectory, DesktopDataContext, useDesktopData, global.ts, program.ts, taskbar.ts, parity test, possibly data.ts).

**Step 4:** Report to the user with:
- Commit count and list of commit messages
- Test count delta from baseline
- Any deviations from this plan
- Confirmation that Phase C (right-click CRUD, persist, JSON export, INFO program) is the next phase

---

## Out of scope (explicit non-goals — defer to Phase C)

- ❌ Right-click context menu UI
- ❌ `addNode` / `updateNode` / `deleteNode` / `renameNode` / `moveNode` wired to UI (they're already defined in `fileSystemStore`, just not surfaced)
- ❌ `persist` middleware on `fileSystemStore`
- ❌ `exportSchema()` JSON download
- ❌ Renaming the `projectReulst` typo
- ❌ Finalizing the `ResumeData` schema / implementing INFO program body
- ❌ Replacing `monitor` and other hard-coded image assets in `portfolio.json` with a manifest

