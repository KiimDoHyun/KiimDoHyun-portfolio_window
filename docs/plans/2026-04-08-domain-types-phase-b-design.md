# Domain Types Phase B — Design

- 작성일: 2026-04-08
- 선행: [Phase A plan](2026-04-08-domain-types-phase-a.md), [전체 설계](2026-04-08-domain-types-and-store-design.md)
- 범위: Recoil 완전 제거 + `DesktopDataContext` 제거 + 전 feature를 새 도메인 타입(`ProgramNode` / `RunningProgram` / id 기반)으로 마이그레이션

---

## 1. 목표

Phase A가 깔아놓은 `fileSystemStore` / `ProgramNode` / `PortfolioSchema` 위에, 실제 앱 동작을 얹는다. 끝나면:

- Recoil 의존성 0 (`pnpm list recoil` 빈결과), `<RecoilRoot>` 및 React 19 polyfill 삭제
- `DesktopDataContext` / `useDesktopData` / `SetDirectory` / `@shared/lib/data.ts`의 `directory` 배열 / 낡은 `DirectoryItem`·`WindowShellItem`·`TaskbarProgramItem` 타입 전부 삭제
- 식별자는 **name이 아닌 `ProgramId`** 로 통일
- `portfolio.json` 시드가 실제 앱 부트에 사용됨
- 기존 기능(창 열기/최소화/활성화/닫기, 바탕화면/폴더/이미지 네비게이션, 태스크바 토글, 시계) 모두 동일하게 동작

**비목표 (Phase C)**: 우클릭 CRUD UI, persist, export JSON 다운로드, `projectReulst` 오타 수정.

---

## 2. 전략 — "어댑터 경유 후 시그니처 교체"

현재 feature들은 Recoil atom을 직접 참조하지 않지만(`hidden-icon` 하나 예외), `useDesktopData()` / `DesktopDataContext` / `DirectoryItem` 타입에는 깊게 의존한다. 이 **Context 경계**를 축으로 3단계로 나눈다.

### B-1. Store 구축 + 어댑터 경유 교체 (feature 무손상)

새 store들을 만들고, `DesktopPage`를 Recoil에서 끊어낸다. 단, `useDesktopData` **시그니처는 유지**하고 내부만 새 store 위에서 재구현한다. feature 코드는 한 줄도 바뀌지 않으며 기존 feature 테스트도 그대로 그린.

### B-2. feature 단위 시그니처 교체 (TDD)

feature를 하나씩 새 타입으로 이주. 각 feature는 독립 커밋이며, 실패 테스트 → 구현 → 그린 → 커밋 순서. 안 건드린 feature는 어댑터가 계속 받쳐준다.

### B-3. 어댑터 및 잔여물 제거

마지막 feature가 이주되면 어댑터·낡은 타입·Recoil·polyfill을 한꺼번에 털어낸다.

---

## 3. 신규 Store & 모듈

### 3.1 `runningProgramsStore` (신규, Zustand + immer)

```ts
interface RunningProgramsState {
    byId: Record<ProgramId, RunningProgram>;
    order: Array<ProgramId>;        // 열린 순서 (Taskbar 표시 순서)
    activeId: ProgramId | null;
    zIndexCounter: number;
}

interface RunningProgramsActions {
    open: (id: ProgramId) => void;          // 이미 열려있으면 active로, min이면 restore
    close: (id: ProgramId) => void;
    closeAll: () => void;                   // 전부 min (현재 handleClickCloseAll 동작 보존)
    activate: (id: ProgramId) => void;
    minimize: (id: ProgramId) => void;
    toggleFromTaskbar: (id: ProgramId) => void; // 현재 handleClickTaskIcon 로직
    requestZIndex: () => number;
}
```

`fileSystemStore`와 별도 store인 이유: persist 수명이 다르다. fileSystem은 Phase C에서 persist 대상이지만 running은 세션 한정.

### 3.2 `uiStore` (신규, Zustand)

```ts
interface UiState {
    statusBarOpen: boolean;
    timeBarOpen: boolean;
    infoBarOpen: boolean;
    hiddenIconOpen: boolean;
    previewActive: boolean;
    displayLight: number;
}
// 토글 액션 + closeAllMenus() + setDisplayLight()
```

