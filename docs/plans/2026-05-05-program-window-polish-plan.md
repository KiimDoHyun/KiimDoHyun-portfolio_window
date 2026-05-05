# 프로그램 윈도우 이동/리사이즈 정리 — 구현 계획서

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 프로그램 창의 이동/리사이즈 동작을 layout-thrashing 없이 정리하고, 8방향 리사이즈 핸들과 화면 경계 클램핑을 도입한다.

**Architecture:** 위치는 `transform: translate3d`(composite-only) 로 표현하고 크기는 `width/height` 를 유지한다. 좌표/크기는 `(x, y, w, h)` 숫자 4-tuple 로 통일하고 `lib/geometry.ts` (계산) + `lib/persist.ts` (영속화) 두 모듈로 책임을 분리한다. 8개 리사이즈 핸들(4 변 + 4 모서리) 은 단일 `direction` 인자로 분기하는 `computeResize` 함수로 통합한다.

**Tech Stack:** React 19, TypeScript, panda-css, vitest + @testing-library/react, jsdom.

**참조:** [설계 문서](./2026-05-05-program-window-polish-design.md). 본 plan 은 design 문서의 결정/규칙/DoD 를 입력으로 한다.

---

## 배경 / 설계 규칙 (요약)

본 작업의 배경, 결정 사항, 설계 규칙, DoD 는 [설계 문서](./2026-05-05-program-window-polish-design.md) 에 명시되어 있다. 핵심만 인용:

- 이동은 `transform: translate3d`, 리사이즈는 `width/height` 유지
- 8개 핸들 (4 변 + 4 모서리), edge `8px` (안 4 / 밖 4) / corner `14×14px` (안 7 / 밖 7)
- 클램핑: 위 `top ≥ 0`, 아래 `top ≤ vh - taskbar - headerHeight`, 좌/우는 자연 보호
- `box.offsetLeft/Top/Width/Height` read 금지, ref 캐시
- DOM write 는 `requestAnimationFrame` 한 프레임에 1회, `localStorage.setItem` 은 mouseup 시 1회

---

## Phase A — geometry/persist 유틸 도입과 좌표 표현 통일

**입력:** 설계 문서. 기존 동작이 보존되어야 하며, 본 Phase 의 변경만으로는 사용자 체감 변화가 없어야 한다.

**완료 조건:**
- `lib/geometry.ts`, `lib/persist.ts` 모듈이 단위 테스트와 함께 추가됨.
- `useWindowLifecycle / useWindowDrag / useWindowResize` 의 `localStorage` 호출이 모두 `persist` 모듈을 경유함.
- 이동/리사이즈/최대화/복원/새로고침 후 복원 시각 동작이 변경 전과 동일함 (수동 검증).
- `pnpm test` 전부 통과, `pnpm build` 통과.

**작업 내용 (커밋 1:1):**
- [ ] Task A1: `lib/geometry.ts` 와 단위 테스트 추가
- [ ] Task A2: `lib/persist.ts` 와 단위 테스트 추가
- [ ] Task A3: `useWindowLifecycle/Drag/Resize` 의 localStorage IO 를 `persist` 모듈로 통합

---

### Task A1: `lib/geometry.ts` 와 단위 테스트 추가

**Files:**
- Create: `src/features/window-shell/lib/geometry.ts`
- Create: `src/features/window-shell/lib/__tests__/geometry.test.ts`

**Step 1: 실패 테스트 작성**

`src/features/window-shell/lib/__tests__/geometry.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
    clampDragPosition,
    computeResize,
    HEADER_HEIGHT,
    MIN_HEIGHT,
    MIN_WIDTH,
    TASKBAR_HEIGHT,
    type Area,
    type Geometry,
} from "../geometry";

const area: Area = { left: 0, top: 0, right: 1000, bottom: 600 };

describe("clampDragPosition", () => {
    it("top 은 0 이상으로 강제된다", () => {
        expect(clampDragPosition({ x: 50, y: -30 }, area).y).toBe(0);
    });

    it("top 은 area.bottom - headerHeight 이하로 강제된다", () => {
        const result = clampDragPosition({ x: 50, y: 1000 }, area);
        expect(result.y).toBe(area.bottom - HEADER_HEIGHT);
    });

    it("left 는 자연 보호 — 클램핑하지 않는다", () => {
        expect(clampDragPosition({ x: -500, y: 100 }, area).x).toBe(-500);
        expect(clampDragPosition({ x: 9999, y: 100 }, area).x).toBe(9999);
    });

    it("정상 범위 안의 값은 그대로 반환한다", () => {
        expect(clampDragPosition({ x: 100, y: 100 }, area)).toEqual({ x: 100, y: 100 });
    });
});

describe("computeResize", () => {
    const start: Geometry = { x: 100, y: 100, w: 500, h: 400 };

    it("right 핸들: width 만 변경된다", () => {
        expect(computeResize("right", start, 50, 999, area)).toEqual({
            x: 100, y: 100, w: 550, h: 400,
        });
    });

    it("bottom 핸들: height 만 변경된다", () => {
        expect(computeResize("bottom", start, 999, 80, area)).toEqual({
            x: 100, y: 100, w: 500, h: 480,
        });
    });

    it("left 핸들: x 와 width 가 동시에 변경된다 (right edge 고정)", () => {
        // dx = -30 → 좌측으로 30 만큼 키움
        expect(computeResize("left", start, -30, 0, area)).toEqual({
            x: 70, y: 100, w: 530, h: 400,
        });
    });

    it("top 핸들: y 와 height 가 동시에 변경된다 (bottom edge 고정)", () => {
        expect(computeResize("top", start, 0, -40, area)).toEqual({
            x: 100, y: 60, w: 500, h: 440,
        });
    });

    it("top-left 모서리: 위치/크기 모두 동시 변경", () => {
        expect(computeResize("top-left", start, -20, -10, area)).toEqual({
            x: 80, y: 90, w: 520, h: 410,
        });
    });

    it("우/하 max 클램핑: x + w 가 area.right 를 넘지 않는다", () => {
        const r = computeResize("right", start, 9999, 0, area);
        expect(r.x + r.w).toBeLessThanOrEqual(area.right);
    });

    it("좌/상 음수 클램핑: x 가 area.left 미만이면 보정되고 width 도 줄어든다", () => {
        // start.x = 100, dx = -300 → x = -200, w = 800 → 클램핑 후 x = 0, w = 600
        const r = computeResize("left", start, -300, 0, area);
        expect(r.x).toBe(0);
        expect(r.w).toBe(600);
    });

    it("min size: width 가 MIN_WIDTH 미만으로 못 내려가고, left 핸들이면 x 가 right edge 기준으로 보정된다", () => {
        // start.x = 100, start.w = 500. dx = +500 → w 를 0 으로 만들려 함
        const r = computeResize("left", start, 500, 0, area);
        expect(r.w).toBe(MIN_WIDTH);
        // right edge (start.x + start.w = 600) 가 고정되므로 x = 600 - MIN_WIDTH
        expect(r.x).toBe(600 - MIN_WIDTH);
    });

    it("min size: height 가 MIN_HEIGHT 미만으로 못 내려간다", () => {
        const r = computeResize("bottom", start, 0, -9999, area);
        expect(r.h).toBe(MIN_HEIGHT);
    });
});

describe("상수", () => {
    it("panda token 과 일치하는 픽셀 값", () => {
        expect(TASKBAR_HEIGHT).toBe(50);
        expect(HEADER_HEIGHT).toBe(32);
        expect(MIN_WIDTH).toBe(300);
        expect(MIN_HEIGHT).toBe(60);
    });
});
```

