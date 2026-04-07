# Stage 2: pages/ 신설 + program-folder 리팩토링 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task.

**Goal:** `pages/DesktopPage` 슬라이스를 신설하고, `DesktopDataContext`를 통해 전역 상태를 features에 주입하는 패턴을 확립한다. `program-folder` feature를 새 패턴으로 리팩토링하여 Recoil 직접 의존을 제거한다.

**Architecture:**
- `pages/DesktopPage` 신설 — Recoil 접근의 유일한 layer
- `DesktopDataContext` (pages 내부) — features에 directory/tree/openProgram을 React Context로 주입 (props drilling 회피, 동적 윈도우 시스템 호환)
- features는 `useDesktopData()` 훅으로 소비, Recoil 절대 import 안 함
- `FolderProgram` = 단일 컴포넌트 + `useFolderNavigation` 훅 + `ui/` 서브컴포넌트 + 분리된 types/style

**Tech Stack:** React 19, TypeScript, Recoil, Jest, RTL, Panda CSS

**참조:**
- [설계 문서](./2026-04-07-refactor-global-state-boundary-design.md)
- [Stage 0+1 plan](./2026-04-07-refactor-stage-0-1-program-doc.md)
- [docs/rules/](../rules/README.md) — 모든 작업은 컨벤션 준수

---

## 사전 정보 (필수 숙지)

