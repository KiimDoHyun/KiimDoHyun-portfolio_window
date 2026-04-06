# styled-components → PandaCSS 마이그레이션 플랜

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 22개 파일에서 styled-components를 제거하고 PandaCSS로 전환하여 zero-runtime CSS를 달성한다.

**Architecture:** 기존 프로젝트에서 확립된 PandaCSS 패턴을 따른다. 정적 스타일은 `css()`, 동적 props는 `cva()` + `styled()`, 레이아웃은 `flex()`/`grid()` 패턴을 사용한다. 각 feature별로 `.style.ts` 파일을 분리하여 스타일을 관리한다.

**Tech Stack:** PandaCSS (`@styled-system/css`, `@styled-system/jsx`, `@styled-system/patterns`), React, TypeScript

---

## 마이그레이션 패턴 가이드

모든 Task에서 아래 패턴을 반복 적용한다:

### 패턴 A: 정적 styled → `css()`
```tsx
// Before (styled-components)
const Block = styled.div`
  display: flex;
  gap: 8px;
`;
<Block>...</Block>

// After (PandaCSS)
import { css } from "@styled-system/css";
const blockStyle = css({ display: "flex", gap: "8px" });
<div className={blockStyle}>...</div>
```

### 패턴 B: 동적 props → `cva()` + `styled()`
```tsx
// Before
const Block = styled.div<{ active: boolean }>`
  opacity: ${(props) => (props.active ? "1" : "0")};
`;
<Block active={true} />

// After
import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
const blockRecipe = cva({
  base: {},
  variants: {
    active: {
      true: { opacity: 1 },
      false: { opacity: 0 },
    },
  },
});
const Block = styled("div", blockRecipe);
<Block active={true} />
```

### 패턴 C: 연속적 동적 값 → CSS 변수 + `cva()`
```tsx
// Before
const Block = styled.div<{ pos: number }>`
  bottom: ${(props) => props.pos}px;
`;

// After - inline style로 CSS 변수 설정, cva에서 참조
const blockRecipe = cva({
  base: { bottom: "var(--pos)" },
});
const Block = styled("div", blockRecipe);
<Block style={{ "--pos": `${pos}px` } as React.CSSProperties} />
```

### 패턴 D: keyframes → panda.config.ts에 등록
```ts
// panda.config.ts
export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        open: {
          from: { opacity: 0, transform: "scale(0.9)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
});

// 사용
const style = css({ animation: "open 0.25s ease" });
```

### 패턴 E: 중첩 셀렉터 → PandaCSS 중첩 문법
```tsx
// Before
const Block = styled.div`
  .child { color: red; }
  &:hover { opacity: 0.8; }
`;

// After
const blockStyle = css({
  "& .child": { color: "red" },
  _hover: { opacity: 0.8 },
});
```

---

## Phase 1: 설정 및 Simple 컴포넌트 (동적 props 없음, 8파일)

### Task 1: panda.config.ts에 keyframes 등록

프로젝트 전체에서 사용하는 keyframes를 미리 등록한다.

**Files:**
- Modify: `panda.config.ts`

**Step 1: keyframes 추가**

```ts
export default defineConfig({
  // ...기존 설정
  theme: {
    extend: {
      keyframes: {
        open: {
          from: { opacity: 0, transform: "scale(0.9)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        showFromBottom: {
          from: { scale: "1 1.5", translate: "0 200px" },
          to: { translate: "0 0px", scale: "1 1.0" },
        },
        prevViewCoverTransform: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
});
```

**Step 2: PandaCSS 코드젠 실행**

Run: `npx panda codegen`
Expected: styled-system 디렉토리에 keyframes 반영

**Step 3: Commit**
```bash
git add panda.config.ts
git commit -m "feat: panda.config에 keyframes 등록 (open, showFromBottom, prevViewCoverTransform)"
```

---

### Task 2: SimpleArrowUp / SimpleArrowDown 마이그레이션

**Files:**
- Modify: `src/shared/ui/icons/SimpleArrowUp.jsx`
- Modify: `src/shared/ui/icons/SimpleArrowDown.jsx`

**패턴:** A (정적 styled → css)

**Step 1: SimpleArrowUp.jsx 읽고 전환**