**Step 2: 테스트 실행해 실패 확인**

```bash
pnpm test src/features/window-shell/lib/__tests__/geometry.test.ts
```

Expected: FAIL (`Cannot find module '../geometry'`).

**Step 3: `geometry.ts` 구현**

`src/features/window-shell/lib/geometry.ts`:

```ts
export interface Geometry {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Area {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export type ResizeDirection =
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

// panda token sizes.taskbar
export const TASKBAR_HEIGHT = 50;
// panda token sizes.windowHeader
export const HEADER_HEIGHT = 32;
export const MIN_WIDTH = 300;
export const MIN_HEIGHT = 60;

export function getAvailableArea(): Area {
    return {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight - TASKBAR_HEIGHT,
    };
}

interface ClampDragOptions {
    headerHeight?: number;
}

export function clampDragPosition(
    pos: { x: number; y: number },
    area: Area,
    options: ClampDragOptions = {}
): { x: number; y: number } {
    const headerHeight = options.headerHeight ?? HEADER_HEIGHT;
    const minTop = area.top;
    const maxTop = area.bottom - headerHeight;
    const y = Math.min(Math.max(pos.y, minTop), maxTop);
    return { x: pos.x, y };
}

interface ResizeOptions {
    minW?: number;
    minH?: number;
}

const isLeftSide = (d: ResizeDirection): boolean =>
    d === "left" || d === "top-left" || d === "bottom-left";
const isRightSide = (d: ResizeDirection): boolean =>
    d === "right" || d === "top-right" || d === "bottom-right";
const isTopSide = (d: ResizeDirection): boolean =>
    d === "top" || d === "top-left" || d === "top-right";
const isBottomSide = (d: ResizeDirection): boolean =>
    d === "bottom" || d === "bottom-left" || d === "bottom-right";

export function computeResize(
    direction: ResizeDirection,
    start: Geometry,
    dx: number,
    dy: number,
    area: Area,
    options: ResizeOptions = {}
): Geometry {
    const minW = options.minW ?? MIN_WIDTH;
    const minH = options.minH ?? MIN_HEIGHT;
    let { x, y, w, h } = start;

    if (isRightSide(direction)) {
        w = start.w + dx;
        if (w < minW) w = minW;
        if (x + w > area.right) w = area.right - x;
    }

    if (isBottomSide(direction)) {
        h = start.h + dy;
        if (h < minH) h = minH;
        if (y + h > area.bottom) h = area.bottom - y;
    }

    if (isLeftSide(direction)) {
        x = start.x + dx;
        w = start.w - dx;
        if (w < minW) {
            // right edge (start.x + start.w) 고정, x 보정
            x = start.x + start.w - minW;
            w = minW;
        }
        if (x < area.left) {
            w -= area.left - x;
            x = area.left;
        }
    }

    if (isTopSide(direction)) {
        y = start.y + dy;
        h = start.h - dy;
        if (h < minH) {
            // bottom edge (start.y + start.h) 고정
            y = start.y + start.h - minH;
            h = minH;
        }
        if (y < area.top) {
            h -= area.top - y;
            y = area.top;
        }
    }

    return { x, y, w, h };
}
```

**Step 4: 테스트 통과 확인**

```bash
pnpm test src/features/window-shell/lib/__tests__/geometry.test.ts
```

Expected: PASS (모든 케이스).

**Step 5: 커밋**

```bash
git add src/features/window-shell/lib/geometry.ts src/features/window-shell/lib/__tests__/geometry.test.ts
git commit -m "feat(window-shell): geometry 유틸과 8방향 리사이즈 분기/클램핑 함수 추가"
```

---

### Task A2: `lib/persist.ts` 와 단위 테스트 추가

**Files:**
- Create: `src/features/window-shell/lib/persist.ts`
- Create: `src/features/window-shell/lib/__tests__/persist.test.ts`

**Step 1: 실패 테스트 작성**

`src/features/window-shell/lib/__tests__/persist.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { loadGeometry, saveGeometry, clearGeometry } from "../persist";

beforeEach(() => {
    localStorage.clear();
});

describe("persist", () => {
    it("저장한 geometry 를 그대로 복원한다", () => {
        saveGeometry("node-1", { x: 100, y: 200, w: 500, h: 400 });
        expect(loadGeometry("node-1")).toEqual({ x: 100, y: 200, w: 500, h: 400 });
    });

    it("저장된 값이 없으면 null 을 반환한다", () => {
        expect(loadGeometry("missing")).toBeNull();
    });

    it("일부 키가 누락되면 null 을 반환한다", () => {
        localStorage.setItem("node-1x", "100");
        // y/w/h 없음
        expect(loadGeometry("node-1")).toBeNull();
    });

    it("숫자 파싱 실패 시 null 을 반환한다", () => {
        localStorage.setItem("node-1x", "not-a-number");
        localStorage.setItem("node-1y", "0");
        localStorage.setItem("node-1w", "500");
        localStorage.setItem("node-1h", "500");
        expect(loadGeometry("node-1")).toBeNull();
    });

    it("clearGeometry 는 4개 키를 모두 제거한다", () => {
        saveGeometry("node-1", { x: 1, y: 2, w: 3, h: 4 });
        clearGeometry("node-1");
        expect(localStorage.getItem("node-1x")).toBeNull();
        expect(localStorage.getItem("node-1y")).toBeNull();
        expect(localStorage.getItem("node-1w")).toBeNull();
        expect(localStorage.getItem("node-1h")).toBeNull();
    });
});
```

