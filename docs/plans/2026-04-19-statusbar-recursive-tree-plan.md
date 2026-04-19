# StatusBar 재귀 트리 렌더링 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** `selectStatusBarViewModel` 의 폴더 이름 하드코딩을 제거하고, 시작 메뉴 센터/기술스택 영역을 재귀 DFS flat+depth 기반 렌더로 전환한다.

**Architecture:** 셀렉터는 `"내컴퓨터"`, `"기술스택"` 2개 이름만 루트 exclude 로 고정하고, 나머지 루트 직계 폴더를 DFS 로 순회해 `{ id, name, icon, type, depth }` 평탄 배열을 반환. 뷰 레이어는 이 배열을 map 순회하며 `type`/`depth` 로 렌더 분기. 기술스택 영역은 flat 리스트를 FOLDER 경계로 그룹핑해 기존 "헤더 + flex-wrap 그리드" 레이아웃 유지.

**Tech Stack:** React 18 + TypeScript, Zustand(store), Panda CSS(styled-system), Jest + React Testing Library.

**기반 문서:**
- 설계: [`docs/plans/2026-04-19-statusbar-recursive-tree-design.md`](2026-04-19-statusbar-recursive-tree-design.md)
- 플랜 작성 규약: [`docs/rules/plan-writing-guide.md`](../rules/plan-writing-guide.md)
- 커밋 규약: [`docs/rules/commit-convention.md`](../rules/commit-convention.md)

**전체 성공 기준(DoD):** 설계 문서 §성공 기준 참조. 본 플랜의 모든 Phase 가 완료되면 DoD 전 항목이 자동 충족된다.

---

## Phase 1 — JSON 기술스택 폴더명 한글화

### 입력
- 브랜치 `refactor/statusbar-recursive-tree` 체크아웃 상태
- 설계 문서 커밋됨(`327799e`)

### 작업 내용
- [x] `refactor(data): 기술스택 서브폴더명 MAIN_TECH/SUB_TECH → 사용자향 한글로 교체`

**파일 수정:** [src/data/portfolio.json](../../src/data/portfolio.json)

```diff
-                        "name": "MAIN_TECH",
+                        "name": "주로 사용하는 기술 스택",
```
```diff
-                        "name": "SUB_TECH",
+                        "name": "사용해본적은 있는 기술",
```

두 서브폴더의 `name` 필드만 교체. 하위 `IMAGE` 노드들은 건드리지 않는다.

### 검증
- `pnpm exec tsc --noEmit` → 에러 없음
- `pnpm test -- --watchAll=false` → 전체 통과 (특히 `portfolio.test.ts` round-trip)
- `pnpm build` → 성공

### 완료 조건
- JSON 의 두 폴더명이 한글 라벨로 변경됨
- 기존 테스트 전수 통과 (round-trip 은 새 이름으로도 문제없음)
- 이 시점에서는 **UI 가 깨진 상태로 보일 수 있음** — `selectStatusBarViewModel` 이 아직 `MAIN_TECH`/`SUB_TECH` 이름을 참조하므로 기술스택 영역이 비어 보일 수 있다. Phase 3 까지 가서야 완전 복구된다. 예상된 중간 상태이며, `tsc`/테스트는 통과한다.

### 수동 검증
이 Phase 만으로는 UI 복구가 일어나지 않으므로 수동 검증 없음. Phase 3 에서 한꺼번에 수행.

### Phase 회고
<!-- Phase 1 완료 후 기록 -->

---

## Phase 2 — CenterAreaBox 에 `depth` prop 추가

### 입력
- Phase 1 완료

### 작업 내용
- [x] `refactor(statusbar): CenterAreaBox 에 depth prop 추가 — 들여쓰기+폰트 차등`

**파일 수정:** [src/features/statusbar/components/CenterAreaBox.tsx](../../src/features/statusbar/components/CenterAreaBox.tsx)

**변경 포인트:**

1. `CenterAreaBoxProps` 에 옵셔널 필드 `depth?: number` 추가 (기본값 0)
2. 스타일을 `css()` 고정 객체가 아닌 **함수형**으로 전환하거나, 인라인 style 로 `paddingLeft`/`fontWeight`/`fontSize` 주입
3. depth 별 시각 차등:
   - depth 0: `paddingLeft: 4px`, `fontWeight: 700`, `fontSize: 14px`
   - depth 1: `paddingLeft: 16px`, `fontWeight: 600`, `fontSize: 13px`
   - depth ≥ 2: `paddingLeft: 4 + depth * 12`px, `fontWeight: lighter`, `fontSize: 14px` (기존 값)

