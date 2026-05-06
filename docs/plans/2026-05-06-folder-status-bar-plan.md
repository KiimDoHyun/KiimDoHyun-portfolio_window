# 폴더 창 status bar 도입 — 구현 계획서

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 폴더 창 하단에 항목/선택 카운트를 표시하는 status bar 를 도입하고, 모든 프로그램 창의 `bottomArea` 슬롯을 시각적으로 일관되게 만든다.

**Architecture:** `FolderStatusBar` 를 props 기반 분리 컴포넌트로 신설하고, `useFolderNavigation` 의 단일 선택 ID 를 `selectedIds: ProgramId[]` 배열로 리팩터해 카운트 인터페이스를 자연스럽게 한다. `bottomArea` 의 배경/separator 는 panda CSS 로 처리하고, 별도의 status bar 가 없는 프로그램(DOC) 도 빈 `<div className="bottomArea" />` 만 두어 회색 띠가 모든 창에 일관되게 표시되도록 한다.

**Tech Stack:** React 19, TypeScript, panda-css, vitest + @testing-library/react.

**참조:** [설계 문서](./2026-05-06-folder-status-bar-design.md). 본 plan 은 design 문서의 결정/규칙/DoD 를 입력으로 한다.

---

## 배경 / 설계 규칙 (요약)

본 작업의 배경/결정/규칙/DoD 는 [설계 문서](./2026-05-06-folder-status-bar-design.md) 에 명시되어 있다. 핵심만 인용:

- 모든 프로그램 창은 `<div className="bottomArea">` 슬롯을 (비어 있더라도) 렌더한다.
- `FolderStatusBar` 는 props (`totalCount`, `selectedCount`) 만 보고 렌더하는 순수 표시 컴포넌트.
- `selectedCount > 0` 일 때만 두 번째 span 을 렌더하며, separator 는 CSS `::before { content: "|" }` 로 처리 (텍스트 `"|"` 직접 작성 금지).
- 선택 인터페이스는 `selectedIds: ProgramId[]` 배열로 통일 (현재 동작은 길이 0 또는 1).
- `bottomArea` 배경은 panda 토큰 `surface.light` (gray.100).

---

## Phase A — `selectedId` 를 `selectedIds: ProgramId[]` 배열로 리팩터

**입력:** 설계 문서. 단일 선택 동작이 회귀 없이 그대로 동작해야 한다.

**완료 조건:**
- `useFolderNavigation` 이 `selectedIds: ProgramId[]` 를 노출한다.
- `FolderGrid` 가 `selectedIds` prop 을 받고 `includes` 로 비교한다.
- 기존 `FolderProgram.test.tsx` 의 모든 케이스가 변경 없이 통과한다.
- 단일 선택 시 `folder_selected` 클래스가 부여되는 시각 동작이 동일하다 (수동 검증).
- `pnpm typecheck`, `pnpm test` 모두 통과.

**작업 내용 (커밋 1:1):**
- [x] Task A1: `useFolderNavigation` 의 `selectedId` 를 `selectedIds: ProgramId[]` 배열로 변경
- [x] Task A2: `FolderGrid` 가 `selectedIds` prop 을 받도록 수정 (includes 비교)
- [x] Task A3: `FolderProgram` 의 분해/전달을 `selectedIds` 로 갱신

---

### Task A1: `useFolderNavigation` 의 selectedId → selectedIds 배열 변경

**Files:**
- Modify: `src/features/program-folder/hooks/useFolderNavigation.ts`

**Step 1: 변경 적용**

기존 useState 와 두 setter 호출을 배열로 바꾼다. 외부 노출 키도 `selectedIds` 로 변경.

```ts
const [selectedIds, setSelectedIds] = useState<ProgramId[]>([]);

// onClickItem:
setSelectedIds([id]);

// onClickLeft / onDoubleClickItem (folder enter): 선택 해제
setSelectedIds([]);

// return 객체에서 selectedId 키를 selectedIds 로 변경
return {
    selectedIds,
    folderContents: viewModel.folderContents,
    // ...rest
};
```

**Step 2: typecheck 실행 — 호출부에서 에러가 발생하는지 확인**

Run: `pnpm typecheck`

Expected: `FolderProgram.tsx` 와 `FolderGrid` 호출부에서 `selectedId` 가 없다는 TS 에러. (Task A2/A3 에서 해결)