**Step 2: 테스트 실행해 실패 확인**

```bash
pnpm test src/features/window-shell/lib/__tests__/persist.test.ts
```

Expected: FAIL (`Cannot find module '../persist'`).

**Step 3: `persist.ts` 구현**

`src/features/window-shell/lib/persist.ts`:

```ts
import type { Geometry } from "./geometry";

const KEY_X = (id: string) => `${id}x`;
const KEY_Y = (id: string) => `${id}y`;
const KEY_W = (id: string) => `${id}w`;
const KEY_H = (id: string) => `${id}h`;

export function loadGeometry(id: string): Geometry | null {
    const raw = {
        x: localStorage.getItem(KEY_X(id)),
        y: localStorage.getItem(KEY_Y(id)),
        w: localStorage.getItem(KEY_W(id)),
        h: localStorage.getItem(KEY_H(id)),
    };
    if (raw.x == null || raw.y == null || raw.w == null || raw.h == null) {
        return null;
    }
    const x = Number(raw.x);
    const y = Number(raw.y);
    const w = Number(raw.w);
    const h = Number(raw.h);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(w) || !Number.isFinite(h)) {
        return null;
    }
    return { x, y, w, h };
}

export function saveGeometry(id: string, geom: Geometry): void {
    localStorage.setItem(KEY_X(id), String(geom.x));
    localStorage.setItem(KEY_Y(id), String(geom.y));
    localStorage.setItem(KEY_W(id), String(geom.w));
    localStorage.setItem(KEY_H(id), String(geom.h));
}

export function clearGeometry(id: string): void {
    localStorage.removeItem(KEY_X(id));
    localStorage.removeItem(KEY_Y(id));
    localStorage.removeItem(KEY_W(id));
    localStorage.removeItem(KEY_H(id));
}
```

**Step 4: 테스트 통과 확인**

```bash
pnpm test src/features/window-shell/lib/__tests__/persist.test.ts
```

Expected: PASS.

**Step 5: 커밋**

```bash
git add src/features/window-shell/lib/persist.ts src/features/window-shell/lib/__tests__/persist.test.ts
git commit -m "feat(window-shell): geometry localStorage 영속화 모듈 추가"
```

---

### Task A3: hooks 의 localStorage IO 를 `persist` 로 통합

**Files:**
- Modify: `src/features/window-shell/hooks/useWindowLifecycle.ts` (전체)
- Modify: `src/features/window-shell/hooks/useWindowDrag.ts` (localStorage 호출만)
- Modify: `src/features/window-shell/hooks/useWindowResize.ts` (localStorage 호출만)

**Step 1: 기존 동작 보존 테스트 확인**

```bash
pnpm test src/features/window-shell/__tests__/WindowShell.test.tsx
```

Expected: PASS (현재 통과 상태인지 baseline 확인).

**Step 2: `useWindowLifecycle.ts` 수정**

좌표/크기를 숫자로 다루고 박스에 적용할 때만 px 문자열로 변환. 기존 동작 그대로 (left/top 으로 위치, width/height 로 크기, 최대화는 100vw / 100vh-50). 단 calc 문자열 대신 숫자.

`src/features/window-shell/hooks/useWindowLifecycle.ts` 변경 핵심 부분:

```ts
import { useEffect, useState, useCallback } from "react";
import type { ProgramId } from "@shared/types/program";
import type { WindowStatus } from "../WindowShell.types";
import { TASKBAR_HEIGHT, type Geometry } from "../lib/geometry";
import { clearGeometry, loadGeometry, saveGeometry } from "../lib/persist";

const DEFAULT_W = 500;
const DEFAULT_H = 500;

interface UseWindowLifecycleParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: ProgramId;
    status?: WindowStatus;
    isActive: boolean;
    onRequestZIndex: () => number;
}

export function useWindowLifecycle({
    boxRef,
    id,
    status,
    isActive,
    onRequestZIndex,
}: UseWindowLifecycleParams) {
    const [isMaxSize, setIsMaxSize] = useState(false);
    const [isClose, setIsClose] = useState(false);

    useEffect(() => {
        if (isActive && boxRef.current) {
            const next = onRequestZIndex();
            boxRef.current.style.zIndex = String(next);
        }
    }, [isActive, boxRef, onRequestZIndex]);

    // 위치 복원
    useEffect(() => {
        if (status !== "active" || !boxRef.current) return;
        const box = boxRef.current;
        if (isMaxSize) {
            box.style.left = "0px";
            box.style.top = "0px";
            return;
        }
        const geom = loadGeometry(id);
        if (geom) {
            box.style.left = `${geom.x}px`;
            box.style.top = `${geom.y}px`;
        } else {
            const cx = Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2));
            const cy = Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2));
            box.style.left = `${cx}px`;
            box.style.top = `${cy}px`;
        }
    }, [status, isMaxSize, boxRef, id]);

    // 크기/opacity/scale — status 전이
    useEffect(() => {
        if (!boxRef.current) return;
        const box = boxRef.current;
        if (status === "active") {
            box.style.transition = "0.25s";
            box.style.opacity = "1";
            const geom = loadGeometry(id);
            if (geom) {
                box.style.width = `${geom.w}px`;
                box.style.height = `${geom.h}px`;
            } else {
                box.style.width = `${DEFAULT_W}px`;
                box.style.height = `${DEFAULT_H}px`;
            }
            box.style.scale = "1";
        } else if (status === "min") {
            box.style.transition = "0.25s";
            box.style.opacity = "0";
            box.style.left = "80px";
            box.style.top = "60vh";
            box.style.scale = "0.6";
            box.style.width = `${DEFAULT_W}px`;
            box.style.height = `${DEFAULT_H}px`;
        }
    }, [status, id, boxRef]);

    useEffect(() => {
        return () => {
            clearGeometry(id);
        };
    }, [id]);

    const onClickMax = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(true);
        const box = boxRef.current;
        const w = window.innerWidth;
        const h = window.innerHeight - TASKBAR_HEIGHT;
        box.style.transition = "0.25s";
        box.style.left = "0px";
        box.style.top = "0px";
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        saveGeometry(id, { x: 0, y: 0, w, h });
    }, [boxRef, id]);

    const onClickNormalSize = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(false);
        const box = boxRef.current;
        const prev = loadGeometry(id);
        const next: Geometry = {
            x: prev?.x ?? Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2)),
            y: prev?.y ?? Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2)),
            w: DEFAULT_W,
            h: DEFAULT_H,
        };
        box.style.transition = "0.25s";
        box.style.left = `${next.x}px`;
        box.style.top = `${next.y}px`;
        box.style.width = `${next.w}px`;
        box.style.height = `${next.h}px`;
        saveGeometry(id, next);
    }, [boxRef, id]);

    const triggerClose = useCallback(
        (onFinish: () => void) => {
            if (!boxRef.current) {
                onFinish();
                return;
            }
            setIsClose(true);
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "0";
            setTimeout(onFinish, 300);
        },
        [boxRef]
    );

    return {
        isMaxSize,
        isClose,
        onClickMax,
        onClickNormalSize,
        triggerClose,
    };
}
```