**구현 예시:**

```tsx
const centerAreaBoxBlockStyle = css({
  width: "100%",
  height: "50px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "5px",
  boxSizing: "border-box",
  "& img": { width: "25px", height: "25px" },
  "& .text": {
    color: "shell.text",
    cursor: "default",
  },
});

type CenterAreaBoxProps = {
    parentId?: ProgramId;
    img: string | null;
    name: string;
    showImg?: boolean;
    depth?: number;
    onClick?: (id: ProgramId) => void;
};

const CenterAreaBox = ({
    parentId, img, name, showImg = true, depth = 0, onClick,
}: CenterAreaBoxProps) => {
    const indentPx = 4 + depth * 12;
    const fontWeight = depth === 0 ? 700 : depth === 1 ? 600 : 300;
    const fontSize = depth === 1 ? 13 : 14;

    return (
        <div
            className={`statusBox ${centerAreaBoxBlockStyle}`}
            style={{ paddingLeft: `${indentPx}px` }}
            onClick={() => { if (parentId) onClick?.(parentId); }}
        >
            {showImg && <img src={img ? img : defaultImg} alt="name" />}
            <div className="text" style={{ fontWeight, fontSize }}>{name}</div>
        </div>
    );
};
```

> **Why 인라인 `style` 혼용?** Panda CSS 는 정적 추출 방식이라 `depth * 12` 같은 런타임 계산을 토큰으로 쉽게 표현하기 어렵다. depth 가 유한한 정수라 `styled-system` 의 `cva` 로 variant 를 정의할 수도 있으나, 이번 스코프에선 간결성을 위해 인라인 style 병용을 채택한다.

4. 기존 호출부는 `depth` 를 주지 않아도 기본값 0 으로 동작하므로 **기존 렌더링이 시각적으로 동일하게 유지**됨 (prop 하위 호환)

### 검증
- `pnpm exec tsc --noEmit` → 에러 없음
- `pnpm test -- --watchAll=false` → 전체 통과 (기존 depth 없는 호출부 그대로 동작)
- `pnpm build` → 성공

### 완료 조건
- `CenterAreaBox` 가 옵셔널 `depth` prop 을 받고, depth 별로 들여쓰기·폰트가 차등됨
- 기존 `StatusBar.tsx` 의 호출부(Phase 3 에서 교체 예정)는 아직 depth 를 주지 않아도 동일 렌더 유지
- 신규 호출부가 depth 를 주면 차등 스타일 적용

### 수동 검증
이 시점에서도 UI 복구는 안 되었으므로 수동 확인은 Phase 3 에서 일괄.

### Phase 회고
<!-- Phase 2 완료 후 기록 -->

---

## Phase 3 — 셀렉터 & 뷰 재귀 구조 전면 전환 (atomic)

### 입력
- Phase 1, 2 완료

### 작업 내용
- [x] `refactor(statusbar): 셀렉터+뷰+파사드를 재귀 DFS flat+depth 로 전면 전환 (단위 테스트 동반)`

> **왜 atomic 단일 커밋인가?** 셀렉터의 반환 타입이 `techStackMain`/`techStackSub` → `techStack` 으로 변경되면서 호출부(StatusBar.tsx 파사드/뷰) 도 같이 고쳐야 tsc 가 통과한다. 하나의 논리 단위(데이터 컨트랙트 교체) 라 한 커밋에 묶는다. 기존 필드와 병행 유지(adapter/deprecation) 는 backward-compat 장식이라 프로젝트 방침상 지양.

#### 파일별 변경

**3-1. [src/shared/lib/file-system/selectors/selectStatusBarViewModel.ts](../../src/shared/lib/file-system/selectors/selectStatusBarViewModel.ts) — 전면 재작성**