### 현재 구조
- [src/features/desktop/DesktopPage.tsx](../../src/features/desktop/DesktopPage.tsx) — 현재 desktop "page". taskbar 관련 4개 atom의 set만 사용 (실제로는 미사용).
- [src/features/desktop/WindowContainer.tsx](../../src/features/desktop/WindowContainer.tsx) — `programList`, `Directory_Tree` 구독 + `useActiveProgram()` 호출. **이것도 사실상 page 로직이지만, Stage 2 범위에선 건드리지 않는다** (큰 변경은 Stage 5 window-shell에서). 단, Recoil 접근은 그대로 둔다.
- [src/features/program-folder/FolderProgramContainer.tsx](../../src/features/program-folder/FolderProgramContainer.tsx) — `Directory_List`, `Directory_Tree` 구독 + `useActiveProgram` 호출 + 6 useState + navigation 로직.
- [src/features/program-folder/FolderProgramComponent.tsx](../../src/features/program-folder/FolderProgramComponent.tsx) — UI + 두 개의 css(...) 블록 (`headerStyle`, `contentStyle`).
- [src/features/window-shell/ProgramComponent.tsx:14, 128](../../src/features/window-shell/ProgramComponent.tsx#L14-L128) — `<FolderProgramContainer type={item.type} name={item.name} />` 형태로 호출.

### Recoil 의존 정리
| 대상 | 어디서 사용 | Stage 2 처리 |
|---|---|---|
| `rc_global_Directory_List` | FolderProgramContainer | → context로 끌어올림 |
| `rc_global_Directory_Tree` | FolderProgramContainer, WindowContainer | → FolderProgram은 context로, WindowContainer는 그대로 |
| `useActiveProgram` (3 atom + dynamic import) | FolderProgramContainer, WindowContainer | → context의 `openProgram` 콜백으로 추상화 |

### 핵심 결정: Context 사용
- 동적 윈도우 시스템(ProgramContainer 안에서 FolderProgram 마운트) 때문에 props drilling 불가
- `pages/DesktopPage`에서 `DesktopDataContext.Provider`로 데이터/콜백 주입
- features는 `useDesktopData()` 훅으로 소비
- 컨벤션 위반 아님 — context는 store가 아니라 React 표준 DI

### 컨벤션 (반드시 준수)
- `Array<T>` 표기, `T[]` 금지
- `React.FC` 금지 → `({}: Props)` 구조분해
- `.tsx`엔 컴포넌트 로직만, 타입/스타일/서브컴포넌트 분리
- feature는 `index.ts`만 외부 노출
- features는 Recoil 절대 import 금지 (테스트 파일도 마찬가지)

---

## Task 1: pages/ 디렉토리 + DesktopPage 슬라이스 신설

**Files:**
- Create: `src/pages/DesktopPage/DesktopPage.tsx` (현재 `src/features/desktop/DesktopPage.tsx`를 이동/복사)
- Create: `src/pages/DesktopPage/index.ts`
- Modify: `src/app/...` 또는 라우터 / 진입점에서 import 교체 (현재 import 위치를 grep으로 찾을 것)
- Delete (Task 끝): `src/features/desktop/DesktopPage.tsx`

> **참고:** `src/features/desktop/`의 다른 파일들(WindowContainer, components/Window 등)은 그대로 둔다. Stage 5에서 정리.

**Step 1: 현재 DesktopPage 호출처 확인**

Run: `Grep "from.*features/desktop/DesktopPage\|features/desktop\"" --type tsx --type ts`
또는: `Grep "DesktopPage" --type tsx --type ts`

호출처가 어디인지 (보통 `src/app/` 라우터) 메모.

**Step 2: pages/DesktopPage/DesktopPage.tsx 생성**

기존 `src/features/desktop/DesktopPage.tsx` 내용을 복사. 단:
- `import WindowContainer from "./WindowContainer";` → `import WindowContainer from "@features/desktop/WindowContainer";`
- 그 외 import 그대로 유지 (Stage 2에선 내부 변경 안 함)
- 컨벤션: `React.FC` 안 쓰는 함수 선언 그대로 유지 (이미 `export default function DesktopPage()` 형태)

**Step 3: pages/DesktopPage/index.ts 생성**

```ts
export { default as DesktopPage } from "./DesktopPage";
```

**Step 4: 호출처 import 교체**

Step 1에서 찾은 파일에서:
```ts
// Before
import DesktopPage from "@features/desktop/DesktopPage";
// After
import { DesktopPage } from "@pages/DesktopPage";
```

**Step 5: tsconfig path alias `@pages/*` 추가 (없는 경우)**

`tsconfig.json` / `craco.config.js` / `panda.config.ts` 모두 확인 후 필요시 alias 추가.
- tsconfig.json `paths`에 `"@pages/*": ["pages/*"]`
- craco config (webpack alias)도 동일하게
- jest moduleNameMapper에 `"^@pages/(.*)$": "<rootDir>/src/pages/$1"` 추가 (package.json)

**Step 6: 구 파일 삭제**

```bash
git rm src/features/desktop/DesktopPage.tsx
```

**Step 7: 검증**

- `pnpm build` — 성공
- `pnpm start` 후 dev server에서 화면 정상 확인 (수동) — 필수는 아니지만 권장

**Step 8: 커밋**

```bash
git add -A
git commit -m "refactor: move DesktopPage to pages/ slice"
```

---

## Task 2: DesktopDataContext + useDesktopData 훅 생성

**Files:**
- Create: `src/pages/DesktopPage/DesktopDataContext.tsx`
- Create: `src/pages/DesktopPage/useDesktopData.ts`

**Step 1: 타입 정의 + Context 생성**

```tsx
// src/pages/DesktopPage/DesktopDataContext.tsx
import { createContext } from "react";

export interface DirectoryItem {
    name: string;
    type: string;
    icon: string;
    parent: string;
    route?: string;
}

export type DirectoryTree = Record<string, Array<DirectoryItem>>;

export interface DesktopDataValue {
    directory: Array<DirectoryItem>;
    directoryTree: DirectoryTree;
    openProgram: (item: DirectoryItem) => void;
}

export const DesktopDataContext = createContext<DesktopDataValue | null>(null);
```

**Step 2: 훅 생성**

```ts
// src/pages/DesktopPage/useDesktopData.ts
import { useContext } from "react";
import { DesktopDataContext, DesktopDataValue } from "./DesktopDataContext";

export const useDesktopData = (): DesktopDataValue => {
    const ctx = useContext(DesktopDataContext);
    if (!ctx) {
        throw new Error("useDesktopData must be used within DesktopDataContext.Provider");
    }
    return ctx;
};
```

**Step 3: 검증**

`pnpm build` — 성공 (아직 사용처 없음)

**Step 4: 커밋**

```bash
git add src/pages/DesktopPage/DesktopDataContext.tsx src/pages/DesktopPage/useDesktopData.ts
git commit -m "feat(pages): add DesktopDataContext for global state injection"
```

---

## Task 3: DesktopPage에서 Provider로 감싸기

**Files:**
- Modify: `src/pages/DesktopPage/DesktopPage.tsx`

**Step 1: DesktopPage에서 Recoil 읽기 + Provider 적용**

```tsx
// src/pages/DesktopPage/DesktopPage.tsx (관련 부분)
import { useRecoilValue } from "recoil";
import {
    rc_global_Directory_List,
    rc_global_Directory_Tree,
} from "@store/global";
import useActiveProgram from "@features/window-shell/useActiveProgram";
import { DesktopDataContext, DesktopDataValue, DirectoryItem, DirectoryTree } from "./DesktopDataContext";
import { useMemo } from "react";

// ... 기존 코드 유지

export default function DesktopPage() {
    // 기존 setActive_* 4개 useSetRecoilState 그대로 유지

    const directory = useRecoilValue(rc_global_Directory_List) as Array<DirectoryItem>;
    const directoryTree = useRecoilValue(rc_global_Directory_Tree) as DirectoryTree;
    const openProgram = useActiveProgram();

    const desktopData = useMemo<DesktopDataValue>(
        () => ({ directory, directoryTree, openProgram }),
        [directory, directoryTree, openProgram]
    );

    return (
        <DesktopDataContext.Provider value={desktopData}>
            <div className={mainPageStyle} ...>
                {/* 기존 JSX 그대로 */}
            </div>
        </DesktopDataContext.Provider>
    );
}
```

**Step 2: 검증**

- `pnpm build` — 성공
- dev server 수동 확인 — 동작 변화 없음 (아직 소비자 없음)

**Step 3: 커밋**

```bash
git add src/pages/DesktopPage/DesktopPage.tsx
git commit -m "feat(pages): wrap DesktopPage with DesktopDataContext provider"
```

---

## Task 4: FolderProgram characterization tests 작성

**Files:**
- Create: `src/features/program-folder/__tests__/FolderProgramContainer.test.tsx`

**Step 1: 현재 동작 파악**

`FolderProgramContainer` 읽고 다음 시나리오 식별:
1. 초기 렌더 — `currentFolder.route`가 input에 표시됨, `folderContents`가 그리드에 표시됨
2. 폴더 아이템 클릭 → `folder_selected` 클래스 부여
3. 폴더 아이템 더블클릭 → `folderContents` 변경 (해당 폴더의 자식)
4. 뒤로가기 클릭 → 부모 폴더의 contents 표시
5. displayType 변경 → 그리드 className 변경
6. 빈 폴더 → "비어있습니다." 표시

**Step 2: 테스트 작성 (RecoilRoot로 wrap, 미니멀)**

`FolderProgramContainer`는 Recoil을 직접 사용하므로 테스트도 RecoilRoot가 필요. 테스트 내에서 atom 초기값을 주입.

```tsx
// src/features/program-folder/__tests__/FolderProgramContainer.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RecoilRoot } from "recoil";
import {
    rc_global_Directory_List,
    rc_global_Directory_Tree,
} from "@store/global";
import FolderProgramContainer from "../FolderProgramContainer";

const mockDirectory = [
    { name: "프로젝트", type: "FOLDER", icon: "", parent: "root", route: "/ KDH / 프로젝트" },
    { name: "(주)아라온소프트", type: "FOLDER", icon: "", parent: "프로젝트", route: "/ KDH / 프로젝트 / (주)아라온소프트" },
];

const mockTree: Record<string, Array<any>> = {
    프로젝트: [
        { name: "(주)아라온소프트", type: "FOLDER", icon: "", parent: "프로젝트" },
    ],
    "(주)아라온소프트": [
        { name: "셈플DOC", type: "DOC", icon: "", parent: "(주)아라온소프트" },
    ],
};

const renderWithRecoil = (ui: React.ReactElement) =>
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(rc_global_Directory_List, mockDirectory);
                snap.set(rc_global_Directory_Tree, mockTree);
            }}
        >
            {ui}
        </RecoilRoot>
    );

describe("FolderProgramContainer (characterization)", () => {
    it("초기 폴더의 자식 항목들을 렌더한다", () => {
        renderWithRecoil(<FolderProgramContainer name="프로젝트" type="FOLDER" />);
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("아이템 클릭 시 selected 상태가 된다", () => {
        renderWithRecoil(<FolderProgramContainer name="프로젝트" type="FOLDER" />);
        const item = screen.getByText("(주)아라온소프트").closest(".folder");
        fireEvent.click(item!);
        expect(item).toHaveClass("folder_selected");
    });

    it("폴더 더블클릭 시 해당 폴더로 진입한다", () => {
        renderWithRecoil(<FolderProgramContainer name="프로젝트" type="FOLDER" />);
        const item = screen.getByText("(주)아라온소프트").closest(".folder")!;
        fireEvent.doubleClick(item);
        // (주)아라온소프트의 자식인 셈플DOC 표시
        expect(screen.getByText("셈플DOC")).toBeInTheDocument();
    });

    it("뒤로가기 클릭 시 부모 폴더로 이동한다", () => {
        renderWithRecoil(<FolderProgramContainer name="(주)아라온소프트" type="FOLDER" />);
        // 시작: 셈플DOC 표시
        expect(screen.getByText("셈플DOC")).toBeInTheDocument();
        const back = screen.getByAltText("leftArrow");
        fireEvent.click(back);
        // 부모인 프로젝트의 자식 = (주)아라온소프트
        expect(screen.getByText("(주)아라온소프트")).toBeInTheDocument();
    });

    it("표시 방식 select 변경 시 className이 갱신된다", () => {
        const { container } = renderWithRecoil(
            <FolderProgramContainer name="프로젝트" type="FOLDER" />
        );
        const select = container.querySelector("select")!;
        fireEvent.change(select, { target: { value: "BIG_ICON" } });
        expect(container.querySelector(".BIG_ICON.contentsArea_folder")).toBeInTheDocument();
    });

    it("빈 폴더는 '비어있습니다.'를 표시한다", () => {
        renderWithRecoil(<FolderProgramContainer name="없는폴더" type="FOLDER" />);
        expect(screen.getByText("비어있습니다.")).toBeInTheDocument();
    });
});
```

**주의:** `useActiveProgram` 호출이 있으나 더블클릭 테스트에서 폴더만 더블클릭하므로 호출 안 됨. DOC/IMAGE 더블클릭 테스트는 의도적으로 빠짐 (Recoil-heavy, Stage 2 범위 밖).

**Step 3: 실행**

Run: `pnpm test --watchAll=false src/features/program-folder`

테스트가 실패하면:
- `closest(".folder")` 가 null이면 selector 조정
- mock 데이터 형태가 실제와 다르면 수정
- 텍스트가 split되면 매처 변경

**모든 테스트 그린이 될 때까지 반복.** FAIL인 채 다음 task로 넘어가지 말 것.

**Step 4: 커밋**

```bash
git add src/features/program-folder/__tests__/FolderProgramContainer.test.tsx
git commit -m "test: add characterization tests for FolderProgramContainer"
```

---

## Task 5: useFolderNavigation 훅 추출

**Files:**
- Create: `src/features/program-folder/hooks/useFolderNavigation.ts`

**Step 1: 훅 작성**

`FolderProgramContainer`의 6개 useState + 콜백을 훅으로 추출. **Recoil/context 모름.** 입력은 props로만.

```ts
// src/features/program-folder/hooks/useFolderNavigation.ts
import { useState, useCallback } from "react";
import type { DirectoryItem, DirectoryTree } from "@pages/DesktopPage/DesktopDataContext";

export interface UseFolderNavigationParams {
    initialFolderName: string;
    directory: Array<DirectoryItem>;
    directoryTree: DirectoryTree;
    onOpenProgram: (item: DirectoryItem) => void;
}

export const useFolderNavigation = ({
    initialFolderName,
    directory,
    directoryTree,
    onOpenProgram,
}: UseFolderNavigationParams) => {
    const [selectedItem, setSelectedItem] = useState("");
    const [folderContents, setFolderContents] = useState<Array<DirectoryItem>>(
        directoryTree[initialFolderName] || []
    );
    const [currentFolder, setCurrentFolder] = useState<Partial<DirectoryItem>>(
        directory.find((item) => item.name === initialFolderName) ?? {}
    );

    const onClickItem = useCallback((name: string) => {
        setSelectedItem(name);
    }, []);

    const onClickLeft = useCallback(() => {
        if (!currentFolder.parent) return;
        setFolderContents(directoryTree[currentFolder.parent] ?? []);
        if (currentFolder.parent === "KDH") {
            setCurrentFolder({ route: "/ KDH" });
        } else {
            setCurrentFolder(
                directory.find((item) => item.name === currentFolder.parent) ?? {}
            );
        }
    }, [currentFolder, directory, directoryTree]);

    const onDoubleClickItem = useCallback(
        (clickedItem: DirectoryItem) => {
            if (clickedItem.type === "FOLDER") {
                setCurrentFolder(
                    directory.find((item) => item.name === clickedItem.name) ?? {}
                );
                setFolderContents(directoryTree[clickedItem.name] ?? []);
            } else {
                onOpenProgram(clickedItem);
            }
        },
        [directory, directoryTree, onOpenProgram]
    );

    return {
        selectedItem,
        folderContents,
        currentFolder,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    };
};
```

**Step 2: 검증**

`pnpm build` — 성공.

**Step 3: 커밋**

```bash
git add src/features/program-folder/hooks/useFolderNavigation.ts
git commit -m "feat(program-folder): extract useFolderNavigation hook"
```

---

## Task 6: types/style/ui 분리 + 새 FolderProgram.tsx 작성

**Files:**
- Create: `src/features/program-folder/FolderProgram.types.ts`
- Create: `src/features/program-folder/FolderProgram.style.ts`
- Create: `src/features/program-folder/ui/FolderHeader.tsx`
- Create: `src/features/program-folder/ui/FolderGrid.tsx`
- Create: `src/features/program-folder/FolderProgram.tsx`

**Step 1: types**

```ts
// src/features/program-folder/FolderProgram.types.ts
export interface DisplayOption {
    value: string;
    name: string;
}

export const DISPLAY_LIST: Array<DisplayOption> = [
    { value: "BIG_BIG_ICON", name: "아주 큰 아이콘" },
    { value: "BIG_ICON", name: "큰 아이콘" },
    { value: "MEDIUM_ICON", name: "보통 아이콘" },
    { value: "SMALL_ICON", name: "작은 아이콘" },
    { value: "DETAIL", name: "자세히" },
];

export const DEFAULT_DISPLAY_TYPE = DISPLAY_LIST[2].value;
```

**Step 2: style**

`headerStyle` + `contentStyle` 두 개의 `css(...)` 블록을 그대로 옮김:
```ts
// src/features/program-folder/FolderProgram.style.ts
import { css } from "@styled-system/css";

export const headerStyle = css({ /* 기존 그대로 */ });
export const contentStyle = css({ /* 기존 그대로 */ });
```

**Step 3: ui/FolderHeader.tsx**

```tsx
// src/features/program-folder/ui/FolderHeader.tsx
import leftArrow from "@images/icons/left-arrow.png";
import { headerStyle } from "../FolderProgram.style";
import type { DisplayOption } from "../FolderProgram.types";

interface FolderHeaderProps {
    type: string;
    route: string;
    displayType: string;
    displayList: Array<DisplayOption>;
    onClickLeft: () => void;
    onChangeDisplayType: (value: string) => void;
}

const FolderHeader = ({
    type,
    route,
    displayType,
    displayList,
    onClickLeft,
    onChangeDisplayType,
}: FolderHeaderProps) => (
    <div className={`headerArea2 headerArea2_${type} ${headerStyle}`}>
        <div className="arrowBox">
            <img src={leftArrow} alt="leftArrow" onClick={onClickLeft} />
        </div>
        <div className="routeBox">
            <input value={route} readOnly />
        </div>
        <div className="selectDisplayType">
            <select
                value={displayType}
                onChange={(e) => onChangeDisplayType(e.target.value)}
            >
                {displayList.map((item, idx) => (
                    <option key={idx} value={item.value}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default FolderHeader;
```

**Step 4: ui/FolderGrid.tsx**

```tsx
// src/features/program-folder/ui/FolderGrid.tsx
import folderFull from "@images/icons/folder_full.png";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import { contentStyle } from "../FolderProgram.style";
import type { DirectoryItem, DirectoryTree } from "@pages/DesktopPage/DesktopDataContext";

interface FolderGridProps {
    items: Array<DirectoryItem>;
    directoryTree: DirectoryTree;
    displayType: string;
    selectedItem: string;
    onClickItem: (name: string) => void;
    onDoubleClickItem: (item: DirectoryItem) => void;
}

const FolderGrid = ({
    items,
    directoryTree,
    displayType,
    selectedItem,
    onClickItem,
    onDoubleClickItem,
}: FolderGridProps) => (
    <div className={`contentsArea_Cover ${contentStyle}`}>
        <div className="sideFolderArea"></div>
        <div className={`${displayType} contentsArea_folder`}>
            {items && items.length > 0 ? (
                <>
                    {displayType === "DETAIL" && (
                        <div className="detailHeader">
                            <div className="name">이미지</div>
                            <div className="name">이름</div>
                            <div className="name">유형</div>
                        </div>
                    )}
                    {items.map((item, idx) => (
                        <div
                            className={
                                selectedItem === item.name
                                    ? "folder folder_selected"
                                    : "folder"
                            }
                            key={idx}
                            onClick={() => onClickItem(item.name)}
                            onDoubleClick={() => onDoubleClickItem(item)}
                        >
                            <div className="imgCover">
                                {item.type === "FOLDER" ? (
                                    <img
                                        src={
                                            directoryTree[item.name] &&
                                            directoryTree[item.name].length > 0
                                                ? folderFull
                                                : folderEmpty
                                        }
                                        alt="folderEmpty"
                                    />
                                ) : (
                                    <img
                                        src={item.icon || defaultImage}
                                        alt={item.name}
                                    />
                                )}
                            </div>
                            <div className="name">{item.name}</div>
                            {displayType === "DETAIL" && (
                                <div className="name">{item.type}</div>
                            )}
                        </div>
                    ))}
                </>
            ) : (
                <div className="noContents">비어있습니다.</div>
            )}
        </div>
    </div>
);

export default FolderGrid;
```

**Step 5: FolderProgram.tsx (메인, 얇게)**

```tsx
// src/features/program-folder/FolderProgram.tsx
import { useState } from "react";
import { useDesktopData } from "@pages/DesktopPage/useDesktopData";
import { useFolderNavigation } from "./hooks/useFolderNavigation";
import { DISPLAY_LIST, DEFAULT_DISPLAY_TYPE } from "./FolderProgram.types";
import FolderHeader from "./ui/FolderHeader";
import FolderGrid from "./ui/FolderGrid";

interface FolderProgramProps {
    type: string;
    name: string;
}

const FolderProgram = ({ type, name }: FolderProgramProps) => {
    const { directory, directoryTree, openProgram } = useDesktopData();
    const [displayType, setDisplayType] = useState(DEFAULT_DISPLAY_TYPE);

    const {
        selectedItem,
        folderContents,
        currentFolder,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    } = useFolderNavigation({
        initialFolderName: name,
        directory,
        directoryTree,
        onOpenProgram: openProgram,
    });

    return (
        <>
            <FolderHeader
                type={type}
                route={currentFolder.route || "/ [error]"}
                displayType={displayType}
                displayList={DISPLAY_LIST}
                onClickLeft={onClickLeft}
                onChangeDisplayType={setDisplayType}
            />
            <FolderGrid
                items={folderContents}
                directoryTree={directoryTree}
                displayType={displayType}
                selectedItem={selectedItem}
                onClickItem={onClickItem}
                onDoubleClickItem={onDoubleClickItem}
            />
        </>
    );
};

export default FolderProgram;
```

**Step 6: 검증**

`pnpm build` — 성공.

**Step 7: 커밋**

```bash
git add src/features/program-folder/FolderProgram.tsx \
        src/features/program-folder/FolderProgram.style.ts \
        src/features/program-folder/FolderProgram.types.ts \
        src/features/program-folder/ui/
git commit -m "feat(program-folder): add unified FolderProgram with split structure"
```

---

## Task 7: 호출처 교체 + 테스트 마이그레이션

**Files:**
- Modify: `src/features/program-folder/index.ts`
- Modify: `src/features/window-shell/ProgramComponent.tsx`
- Rename: `src/features/program-folder/__tests__/FolderProgramContainer.test.tsx` → `FolderProgram.test.tsx`

**Step 1: index.ts 정리**

```ts
// src/features/program-folder/index.ts
export { default as FolderProgram } from "./FolderProgram";
```

**Step 2: ProgramComponent.tsx 교체**

[src/features/window-shell/ProgramComponent.tsx:14](../../src/features/window-shell/ProgramComponent.tsx#L14):
```tsx
// Before
import FolderProgramContainer from "@features/program-folder/FolderProgramContainer";
// After
import { FolderProgram } from "@features/program-folder";
```

[src/features/window-shell/ProgramComponent.tsx:128](../../src/features/window-shell/ProgramComponent.tsx#L128):
```tsx
// Before
{item.type === "FOLDER" && (
    <FolderProgramContainer type={item.type} name={item.name} />
)}
// After
{item.type === "FOLDER" && (
    <FolderProgram type={item.type} name={item.name} />
)}
```

**Step 3: 테스트 파일 마이그레이션**

```bash
git mv src/features/program-folder/__tests__/FolderProgramContainer.test.tsx \
       src/features/program-folder/__tests__/FolderProgram.test.tsx
```

테스트 내용을 새 컴포넌트에 맞게 수정:
- Import: `import FolderProgram from "../FolderProgram";`
- `<FolderProgramContainer ... />` → `<FolderProgram ... />`
- **RecoilRoot 제거하고 DesktopDataContext.Provider로 교체** (이게 핵심 — features 테스트는 Recoil 모름):

```tsx
import { DesktopDataContext } from "@pages/DesktopPage/DesktopDataContext";

const noopOpen = jest.fn();

const renderWithDesktopData = (ui: React.ReactElement) =>
    render(
        <DesktopDataContext.Provider
            value={{
                directory: mockDirectory,
                directoryTree: mockTree,
                openProgram: noopOpen,
            }}
        >
            {ui}
        </DesktopDataContext.Provider>
    );

// 모든 renderWithRecoil → renderWithDesktopData
```

**Step 4: 검증**

- `pnpm test --watchAll=false src/features/program-folder` — 6/6 PASS (동작 보존 증명!)
- `pnpm build` — 성공
- dev server 수동 확인 — 폴더 동작 정상

**Step 5: 커밋**

```bash
git add -A
git commit -m "refactor(program-folder): switch callers to FolderProgram and migrate tests to context"
```

---

## Task 8: 레거시 파일 삭제

**Files:**
- Delete: `src/features/program-folder/FolderProgramContainer.tsx`
- Delete: `src/features/program-folder/FolderProgramComponent.tsx`

**Step 1: 잔존 참조 확인**

Run: `Grep "FolderProgramContainer|FolderProgramComponent" --type tsx --type ts`

소스 파일 매치는 0이어야 함. 매치 있으면 STOP.

**Step 2: 삭제 + 검증**

```bash
git rm src/features/program-folder/FolderProgramContainer.tsx \
       src/features/program-folder/FolderProgramComponent.tsx
pnpm test --watchAll=false
pnpm build
```

**Step 3: 커밋**

```bash
git commit -m "refactor(program-folder): remove legacy Container/Component files"
```

---

## Stage 2 완료 기준

- [x] `src/pages/DesktopPage/` 슬라이스 존재 (DesktopPage, DesktopDataContext, useDesktopData)
- [x] `src/features/desktop/DesktopPage.tsx` 삭제됨
- [x] `program-folder` 폴더에 새 구조 (FolderProgram.tsx, .style.ts, .types.ts, hooks/, ui/)
- [x] 레거시 Container/Component 삭제됨
- [x] `FolderProgram` 내부에 Recoil import 없음 (`useDesktopData` 훅으로만 데이터 소비)
- [x] characterization 테스트 6/6 그린 (RecoilRoot 없이 Context Provider만 사용)
- [x] `pnpm build` 성공
- [x] dev server에서 폴더 진입/뒤로가기/디스플레이 변경/파일 더블클릭 정상 동작

## 알려진 미해결 사항 (다음 Stage에서 처리)

1. **`WindowContainer.tsx`도 여전히 Recoil 사용 중** — Stage 5(`window-shell`) 작업에서 처리. Stage 2 범위 밖.
2. **`useActiveProgram` 훅 자체가 features/window-shell 안에 있음** — pages/로 옮기는 게 이상적. Stage 5에서 이전.
3. **`DesktopDataContext`를 다른 feature가 사용** — Stage 3(`program-image`)에서 같은 context 활용 예정. 필드 추가될 수 있음.

## 다음 단계

Stage 3 (`program-image`)는 같은 패턴이지만 useEffect가 더 많고 이미지 인덱스 계산 로직이 큼. Stage 2 완료 후 별도 plan 작성.