**Step 3: `useWindowDrag.ts` 의 localStorage 호출 교체 (mouseup 시 1회 저장으로)**

mousemove 마다 저장하지 않고 mouseup 시점에 한 번만 저장. transform 전환은 Phase B 에서 하므로 box.style.left/top 그대로 사용.

```ts
import { useCallback, useEffect, useRef } from "react";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowDragParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: string;
}

export function useWindowDrag({ boxRef, id }: UseWindowDragParams) {
    const isMovableRef = useRef(false);
    const prevPosRef = useRef<{ X: number; Y: number } | null>(null);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        isMovableRef.current = true;
        prevPosRef.current = { X: e.clientX, Y: e.clientY };
    }, []);

    const onMouseUp = useCallback(() => {
        isMovableRef.current = false;
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isMovableRef.current || !boxRef.current || !prevPosRef.current) {
                return;
            }
            const box = boxRef.current;
            const dx = e.clientX - prevPosRef.current.X;
            const dy = e.clientY - prevPosRef.current.Y;
            prevPosRef.current = { X: e.clientX, Y: e.clientY };

            box.style.transition = "0s";
            const nextLeft = box.offsetLeft + dx;
            const nextTop = box.offsetTop + dy;
            box.style.left = `${nextLeft}px`;
            box.style.top = `${nextTop}px`;
        };

        const handleMouseUp = () => {
            if (isMovableRef.current && boxRef.current) {
                // mouseup 시 1회 저장
                const box = boxRef.current;
                const prev = loadGeometry(id);
                saveGeometry(id, {
                    x: box.offsetLeft,
                    y: box.offsetTop,
                    w: prev?.w ?? box.offsetWidth,
                    h: prev?.h ?? box.offsetHeight,
                });
            }
            isMovableRef.current = false;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [boxRef, id]);

    return { onMouseDown, onMouseUp };
}
```

> Note: 이 단계에서는 `box.offsetLeft/Top` read 가 mousemove 에 남아 있다. Phase B 에서 transform 전환과 함께 ref 캐시로 제거한다.

**Step 4: `useWindowResize.ts` 의 localStorage 호출 교체 (mouseup 시 1회 저장)**

```ts
import { useCallback, useEffect, useRef } from "react";
import { MIN_HEIGHT, MIN_WIDTH } from "../lib/geometry";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowResizeParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: string;
}

export function useWindowResize({ boxRef, id }: UseWindowResizeParams) {
    const isResizingRef = useRef(false);
    const prevPosRef = useRef<{ X: number; Y: number } | null>(null);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        isResizingRef.current = true;
        prevPosRef.current = { X: e.clientX, Y: e.clientY };
    }, []);

    const onMouseUp = useCallback(() => {
        isResizingRef.current = false;
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingRef.current || !boxRef.current || !prevPosRef.current) {
                return;
            }
            const box = boxRef.current;
            const dx = e.clientX - prevPosRef.current.X;
            const dy = e.clientY - prevPosRef.current.Y;

            box.style.transition = "0s";

            const nextWidth = box.offsetWidth + dx;
            const nextHeight = box.offsetHeight + dy;

            if (nextWidth >= MIN_WIDTH) {
                box.style.width = `${nextWidth}px`;
            }
            if (nextHeight >= MIN_HEIGHT) {
                box.style.height = `${nextHeight}px`;
            }

            prevPosRef.current = { X: e.clientX, Y: e.clientY };
        };

        const handleMouseUp = () => {
            if (isResizingRef.current && boxRef.current) {
                const box = boxRef.current;
                const prev = loadGeometry(id);
                saveGeometry(id, {
                    x: prev?.x ?? box.offsetLeft,
                    y: prev?.y ?? box.offsetTop,
                    w: box.offsetWidth,
                    h: box.offsetHeight,
                });
            }
            isResizingRef.current = false;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [boxRef, id]);

    return { onMouseDown, onMouseUp };
}
```

**Step 5: 전체 테스트 실행**

```bash
pnpm test
```

Expected: 기존 `WindowShell.test.tsx` 와 신규 geometry/persist 테스트 모두 PASS.

**Step 6: 빌드 확인**

```bash
pnpm build
```

Expected: 성공.

**Step 7: 수동 검증 (dev 서버)**

```bash
pnpm dev
```

확인 항목:
- [ ] 폴더 프로그램 1개 열기 → 기본 위치/크기 정상
- [ ] 헤더 잡고 이동 → 동작 정상
- [ ] 우측 하단 핸들로 리사이즈 → 동작 정상
- [ ] 최대화 → 화면 가득 (taskbar 위까지)
- [ ] 복원 → 500x500 으로 돌아옴
- [ ] 새로고침 → 위치/크기 복원

**Step 8: 커밋**

```bash
git add src/features/window-shell/hooks/useWindowLifecycle.ts \
        src/features/window-shell/hooks/useWindowDrag.ts \
        src/features/window-shell/hooks/useWindowResize.ts
git commit -m "refactor(window-shell): localStorage IO 를 persist 모듈로 통합하고 좌표/크기를 숫자로 통일"
```

#### Phase A 회고 (작업 완료 후 작성)

> _(검증 가능한 사실 기반 관찰만 — 사용자 검토 후 확정)_

---

## Phase B — 이동(드래그) `transform` 전환 + 상/하 클램핑

**입력:** Phase A 완료. `lib/geometry.ts` 의 `clampDragPosition` 과 `getAvailableArea` 사용 가능.

**완료 조건:**
- `useWindowDrag` 가 `transform: translate3d` 기반으로 전환됨.
- `box.offsetLeft/Top` 읽기 제거 (ref 캐시로 대체).
- mousemove 가 `requestAnimationFrame` 으로 배칭됨.
- 헤더가 viewport 위로 사라지지 않고, taskbar 뒤로 가려지지 않음 (수동 검증).
- DevTools Performance 에서 드래그 mousemove 당 "Layout" 이벤트 0회 (수동 검증).
- 기존 테스트와 신규 통합 테스트 모두 통과.