```ts
import type { FileSystemState, ProgramId, ProgramNode, ProgramType } from "@shared/types/program";
import { resolveAsset } from "@shared/lib/assetManifest";

export interface StatusBarTreeItem {
    id: ProgramId;
    name: string;
    icon: string;
    type: ProgramType;
    depth: number;
}

export interface StatusBarViewModel {
    projects: Array<StatusBarTreeItem>;
    techStack: Array<StatusBarTreeItem>;
    myComputerId: ProgramId | null;
}

const MY_COMPUTER_NAME = "내컴퓨터";
const TECH_STACK_NAME = "기술스택";
const PROJECT_ROOT_EXCLUDE: ReadonlySet<string> = new Set([
    MY_COMPUTER_NAME,
    TECH_STACK_NAME,
]);

function findChildIdByName(
    fs: FileSystemState,
    parentId: ProgramId,
    name: string,
): ProgramId | null {
    const children = fs.childrenByParent[parentId] ?? [];
    for (const cid of children) {
        if (fs.nodes[cid]?.name === name) return cid;
    }
    return null;
}

function dfs(
    fs: FileSystemState,
    startId: ProgramId,
    startDepth: number,
    out: Array<StatusBarTreeItem>,
    includeStart: boolean,
): void {
    const node = fs.nodes[startId];
    if (!node) return;
    if (includeStart) {
        out.push(toItem(node, startDepth));
    }
    const childDepth = includeStart ? startDepth + 1 : startDepth;
    const childIds = fs.childrenByParent[startId] ?? [];
    for (const cid of childIds) {
        dfs(fs, cid, childDepth, out, true);
    }
}

function toItem(node: ProgramNode, depth: number): StatusBarTreeItem {
    return {
        id: node.id,
        name: node.name,
        icon: resolveAsset(node.icon) ?? "",
        type: node.type,
        depth,
    };
}

export function selectStatusBarViewModel(fs: FileSystemState): StatusBarViewModel {
    if (!fs.rootId) {
        return { projects: [], techStack: [], myComputerId: null };
    }
    const rootChildren = fs.childrenByParent[fs.rootId] ?? [];

    const projects: Array<StatusBarTreeItem> = [];
    for (const cid of rootChildren) {
        const node = fs.nodes[cid];
        if (!node) continue;
        if (node.type !== "FOLDER") continue;
        if (PROJECT_ROOT_EXCLUDE.has(node.name)) continue;
        dfs(fs, cid, 0, projects, true);
    }

    const techStack: Array<StatusBarTreeItem> = [];
    const techStackId = findChildIdByName(fs, fs.rootId, TECH_STACK_NAME);
    if (techStackId) {
        dfs(fs, techStackId, 0, techStack, false);
    }

    const myComputerId = findChildIdByName(fs, fs.rootId, MY_COMPUTER_NAME);

    return { projects, techStack, myComputerId };
}
```

**3-2. [src/shared/lib/file-system/__tests__/selectStatusBarViewModel.test.ts](../../src/shared/lib/file-system/__tests__/selectStatusBarViewModel.test.ts) — 신규**

신규 파일. 다음 테스트 케이스를 포함:

1. **projects: 루트 직계에서 `내컴퓨터`/`기술스택` 제외** — INFO 노드도 자동 제외됨 (type !== "FOLDER")
2. **projects: DFS 순서 평탄화 + depth 값 정확성** — `현직 (d0) / 와탭랩스 (d1) / DOC_A (d2) / DOC_B (d2) / 경력 (d0) / 아라온 (d1) / DOC_C (d2)` 순서
3. **projects: 회귀 방어 케이스** — 카테고리 폴더 이름을 임의(`현직 → 직장`, `아라온소프트 → 아라온`) 로 바꾼 픽스처에서도 동일 개수 반환
4. **techStack: `기술스택` 폴더 하위만 반환, 시작 노드 자체는 제외**
5. **techStack: 서브폴더명이 한글이든 영문이든 내용이 동일** — 이름 의존성 없음 검증
6. **myComputerId: `내컴퓨터` 노드 id 반환**
7. **엣지: rootId 가 빈 문자열** — `{ projects: [], techStack: [], myComputerId: null }`
8. **엣지: 루트 자식이 전부 exclude 대상** — `projects: []`

테스트 픽스처는 `buildFileSystem(schema)` 로 생성 (기존 `selectDesktopRootIcons.test.ts` 패턴 참조).

**3-3. [src/features/statusbar/components/StatusBar.tsx](../../src/features/statusbar/components/StatusBar.tsx) — 뷰 렌더 재작성**

