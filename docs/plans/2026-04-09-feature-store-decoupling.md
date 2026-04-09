# Feature ↔ Store Decoupling Plan

작성일: 2026-04-09
상태: In Progress (Phase 0–4 완료, Phase 5 대기)

---

## 1. 배경 및 목표

### 의도된 아키텍처 (3-레이어: Page → Shell → Feature)

본 프로젝트는 page가 사실상 [DesktopPage](../../src/pages/DesktopPage/DesktopPage.tsx) 하나뿐이고 그 아래 8개 내외의 feature가 매달리는 구조다. 모든 store 구독을 page 하나로 모으면 **DesktopPage가 god component가 된다**(세 store × N feature × 핸들러 조립). 그래서 page와 feature 사이에 **Shell 레이어**를 한 단계 둔다.

- **도메인 타입이 진실의 원천**이며, 전역 store는 이 타입을 담는 그릇.
- **Page = Layout Root**: feature shell들을 어디에 어떤 순서로 배치할지 결정. 정말 page 전체에 걸친 전역 상태(예: `displayLight`, `previewActive`)만 직접 구독.
- **Shell = Composition Adapter**: feature별로 1:1로 존재하는 얇은 어댑터. 해당 feature가 필요한 store 슬라이스만 구독하고, selector를 호출해 view model을 만들고, 핸들러를 wiring해서 View에 props로 주입. **로직(상태/이펙트/조건 분기) 금지, 조립만.**
- **Feature (View) = 순수 부품**: 전역 store/Context를 import하지 않는다. 입력은 도메인 타입 props + 콜백, 출력은 콜백 호출. 같은 props → 같은 동작이 보장된다.

```
DesktopPage (layout root)
   ├─ <FolderProgramShell />        ← fileSystem/runningPrograms 구독
   │      └─ <FolderProgramView />  ← 순수 (props만)
   ├─ <StatusBarShell />
   │      └─ <StatusBarView />
   └─ <DesktopWindowShell />
          └─ <DesktopWindowView />
```

