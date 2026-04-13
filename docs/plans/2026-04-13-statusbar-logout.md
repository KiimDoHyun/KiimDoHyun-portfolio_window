# 시작 메뉴 로그아웃 기능 — 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 시작 메뉴(StatusBar) leftArea 최하단에 전원 아이콘을 배치하고, 클릭 시 로그인 초기 화면으로 돌아가는 로그아웃 기능 구현

**Architecture:** StatusBarShell(로직) → StatusBar(컨테이너) → StatusBarView(뷰)로 이어지는 기존 prop 체인에 `onLogout` 콜백을 추가. 로그아웃 시 runningProgramsStore를 완전 초기화하고 `/window/login`으로 네비게이션.

**Tech Stack:** React, React Router DOM, Zustand, Panda CSS

**설계 문서:** [`2026-04-13-statusbar-logout-design.md`](2026-04-13-statusbar-logout-design.md)

**컨벤션 참조:**
- TypeScript: `docs/rules/typescript/README.md` — `type` 선호, `Array<T>` 표기, prop 구조분해 어노테이션
- Naming: `docs/rules/naming/README.md` — 상수 UPPER_SNAKE_CASE, 함수 camelCase
- Component: `docs/rules/component-structure/README.md` — Shell에 로직, View에 콜백만

---

## Task 1: 전원 아이콘 SVG 생성

**Files:**
- Create: `src/asset/images/icons/power.svg`

**Step 1: SVG 파일 생성**

IEC 5009 전원 기호(원 + 세로선) 스타일. 기존 아이콘들과 어울리도록 흰색(#ffffff), 24x24 viewBox.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v6" />
  <circle cx="12" cy="14" r="8" />
  <path d="M12 6v4" />
</svg>
```

> 참고: 실제 비율은 브라우저에서 확인 후 조정 필요. 원의 상단이 열린 형태(전원 심볼)로 수정할 수 있음.

**Step 2: 커밋**

```
feat(statusbar): 전원 아이콘 SVG 추가
```

---

## Task 2: runningProgramsStore에 reset 액션 추가

**Files:**
- Modify: `src/store/runningProgramsStore.ts`

**Step 1: reset 액션을 인터페이스와 구현에 추가**

`RunningProgramsActions`에 `reset` 추가:

```ts
// interface RunningProgramsActions 에 추가
reset: () => void;
```

`immer` 콜백 안에 구현 추가:

```ts
reset: () => {
    set((draft) => {
        draft.byId = {};
        draft.order = [];
        draft.activeId = null;
        draft.zIndexCounter = 1;
    });
},
```

**Step 2: 커밋**

```
feat(store): runningProgramsStore에 reset 액션 추가 — 로그아웃 시 전체 초기화용
```

---

## Task 3: StatusBar.style.ts에 leftArea_bottom 스타일 추가

**Files:**
- Modify: `src/features/statusbar/components/StatusBar.style.ts`

**Step 1: leftArea_bottom 스타일 추가**

기존 `statusBarRecipe.base` 내부에 추가:

```ts
"& .leftArea_bottom": {
    borderTop: "1px solid token(colors.shell.border)",
},
```

**Step 2: 타입 체크 실행**

```bash
pnpm tsc --noEmit
```

---

## Task 4: StatusBarView에 전원 아이콘 렌더링

**Files:**
- Modify: `src/features/statusbar/components/StatusBar.tsx`

**Step 1: onLogout prop 추가 및 leftArea_bottom 렌더링**

`StatusBarViewProps`에 `onLogout` 추가:

```ts
type StatusBarViewProps = {
    // ... 기존 props
    onLogout: () => void;
};
```

컴포넌트 파라미터에 `onLogout` 구조분해 추가.

leftArea 내부 `leftArea_Contents` div 안, `leftArea_contents` div 뒤에 추가:

```tsx
<div className="leftArea_bottom">
    <LeftAreaBox
        img={imgPower}
        name={"로그아웃"}
        onClick={onLogout}
    />
</div>
```

파일 상단에 import 추가:

```ts
import imgPower from "@images/icons/power.svg";
```

**Step 2: 타입 체크 실행**

```bash
pnpm tsc --noEmit
```

---

## Task 5: StatusBar 컨테이너에 onLogout prop 전달

**Files:**
- Modify: `src/features/statusbar/StatusBar.tsx`

**Step 1: onLogout prop 추가**

`StatusBarProps`에 추가:

```ts
// 기존 interface에 추가
onLogout: () => void;
```

컴포넌트 파라미터에 `onLogout` 구조분해 추가.

`StatusBarView`에 `onLogout={onLogout}` 전달.

**Step 2: 타입 체크 실행**

```bash
pnpm tsc --noEmit
```

---

## Task 6: StatusBarShell에서 handleLogout 구현 및 연결

**Files:**
- Modify: `src/pages/DesktopPage/shells/StatusBarShell.tsx`

**Step 1: useNavigate import 및 handleLogout 구현**

```ts
import { useNavigate } from "react-router-dom";
```

컴포넌트 안에:

```ts
const navigate = useNavigate();

const handleLogout = useCallback(() => {
    useRunningProgramsStore.getState().reset();
    useUiStore.getState().closeAllMenus();
    navigate("/window/login", { replace: true });
}, [navigate]);
```

`StatusBar`에 `onLogout={handleLogout}` 전달.

**Step 2: 타입 체크 실행**

```bash
pnpm tsc --noEmit
```

---

## Task 7: Task 3~6 일괄 커밋

Task 3~6은 하나의 논리 단위(StatusBar에 로그아웃 UI + 핸들러 연결)이므로 단일 커밋으로 묶는다.

```
feat(statusbar): 시작 메뉴에 로그아웃 버튼 추가 — leftArea 하단 전원 아이콘 + 네비게이션
```

---

## Task 8: 브라우저 수동 검증

**Step 1: 개발 서버 실행**

```bash
pnpm dev
```

**Step 2: 검증 항목**

- [ ] 시작 메뉴 열기 → leftArea 최하단에 전원 아이콘 확인
- [ ] leftArea 호버 → 넓어지면서 "로그아웃" 텍스트 표시 확인
- [ ] 전원 아이콘 클릭 → Lock Screen(드래그 화면)으로 이동 확인
- [ ] Lock Screen → 언락 → 로그인 → 데스크탑 재진입 확인
- [ ] 재진입 후 이전에 열었던 프로그램 창이 없는지 확인
- [ ] 시작 메뉴의 기존 기능(소개 클릭, 프로젝트 클릭, 기술스택 클릭) 정상 동작 확인

**Step 3: SVG 아이콘 외관이 어색하면 조정 후 재커밋**