taskbar 메뉴 상호배제 로직(한 메뉴 열면 다른 건 닫힘)은 액션 안으로 흡수한다. 현재 `DesktopPage`의 `handleClickStartIcon` 등 5개 핸들러가 그대로 액션 하나로 매핑.

### 3.3 `getRoute(state, id)` 순수 함수

`src/shared/lib/file-system/getRoute.ts`. `childrenByParent` 역색인 또는 `parentId` 체인을 따라 올라가며 `"/ A / B / C"` 형태 문자열 생성. 현재 `SetDirectory.tsx`의 DFS를 대체. 단위 테스트 포함.

### 3.4 `useCurrentTime()` 훅

`src/shared/lib/hooks/useCurrentTime.ts`. 내부 `setInterval(1000)`, `{ year, month, day, date, hour, min, sec, timeline }` 반환. `rc_global_year/month/...` 8개 atom 전부 대체.

---

## 4. 어댑터 레이어 (B-1 한정, B-3에서 제거)

`useDesktopData()` 시그니처 유지:

```ts
interface DesktopDataValue {
    directory: Array<DirectoryItem>;       // 파생 — nodes에서 name/type/icon/parent/route 채워 생성
    directoryTree: DirectoryTree;          // 파생 — Record<parentName, children[]>
    openProgram: (item: DirectoryItem) => void;
}
```

내부 구현:

- `directory` / `directoryTree` — `useFileSystemStore`의 `nodes` / `childrenByParent` 셀렉터에서 파생. `route`는 `getRoute()` 호출.
- `openProgram(item)` — `nodes`를 순회하며 `n.name === item.name` 로 노드 찾기 → `runningProgramsStore.open(node.id)`. 동일 name 중복 케이스는 현재 코드에서도 이미 깨지므로 비목표.

이 매핑은 **B-1 임시 규약**이며, B-2에서 feature가 id 기반으로 교체될 때마다 해당 경로가 하나씩 사라지고, B-3에서 파일 자체가 삭제된다.

---

## 5. 데이터 부트스트랩

`src/index.tsx`:

```ts
import portfolio from "@/data/portfolio.json";
useFileSystemStore.getState().hydrate(portfolio as PortfolioSchema);
```

`<App/>` 렌더 전 1회. `DesktopPage`/`SetDirectory`의 `useEffect` 기반 초기화는 제거.

---

## 6. Task 순서 (요약)

### B-1 — Store + 어댑터 (8 task)

1. `runningProgramsStore` + 테스트
2. `uiStore` + 테스트
3. `getRoute` 순수 함수 + 테스트
4. `useCurrentTime` 훅 + 테스트
5. `index.tsx`에 seed hydrate 추가 (`<RecoilRoot>` 유지)
6. `useDesktopData` 내부를 새 store 위 어댑터로 재구현 (시그니처 불변, 기존 `useDesktopData` 테스트 그대로 통과 확인)
7. `DesktopPage`를 Recoil → 새 store로 전환, `SetDirectory` 제거, `rc_global_Directory_*` / `rc_program_*` atom 파일 삭제
8. 풀 테스트 + typecheck 그린 확인 (feature 무변경 가드)

### B-2 — feature 시그니처 교체 (7 task, 각 TDD)

9. `program-folder` → `ProgramNode` / id 기반 (hook·컴포넌트·테스트)
10. `program-image` → `ProgramNode` / id 기반
11. `desktop` (`DesktopWindow`, `Window`, `IconBox`) → `ProgramNode` / id 기반
12. `statusbar` → `ProgramNode` / id 기반
13. `taskbar` → `RunningProgram` + `ProgramNode`, `TaskbarProgramItem` 제거
14. `window-shell` → id 기반 props, `WindowShellItem` 제거
15. `hidden-icon` Recoil 제거 (마지막 Recoil 직접 참조)

### B-3 — 잔여물 제거 (5 task)