- `StatusBarViewProps.projectDatas: Array<StatusBarViewItem>` → `projectDatas: Array<StatusBarTreeItem>`
- `techStack_main`/`techStack_sub` prop 2개를 `techStack: Array<StatusBarTreeItem>` 1개로 통합
- 센터 영역 렌더: `projects.map(...)` 로 평탄 순회, 각 아이템을 `CenterAreaBox` 하나로 렌더(`depth`/`showImg` 는 type 에 따라). **"parentName 이 바뀌면 헤더 삽입" 로직은 완전히 제거** — 이미 FOLDER 자체가 DFS 에서 들어와 있으므로 별도 헤더 삽입 불필요.
- 우측 영역 렌더: `groupTechStack(techStack)` 헬퍼로 `Array<{ title: string; items: Array<StatusBarTreeItem> }>` 로 묶은 뒤, 섹션별로 `.rightArea_title` 헤더 + `.rightArea_boxArea` 그리드 렌더

**센터 영역 구현:**

```tsx
<div className={active ? "statusBarBoxArea centerArea show_animation" : "statusBarBoxArea centerArea"}>
    {projectDatas.map((item) => (
        <CenterAreaBox
            key={item.id}
            parentId={item.id}
            img={item.icon}
            name={item.name}
            depth={item.depth}
            showImg={item.type !== "FOLDER"}
            onClick={onClickBox}
        />
    ))}
</div>
```

**우측 영역 구현:**

```tsx
function groupTechStack(
    items: Array<StatusBarTreeItem>,
): Array<{ title: string; items: Array<StatusBarTreeItem> }> {
    const sections: Array<{ title: string; items: Array<StatusBarTreeItem> }> = [];
    for (const it of items) {
        if (it.type === "FOLDER") {
            sections.push({ title: it.name, items: [] });
        } else if (sections.length > 0) {
            sections[sections.length - 1].items.push(it);
        }
    }
    return sections;
}
```

```tsx
const techStackSections = useMemo(() => groupTechStack(techStack), [techStack]);

<div className={active ? "statusBarBoxArea rightArea show_animation" : "statusBarBoxArea rightArea"}>
    {techStackSections.map((section) => (
        <Fragment key={section.title}>
            <div className="rightArea_title"><p>{section.title}</p></div>
            <div className="rightArea_boxArea">
                {section.items.map((item) => (
                    <RightAreaBox
                        key={item.id}
                        parentId={item.id}
                        img={item.icon}
                        name={item.name}
                        onClick={onClickBox}
                    />
                ))}
            </div>
        </Fragment>
    ))}
</div>
```

> `useMemo` import 추가 필요. `Fragment` 는 `React.Fragment` 대신 named import.

**기존 import 정리:** `StatusBarViewItem` 미사용 시 제거, `StatusBarTreeItem` import 추가.

**3-4. [src/features/statusbar/StatusBar.tsx](../../src/features/statusbar/StatusBar.tsx) — 파사드 prop 매핑 교체**

```tsx
<StatusBarView
    active={active}
    activeLeftArea_Detail={activeLeftArea_Detail}
    statusBar_LeftArea_Items={STATUSBAR_LEFT_AREA_ITEMS}
    projectDatas={viewModel.projects}
    techStack={viewModel.techStack}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClickBox={handleClickBox}
    onClickLeftArea={handleClickLeftArea}
    onLogout={onLogout}
/>
```

`techStack_main`/`techStack_sub` → `techStack` 1개로 단일화.

**3-5. [src/pages/DesktopPage/shells/StatusBarShell.tsx](../../src/pages/DesktopPage/shells/StatusBarShell.tsx) — 영향 없음**

Shell 은 `viewModel` 을 그대로 prop 으로 넘길 뿐이라 코드 변경 없음. viewModel 타입만 자동으로 바뀐 타입 따라감.

### 검증
- `pnpm exec tsc --noEmit` → 에러 없음
- `pnpm test -- --watchAll=false` → 전체 통과, 신규 selector 테스트 포함
- `pnpm build` → 성공
- `pnpm start` → 개발 서버 띄워 수동 검증 (아래)

### 완료 조건
- 셀렉터가 flat+depth+재귀 DFS 구조로 동작하고, `techStackMain`/`techStackSub` 필드가 사라짐
- StatusBar 센터 영역에 프로젝트 카테고리 + 회사/학교 폴더 + DOC 이 들여쓰기되어 보임
- StatusBar 기술스택 영역이 기존과 시각적으로 동일하게 렌더됨
- 신규 셀렉터 단위 테스트 전수 통과