**Step 3: 커밋**

```bash
git add src/features/program-folder/hooks/useFolderNavigation.ts
git commit -m "refactor(folder-program): useFolderNavigation 선택 상태를 selectedIds 배열로 통일"
```

본문에 "단일 선택 동작은 길이 0/1 배열로 동일하게 표현. 다중 선택 도입 시 인터페이스 변경 없이 자연 확장." 한 줄 추가 권장.

---

### Task A2: `FolderGrid` 가 `selectedIds` prop 을 받도록 수정

**Files:**
- Modify: `src/features/program-folder/ui/FolderGrid.tsx`

**Step 1: prop 시그니처와 비교 로직 변경**

```tsx
interface FolderGridProps {
    items: Array<ProgramNode>;
    displayType: string;
    selectedIds: ProgramId[];
    hasChildren: (id: ProgramId) => boolean;
    onClickItem: (id: ProgramId) => void;
    onDoubleClickItem: (item: ProgramNode) => void;
}

// 내부 비교
className={
    selectedIds.includes(item.id)
        ? "folder folder_selected"
        : "folder"
}
```

**Step 2: 커밋 (이 시점에 typecheck 는 여전히 FolderProgram 에서 실패 — 정상)**

```bash
git add src/features/program-folder/ui/FolderGrid.tsx
git commit -m "refactor(folder-program): FolderGrid 의 selectedId prop 을 selectedIds 배열로 변경"
```

---

### Task A3: `FolderProgram` 의 분해/전달을 `selectedIds` 로 갱신

**Files:**
- Modify: `src/features/program-folder/FolderProgram.tsx`

**Step 1: hook 분해와 FolderGrid 전달을 변경**

```tsx
const {
    selectedIds,
    folderContents,
    route,
    nodeType,
    hasChildren,
    onClickItem,
    onClickLeft,
    onDoubleClickItem,
} = useFolderNavigation({ fsState, initialFolderId, onOpenProgram });

// ...

<FolderGrid
    items={folderContents}
    displayType={displayType}
    selectedIds={selectedIds}
    hasChildren={hasChildren}
    onClickItem={onClickItem}
    onDoubleClickItem={onDoubleClickItem}
/>
```

**Step 2: typecheck + 기존 테스트 실행**

Run: `pnpm typecheck && pnpm test src/features/program-folder/__tests__/FolderProgram.test.tsx`

Expected: typecheck 통과. 기존 테스트 (선택 시 `folder_selected` 클래스 부여 등) 모두 통과.

**Step 3: 수동 검증**

- [ ] 폴더 창에서 항목 클릭 → 선택 시각 효과 (`folder_selected` 클래스) 그대로 보임
- [ ] 좌측 화살표 클릭 → 부모 폴더로 이동, 선택 해제됨
- [ ] 폴더 더블클릭 → 진입, 선택 해제됨

**Step 4: 커밋**

```bash
git add src/features/program-folder/FolderProgram.tsx
git commit -m "refactor(folder-program): FolderProgram 이 selectedIds 배열을 hook 에서 받아 Grid 로 전달"
```

#### Phase A 회고

- **잘된 점**: 훅 → Grid → Program 순서로 위에서 아래로 타입 에러를 따라가며 자연스럽게 진행됨. 각 task 후 `tsc --noEmit` 으로 의도한 위치에서만 에러가 나는지 확인할 수 있어 회귀 위험이 낮았다.
- **개선할 점**: 계획서가 `FolderGrid.test.tsx` 의 존재를 누락했다 — FolderGrid 의 prop 시그니처를 바꾸면 그 단위 테스트도 함께 갱신되어야 한다. Task A3 에서 prop 이름 동기화 차원에서 같이 처리. 다음 plan 부터는 변경 대상 컴포넌트의 단위 테스트도 변경 대상에 포함하는지 확인하는 단계가 있으면 좋겠다.
- **검증**: `pnpm exec tsc --noEmit` 통과, `pnpm test src/features/program-folder` 15 케이스 모두 통과 (FolderProgram 7 + FolderGrid 8). `pnpm typecheck` 스크립트는 package.json 에 없으므로 `tsc --noEmit` 으로 대체.

---