**작업 내용 (커밋 1:1):**
- [ ] Task B1: 드래그를 transform 으로 전환 + 상/하 클램핑 + rAF 배칭

---

### Task B1: 드래그 transform 전환 + rAF + 상/하 클램핑

**Files:**
- Modify: `src/features/window-shell/hooks/useWindowDrag.ts` (전체 재작성)
- Modify: `src/features/window-shell/hooks/useWindowLifecycle.ts` (위치 표현을 transform 으로)
- Modify: `src/features/window-shell/ProgramComponent.style.ts` (base position `left:0; top:0`)

**Step 1: 통합 테스트 추가 (기존 동작 + 클램핑)**

`src/features/window-shell/__tests__/WindowShell.test.tsx` 에 새 케이스 추가:

```ts
import { TASKBAR_HEIGHT, HEADER_HEIGHT } from "../lib/geometry";

describe("WindowShell drag clamping", () => {
    beforeEach(() => {
        localStorage.clear();
        // jsdom default innerWidth/innerHeight (1024x768) 가정
    });

    it("드래그 mouseup 후 저장된 y 가 0 미만으로 내려가지 않는다", () => {
        render(<WindowShell {...buildProps()} />);
        const dragArea = document.querySelector(".dragArea") as HTMLElement;

        fireEvent.mouseDown(dragArea, { clientX: 500, clientY: 500 });
        fireEvent.mouseMove(document, { clientX: 500, clientY: -1000 });
        fireEvent.mouseUp(document);

        const stored = Number(localStorage.getItem("node-1y"));
        expect(stored).toBeGreaterThanOrEqual(0);
    });

    it("드래그 mouseup 후 y 가 (innerHeight - taskbar - headerHeight) 이하", () => {
        render(<WindowShell {...buildProps()} />);
        const dragArea = document.querySelector(".dragArea") as HTMLElement;

        fireEvent.mouseDown(dragArea, { clientX: 500, clientY: 500 });
        fireEvent.mouseMove(document, { clientX: 500, clientY: 9999 });
        fireEvent.mouseUp(document);

        const stored = Number(localStorage.getItem("node-1y"));
        expect(stored).toBeLessThanOrEqual(window.innerHeight - TASKBAR_HEIGHT - HEADER_HEIGHT);
    });
});
```

**Step 2: 테스트 실행해 실패 확인**

```bash
pnpm test src/features/window-shell/__tests__/WindowShell.test.tsx
```

Expected: 신규 두 케이스 FAIL (현재 클램핑 없음).

**Step 3: `useWindowDrag.ts` 재작성**

```ts
import { useCallback, useEffect, useRef } from "react";
import { clampDragPosition, getAvailableArea } from "../lib/geometry";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowDragParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: string;
}

export function useWindowDrag({ boxRef, id }: UseWindowDragParams) {
    const isMovableRef = useRef(false);
    const prevMouseRef = useRef<{ X: number; Y: number } | null>(null);
    const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const rafIdRef = useRef<number>(0);
    const prevTransitionRef = useRef<string>("");

    const apply = useCallback(() => {
        rafIdRef.current = 0;
        if (!boxRef.current) return;
        boxRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }, [boxRef]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (!boxRef.current) return;
        isMovableRef.current = true;
        prevMouseRef.current = { X: e.clientX, Y: e.clientY };

        // 현재 위치/크기를 ref 에 캐시
        const stored = loadGeometry(id);
        if (stored) {
            posRef.current = { x: stored.x, y: stored.y };
            sizeRef.current = { w: stored.w, h: stored.h };
        }

        // transition 끄기 (mousedown 시 1회)
        prevTransitionRef.current = boxRef.current.style.transition;
        boxRef.current.style.transition = "0s";
    }, [boxRef, id]);

    const onMouseUp = useCallback(() => {
        isMovableRef.current = false;
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isMovableRef.current || !prevMouseRef.current) return;

            const dx = e.clientX - prevMouseRef.current.X;
            const dy = e.clientY - prevMouseRef.current.Y;
            prevMouseRef.current = { X: e.clientX, Y: e.clientY };

            const next = clampDragPosition(
                { x: posRef.current.x + dx, y: posRef.current.y + dy },
                getAvailableArea()
            );
            posRef.current = next;

            if (rafIdRef.current === 0) {
                rafIdRef.current = requestAnimationFrame(apply);
            }
        };

        const handleMouseUp = () => {
            if (isMovableRef.current && boxRef.current) {
                // transition 복원
                boxRef.current.style.transition = prevTransitionRef.current;
                // 저장
                saveGeometry(id, {
                    x: posRef.current.x,
                    y: posRef.current.y,
                    w: sizeRef.current.w,
                    h: sizeRef.current.h,
                });
            }
            isMovableRef.current = false;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (rafIdRef.current !== 0) cancelAnimationFrame(rafIdRef.current);
        };
    }, [boxRef, id, apply]);

    return { onMouseDown, onMouseUp };
}
```

**Step 4: `useWindowLifecycle.ts` 위치 표현 transform 으로**

`box.style.left/top` → `box.style.transform = translate3d(x, y, 0)` 로 교체. width/height 는 그대로.

위치 복원 effect:

```ts
useEffect(() => {
    if (status !== "active" || !boxRef.current) return;
    const box = boxRef.current;
    if (isMaxSize) {
        box.style.transform = "translate3d(0, 0, 0)";
        return;
    }
    const geom = loadGeometry(id);
    if (geom) {
        box.style.transform = `translate3d(${geom.x}px, ${geom.y}px, 0)`;
    } else {
        const cx = Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2));
        const cy = Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2));
        box.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    }
}, [status, isMaxSize, boxRef, id]);
```

`onClickMax / onClickNormalSize / status="min"` 처리에서 `box.style.left/top` 사용처를 모두 `box.style.transform = translate3d(...)` 로 교체. `min` 상태의 `top: 60vh` 도 `(80, window.innerHeight * 0.6)` 픽셀 환산.

**Step 5: `ProgramComponent.style.ts` base position 변경**

```ts
base: {
    left: 0,
    top: 0,
    transform: "translate3d(0, 0, 0)",
    height: "program.default",
    width: "program.default",
    // ... 기존 그대로
},
```

기존 `left: "calc(50% - ...)" / top: "calc(50% - ...)"` 는 lifecycle 의 초기 복원 effect 가 처리하므로 제거.

**Step 6: 테스트 실행**

