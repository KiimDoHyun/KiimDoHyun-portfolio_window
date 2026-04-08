# 도메인 타입 공통화 & 정규화 스토어 설계

- 작성일: 2026-04-08
- 범위(이 문서): **Phase A** — 도메인 타입 정의 + 변환 함수 + Zustand store 골격
- 후속(별도 plan): Phase B(기존 feature 마이그레이션·Recoil 제거), Phase C(우클릭 CRUD UI)

---

## 1. 배경 & 문제 정의

타입스크립트 + feature-first 전환이 끝났지만, 도메인 타입이 feature마다 흩어져 있고 의미가 겹친다.

- `DirectoryItem` ([src/pages/DesktopPage/DesktopDataContext.tsx:3](../../src/pages/DesktopPage/DesktopDataContext.tsx#L3)) — 파일시스템 항목(정의)
- `TaskbarProgramItem` ([src/features/taskbar/TaskBar.types.ts](../../src/features/taskbar/TaskBar.types.ts)) — 실행 중인 프로세스
- `WindowShellItem` ([src/features/window-shell/WindowShell.types.ts](../../src/features/window-shell/WindowShell.types.ts)) — 창 인스턴스

세 타입 모두 `name / type / icon / parent / status` 를 공유한다. 또한:

- `ProgramStatus` ↔ `WindowStatus` 가 동일 정의(`"active" | "min"`)로 중복.
- `ProgramType` 이 `... | string` 으로 탈출구가 열려 있어 타입 안전성이 약함.
- `WindowShellItem.contents?: unknown` — 프로그램 종류별 payload가 `unknown`으로 무력화.
- `src/types/` 는 `images.d.ts` 하나뿐이라 공용 도메인 레이어가 사실상 부재.
- 디렉토리는 `Record<parentName, items[]>` 평면 구조이며 **`name`을 식별자로 사용** → 향후 rename 기능과 충돌.

### 최종 목표(이번 작업 범위 밖, 동기로만 명시)

- 폴더/파일과 그 계층을 **데이터(JSON)만으로 정의**
- 포트폴리오 내용·이력을 동적으로 수정 가능
- 우클릭 컨텍스트 메뉴로 추가/수정/삭제

위 목표를 지지할 수 있는 **타입과 상태 모델의 토대**를 이 문서에서 설계한다.

---

## 2. 설계 결정 요약

| 결정 | 선택 | 이유 |
|---|---|---|
| 통합 전략 | 베이스 + 차별 유니언 | optional 남발 없이 단일 SoT 확보 |
| `ProgramType` 탈출구 | **닫음** (string fallback 제거) | 타입 안전성, 자동완성 |
| 식별자 | `id: ProgramId`(stable) — `name`과 분리 | rename 안전, parent 참조 안정 |
| 런타임 자료구조 | **정규화 스토어** (`nodes` 맵 + `childrenByParent` 인덱스) | CRUD O(1), immutable update 단순 |
| 저작 입력 형식 | **재귀 트리** (AuthoringTree) | 사람이 작성하기 직관적 |
| 트리 ↔ 정규화 변환 | `buildFileSystem()` / `exportFileSystem()` 어댑터 | SoT는 한쪽, 다른 쪽은 파생 |
| Payload 타입 | `type` 키 기반 **discriminated union** | `contents`가 자동으로 좁혀짐 |
| 전역 상태 | **Zustand** + `immer` + `persist` | 정규화 스토어 친화적, JSON hydrate가 1줄, 보일러플레이트 적음 |
| 외부 데이터 | `src/data/portfolio.json` 시드, `version` 필드 포함 | 추후 API/파일 로드로 확장 가능 |

---

## 3. 타입 모델

### 3.1 베이스 & 리터럴

```ts
// src/shared/types/program.ts
export type ProgramId = string;

export type ProgramType =
  | "FOLDER"
  | "DOC"
  | "IMAGE"
  | "INFO"
  | "BROWSER";

export type ProgramStatus = "active" | "min";

interface ProgramBase {
  id: ProgramId;
  parentId: ProgramId | null;  // null = root
  name: string;
  icon: string;
}
```

### 3.2 런타임 노드 (차별 유니언)

```ts
export type ProgramNode =
  | (ProgramBase & { type: "FOLDER" })
  | (ProgramBase & { type: "DOC";     contents: ProjectData })
  | (ProgramBase & { type: "IMAGE";   src: string })
  | (ProgramBase & { type: "INFO";    contents: ResumeData })
  | (ProgramBase & { type: "BROWSER"; url: string });
```

`type`으로 좁혀지면 `contents` / `src` / `url` 이 자동으로 정확한 타입이 된다.

### 3.3 실행 인스턴스 타입 (Phase B에서 사용)

```ts
// 베이스 + status 만 추가. 별도 엔티티가 아니라 런타임 메타데이터.
export interface RunningProgram {
  id: ProgramId;
  status: ProgramStatus;
  zIndex: number;
}
```

> Taskbar/WindowShell은 `ProgramNode` + `RunningProgram` 두 정보를 합쳐 화면을 그린다. 합치는 방식(셀렉터, derived view 등)은 Phase B에서 결정.

### 3.4 콘텐츠 페이로드

`ProjectData` (현재 [DOCProgram.types.ts](../../src/features/program-doc/DOCProgram.types.ts))는 도메인 타입으로 승격해 `src/shared/types/program.ts` 또는 `src/shared/types/content.ts`에 둔다. `ResumeData`는 INFO 프로그램용으로 새로 정의한다(필드는 추후 확정, Phase A에서는 `Record<string, unknown>` 임시 placeholder 허용).

### 3.5 정규화 상태

```ts
export interface FileSystemState {
  rootId: ProgramId;
  nodes: Record<ProgramId, ProgramNode>;
  childrenByParent: Record<ProgramId, Array<ProgramId>>; // 순서 유지
}
```

---

## 4. 저작 스키마 & 변환

### 4.1 AuthoringTree (외부 JSON 형태)

```ts
// src/shared/types/portfolio-schema.ts
export interface PortfolioSchema {
  version: 1;
  root: AuthoringNode;
}

export type AuthoringNode =
  | { type: "FOLDER";  name: string; icon: string; children: Array<AuthoringNode> }
  | { type: "DOC";     name: string; icon: string; contents: ProjectData }
  | { type: "IMAGE";   name: string; icon: string; src: string }
  | { type: "INFO";    name: string; icon: string; contents: ResumeData }
  | { type: "BROWSER"; name: string; icon: string; url: string };
```

`id`는 저작 시 작성하지 않고, 변환 시점에 자동 부여한다(안정 ID 보장 — 동일 입력 → 동일 ID 면 좋지만 우선은 nanoid 사용 가능).

### 4.2 변환 함수

```ts
// src/shared/lib/file-system/buildFileSystem.ts
export function buildFileSystem(schema: PortfolioSchema): FileSystemState;

// src/shared/lib/file-system/exportFileSystem.ts
export function exportFileSystem(state: FileSystemState): PortfolioSchema;
```

- `buildFileSystem`: DFS로 노드 순회 → id 생성 → `nodes`/`childrenByParent` 채움.
- `exportFileSystem`: rootId부터 자식 인덱스 따라 트리로 직렬화. id는 출력에서 제외.
- 두 함수는 **순수 함수**, 단위 테스트 대상.

### 4.3 시드 데이터

`src/data/portfolio.json` — 기존 [DesktopPage](../../src/pages/DesktopPage/DesktopPage.tsx)에 하드코딩된 디렉토리 구조를 트리 형태 JSON으로 옮긴 초기 시드. **Phase A에서 작성만 하고 사용은 Phase B에서**.

---

## 5. 전역 스토어 (Zustand)

```ts
// src/store/fileSystemStore.ts
interface FileSystemStore extends FileSystemState {
  // hydrate / export
  hydrate: (schema: PortfolioSchema) => void;
  export: () => PortfolioSchema;

  // CRUD (Phase C에서 UI와 연결, Phase A에서는 액션 정의 + 단위 테스트)
  addNode: (parentId: ProgramId, input: NewNodeInput) => ProgramId;
  updateNode: (id: ProgramId, patch: UpdateNodeInput) => void;
  deleteNode: (id: ProgramId) => void;
  moveNode: (id: ProgramId, newParentId: ProgramId, index?: number) => void;
  renameNode: (id: ProgramId, name: string) => void;
}
```

- `immer` 미들웨어로 깊은 업데이트를 mutation 스타일로 작성.
- `persist` 미들웨어는 Phase A에서는 **연결만 해두고 기본 비활성**(Phase B에서 hydrate 우선순위 결정 후 활성).
- `NewNodeInput` / `UpdateNodeInput`은 `ProgramNode`에서 `id`/`parentId`를 제외한 차별 유니언으로 정의.

---

## 6. 파일 배치

```
src/
├─ shared/
│  ├─ types/
│  │  ├─ program.ts            ← ProgramNode, ProgramType, ProgramStatus, FileSystemState, RunningProgram
│  │  ├─ content.ts            ← ProjectData, ResumeData (DOC/INFO 페이로드)
│  │  └─ portfolio-schema.ts   ← AuthoringNode, PortfolioSchema
│  └─ lib/
│     └─ file-system/
│        ├─ buildFileSystem.ts
│        ├─ exportFileSystem.ts
│        └─ __tests__/
├─ store/
│  └─ fileSystemStore.ts       ← Zustand store (Phase A: 골격 + 액션 + 테스트)
└─ data/
   └─ portfolio.json           ← 시드 (Phase A: 작성만)
```

> `src/types/`는 ambient `.d.ts` 전용으로 유지(`images.d.ts`만 남김). 도메인 타입은 `src/shared/types/`로 통일.

---

## 7. Phase A 산출물 체크리스트

1. `src/shared/types/program.ts` — 베이스/리터럴/노드 유니언/`FileSystemState`/`RunningProgram`
2. `src/shared/types/content.ts` — `ProjectData` 이전, `ResumeData` placeholder
3. `src/shared/types/portfolio-schema.ts` — `AuthoringNode`, `PortfolioSchema`
4. `src/shared/lib/file-system/buildFileSystem.ts` + 단위 테스트
5. `src/shared/lib/file-system/exportFileSystem.ts` + 단위 테스트 (round-trip 테스트 포함)
6. `src/store/fileSystemStore.ts` — Zustand store + 액션 단위 테스트
7. `src/data/portfolio.json` — 시드 데이터(현재 데스크톱 디렉토리 구조 반영)
8. `zustand`, `immer` 의존성 추가

**의도적으로 하지 않는 것 (Phase B 이후로 미룸)**
- 기존 feature 코드(`DesktopDataContext`, Taskbar, WindowShell, navigation hooks 등) 수정
- Recoil 제거
- 기존 feature 타입 파일 삭제/이동
- 우클릭 컨텍스트 메뉴 UI

---

## 8. Phase A 검증 기준

- `tsc --noEmit` 통과
- 신규 단위 테스트 전부 통과 (`buildFileSystem`/`exportFileSystem`/store 액션)
- round-trip: `exportFileSystem(buildFileSystem(seed)) ≡ seed` (id 제외)
- 기존 테스트 스위트 그대로 통과 (기존 코드 수정 없음)
- 어떤 feature 파일도 새 타입을 import하지 않는다 (Phase A 격리 보장)

---

## 9. 후속 plan 메모

- **Phase B**: Recoil 제거, `DesktopDataContext` → `fileSystemStore`로 치환, Taskbar/WindowShell/navigation hooks를 새 타입으로 마이그레이션, 기존 feature 타입 파일 정리, `RunningProgram` 상태 모델링.
- **Phase C**: 우클릭 컨텍스트 메뉴 UI, 추가/수정/삭제 모달, `persist` 활성화, `export()` 기반 JSON 다운로드.