## Phase B — `FolderStatusBar` 컴포넌트 신설 (TDD)

**입력:** Phase A 완료. `selectedIds` 인터페이스 사용 가능.

**완료 조건:**
- `FolderStatusBar.tsx` 가 props (`totalCount`, `selectedCount`) 만 받는 표시 컴포넌트로 존재한다.
- 단위 테스트 4 케이스 (선택 없음 / 단일 선택 / 빈 폴더 / 다중 선택) 가 모두 통과한다.
- 컴포넌트는 외부 상태/훅 접근 없이 렌더한다.

**작업 내용 (커밋 1:1):**
- [x] Task B1: `FolderStatusBar.test.tsx` 단위 테스트 작성 (실패 상태로 시작)
- [x] Task B2: `FolderStatusBar.tsx` 최소 구현으로 테스트 통과

---

### Task B1: `FolderStatusBar` 단위 테스트 작성

**Files:**
- Create: `src/features/program-folder/__tests__/FolderStatusBar.test.tsx`

**Step 1: 실패 테스트 작성**

```tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FolderStatusBar from "../ui/FolderStatusBar";

describe("FolderStatusBar", () => {
    it("선택이 없으면 항목 개수만 렌더한다", () => {
        const { container } = render(
            <FolderStatusBar totalCount={3} selectedCount={0} />,
        );
        expect(screen.getByText("3개 항목")).toBeInTheDocument();
        expect(screen.queryByText(/선택함$/)).not.toBeInTheDocument();
        // 선택 부분 span 자체가 렌더되지 않는다
        expect(container.querySelectorAll("span").length).toBe(1);
    });

    it("선택이 1개면 '선택함' 부분이 추가로 렌더된다", () => {
        render(<FolderStatusBar totalCount={3} selectedCount={1} />);
        expect(screen.getByText("3개 항목")).toBeInTheDocument();
        expect(screen.getByText("1개 항목 선택함")).toBeInTheDocument();
    });

    it("빈 폴더는 '0개 항목' 한 span 만 렌더한다", () => {
        const { container } = render(
            <FolderStatusBar totalCount={0} selectedCount={0} />,
        );
        expect(screen.getByText("0개 항목")).toBeInTheDocument();
        expect(container.querySelectorAll("span").length).toBe(1);
    });

    it("선택이 다수면 그 개수가 노출된다", () => {
        render(<FolderStatusBar totalCount={5} selectedCount={2} />);
        expect(screen.getByText("5개 항목")).toBeInTheDocument();
        expect(screen.getByText("2개 항목 선택함")).toBeInTheDocument();
    });
});
```

**Step 2: 테스트 실행 — 실패 확인**

Run: `pnpm test src/features/program-folder/__tests__/FolderStatusBar.test.tsx`

Expected: FAIL — 컴포넌트 import 실패 (`Cannot find module '../ui/FolderStatusBar'`).

**Step 3: 커밋 (실패 테스트만)**

```bash
git add src/features/program-folder/__tests__/FolderStatusBar.test.tsx
git commit -m "test(folder-program): FolderStatusBar 단위 테스트 4 케이스 추가 (RED)"
```

---

### Task B2: `FolderStatusBar.tsx` 최소 구현

**Files:**
- Create: `src/features/program-folder/ui/FolderStatusBar.tsx`

**Step 1: 최소 구현**

```tsx
interface FolderStatusBarProps {
    totalCount: number;
    selectedCount: number;
}

const FolderStatusBar = ({
    totalCount,
    selectedCount,
}: FolderStatusBarProps) => (
    <div className="bottomArea">
        <span>{totalCount}개 항목</span>
        {selectedCount > 0 && <span>{selectedCount}개 항목 선택함</span>}
    </div>
);

export default FolderStatusBar;
```

**Step 2: 테스트 실행 — 통과 확인**

Run: `pnpm test src/features/program-folder/__tests__/FolderStatusBar.test.tsx`

Expected: 4 케이스 모두 PASS.

**Step 3: 커밋**

```bash
git add src/features/program-folder/ui/FolderStatusBar.tsx
git commit -m "feat(folder-program): FolderStatusBar 컴포넌트 추가 (GREEN)"
```

#### Phase B 회고

