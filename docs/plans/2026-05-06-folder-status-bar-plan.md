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
- [ ] Task A1: `useFolderNavigation` 의 `selectedId` 를 `selectedIds: ProgramId[]` 배열로 변경
- [ ] Task A2: `FolderGrid` 가 `selectedIds` prop 을 받도록 수정 (includes 비교)
- [ ] Task A3: `FolderProgram` 의 분해/전달을 `selectedIds` 로 갱신

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

(Phase 완료 시 작성)

---

## Phase B — `FolderStatusBar` 컴포넌트 신설 (TDD)

**입력:** Phase A 완료. `selectedIds` 인터페이스 사용 가능.

**완료 조건:**
- `FolderStatusBar.tsx` 가 props (`totalCount`, `selectedCount`) 만 받는 표시 컴포넌트로 존재한다.
- 단위 테스트 4 케이스 (선택 없음 / 단일 선택 / 빈 폴더 / 다중 선택) 가 모두 통과한다.
- 컴포넌트는 외부 상태/훅 접근 없이 렌더한다.

**작업 내용 (커밋 1:1):**
- [ ] Task B1: `FolderStatusBar.test.tsx` 단위 테스트 작성 (실패 상태로 시작)
- [ ] Task B2: `FolderStatusBar.tsx` 최소 구현으로 테스트 통과

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

(Phase 완료 시 작성)

---

## Phase C — `FolderProgram` 에서 `<FolderStatusBar>` 렌더 + `DOCProgram` 빈 슬롯

**입력:** Phase A, B 완료.

**완료 조건:**
- 폴더 창 하단에 status bar 텍스트가 표시된다.
- 항목 클릭/해제에 따라 두 번째 부분이 정확히 추가/사라진다 (수동 검증).
- DOC 창 하단도 빈 `bottomArea` 가 렌더된다 (Phase D 의 회색 띠가 적용되면 일관되게 보인다).
- `pnpm typecheck`, `pnpm test` 통과.

**작업 내용 (커밋 1:1):**
- [ ] Task C1: `FolderProgram` 에 `<FolderStatusBar>` 렌더 추가
- [ ] Task C2: `DOCProgram` 에 빈 `<div className="bottomArea" />` 추가

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

(Phase 완료 시 작성)

---

## Phase D — `.bottomArea` 배경/separator CSS

**입력:** Phase A, B, C 완료.

**완료 조건:**
- `bottomArea` 배경이 `surface.light` (gray.100) 으로 표시되어 윈도우 배경과 시각적으로 구분된다.
- 폴더 창의 두 번째 span 앞에 `|` 가 CSS 로 표시된다 (텍스트 문자가 JSX 에 들어가지 않음).
- 모든 프로그램 창 (Folder/Image/DOC) 의 하단이 동일한 회색 띠로 보인다 (수동 검증).
- `pnpm test`, `pnpm build` 통과.

**작업 내용 (커밋 1:1):**
- [ ] Task D1: `.bottomArea` 배경색을 `surface.light` 로 지정 + separator 스타일 추가

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

(Phase 완료 시 작성)

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
- [ ] eslint / typecheck / vitest 모두 통과.
- [ ] 기존 `FolderProgram.test.tsx` 의 모든 케이스 변경 없이 통과.
- [ ] `selectedIds` 인터페이스 변경이 `program-folder` 외부에 새 의존을 만들지 않음.

---

## 프로젝트 회고

(모든 Phase 완료 후 작성)

- **잘된 점**: (다음에도 유지할 패턴)
- **개선할 점**: (다음에 보완할 사항)
- **향후 과제**: (이 작업에서 파생된 후속 작업, 예: `selectedIds` 다중 선택 UX 도입)