```bash
pnpm test
```

Expected: 모두 PASS (기존 + 신규 클램핑 케이스).

**Step 7: 빌드 + 수동 검증**

```bash
pnpm build && pnpm dev
```

확인:
- [ ] 헤더 하단을 잡고 위로 끌어도 헤더가 사라지지 않음
- [ ] 헤더 상단을 잡고 아래로 끌어도 헤더가 taskbar 뒤로 안 들어감
- [ ] 좌/우는 마우스를 따라가며 자연스럽게 보호됨
- [ ] 최대화/복원/min/새로고침 후 복원 정상
- [ ] DevTools Performance: 드래그 중 "Layout" 이벤트가 mousemove 당 0회

**Step 8: 커밋**

```bash
git add src/features/window-shell/hooks/useWindowDrag.ts \
        src/features/window-shell/hooks/useWindowLifecycle.ts \
        src/features/window-shell/ProgramComponent.style.ts \
        src/features/window-shell/__tests__/WindowShell.test.tsx
git commit -m "refactor(window-shell): 창 이동을 transform 기반 + rAF 로 전환하고 상/하 클램핑 적용"
```

#### Phase B 회고

> _(작업 완료 후 작성)_

---

## Phase C — 8방향 리사이즈 + 영역 max 클램핑

**입력:** Phase B 완료. `computeResize`, `getAvailableArea`, transform-based 위치 표현 사용 가능.

**완료 조건:**
- 4 변 + 4 모서리 = 8 곳에서 모두 리사이즈 가능.
- `useWindowResize` 가 `direction` 인자를 받아 `computeResize` 로 분기.
- `box.offsetWidth/Height` read 제거 (ref 캐시).
- mousemove 가 rAF 로 배칭, mouseup 시 1회 저장.
- 우/하단이 viewport 영역을 넘지 않고, 좌/상으로 키울 때 음수 위치 불가 (수동 검증).
- 최소 크기(300x60) 유지.

**작업 내용 (커밋 1:1):**
- [ ] Task C1: 8방향 리사이즈 핸들 + 분기 로직 + 영역 max 클램핑

---

### Task C1: 8방향 리사이즈 핸들 + 분기 로직 + 영역 max 클램핑

**Files:**
- Modify: `src/features/window-shell/ui/WindowResizeHandles.tsx` (8개 핸들)
- Modify: `src/features/window-shell/hooks/useWindowResize.ts` (전체 재작성)
- Modify: `src/features/window-shell/WindowShell.tsx` (resize 콜백 시그니처 변경)
- Modify: `src/features/window-shell/__tests__/WindowShell.test.tsx` (8핸들 렌더 + 클램핑 케이스 추가)

**Step 1: 8핸들 렌더 검증 테스트 추가**

```ts
describe("WindowResizeHandles", () => {
    it("8개 방향 핸들이 모두 렌더된다", () => {
        render(<WindowShell {...buildProps()} />);
        const directions = [
            "top", "right", "bottom", "left",
            "top-left", "top-right", "bottom-left", "bottom-right",
        ];
        for (const d of directions) {
            expect(document.querySelector(`.modiSize.${d.replace("-", "_")}`)).toBeTruthy();
        }
    });
});

describe("WindowShell resize clamping", () => {
    beforeEach(() => {
        localStorage.clear();
        // 초기 geometry: 중앙 500x500 가정. innerWidth=1024, innerHeight=768 가정.
        localStorage.setItem("node-1x", "100");
        localStorage.setItem("node-1y", "100");
        localStorage.setItem("node-1w", "500");
        localStorage.setItem("node-1h", "500");
    });

    it("right 핸들로 끝까지 키워도 x + w 가 innerWidth 를 넘지 않는다", () => {
        render(<WindowShell {...buildProps()} />);
        const handle = document.querySelector(".modiSize.right") as HTMLElement;
        fireEvent.mouseDown(handle, { clientX: 600, clientY: 200 });
        fireEvent.mouseMove(document, { clientX: 99999, clientY: 200 });
        fireEvent.mouseUp(document);

        const x = Number(localStorage.getItem("node-1x"));
        const w = Number(localStorage.getItem("node-1w"));
        expect(x + w).toBeLessThanOrEqual(window.innerWidth);
    });

    it("left 핸들로 음수 방향까지 키워도 x 가 0 이상", () => {
        render(<WindowShell {...buildProps()} />);
        const handle = document.querySelector(".modiSize.left") as HTMLElement;
        fireEvent.mouseDown(handle, { clientX: 100, clientY: 200 });
        fireEvent.mouseMove(document, { clientX: -99999, clientY: 200 });
        fireEvent.mouseUp(document);

        const x = Number(localStorage.getItem("node-1x"));
        expect(x).toBeGreaterThanOrEqual(0);
    });
});
```

**Step 2: 테스트 실행해 실패 확인**

```bash
pnpm test src/features/window-shell/__tests__/WindowShell.test.tsx
```

Expected: 신규 케이스들 FAIL.

**Step 3: `useWindowResize.ts` 재작성**

```ts
import { useCallback, useEffect, useRef } from "react";
import {
    computeResize,
    getAvailableArea,
    type Geometry,
    type ResizeDirection,
} from "../lib/geometry";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowResizeParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: string;
}

export function useWindowResize({ boxRef, id }: UseWindowResizeParams) {
    const directionRef = useRef<ResizeDirection | null>(null);
    const startMouseRef = useRef<{ X: number; Y: number } | null>(null);
    const startGeomRef = useRef<Geometry | null>(null);
    const currentGeomRef = useRef<Geometry | null>(null);
    const rafIdRef = useRef<number>(0);
    const prevTransitionRef = useRef<string>("");

    const apply = useCallback(() => {
        rafIdRef.current = 0;
        const box = boxRef.current;
        const geom = currentGeomRef.current;
        if (!box || !geom) return;
        box.style.transform = `translate3d(${geom.x}px, ${geom.y}px, 0)`;
        box.style.width = `${geom.w}px`;
        box.style.height = `${geom.h}px`;
    }, [boxRef]);

    const onMouseDown = useCallback(
        (direction: ResizeDirection) => (e: React.MouseEvent) => {
            if (!boxRef.current) return;
            e.stopPropagation();
            directionRef.current = direction;
            startMouseRef.current = { X: e.clientX, Y: e.clientY };

            const stored = loadGeometry(id);
            const start: Geometry = stored ?? {
                x: boxRef.current.offsetLeft,
                y: boxRef.current.offsetTop,
                w: boxRef.current.offsetWidth,
                h: boxRef.current.offsetHeight,
            };
            startGeomRef.current = start;
            currentGeomRef.current = start;

            prevTransitionRef.current = boxRef.current.style.transition;
            boxRef.current.style.transition = "0s";
        },
        [boxRef, id]
    );

    const onMouseUp = useCallback(() => {
        directionRef.current = null;
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const direction = directionRef.current;
            const startMouse = startMouseRef.current;
            const startGeom = startGeomRef.current;
            if (!direction || !startMouse || !startGeom) return;

            const dx = e.clientX - startMouse.X;
            const dy = e.clientY - startMouse.Y;
            currentGeomRef.current = computeResize(
                direction,
                startGeom,
                dx,
                dy,
                getAvailableArea()
            );

            if (rafIdRef.current === 0) {
                rafIdRef.current = requestAnimationFrame(apply);
            }
        };

        const handleMouseUp = () => {
            if (directionRef.current && boxRef.current && currentGeomRef.current) {
                boxRef.current.style.transition = prevTransitionRef.current;
                saveGeometry(id, currentGeomRef.current);
            }
            directionRef.current = null;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (rafIdRef.current !== 0) cancelAnimationFrame(rafIdRef.current);
        };
    }, [boxRef, id, apply]);

    return { onMouseDown, onMouseUp };
}
```

