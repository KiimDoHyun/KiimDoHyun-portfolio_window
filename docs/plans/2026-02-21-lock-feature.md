# 잠금(Lock) 기능 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 시작 메뉴(StatusBar) 왼쪽 영역 하단에 잠금 버튼을 추가하여, 클릭 시 페이드아웃 후 로그인 화면으로 이동

**Architecture:** StatusBar 컴포넌트의 왼쪽 영역(leftArea)에 잠금 버튼을 추가하고, 클릭 시 DesktopPage에 onLock 콜백을 전달하여 페이드아웃 애니메이션 후 `/window/login`으로 navigate한다. LoginPage의 기존 2단계 흐름(잠금→로그인)을 그대로 재활용.

**Tech Stack:** React, styled-components, Recoil, react-router-dom

---

### Task 1: Power 아이콘 컴포넌트 생성

**Files:**
- Create: `src/fsd/window/6_common/components/icons/Power.jsx`
- Modify: `src/fsd/window/6_common/components/icons/index.ts`

**Context:**
- 기존 아이콘 패턴 참고: `src/fsd/window/6_common/components/icons/Windows.jsx`
- SVG 컴포넌트로 전원 아이콘 생성 (원형 + 상단 세로선)

**Step 1: Power 아이콘 생성**

`src/fsd/window/6_common/components/icons/Power.jsx`:

```jsx
import React from "react";

const Power = ({ size = 20, color = "#e8e8e8" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2v10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17.66 6.34A8 8 0 1 1 6.34 6.34"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Power;
```

**Step 2: barrel export에 추가**

`src/fsd/window/6_common/components/icons/index.ts` 맨 끝에 추가:

```ts
export { default as Power } from "./Power";
```

**Step 3: 빌드 확인**

Run: `npm run build`
Expected: 경고만 있고 에러 없이 빌드 성공

**Step 4: Commit**

```bash
git add src/fsd/window/6_common/components/icons/Power.jsx src/fsd/window/6_common/components/icons/index.ts
git commit -m "feat: Power 아이콘 컴포넌트 추가"
```

---

### Task 2: StatusBar에 잠금 버튼 추가

**Files:**
- Modify: `src/fsd/window/3_widgets/Window10/StatusBar/StatusBarContainer.tsx`
- Modify: `src/fsd/window/3_widgets/Window10/StatusBar/components/StatusBar.tsx`

**Context:**
- StatusBarContainer는 Container/Component 패턴. Container가 로직 보유, StatusBar(Component)에 props 전달.
- StatusBar의 왼쪽 영역은 `leftArea_top`(소개 헤더)과 `leftArea_contents`(아이템 목록)으로 구분됨.
- `leftArea_Contents`는 `flex-direction: column; justify-content: space-between;`이므로 하단에 요소를 추가하면 자동으로 바닥에 붙음.

**Step 1: StatusBarContainer에 onLock prop 추가**

`src/fsd/window/3_widgets/Window10/StatusBar/StatusBarContainer.tsx`:

StatusBarContainer의 props에 `onLock` 콜백을 받아서 StatusBar에 전달.

변경 1 — 컴포넌트 시그니처:

```tsx
// Before:
const StatusBarContainer = () => {

// After:
const StatusBarContainer = ({ onLock }: { onLock?: () => void }) => {
```

변경 2 — propDatas에 onLock 추가 (line ~106-118):

```tsx
// Before:
const propDatas = {
    active,
    activeLeftArea_Detail,
    statusBar_LeftArea_Items,
    projectDatas,
    techStack_main,
    techStack_sub,
    onMouseEnter,
    onMouseLeave,
    onClickBox,
};

// After:
const onClickLock = useCallback(() => {
    setActive(false);
    onLock?.();
}, [setActive, onLock]);

const propDatas = {
    active,
    activeLeftArea_Detail,
    statusBar_LeftArea_Items,
    projectDatas,
    techStack_main,
    techStack_sub,
    onMouseEnter,
    onMouseLeave,
    onClickBox,
    onClickLock,
};
```

**Step 2: StatusBar 컴포넌트에 잠금 버튼 렌더링**

`src/fsd/window/3_widgets/Window10/StatusBar/components/StatusBar.tsx`:

변경 1 — import Power 아이콘:

```tsx
import { Power } from "@fsd/window/6_common/components/icons";
```

변경 2 — props에 onClickLock 추가:

```tsx
// Before:
const StatusBar = ({
  active,
  activeLeftArea_Detail,
  statusBar_LeftArea_Items,
  projectDatas,
  techStack_main,
  techStack_sub,
  onMouseEnter,
  onMouseLeave,
  onClickBox,
}) => {

// After:
const StatusBar = ({
  active,
  activeLeftArea_Detail,
  statusBar_LeftArea_Items,
  projectDatas,
  techStack_main,
  techStack_sub,
  onMouseEnter,
  onMouseLeave,
  onClickBox,
  onClickLock,
}) => {
```

변경 3 — `leftArea_Contents` div 내부, `leftArea_contents` div 뒤에 잠금 버튼 추가:

```tsx
{/* Before: leftArea_Contents 내부는 leftArea_top + leftArea_contents */}

{/* After: leftArea_top + leftArea_contents + leftArea_bottom(잠금) */}
<div className="leftArea_bottom">
  <div className="statusBox lockButton" onClick={onClickLock}>
    <div className="icon">
      <Power />
    </div>
    <div className="text">잠금</div>
  </div>
</div>
```

위치: `leftArea_Contents` div 내부, `leftArea_contents` div 바로 뒤에 삽입.

현재 구조:
```
leftArea_Contents
  ├── leftArea_top (소개 헤더)
  └── leftArea_contents (아이템 목록)
```

변경 후:
```
leftArea_Contents
  ├── leftArea_top (소개 헤더)
  ├── leftArea_contents (아이템 목록)
  └── leftArea_bottom (잠금 버튼)
```

`justify-content: space-between` 덕분에 `leftArea_bottom`은 자동으로 바닥에 위치함.

변경 4 — styled-components에 `lockButton` 스타일 추가 (StatusBarBlock 내부):

```css
.lockButton {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 50px;

  .icon {
    width: 48px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    color: #e8e8e8;
    font-size: 13px;
    font-weight: lighter;
    white-space: nowrap;
  }
}
```

LeftAreaBox 스타일과 동일한 패턴 (48px 아이콘 + 텍스트).

**Step 3: 빌드 확인**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

**Step 4: Commit**

```bash
git add src/fsd/window/3_widgets/Window10/StatusBar/StatusBarContainer.tsx src/fsd/window/3_widgets/Window10/StatusBar/components/StatusBar.tsx
git commit -m "feat: StatusBar 왼쪽 하단에 잠금 버튼 추가"
```

---

### Task 3: DesktopPage 페이드아웃 및 라우팅

**Files:**
- Modify: `src/fsd/window/2_pages/DesktopPage.tsx`

**Context:**
- LoginPage의 페이드아웃 패턴을 참고: `isFadingOut` 상태 + `opacity` transition + setTimeout → navigate.
- `FADE_OUT_DURATION = 400` (LoginPage와 동일).
- StatusBarContainer에 `onLock` prop 전달.

**Step 1: DesktopPage에 페이드아웃 로직 추가**

`src/fsd/window/2_pages/DesktopPage.tsx`:

변경 1 — import 추가:

```tsx
// Before:
import React from "react";

// After:
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
```

변경 2 — 페이드아웃 상태 및 핸들러 추가 (컴포넌트 내부 상단):

```tsx
const FADE_OUT_DURATION = 400;

export default function DesktopPage() {
  const navigate = useNavigate();
  const [isLocking, setIsLocking] = useState(false);

  // 기존 setActive_* 선언들...

  const handleLock = useCallback(() => {
    setIsLocking(true);
    setTimeout(() => {
      navigate("/window/login", { replace: true });
    }, FADE_OUT_DURATION);
  }, [navigate]);
```

변경 3 — MainPageBlock에 페이드아웃 스타일 적용:

```tsx
// Before:
<MainPageBlock>

// After:
<MainPageBlock
  style={{
    opacity: isLocking ? 0 : 1,
    transition: `opacity ${FADE_OUT_DURATION}ms ease`,
  }}
>
```

변경 4 — StatusBarContainer에 onLock prop 전달:

```tsx
// Before:
<StatusBarContainer />

// After:
<StatusBarContainer onLock={handleLock} />
```

**Step 2: 빌드 확인**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

**Step 3: 수동 테스트**

Run: `npm start` → 브라우저에서 확인
1. `/window/login`에서 로그인
2. 시작 버튼(Windows 아이콘) 클릭 → StatusBar 열림
3. 왼쪽 하단 잠금 버튼 확인 (전원 아이콘 + "잠금" 텍스트)
4. 잠금 클릭 → StatusBar 닫힘 → 화면 페이드아웃 → 로그인 잠금화면

**Step 4: Commit**

```bash
git add src/fsd/window/2_pages/DesktopPage.tsx
git commit -m "feat: 잠금 버튼 클릭 시 페이드아웃 후 로그인 화면으로 이동"
```