> **선행 사례 / 명명의 출처**
> 이 3-레이어 구조는 본 프로젝트가 처음 발명한 것이 아니라 이미 검증된 패턴이다.
> - **Container/Presentational pattern** (Dan Abramov, 2015) — "데이터 주입자"와 "순수 표시자"의 분리.
> - **[Feature-Sliced Design (FSD)](https://feature-sliced.design/docs/reference/layers)** — `pages / widgets / features` 7-레이어 방법론. 본 계획의 *Page → Shell → Feature*는 FSD의 *pages → widgets → features* 와 같은 정신을 본 프로젝트 규모에 맞게 3층으로 압축한 형태다. 특히 **Shell ≈ FSD의 widgets**로 보면 책임이 정확히 일치한다.
> - **Zustand container pattern** — feature는 store import 금지, container만 구독한다는 Zustand 생태계의 관행과 동일.

### 이 구조가 주는 것 (= 진짜 목표)
1. **엄격한 단위 테스트**: feature는 props만 주면 동작 → store hydration/mock 없이 input/output 계약만 검증.
2. **회귀 방지망**: 테스트가 "기능 계약"이 되어, 내부 구현(store 종류, state shape)이 바뀌어도 동작이 보장된다.
3. **AI 협업 안전성**: AI에게 feature 수정/추가를 시킬 때 "이 props를 받아 이 콜백을 호출한다 + 기존 테스트를 통과시킨다" 형태의 명확한 명세가 가능하다.
4. **미래 마이그레이션 비용 최소화**: Zustand → 다른 상태관리, SSR 도입, 다른 앱 이식 시 **page + shell 레이어**만 손대면 된다. feature 코드는 한 줄도 안 바뀐다.
5. **Page god component 회피**: 책임을 feature별 shell로 분산하여 DesktopPage가 "레이아웃 결정자"로 얇게 유지된다.

### 현재 상태 (요약)
TS/Panda CSS/Zustand/Feature-first 마이그레이션은 완료되었으나, **전역 store 접근이 page 경계를 넘어 features 곳곳에서 직접 일어나고 있다**. 최근 커밋 `9b05539 chore(lint): allow zustand store imports in features` 에서 lint 룰까지 명시적으로 완화되었다. 즉, 의도된 아키텍처와 현재 코드 사이의 갭이 명시적으로 열려있는 상태.

---

## 2. 현황 점검

### 2.1 전역 Store 인벤토리

| Store | 파일 | 상태 (State) | 액션 (Actions) |
|---|---|---|---|
| `useFileSystemStore` | [src/store/fileSystemStore.ts](../../src/store/fileSystemStore.ts) | `rootId`, `nodes`, `childrenByParent` | `hydrate`, `exportSchema`, `addNode`, `updateNode`, `deleteNode`, `moveNode`, `renameNode` |
| `useRunningProgramsStore` | [src/store/runningProgramsStore.ts](../../src/store/runningProgramsStore.ts) | `byId`, `order`, `activeId`, `zIndexCounter` | `open`, `close`, `closeAll`, `activate`, `minimize`, `toggleFromTaskbar`, `requestZIndex` |
| `useUiStore` | [src/store/uiStore.ts](../../src/store/uiStore.ts) | `statusBarOpen`, `timeBarOpen`, `infoBarOpen`, `hiddenIconOpen`, `previewActive`, `displayLight` | `toggle*`, `closeAllMenus`, `setPreviewActive`, `setDisplayLight` |

### 2.2 Page 레이어
유일한 page: [src/pages/DesktopPage/DesktopPage.tsx](../../src/pages/DesktopPage/DesktopPage.tsx)
- 세 store 모두 적절히 구독하고 핸들러를 만들어 일부 자식(`TaskBar`, `StatusBar`, `InfoBar`, `TimeBar`, `HiddenIcon`, `ProgramWindow`, `DisplayCover`)에 props로 주입 중. **이 부분은 이미 의도대로 동작.**
- 그러나 `<DesktopWindow />`는 props 없이 렌더되어 자체적으로 store를 구독한다 → **page 우회의 시작점**.

### 2.3 위반 인벤토리 (Feature → Store 직접 접근)

| # | 파일 | 사용 store | 사용 패턴 | 영향도 |
|---|---|---|---|---|
| 1 | [src/features/desktop/DesktopWindow.tsx](../../src/features/desktop/DesktopWindow.tsx) | fileSystem, runningPrograms | `rootId`/`nodes`/`childrenByParent` 구독 + `open()` 호출 | **High** — Desktop 진입점, 전체 데스크탑 렌더 |
| 2 | [src/features/program-folder/FolderProgram.tsx](../../src/features/program-folder/FolderProgram.tsx) | fileSystem | `nodes[id]` 구독 (헤더 type 표시용) | High |
| 3 | [src/features/program-folder/hooks/useFolderNavigation.ts](../../src/features/program-folder/hooks/useFolderNavigation.ts) | fileSystem, runningPrograms | 전체 트리 구독 + `open()` 호출 | **High** — 폴더 네비게이션 핵심 로직 |
| 4 | [src/features/program-folder/ui/FolderGrid.tsx](../../src/features/program-folder/ui/FolderGrid.tsx) | fileSystem | `childrenByParent` 구독 (폴더가 비었는지 아이콘 결정용) | Medium |
| 5 | [src/features/program-image/hooks/useImageNavigation.ts](../../src/features/program-image/hooks/useImageNavigation.ts) | fileSystem | 형제 이미지 목록 계산을 위해 전체 트리 구독 | Medium |
| 6 | [src/features/program-doc/DOCProgram.tsx](../../src/features/program-doc/DOCProgram.tsx) | fileSystem | `nodes[id]` 구독 (DOC contents) | Medium |
| 7 | [src/features/statusbar/StatusBar.tsx](../../src/features/statusbar/StatusBar.tsx) | fileSystem, runningPrograms | 이름으로 노드 검색 + `open()` 호출 | **High** — 도메인 결합도 가장 심함 (이름 하드코딩) |
| 8 | [src/features/desktop/__tests__/DesktopWindow.test.tsx](../../src/features/desktop/__tests__/DesktopWindow.test.tsx) | runningPrograms | 테스트에서 store hydrate | (테스트 부채) |
| 9 | [src/features/program-folder/__tests__/FolderProgram.test.tsx](../../src/features/program-folder/__tests__/FolderProgram.test.tsx) | runningPrograms | 테스트에서 store hydrate | (테스트 부채) |

테스트 두 개가 store에 의존한다는 사실 자체가 "feature가 store에 종속되어 있다"는 가장 강한 증거.

### 2.4 Lint 게이트
`9b05539`에서 features → `@store/*` 임포트를 허용하도록 룰 완화. **위 마이그레이션이 끝나면 이 룰을 원복**해 회귀 방지선이 되어야 한다.

---

## 3. 의존도 분석 / 마이그레이션 우선순위

### 3.1 평가 기준
- **(A) 변경 면적**: 풀어내야 할 store 호출 수와 props로 끌어올릴 데이터 양
- **(B) 호출부 영향**: page에서 새로 만들어 주입해야 하는 데이터/콜백의 복잡도
- **(C) 테스트 가치**: 풀고 나서 얻는 단위 테스트 명료도 (= 공이 들어간 만큼 효과가 큰가)
- **(D) 위험도**: 풀다가 회귀가 발생할 가능성

### 3.2 우선순위 추천

| 순서 | 대상 | 이유 |
|---|---|---|
| **1** | `FolderGrid` | 가장 작은 패치. `hasChildren: (id) => boolean`을 prop으로 받으면 끝. 워밍업 + 패턴 확정 용도. |
| **2** | `DOCProgram` | `node.contents` 한 덩어리만 props로 받으면 끝. 분리 후 test도 fixtures만으로 작성 가능. |
| **3** | `useImageNavigation` | store 의존을 "형제 이미지 노드 배열"이라는 input으로 치환. hook 시그니처를 `(images: ProgramNode[], currentId)`로 단순화. |
| **4** | `FolderProgram` + `useFolderNavigation` | 묶음 작업. hook을 "상태 머신"으로 만들어 `(rootSnapshot, initialFolderId, onOpenProgram)`를 받게 한다. 가장 큰 단위지만 풀고 나면 폴더 동작 전체가 순수 테스트 가능. |
| **5** | `DesktopWindow` | DesktopPage에서 `iconBoxArr` + `onOpenProgram`을 만들어 주입. 분리 후 page가 진짜 composition root가 됨. |
| **6** | `StatusBar` | 가장 어렵고 가장 가치 있음. "이름 하드코딩으로 노드 검색"이라는 안티패턴까지 정리해야 함. → page에서 도메인 selector(예: `selectStatusBarSections(fs)`)로 view model을 미리 만들어 주입한다. |
| **7** | 테스트 두 개 (`DesktopWindow.test`, `FolderProgram.test`) | feature가 순수해진 직후 즉시 props 기반으로 재작성. fixtures만 사용. |
| **8** | Lint 룰 원복 | features → `@store/*` 차단. 회귀 방지선 확정. |

### 3.3 공통 패턴 (재사용할 추상화)

각 feature를 풀 때 반복적으로 등장할 형태. 핵심은 **Shell이 구독을 책임지고, View는 props만 받는다**는 분리.

```tsx
// src/pages/DesktopPage/shells/FolderProgramShell.tsx
export function FolderProgramShell({ folderId }: { folderId: NodeId }) {
  // ① 읽기는 반드시 hook 구독 (selector + equality)
  const viewModel = useFileSystemStore(
    (s) => selectFolderViewModel(s, folderId),
    shallow,
  );
  // ② 쓰기 액션은 store에서 stable reference로 뽑아 내려준다
  //    ※ getState()로 만든 핸들러는 stale 위험이 있어 §5 ③ 참고
  const open = useRunningProgramsStore((s) => s.open);

  return <FolderProgramView viewModel={viewModel} onOpenProgram={open} />;
}
```

```tsx
// src/pages/DesktopPage/DesktopPage.tsx (layout root)
<ProgramWindow>
  <FolderProgramShell folderId={activeFolderId} />
</ProgramWindow>
```

```tsx
// src/features/program-folder/FolderProgramView.tsx (순수)
// @store/* import 금지. props와 콜백만.
export function FolderProgramView({ viewModel, onOpenProgram }: Props) { ... }
```

**Shell 호출 경로: `renderProgramContent` 가 중앙 진입점**

모든 프로그램(FOLDER, IMAGE, DOC, BROWSER, INFO)은 [src/pages/DesktopPage/renderProgramContent.tsx](../../src/pages/DesktopPage/renderProgramContent.tsx) 의 switch-case를 통해 렌더된다. 이 함수는 `ProgramWindow`(창 본문)와 `TaskBar`(미리보기 팝업) 양쪽에서 호출되므로, **프로그램을 화면에 띄우는 유일한 통로**다.

각 Phase에서 feature를 분리할 때, 이 switch-case 안에서 feature를 직접 호출하던 것을 Shell 호출로 교체하는 것이 작업의 핵심 패턴이다:

```tsx
// src/pages/DesktopPage/renderProgramContent.tsx
export const renderProgramContent = (node: ProgramNode): ReactNode => {
    switch (node.type) {
        case "FOLDER":
            return <FolderProgramShell id={node.id} />;  // Phase 3
        case "IMAGE":
            return <ImageProgramShell id={node.id} />;   // Phase 2
        case "DOC":
            return <DOCProgramShell id={node.id} />;     // Phase 1 ✅
        case "INFO":
            return <InfoProgram />;
        // ...
    }
};
```

**규칙**
- Shell 파일은 `src/pages/DesktopPage/shells/` 아래 둔다. feature 폴더에 두지 않는다 — feature는 끝까지 순수하게 유지한다.
- Shell 안에는 **selector 호출 + 핸들러 wiring + JSX 조립**만. `useState`, `useEffect`, 조건 분기 금지. 로직이 필요하면 순수 hook으로 뽑아 View가 호출하게 한다.
- **순수 selector 함수**는 `src/shared/lib/file-system/selectors/`에 모은다. store와 무관한 입력(`FileSystemState`)만 받으므로 단위 테스트 100%.
- 읽기와 쓰기를 분리한다: 읽기는 hook 구독, 쓰기 액션은 store에서 함수 reference만 뽑기 (§5 ③).

---

## 4. 단계별 작업 계획

각 단계는 독립 PR/커밋 단위로 쪼갤 수 있도록 설계.

### Phase 0 — 기반 마련 (코드 변경 없음 / 문서·합의)
- [ ] 본 문서 리뷰 및 합의 (특히 3-레이어 구조)
- [ ] 도메인 타입 점검: `ProgramNode`, `RunningProgram`, `FileSystemState` 가 feature에 props로 흘려보내기 적합한지 확인 (이미 phase-b에서 정리됨)
- [ ] Selector 디렉터리 위치 합의: `src/shared/lib/file-system/selectors/` 제안
- [ ] Shell 디렉터리 위치 합의: `src/pages/DesktopPage/shells/` 제안
- [ ] Shell 작성 규칙 합의: "selector 호출 + wiring + JSX만, 로직 금지"

### Phase 1 — 가벼운 분리 (워밍업, 패턴 확정)
- [ ] `FolderGrid`: `hasChildren` prop 추가, store import 제거 (호출부 shell이 prop 주입)
- [ ] `DOCProgramShell` 생성 + `DOCProgram`: `contents` prop으로 받기, store import 제거
- [ ] 두 컴포넌트의 단위 테스트 작성 (fixtures only)

**검증 기준**: 두 컴포넌트가 store 없이 Storybook/테스트에서 렌더 가능. shell 작성 규칙 검증.

### Phase 2 — 중간 분리 (hook 단위)
- [ ] `useImageNavigation` 시그니처 변경: `(images, currentId) → state+handlers`
- [ ] `ImageProgramShell` 생성: 형제 노드 계산을 selector로 묶어 View에 주입
- [ ] `useImageNavigation` 단위 테스트: 순수 입력 → 출력 계약 검증

### Phase 3 — 폴더 도메인 (가장 큰 한 덩어리) ✅
- [x] `selectFolderViewModel(fs, folderId)` selector 작성 + 단위 테스트
- [x] `useFolderNavigation` 리팩터: store 구독 제거, `(fsState, initialFolderId, onOpenProgram)` 입력으로 변경
- [x] `FolderProgram`: store import 제거, props 기반으로 변경 (`fsState`, `initialFolderId`, `onOpenProgram`)
- [x] `FolderProgramShell` 생성: fileSystemStore 구독 + `open` 핸들러 wiring
- [x] `renderProgramContent`가 `<FolderProgramShell id=… />`를 렌더하도록 변경
- [x] `FolderProgram.test.tsx` 재작성: store hydrate 제거, fixtures only (`buildFileSystem` + `jest.fn()`)

### Phase 4 — Desktop 본체 ✅
- [x] `selectDesktopRootIcons(fs)` selector 작성 + 단위 테스트
- [x] `DesktopWindow`: `iconBoxArr` + `onDoubleClickIcon` props로 받기, store import 제거
- [x] `DesktopWindowShell` 생성 + DesktopPage가 shell을 렌더
- [x] `DesktopWindow.test.tsx` 재작성: store hydrate 제거, fixtures only

### Phase 5 — StatusBar (가장 도메인 결합도 높음)
- [ ] 안티패턴 정리: "이름으로 노드 검색" 제거. 데이터 모델에 명시적인 카테고리 키 도입을 검토하거나, shell에서 hard-coded 이름 → id 매핑을 한 곳에 모은다
- [ ] `selectStatusBarViewModel(fs)` selector
- [ ] `StatusBarView`: `viewModel` + `onOpenProgram` props
- [ ] `StatusBarShell` 생성 + DesktopPage가 shell을 렌더

### Phase 6 — 봉인
- [ ] ESLint 룰: `src/features/**` → `@store/*` import 차단. 예외는 `src/pages/**`(shell 포함)만 허용
- [ ] CI에서 lint 통과 확인
- [ ] 본 문서를 "complete"로 마킹하고 회고 추가

---

## 5. 위험과 대응

### 5.1 실제 발생 가능성이 높은 위험

**① View model selector가 매번 새 객체/배열을 반환해 리렌더 폭주 (High)**
- 가장 현실적인 위험. `selectFolderViewModel`이 `children.map(...)` 같은 변환을 매 호출마다 새로 수행하면, store state가 변하지 않아도 page가 리렌더될 때마다 새 reference가 내려가 자식 전체가 리렌더된다.
- 대응:
  - Selector는 순수 함수로 두되, **page에서 구독할 때 `useFileSystemStore(selectFn, shallow)` 또는 `useShallow`로 equality를 강제**한다.
  - 파생 데이터가 무거우면 reselect 스타일의 메모화 selector를 `src/shared/lib/file-system/selectors/`에 둔다.
  - feature에는 `React.memo` + 좁은 props를 기본값으로 적용.

**② 분리 중 회귀를 잡을 안전망이 없다 (High)**
- 현재 feature 테스트는 store hydrate에 의존하는 부채 테스트 두 개뿐(§2.3 #8, #9). 분리 자체가 만들어내는 회귀를 잡을 수단이 사실상 없다.
- 계획서 원안의 "분리 → 즉시 테스트"는 **분리된 이후의 계약**만 검증하므로, 분리 과정의 동작 보존은 보장하지 못한다.
- 대응:
  - 각 Phase 착수 전에 **현재 동작을 고정하는 characterization test**를 먼저 추가한다 (store hydrate를 허용한 채, 기존 DOM/이벤트 결과만 검증).
  - 분리 완료 후 해당 characterization test를 props 기반 단위 테스트로 치환하며 store 의존을 걷어낸다.

**③ 핸들러를 `getState()`로 만들면 구독이 끊긴다 (Medium)**
- `onOpenProgram={() => useRunningProgramsStore.getState().open(id)}` 패턴은 호출 시점의 최신 state는 보지만 **page는 해당 store 변경을 구독하지 않는다**. 결과적으로 UI가 stale해질 수 있다 (예: `activeId` 변경이 TaskBar에 반영되지 않음).
- 대응:
  - "읽기"는 반드시 hook(`useRunningProgramsStore(selector)`)으로 구독.
  - "쓰기 전용" 액션(`open`, `close` 등)만 `getState()` 또는 최초 1회 `useRef`로 고정해 핸들러 identity를 안정화.
  - 이 구분을 §3.3 공통 패턴에 예시로 박아둔다.

**④ Shell 비대화 (Medium)**
- Container/Shell 패턴의 고전적 실패 모드. "조건 한두 개니까 여기 넣자" → 로직이 slipping in → shell이 mini-page가 된다. 이렇게 되면 page를 분산한 의미가 사라진다.
- 대응:
  - Shell 작성 규칙을 §3.3에 명시한 그대로 강제: **selector 호출 + 핸들러 wiring + JSX 조립만**. `useState`, `useEffect`, 조건 분기 금지.
  - 로직이 필요해지면 (a) 순수 hook으로 뽑아 View가 호출하게 하거나, (b) selector 단으로 밀어넣는다.
  - 코드 리뷰/AI 협업 시 "shell 파일에서 hook이 `useXxxStore` 외에 등장하면 경고" 정도의 휴리스틱을 둔다.

### 5.2 실재하지만 범위 blow-up 리스크

**⑤ StatusBar "이름 하드코딩"이 도메인 모델까지 침투 (Medium)**
- 동작이 깨지는 위험이라기보다 **Phase 5가 "디커플링" 범위를 넘어 스키마 변경까지 번질 위험**이다.
- 대응: 원안대로 Phase 5 착수 전 별도 분석 노트를 쓰고, 필요 시 schema에 카테고리 키를 추가하는 phase를 선행. 본 계획의 목표(= store 접근의 page 집중화)와 스키마 개선을 섞지 않는다.

### 5.3 과대평가되었던 항목

**⑥ Selector useMemo 의존성 부정확으로 인한 리렌더 폭주 (Low)**
- 실제로는 useMemo 의존성보다 selector의 reference equality(①)가 본질이다. 본 프로젝트 규모에서는 성능 이슈로 체감되기 어렵다. ①에 흡수되어 별도 리스크로 관리할 필요 없음.

---

## 6. 성공 기준 (Definition of Done)

- [ ] `src/features/**` 어디에서도 `@store/*` import가 존재하지 않는다 (lint로 강제)
- [ ] 모든 feature 테스트가 store hydration 없이 fixtures만으로 통과한다
- [ ] store 접근은 `src/pages/**`(DesktopPage + shells) 안에서만 일어난다
- [ ] 각 feature의 props 시그니처가 그 feature의 "계약"으로 읽힌다
- [ ] DesktopPage.tsx는 "shell 배치"에 가까운 얇은 파일로 유지된다 (god component 아님)
- [ ] 모든 shell 파일이 §3.3 규칙을 만족한다 (selector + wiring + JSX만, 로직 없음)
- [ ] 향후 Zustand를 다른 라이브러리로 교체할 경우, `src/pages/**` 외의 파일은 단 한 줄도 수정할 필요가 없다