현재 파일을 읽고, `styled.div` 정의를 `css()` 기반 className으로 교체한다. 중첩 셀렉터는 패턴 E로 변환.

**Step 2: SimpleArrowDown.jsx 동일하게 전환**

**Step 3: 빌드 확인**

Run: `npx panda codegen && npm run build`
Expected: 에러 없이 빌드 성공

**Step 4: Commit**
```bash
git add src/shared/ui/icons/
git commit -m "refactor: SimpleArrow 아이콘 styled-components → PandaCSS 전환"
```

---

### Task 3: ErrorBox 마이그레이션

**Files:**
- Modify: `src/features/infobar/components/ErrorBox.tsx`

**패턴:** A (정적 styled → css)

**Step 1: 파일 읽고 styled.div → css() 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/infobar/components/ErrorBox.tsx
git commit -m "refactor: ErrorBox styled-components → PandaCSS 전환"
```

---

### Task 4: SkillIcon 마이그레이션

**Files:**
- Modify: `src/features/hidden-icon/components/SkillIcon.tsx`

**패턴:** A + E (정적 + hover/중첩)

**Step 1: 파일 읽고 전환** — hover는 `_hover`, 중첩 img는 `"& img"` 문법 사용

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/hidden-icon/components/SkillIcon.tsx
git commit -m "refactor: SkillIcon styled-components → PandaCSS 전환"
```

---

### Task 5: LeftAreaBox, CenterAreaBox, RightAreaBox 마이그레이션

**Files:**
- Modify: `src/features/statusbar/components/LeftAreaBox.tsx`
- Modify: `src/features/statusbar/components/CenterAreaBox.tsx`
- Modify: `src/features/statusbar/components/RightAreaBox.tsx`

**패턴:** A + E (정적 + 중첩)

**Step 1: 세 파일 각각 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/statusbar/components/
git commit -m "refactor: StatusBar 하위 영역 컴포넌트 styled-components → PandaCSS 전환"
```

---

### Task 6: Window 마이그레이션

**Files:**
- Modify: `src/features/desktop/components/Window.tsx`

**패턴:** A (정적 grid)

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/desktop/components/Window.tsx
git commit -m "refactor: Window styled-components → PandaCSS 전환"
```

---

## Phase 2: Medium 컴포넌트 (중첩 셀렉터 다수, 동적 props 없음, 5파일)

### Task 7: CommitItem 마이그레이션

**Files:**
- Modify: `src/features/infobar/components/CommitItem.tsx`

**패턴:** A + E (중첩 + hover/active)

**Step 1: 파일 읽고 전환** — `_hover`, `_active`, `"& h4"`, `"& .message"` 등

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/infobar/components/CommitItem.tsx
git commit -m "refactor: CommitItem styled-components → PandaCSS 전환"
```

---

### Task 8: IconBox 마이그레이션

**Files:**
- Modify: `src/features/desktop/components/IconBox.tsx`

**패턴:** A + E (중첩 + hover/active + 고정 크기)

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/desktop/components/IconBox.tsx
git commit -m "refactor: IconBox styled-components → PandaCSS 전환"
```

---

### Task 9: DesktopPage 마이그레이션

**Files:**
- Modify: `src/features/desktop/DesktopPage.tsx`

**패턴:** A + E (Grid + 중첩 + background-image)

background-image URL은 inline style로 처리하고, 나머지 정적 스타일은 `css()`로 전환.

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/desktop/DesktopPage.tsx
git commit -m "refactor: DesktopPage styled-components → PandaCSS 전환"
```

---

### Task 10: DOCProgramComponent 마이그레이션

**Files:**
- Modify: `src/features/program-doc/DOCProgramComponent.tsx`

**패턴:** A + E (대량 중첩 셀렉터)

빈 Header Block은 제거하거나 단순 div로 대체. Content Block의 대량 중첩 셀렉터를 `css()` 내 중첩 문법으로 전환.

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/program-doc/DOCProgramComponent.tsx
git commit -m "refactor: DOCProgramComponent styled-components → PandaCSS 전환"
```

---

### Task 11: INFOProgramComponent 마이그레이션

**Files:**
- Modify: `src/features/program-info/INFOProgramComponent.tsx`

**패턴:** A + E (대량 중첩 셀렉터)