16. taskbar UI 토글 소비처(`StatusBar`/`TimeBar`/`InfoBar`/`HiddenIcon`/`TaskBar`)를 `uiStore`로 전환, `rc_taskbar_*` + `rc_global_DisplayLight` 제거
17. 시간 atom 소비처를 `useCurrentTime`으로 전환, `rc_global_year/month/day/date/hour/min/sec/timeline` 제거
18. 어댑터 및 낡은 타입 삭제: `DesktopDataContext.tsx`, `useDesktopData.ts`, `@shared/lib/data.ts`의 `directory` export, feature `*.types.ts`에 남은 낡은 타입
19. `index.tsx`에서 `<RecoilRoot>` + React 19 polyfill 제거, `pnpm remove recoil`
20. 최종 가드: `grep` 으로 `recoil|DesktopDataContext|DirectoryItem|WindowShellItem|TaskbarProgramItem` 0건, typecheck, 전체 테스트

---

## 7. 파일 배치 (신규/수정 요약)

```
src/
├─ store/
│  ├─ fileSystemStore.ts           (Phase A, 변경 없음)
│  ├─ runningProgramsStore.ts      ← 신규
│  └─ uiStore.ts                   ← 신규
├─ shared/lib/
│  ├─ file-system/getRoute.ts      ← 신규
│  └─ hooks/useCurrentTime.ts      ← 신규
└─ index.tsx                       ← hydrate 추가 (B-1), RecoilRoot/polyfill 제거 (B-3)
```

삭제 대상(B-3 완료 시점):

```
src/pages/DesktopPage/DesktopDataContext.tsx
src/pages/DesktopPage/useDesktopData.ts
src/pages/DesktopPage/SetDirectory.tsx
src/store/global.ts
src/store/program.ts
src/store/taskbar.ts
src/shared/lib/data.ts (directory export만; projectDatas는 유지 여부 확인 필요)
src/features/window-shell/WindowShell.types.ts 의 WindowShellItem
src/features/taskbar/TaskBar.types.ts 의 TaskbarProgramItem, ProgramStatus, ProgramType (새 타입으로 대체)
```

---

## 8. 검증 기준

- `pnpm tsc --noEmit` 통과
- 전체 테스트 그린 (Phase A + B에서 추가된 모든 테스트 포함)
- `grep -r "recoil" src/` 0건
- `grep -r "DesktopDataContext\|useDesktopData\|DirectoryItem\|WindowShellItem\|TaskbarProgramItem" src/` 0건
- `grep -r "rc_global_\|rc_program_\|rc_taskbar_" src/` 0건
- 수동 smoke: 앱 부트 → 바탕화면 아이콘 클릭으로 창 열림 → 최소화/복원/닫기 → 태스크바 미리보기 hover → 시작/시간/정보/숨겨진 아이콘 메뉴 토글 → 폴더/이미지 네비게이션 모두 동작
- `package.json` 에서 `recoil` 제거됨

---

## 9. 리스크 & 완화

| 리스크 | 완화 |
|---|---|
| B-2 도중 이주된 feature와 미이주 feature가 공존 | 어댑터가 양쪽 규약 동시 지원. 각 feature 커밋마다 풀 테스트로 그린 유지. |
| 동일 `name` 중복으로 어댑터 매핑 깨짐 | 현재 코드에서도 이미 깨지는 케이스. 비목표로 명시. |
| `portfolio.json` 과 기존 `data.ts` 의 `directory` 내용 미스매치 | B-1 T5 전에 round-trip 비교 테스트 추가 (`buildFileSystem(portfolio)` 결과가 기존 `directory`와 동일 노드 집합을 생성하는지). |
| Recoil 제거 후 `StrictMode` 등 부작용 노출 | 현재 `index.tsx`는 `StrictMode` 비활성. B-3 이후에도 유지. |
| taskbar 메뉴 상호배제 로직 회귀 | `uiStore` 액션 단위 테스트에서 "한 메뉴 open 시 나머지 false" 검증. |

---

## 10. 후속 (Phase C 예고)

- 우클릭 컨텍스트 메뉴 UI (`fileSystemStore`의 `addNode/updateNode/deleteNode/renameNode/moveNode` 사용)
- `persist` 미들웨어 활성화 (`fileSystemStore` 한정)
- `exportSchema()` 기반 JSON 다운로드
- `projectReulst` 오타 수정 + `ResumeData` 실제 스키마 확정 + INFO 프로그램 본문 구현