**Step 4: `WindowResizeHandles.tsx` 8개 핸들로 재작성**

```tsx
import type { ResizeDirection } from "../lib/geometry";

interface WindowResizeHandlesProps {
    onResizeMouseDown: (direction: ResizeDirection) => (e: React.MouseEvent) => void;
    onResizeMouseUp: () => void;
}

const DIRECTIONS: { dir: ResizeDirection; className: string }[] = [
    { dir: "top", className: "top" },
    { dir: "right", className: "right" },
    { dir: "bottom", className: "bottom" },
    { dir: "left", className: "left" },
    { dir: "top-left", className: "top_left" },
    { dir: "top-right", className: "top_right" },
    { dir: "bottom-left", className: "bottom_left" },
    { dir: "bottom-right", className: "bottom_right" },
];

const WindowResizeHandles = ({
    onResizeMouseDown,
    onResizeMouseUp,
}: WindowResizeHandlesProps) => {
    return (
        <>
            {DIRECTIONS.map(({ dir, className }) => (
                <div
                    key={dir}
                    className={`modiSize ${className}`}
                    onMouseDown={onResizeMouseDown(dir)}
                    onMouseUp={onResizeMouseUp}
                />
            ))}
        </>
    );
};

export default WindowResizeHandles;
```

**Step 5: `WindowShell.tsx` 콜백 시그니처 반영**

```tsx
<WindowResizeHandles
    onResizeMouseDown={resize.onMouseDown}
    onResizeMouseUp={resize.onMouseUp}
/>
```

(시그니처는 `(direction) => (e) => void` 가 됐으므로 prop 전달은 그대로지만 타입이 바뀐다. 컴파일 통과 확인.)

**Step 6: 테스트 실행**

```bash
pnpm test
```

Expected: 신규 8핸들 렌더 + 클램핑 케이스 PASS.

**Step 7: 빌드 + 수동 검증**

```bash
pnpm build && pnpm dev
```

확인:
- [ ] 4 모서리 + 4 변 모두 hover 시 커서 변경
- [ ] 각 핸들로 리사이즈 시 위치/크기 자연스럽게 변함 (top/left 계열은 위치도 같이)
- [ ] 우/하단으로 끝까지 키우면 viewport 경계에서 멈춤
- [ ] 좌/상으로 끝까지 키우면 (0, 0) 에서 멈춤
- [ ] 최소 크기 300x60 미만으로 못 줄어듦
- [ ] 새로고침 후 복원

**Step 8: 커밋**

```bash
git add src/features/window-shell/hooks/useWindowResize.ts \
        src/features/window-shell/ui/WindowResizeHandles.tsx \
        src/features/window-shell/WindowShell.tsx \
        src/features/window-shell/__tests__/WindowShell.test.tsx
git commit -m "feat(window-shell): 4모서리/4변 8방향 리사이즈와 영역 max 클램핑 적용"
```

#### Phase C 회고

> _(작업 완료 후 작성)_

---

## Phase D — 핸들 스타일 (안 절반/밖 절반, 8방향 커서)

**입력:** Phase C 완료. 8개 핸들이 동작하지만 스타일은 기존 `4×4px` 그대로.

**완료 조건:**
- 변 핸들 두께 `8px` (안 4 / 밖 4), 모서리 `14×14px` (안 7 / 밖 7).
- 8 방향 모두 OS 표준 커서 (`n/s/e/w/nw/ne/sw/se-resize`).
- 모서리 핸들이 변 핸들보다 위 (z-index).
- 헤더 영역과 겹치는 `top` 변 / `top-left` / `top-right` 핸들이 헤더 드래그영역 위 (z-index).
- 시각적으로 핸들이 보이지 않음 (hover 시에도) — 미니멀.

**작업 내용 (커밋 1:1):**
- [ ] Task D1: `ProgramComponent.style.ts` 의 `.modiSize` recipe 재작성

---

### Task D1: 핸들 스타일 재작성

**Files:**
- Modify: `src/features/window-shell/ProgramComponent.style.ts` (`.modiSize` 관련 블록만)

**Step 1: 기존 blocks 확인 후 재작성**

`ProgramComponent.style.ts` 의 `& .modiSize` ~ `& .bottom_right` 블록 (현 25-54 라인) 을 다음으로 교체:

```ts
"& .modiSize": {
    position: "absolute",
    zIndex: 10,  // 헤더 dragArea 위
},

// 4 변 (edge): 두께 8px, 안 4 / 밖 4
"& .modiSize.top": {
    top: "-4px",
    left: 0,
    right: 0,
    height: "8px",
    cursor: "ns-resize",
},
"& .modiSize.right": {
    top: 0,
    bottom: 0,
    right: "-4px",
    width: "8px",
    cursor: "ew-resize",
},
"& .modiSize.bottom": {
    bottom: "-4px",
    left: 0,
    right: 0,
    height: "8px",
    cursor: "ns-resize",
},
"& .modiSize.left": {
    top: 0,
    bottom: 0,
    left: "-4px",
    width: "8px",
    cursor: "ew-resize",
},

// 4 모서리 (corner): 14x14, 안 7 / 밖 7. 변보다 위 (z-index 우선)
"& .modiSize.top_left": {
    top: "-7px",
    left: "-7px",
    width: "14px",
    height: "14px",
    cursor: "nw-resize",
    zIndex: 11,
},
"& .modiSize.top_right": {
    top: "-7px",
    right: "-7px",
    width: "14px",
    height: "14px",
    cursor: "ne-resize",
    zIndex: 11,
},
"& .modiSize.bottom_left": {
    bottom: "-7px",
    left: "-7px",
    width: "14px",
    height: "14px",
    cursor: "sw-resize",
    zIndex: 11,
},
"& .modiSize.bottom_right": {
    bottom: "-7px",
    right: "-7px",
    width: "14px",
    height: "14px",
    cursor: "se-resize",
    zIndex: 11,
},
```