Task 10과 동일 패턴.

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/program-info/INFOProgramComponent.tsx
git commit -m "refactor: INFOProgramComponent styled-components → PandaCSS 전환"
```

---

## Phase 3: Complex 컴포넌트 (동적 props, 6파일)

### Task 12: DisplayCover 마이그레이션

**Files:**
- Modify: `src/features/display-cover/DisplayCover.tsx`

**패턴:** C (연속 동적 값 → CSS 변수)

`displayLight` prop으로 opacity를 계산하는 로직 → CSS 변수 `--opacity`를 inline style로 설정, `css()`에서 `var(--opacity)` 참조.

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/display-cover/DisplayCover.tsx
git commit -m "refactor: DisplayCover styled-components → PandaCSS 전환"
```

---

### Task 13: HiddenIcon 마이그레이션

**Files:**
- Modify: `src/features/hidden-icon/HiddenIcon.tsx`

**패턴:** B (active boolean → cva variants)

`active` prop에 따른 bottom/z-index 전환 → `cva()` variants로 처리.

**Step 1: 스타일 파일 분리 생성**
- Create: `src/features/hidden-icon/HiddenIcon.style.ts`

**Step 2: HiddenIcon.tsx에서 import 교체**

**Step 3: 빌드 확인**

**Step 4: Commit**
```bash
git add src/features/hidden-icon/
git commit -m "refactor: HiddenIcon styled-components → PandaCSS 전환"
```

---

### Task 14: InfoBar 마이그레이션

**Files:**
- Modify: `src/features/infobar/components/InfoBar.tsx`

**패턴:** B + E (active boolean → cva variants + 대량 중첩)

`active` prop → `cva()` variants (right, pointer-events, z-index). 중첩 셀렉터는 base에 포함.

**Step 1: 스타일 파일 분리**
- Create: `src/features/infobar/components/InfoBar.style.ts`

**Step 2: InfoBar.tsx import 교체**

**Step 3: 빌드 확인**

**Step 4: Commit**
```bash
git add src/features/infobar/components/
git commit -m "refactor: InfoBar styled-components → PandaCSS 전환"
```

---

### Task 15: StatusBar 마이그레이션

**Files:**
- Modify: `src/features/statusbar/components/StatusBar.tsx`

**패턴:** B + D + E (active variants + keyframes + 대량 중첩)

`show_from_bottom` keyframes는 Task 1에서 이미 등록. `active` prop → `cva()` variants. animation은 base에서 `showFromBottom` 참조.

**Step 1: 스타일 파일 분리**
- Create: `src/features/statusbar/components/StatusBar.style.ts`

**Step 2: StatusBar.tsx import 교체**

**Step 3: 빌드 확인**

**Step 4: Commit**
```bash
git add src/features/statusbar/components/
git commit -m "refactor: StatusBar styled-components → PandaCSS 전환"
```

---

### Task 16: TimeBar 마이그레이션

**Files:**
- Modify: `src/features/timebar/components/TimeBar.tsx`

**패턴:** B + E (active variants + 대량 중첩)

StatusBar와 동일한 `active` boolean 패턴. 대량 중첩 셀렉터 포함.

**Step 1: 스타일 파일 분리**
- Create: `src/features/timebar/components/TimeBar.style.ts`

**Step 2: TimeBar.tsx import 교체**

**Step 3: 빌드 확인**

**Step 4: Commit**
```bash
git add src/features/timebar/components/
git commit -m "refactor: TimeBar styled-components → PandaCSS 전환"
```

---

## Phase 4: Very Complex 컴포넌트 (keyframes + 복합 동적 로직, 4파일)

### Task 17: ProgramComponent (Window Shell) 마이그레이션

**Files:**
- Modify: `src/features/window-shell/ProgramComponent.tsx`

**패턴:** B + D + E (isClose boolean + keyframes `open` + 대량 중첩 + pseudo-elements)

`open` keyframes는 Task 1에서 등록됨. `isClose` → cva variants로 opacity/transform 전환.

**Step 1: 스타일 파일 분리**
- Create: `src/features/window-shell/ProgramComponent.style.ts`

**Step 2: ProgramComponent.tsx import 교체**

**Step 3: 빌드 확인**

**Step 4: Commit**
```bash
git add src/features/window-shell/
git commit -m "refactor: ProgramComponent styled-components → PandaCSS 전환"
```