- **잘된 점**: TDD 사이클 (RED 1회 실행 확인 → GREEN 1회 실행 통과) 이 군더더기 없이 흘렀다. 컴포넌트가 props 만 받는 순수 표시이므로 테스트 4 케이스가 곧 사양 정의 역할을 했다.
- **개선할 점**: `container.querySelectorAll("span").length` 같은 구조 검증은 향후 separator span 추가 등으로 깨지기 쉽다. 다만 본 컴포넌트의 책임상 이 시점에 의도적으로 확인하는 게 맞다고 판단.
- **검증**: `pnpm test src/features/program-folder/__tests__/FolderStatusBar.test.tsx` 4 케이스 모두 PASS.

---

## Phase C — `FolderProgram` 에서 `<FolderStatusBar>` 렌더 + `DOCProgram` 빈 슬롯

**입력:** Phase A, B 완료.

**완료 조건:**
- 폴더 창 하단에 status bar 텍스트가 표시된다.
- 항목 클릭/해제에 따라 두 번째 부분이 정확히 추가/사라진다 (수동 검증).
- DOC 창 하단도 빈 `bottomArea` 가 렌더된다 (Phase D 의 회색 띠가 적용되면 일관되게 보인다).
- `pnpm typecheck`, `pnpm test` 통과.

**작업 내용 (커밋 1:1):**
- [x] Task C1: `FolderProgram` 에 `<FolderStatusBar>` 렌더 추가
- [x] Task C2: `DOCProgram` 에 빈 `<div className="bottomArea" />` 추가

---

### Task C1: `FolderProgram` 에 `<FolderStatusBar>` 렌더 추가

**Files:**
- Modify: `src/features/program-folder/FolderProgram.tsx`

**Step 1: import 와 렌더 추가**

```tsx
import FolderStatusBar from "./ui/FolderStatusBar";

// ... 기존 return 의 마지막에 추가:
<FolderStatusBar
    totalCount={folderContents.length}
    selectedCount={selectedIds.length}
/>
```

**Step 2: 테스트 실행 — 기존 테스트 회귀 없음 확인**

Run: `pnpm test src/features/program-folder/__tests__/FolderProgram.test.tsx`

Expected: 모든 기존 케이스 PASS.

**Step 3: 수동 검증**

- [ ] 폴더 진입 시 하단에 "{N}개 항목" 표시
- [ ] 항목 클릭 시 " | 1개 항목 선택함" 추가됨 (text 가 아닌 시각적 separator 는 Phase D 에서)
- [ ] 다른 항목 클릭 시 카운트는 유지 (여전히 1개 선택)
- [ ] 좌측 화살표 / 폴더 더블 클릭 시 선택 해제 → 두 번째 부분 사라짐
- [ ] 빈 폴더 진입 시 "0개 항목" 표시 (그리드는 여전히 "비어있습니다." 노출)

**Step 4: 커밋**

```bash
git add src/features/program-folder/FolderProgram.tsx
git commit -m "feat(folder-program): FolderProgram 하단에 FolderStatusBar 렌더"
```

---

### Task C2: `DOCProgram` 에 빈 `bottomArea` 추가

**Files:**
- Modify: `src/features/program-doc/DOCProgram.tsx`

**Step 1: 빈 div 추가**

기존 `Fragment` 마지막 child 로 추가:

```tsx
<div className="bottomArea" />
```

**Step 2: 기존 DOC 테스트 회귀 없음 확인**

Run: `pnpm test src/features/program-doc`

Expected: 기존 케이스 모두 PASS.

**Step 3: 커밋**

```bash
git add src/features/program-doc/DOCProgram.tsx
git commit -m "feat(doc-program): DOCProgram 에 빈 bottomArea 슬롯 추가하여 창 하단 일관성 확보"
```

#### Phase C 회고

- **잘된 점**: C1/C2 모두 추가만 한 변경 (한 줄~다섯 줄). 회귀 위험이 가장 낮은 형태로, 자동 테스트가 회귀 없음을 즉시 증명. Phase A 의 `selectedIds.length` 가 카운트 prop 으로 자연스럽게 흘러들어가 Phase A 의 의도가 검증됨.
- **개선할 점**: 폴더 진입 시 선택 자동 해제 → status bar 두 번째 span 사라짐 같은 시각적 동작 검증은 jsdom 단위 테스트만으로는 한계. Phase D 의 dev 서버 검증에서 함께 확인할 항목으로 미룸.
- **검증**: `pnpm exec tsc --noEmit` 통과, `pnpm test src/features/program-folder` 19/19 PASS, `pnpm test src/features/program-doc` 4/4 PASS.