**Step 2: panda codegen + 빌드 확인**

```bash
pnpm panda && pnpm build
```

Expected: 성공.

**Step 3: 테스트 실행 (회귀 확인)**

```bash
pnpm test
```

Expected: 전체 PASS.

**Step 4: 수동 검증 (dev)**

```bash
pnpm dev
```

확인:
- [ ] 마우스를 윈도우의 4 변 / 4 모서리에 가까이 가져갔을 때 정확한 커서 (ns/ew/nw/ne/sw/se) 가 표시됨
- [ ] 핸들이 잡기 쉬워졌음 (이전 4x4 → 8/14)
- [ ] 모서리 영역에서 모서리 동작 (위치+크기 동시) 이 우선 (변 핸들이 가로채지 않음)
- [ ] 헤더 상단 변 (`top`) 을 잡으면 헤더 드래그가 발동하지 않고 리사이즈가 발동함
- [ ] 핸들이 시각적으로 안 보임 (배경 없음)

**Step 5: 커밋**

```bash
git add src/features/window-shell/ProgramComponent.style.ts
git commit -m "style(window-shell): 8방향 리사이즈 핸들 두께(8/14)/커서/z-index 정리"
```

#### Phase D 회고

> _(작업 완료 후 작성)_

---

## Phase E — 통합 검증 + 회고

**입력:** Phase A~D 완료. 모든 기능이 동작하는 상태.

**완료 조건:**
- 설계 문서 §성공 기준 (Definition of Done) 의 모든 항목이 검증됨.
- DevTools Performance 측정 결과를 회고에 기록.
- 프로젝트 회고를 본 plan 마지막에 작성.

**작업 내용:**
- [ ] Task E1: DevTools Performance 측정 + 회고 작성

---

### Task E1: DevTools Performance 측정 + 회고 작성

**Step 1: dev 서버 기동 + Performance 녹화**

```bash
pnpm dev
```

브라우저 DevTools → Performance 탭 → Record:
1. 폴더 프로그램 1개 열기
2. 헤더 잡고 5초간 좌우 위아래 빠르게 드래그
3. Stop → 녹화 분석

기록 항목:
- 드래그 중 mousemove 발생 횟수
- "Recalculate Style" 이벤트 수
- "Layout" 이벤트 수
- "Paint" 이벤트 수
- "Composite Layers" 이벤트 수

기대값:
- "Layout" 이벤트가 mousemove 당 0회 (transform-only 가정 검증)
- "Paint" 도 mousemove 당 0회 (composite-only)
- rAF 한 프레임에 1회 transform 갱신

**Step 2: 같은 방식으로 리사이즈 녹화**

bottom-right 모서리 잡고 5초간 빠르게 리사이즈. 기대값:
- "Layout" 이벤트가 발생함 (width/height 변경이라 정상)
- 단 mousemove 당 read 0회 (rAF 1회만 write)
- localStorage.setItem 은 mouseup 시 1회만 (Application 탭에서 확인하거나 console.log 임시 삽입)

**Step 3: 설계 문서의 모든 DoD 항목을 본 plan 의 Phase 회고에 옮겨 적고 체크**

`docs/plans/2026-05-05-program-window-polish-design.md` §성공 기준 의 모든 `- [ ]` 항목을 본 문서로 가져와 검증 결과 기록.

**Step 4: 프로젝트 회고 작성**

본 plan 의 마지막 절 (아래 "프로젝트 회고") 에 다음을 기록:
- 잘된 점 (다음에도 유지할 패턴)
- 개선할 점 (다음에 보완할 사항)
- 향후 과제 (이 작업에서 파생된 후속 작업)

**Step 5: 커밋**

```bash
git add docs/plans/2026-05-05-program-window-polish-plan.md
git commit -m "docs(window-shell): 프로그램 창 정리 작업 회고 추가"
```

#### Phase E 회고

> _(작업 완료 후 작성)_

---

## 프로젝트 회고

> _(전체 Phase 완료 후 작성)_

### 잘된 점

> _(검증 가능한 사실)_

### 개선할 점

> _(다음에 보완)_

### 향후 과제

> _(파생 후속 작업)_

---

## Definition of Done (전체)

설계 문서 [§성공 기준](./2026-05-05-program-window-polish-design.md#성공-기준-definition-of-done) 의 모든 항목을 인용한다. Phase E 에서 각 항목을 검증하고 본 절을 직접 체크한다.

### 기능
- [ ] 헤더의 드래그 가능 영역을 잡고 4 방향으로 끝까지 끌어도, 헤더가 viewport 위로 사라지지 않고 taskbar 뒤로 가려지지 않는다.
- [ ] 좌/우는 마우스가 viewport 끝까지 가는 만큼 따라가고, 헤더의 마우스 잡은 점은 항상 화면 안에 보인다.
- [ ] 4 모서리 + 4 변 = 8 곳 모두에서 리사이즈 가능. 각 핸들의 커서가 OS 표준에 맞다.
- [ ] 모든 방향에서 리사이즈 시 윈도우 우/하단이 사용 가능 영역을 넘지 않는다. 좌/상 방향으로 키울 때 위치도 음수가 되지 않는다.
- [ ] 최대화/복원 후에도 위치/크기가 일관된다. 새로고침 후 마지막 위치/크기가 복원된다.

### 성능
- [ ] 드래그 중 DevTools Performance 의 "Layout" 카운트가 mousemove 당 0회.
- [ ] 리사이즈 중 forced layout (read) 이 mousemove 당 0회. DOM write 는 rAF 한 프레임당 1회.
- [ ] `localStorage.setItem` 은 드래그/리사이즈 1회당 mouseup 시 1회.

### 기술 부채 비-증가
- [ ] 기존 `useDrag.tsx` 등 다른 컴포넌트가 사용하는 별도 훅에 영향 없음.
- [ ] eslint / typecheck / vitest 모두 통과.