---

### Task 18: ImageProgramComponent 마이그레이션

**Files:**
- Modify: `src/features/program-image/ImageProgramComponent.tsx`

**패턴:** A + E (정적 + gradient + hover + 대량 중첩)

동적 props 없음. gradient, opacity 전환 등은 정적 css로 처리 가능.

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/program-image/ImageProgramComponent.tsx
git commit -m "refactor: ImageProgramComponent styled-components → PandaCSS 전환"
```

---

### Task 19: FolderProgramComponent 마이그레이션

**Files:**
- Modify: `src/features/program-folder/FolderProgramComponent.tsx`

**패턴:** A + E (상수 기반 크기 계산 + 다수 display 변형 + 대량 중첩)

`DEFAULT_SIZE` 상수를 사용한 크기 계산은 template literal로 css 값을 생성하여 `css()` 내에서 사용.

**Step 1: 파일 읽고 전환**

**Step 2: 빌드 확인**

**Step 3: Commit**
```bash
git add src/features/program-folder/FolderProgramComponent.tsx
git commit -m "refactor: FolderProgramComponent styled-components → PandaCSS 전환"
```

---

### Task 20: TaskBar 마이그레이션 (가장 복잡)

**Files:**
- Modify: `src/features/taskbar/components/TaskBar.tsx`

**패턴:** C + D + E (복합 동적 값 → CSS 변수 + keyframes + 대량 중첩)

`hoverTarget` prop의 복잡한 조건부 로직 → 컴포넌트 내에서 계산한 뒤 CSS 변수로 주입.

```tsx
// 컴포넌트 내에서 값을 미리 계산
const hoverTop = hoverTarget.name ? "-70px" : "0px";
const hoverLeft = `${hoverTarget.idx * 50}px`;
// ... 등

// CSS 변수로 전달
style={{
  "--hover-top": hoverTop,
  "--hover-left": hoverLeft,
  // ...
} as React.CSSProperties}
```

`css()` 내에서 `var(--hover-top)` 등으로 참조.

**Step 1: 스타일 파일 분리**
- Create: `src/features/taskbar/components/TaskBar.style.ts`

**Step 2: TaskBar.tsx에서 동적 값 계산 로직을 CSS 변수 방식으로 변경**

**Step 3: 빌드 확인**

**Step 4: Commit**
```bash
git add src/features/taskbar/components/
git commit -m "refactor: TaskBar styled-components → PandaCSS 전환"
```

---

## Phase 5: 정리

### Task 21: styled-components 패키지 제거

**Files:**
- Modify: `package.json`

**Step 1: styled-components 관련 import가 남아있는지 전체 검색**

Run: `grep -r "styled-components" src/`
Expected: 결과 없음

**Step 2: 패키지 제거**

Run: `npm uninstall styled-components @types/styled-components`

**Step 3: 빌드 확인**

Run: `npm run build`
Expected: 에러 없이 빌드 성공

**Step 4: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: styled-components 패키지 제거"
```

---

### Task 22: data.ts에서 styled-components 참조 정리

**Files:**
- Modify: `src/shared/lib/data.ts`

이 파일에 styled-components 관련 참조가 있다면 제거.

**Step 1: 파일 읽고 확인**

**Step 2: 필요시 정리**

**Step 3: Commit (변경 있을 경우)**
```bash
git add src/shared/lib/data.ts
git commit -m "chore: data.ts styled-components 참조 제거"
```

---

### Task 23: 최종 검증

**Step 1: 전체 빌드**

Run: `npm run build`
Expected: 에러 없음

**Step 2: styled-components 잔여 확인**

Run: `grep -r "styled-components\|from \"styled\"\|from 'styled'" src/`
Expected: 결과 없음

**Step 3: 앱 실행 확인**

Run: `npm run dev`
Expected: 정상 동작

---

## 요약

| Phase | Tasks | 파일 수 | 난이도 |
|-------|-------|---------|--------|
| 1. 설정 + Simple | Task 1-6 | 9 | 낮음 |
| 2. Medium | Task 7-11 | 5 | 중간 |
| 3. Complex | Task 12-16 | 5 | 높음 |
| 4. Very Complex | Task 17-20 | 4 | 매우 높음 |
| 5. 정리 | Task 21-23 | 2 | 낮음 |