---

## Phase D — `.bottomArea` 배경/separator CSS

**입력:** Phase A, B, C 완료.

**완료 조건:**
- `bottomArea` 배경이 `surface.light` (gray.100) 으로 표시되어 윈도우 배경과 시각적으로 구분된다.
- 폴더 창의 두 번째 span 앞에 `|` 가 CSS 로 표시된다 (텍스트 문자가 JSX 에 들어가지 않음).
- 모든 프로그램 창 (Folder/Image/DOC) 의 하단이 동일한 회색 띠로 보인다 (수동 검증).
- `pnpm test`, `pnpm build` 통과.

**작업 내용 (커밋 1:1):**
- [x] Task D1: `.bottomArea` 배경색을 `surface.light` 로 지정 + separator 스타일 추가

---

### Task D1: `.bottomArea` 배경 + separator CSS

**Files:**
- Modify: `src/features/window-shell/ProgramComponent.style.ts`

**Step 1: 기존 `.bottomArea` 정의 (211-219 라인) 에 배경 + separator 추가**

```ts
"& .bottomArea": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    fontSize: "12px",
    py: "0",
    px: "8",
    backgroundColor: "surface.light",
},

"& .bottomArea > span + span::before": {
    content: '"|"',
    px: "8",
    color: "surface.textSubtle",
},
```