### 수동 검증

아래 체크리스트를 모두 통과해야 Phase 3 완료:

- [ ] `pnpm start` 실행 → 로그인 → 시작 버튼 클릭해 시작 메뉴 펼침
- [ ] **센터 영역 — 카테고리**: `현직` / `경력` / `대학교` 3개가 depth 0 (볼드, 14px, 들여쓰기 최소) 로 보인다
- [ ] **센터 영역 — 소속 폴더**: `와탭랩스` / `아라온소프트` / `셈틀꾼` / `컴퓨터공학과 학생회` 4개가 depth 1 (세미볼드, 13px, 중간 들여쓰기) 로 보인다
- [ ] **센터 영역 — DOC**: 12개 DOC 이 depth 2 로 아이콘+텍스트 박스로 보인다
- [ ] **센터 영역 — 클릭**: DOC 클릭 시 해당 프로그램 창이 열린다 (폴더 클릭은 동작 없음이 기본)
- [ ] **센터 영역 — 구분 가독성 평가**: depth 간 구분이 충분하다. 불충분하다면 본 문서 "시각 조정" 절로 이동해 추가 장치 결정
- [ ] **기술스택 영역 — 헤더**: `주로 사용하는 기술 스택` / `사용해본적은 있는 기술` 2개 헤더가 기존과 동일하게 보인다
- [ ] **기술스택 영역 — 그리드**: 각 섹션 아래 아이콘들이 3열 flex-wrap 그리드로 기존과 동일 렌더
- [ ] **기술스택 영역 — 클릭**: 아이콘 클릭 시 기존과 동일한 동작 (프로그램 열기)
- [ ] **좌측 영역**: 소개/로그아웃 동작 기존 그대로 유지 (비기능 회귀 없음)

### 시각 조정 (조건부)

위 "구분 가독성 평가" 가 불충분하면 다음 추가 장치 중 택일하여 적용한 뒤 다시 수동 검증:

- 최상위 카테고리(depth 0) 상단에 여백 추가 (`marginTop: 8px`, 단 첫 번째는 제외)
- depth 0 헤더에 하단 보더 또는 배경 미세 차등
- depth 1 헤더 좌측에 `│` 같은 트리 가이드 문자 추가

조정 적용 시 별도 후속 커밋으로 기록: `refactor(statusbar): 센터 영역 depth 구분 시각 장치 추가`

### Phase 회고
<!-- Phase 3 완료 후 기록 -->

---

## Phase 4 — 최종 통합 검증

### 입력
- Phase 1–3 완료, 각 Phase 의 수동 검증 통과

### 작업 내용
별도 커밋 없음. 아래 최종 검증만 수행.

### 검증
- [ ] `pnpm test -- --watchAll=false` 최종 통과
- [ ] `pnpm exec tsc --noEmit` 최종 에러 없음
- [ ] `pnpm build` 최종 성공
- [ ] `git log --oneline` 확인: `refactor/statusbar-recursive-tree` 브랜치 위로 다음 커밋이 쌓여 있어야 함
  - 설계 문서 커밋 (이미 완료)
  - Phase 1 JSON 폴더명 변경 커밋
  - Phase 2 CenterAreaBox depth prop 커밋
  - Phase 3 셀렉터+뷰 전환 커밋 (시각 조정 시 추가 커밋 1건 이내)
- [ ] 설계 문서 §성공 기준의 체크박스 전 항목이 실제 충족되는지 문서에서 교차 확인

### 완료 조건
설계 문서의 Definition of Done 전 항목이 검증되고, 브랜치가 PR 로 올릴 준비가 됨.

### 다음 단계(참고)
- PR 생성은 `worker-create-pr` 스킬로 진행 (메모리 지침: phase 단위 PR 금지, 작업 전체 완료 후 1개 PR)
- 후속 과제(이번 스코프 밖):
  - 폴더 접기/펼치기(D-2) 또는 폴더 창 열기(D-3) 가 필요하면 별도 설계
  - JSON `role` 메타 필드 도입 고려 시 별도 설계

---

## 프로젝트 회고
<!-- 모든 Phase 완료 후 기록 -->

### 잘된 점

### 개선할 점

### 향후 과제