(`surface.textSubtle` 토큰 존재는 [`panda.config.ts:211-216`](../../panda.config.ts#L211-L216) 확인됨. 부족하면 단순 `color: "gray.500"` 으로 대체 가능.)

**Step 2: build / test 확인**

Run: `pnpm build && pnpm test`

Expected: 모두 통과. panda 가 새 토큰 사용을 인식하여 CSS 출력에 포함.

**Step 3: 수동 검증**

- [ ] 폴더 창 하단에 회색 띠가 보임 — 윈도우 배경 (`windowChrome.bg`) 보다 약간 진하다
- [ ] 폴더 항목 선택 시 두 텍스트 사이에 `|` 가 표시됨 (CSS 로 그려진 것; JSX 에 텍스트 `"|"` 없음)
- [ ] DOC 창 하단도 동일한 회색 띠로 보임 (텍스트는 없음)
- [ ] Image 창 하단의 회색 띠도 어색하지 않음 (기존 동작 보존, 색만 추가)

**Step 4: 커밋**

```bash
git add src/features/window-shell/ProgramComponent.style.ts
git commit -m "style(window-shell): bottomArea 배경을 surface.light 로 지정하고 span separator CSS 추가"
```

#### Phase D 회고

- **잘된 점**: 사전 확인 (ImageProgram bottomArea / `surface.light` / `surface.textSubtle` 토큰 / 211-219 라인 내용) 을 회고 피드백 루프대로 먼저 수행해 plan 의 가정과 실제가 일치함을 확인하고 진행. panda 빌드 산출물에서 새 CSS 두 줄 (`background-color: var(--colors-surface-light)`, `content: "|"; color: var(--colors-surface-text-subtle)`) 을 직접 grep 으로 검증해 토큰 적용을 자동 확인.
- **개선할 점**: 시각 효과 자체가 본질인 phase 라 brower 수동 검증이 진짜 완료 기준이지만, 본 세션에서는 dev 서버를 띄우지 않고 panda 출력 검증으로 대체. 사용자 검증이 필요한 항목으로 분리 보고함.
- **검증**: `pnpm build` (2.36s, 모듈 579 변환), `pnpm test` 21 파일 / 136 케이스 모두 PASS, panda 산출물 CSS 에 `background-color: var(--colors-surface-light)` 및 `content: "|"; color: var(--colors-surface-text-subtle)` 출력 확인.

---

## 성공 기준 (Definition of Done) — 전체

설계 문서의 DoD 와 동일. 본 plan 의 모든 Phase 가 완료되면 다음을 만족한다:

### 기능
- [ ] 폴더 창 하단에 회색 띠와 "N개 항목" 텍스트가 항상 표시됨.
- [ ] 항목 클릭 시 " | M개 항목 선택함" 부분이 추가됨 (텍스트 "|" 가 아닌 CSS).
- [ ] 좌측 화살표 / 다른 폴더 진입 시 선택이 해제되어 두 번째 부분 사라짐.
- [ ] DOC 창, Image 창의 하단도 동일한 회색 띠로 보임.
- [ ] 단일 선택 시각 동작 (`folder_selected` 클래스) 회귀 없음.

### 기술 부채 비-증가
- [x] eslint / typecheck / vitest 모두 통과. (`pnpm exec tsc --noEmit` 통과, `pnpm test` 21 파일 / 136 케이스 PASS, `pnpm build` 성공.)
- [x] 기존 `FolderProgram.test.tsx` 의 모든 케이스 변경 없이 통과. (Phase A~D 동안 해당 파일은 한 줄도 수정되지 않았으며 모든 케이스 PASS 유지.)
- [x] `selectedIds` 인터페이스 변경이 `program-folder` 외부에 새 의존을 만들지 않음. (변경된 파일은 `useFolderNavigation`, `FolderGrid`, `FolderProgram`, `FolderStatusBar`, `DOCProgram`, `ProgramComponent.style` 로 한정. `selectedIds` 는 `program-folder` feature 내부에서만 흐른다.)

---

## 프로젝트 회고

- **잘된 점**:
  - **Phase 분리가 의존 그래프를 그대로 따랐다**. A (배열 통일) → B (TDD 컴포넌트) → C (통합) → D (CSS) 순서가 각 phase 의 산출물이 다음 phase 의 입력이 되는 구조였고, 회귀 위험을 phase 단위로 격리했다.
  - **TDD 가 자기 사양 역할**. Phase B 의 4 케이스 (선택 없음 / 단일 선택 / 빈 폴더 / 다중 선택) 가 컴포넌트의 사양 자체로, GREEN 단계 구현을 군더더기 없이 만들었다.
  - **panda 토큰 적용을 빌드 산출물에서 검증**. CSS 가 실제 출력에 들어갔는지 grep 으로 직접 확인해 "panda 가 인식했다" 가 추측이 아닌 사실로 확정.
  - **회고 피드백 루프 시범 적용 효과**. Task 회고의 "다음 task 에 적용할 것" 을 의식적으로 다음 task 시작에서 반영 (예: Phase D 사전 확인 3종) 해 가정과 실제 사이의 갭을 사전에 발견.
- **개선할 점**:
  - **시각 효과 자체가 본질인 phase 의 수동 검증 미수행**. Phase D 는 dev 서버를 띄워 실제 색감/separator 가 의도대로 보이는지 확인하는 게 진짜 완료 기준이지만, 본 세션에서는 panda 출력 검증으로 대체. 사용자에게 시각 검증을 위임함.
  - **plan 체크리스트 갱신 vs 커밋 단위 분리 정책 부재**. plan 문서를 매 task 마다 갱신했는데, 이걸 별도 커밋으로 묶을지 / 마지막에 한 번에 묶을지 / unstaged 로 둘지 일관된 규칙이 없었다. 다음 plan 부터는 시작 시점에 정해두면 좋다.
- **향후 과제**:
  - **다중 선택 UX**: `selectedIds: ProgramId[]` 가 길이 0/1 외에 N 도 자연스럽게 표현하도록 만들어졌다. Ctrl/Shift-클릭 다중 선택 도입 시 status bar 인터페이스는 변경 없이 자연 확장 가능.
  - **separator span 기반 구조 검증의 깨짐 가능성**: `FolderStatusBar.test.tsx` 의 `container.querySelectorAll("span").length` 가 향후 status bar 가 개수 외의 정보 (선택 항목 종류, 경로 등) 를 추가할 때 깨질 수 있다. 그 시점에 의미 기반 검증 (`getByText` 만) 으로 단순화 권장.
  - **`bottomArea` 의 의미적 역할**: 현재 회색 띠는 모든 프로그램 창에 일관되지만, 빈 슬롯이 의미적으로 무엇인지 (status / 푸터 / 액션 영역) 가 정의되지 않았다. 후속 프로그램 (예: 설정 창) 이 등장하면 슬롯의 의미를 명문화할 가치가 있다.
