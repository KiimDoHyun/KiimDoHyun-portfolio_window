# Phase D-2: Program Registry 패턴 도입

> **브랜치:** `refactor/program-registry`
> **선행 조건:** Phase D-1 완료 (`resolveProgramIcon` 공통화)
> **목적:** 새 타입 추가 시 수정 지점을 최소화하고, AI 작업 시 명확한 등록 패턴 제공

---

## 배경 (Why)

현재 `ProgramNode`의 `type`별 분기가 여러 파일에 switch문으로 분산되어 있다:

| 파일 | 분기 내용 |
|------|-----------|
| `resolveProgramIcon.ts` (D-1 이후) | type → fallback 아이콘 |
| `resolveProgramMeta.ts` | type → 윈도우 타이틀 |
| `renderProgramContent.tsx` | type → Shell 컴포넌트 |
| `ProgramWindow.tsx` | type → subHeader 존재 여부 |
| `buildFileSystem.ts` | AuthoringNode → ProgramNode 변환 |
| `exportFileSystem.ts` | ProgramNode → AuthoringNode 변환 |
| `fileSystemStore.ts` | `NewNodeInput` union 정의 |

새 타입(예: PDF)을 추가하려면 이 7곳을 모두 찾아 수정해야 한다.
Registry 패턴으로 타입별 메타데이터와 렌더링을 중앙 집중시켜 수정 지점을 줄인다.

## 설계 규칙

- Registry는 `Record<ProgramType, RegistryEntry>` 형태로 **TypeScript가 누락을 컴파일 에러로 잡는다**
- Feature 레이어의 컴포넌트는 store를 직접 import하지 않는다 (3-레이어 아키텍처 유지)
- Registry는 `@shared/lib/` 또는 Pages 레이어에 위치한다
- FOLDER는 특수 타입(children 재귀)이므로 registry에 등록하되 build/export에서는 별도 분기를 유지한다

## 성공 기준 (Definition of Done)

- [ ] `programRegistry`가 단일 파일로 존재한다
- [ ] `renderProgramContent`의 switch문이 registry lookup으로 교체된다
- [ ] `resolveProgramIcon`의 fallback 맵이 registry로 흡수된다
- [ ] `resolveProgramTitle`의 분기가 registry로 흡수된다
- [ ] `ProgramWindow`의 subHeader 분기가 registry로 흡수된다
- [ ] `ProgramType`이 `ProgramNode['type']`에서 파생된다
- [ ] `buildFileSystem`, `exportFileSystem`의 leaf 노드 처리가 일반화된다
- [ ] 새 타입 추가 시 수정 지점이 4곳 이하이다 (타입 정의 2 + registry 1 + feature 모듈 1)
- [ ] `tsc --noEmit` 0 errors
- [ ] 기존 테스트 전부 pass
- [ ] 모든 기존 기능이 동일하게 동작한다

---

## 구조

### Before (switch 분산)

```
renderProgramContent.tsx   → switch(type) → Shell 선택
resolveProgramIcon.ts      → switch(type) → fallback 아이콘
resolveProgramMeta.ts      → if(type) → 타이틀
ProgramWindow.tsx          → if(type) → subHeader
buildFileSystem.ts         → switch(type) → 노드 생성
exportFileSystem.ts        → switch(type) → 노드 내보내기
```

### After (registry 중앙 집중)

```
programRegistry.ts         → { DOC: {...}, IMAGE: {...}, ... }
  ↑
renderProgramContent.tsx   → registry[type].Shell
resolveProgramIcon.ts      → registry[type].defaultIcon
resolveProgramMeta.ts      → registry[type].resolveTitle
ProgramWindow.tsx          → registry[type].hasSubHeader
buildFileSystem.ts         → 일반화된 leaf 처리
exportFileSystem.ts        → 일반화된 leaf 처리
```

---

## Registry 타입 설계

```ts
// src/shared/lib/programRegistry.ts

import type { ComponentType } from "react";
import type { ProgramId } from "@shared/types/program";

interface ProgramRegistryEntry {
    /** type별 fallback 아이콘 (매니페스트 키에 없을 때) */
    defaultIcon: string;

    /** 윈도우 타이틀 resolve (기본: node.name) */
    resolveTitle?: (name: string) => string;

    /** 윈도우 subHeader 존재 여부 */
    hasSubHeader?: boolean;

    /** 프로그램 content 영역을 렌더하는 Shell 컴포넌트 */
    Shell: ComponentType<{ id: ProgramId }> | null;

    /** AuthoringNode에서 ProgramNode로 변환 시 추가 필드 키 목록 */
    extraFields: Array<string>;
}
```

### Registry 정의

```ts
import folderEmpty from "@images/icons/folder_empty.png";
import imageDefault from "@images/icons/image_default.png";
import documentDefault from "@images/icons/document_default.png";
import monitor from "@images/icons/monitor.png";

// ProgramType은 ProgramNode['type']에서 파생
// → 새 타입을 ProgramNode에 추가하면 여기에도 넣으라고 컴파일 에러 발생
export const programRegistry: Record<ProgramType, ProgramRegistryEntry> = {
    FOLDER: {
        defaultIcon: folderEmpty,
        Shell: FolderProgramShell,
        extraFields: [],  // FOLDER는 children이 있어 별도 처리
    },
    DOC: {
        defaultIcon: documentDefault,
        Shell: DOCProgramShell,
        extraFields: ["contents"],
    },
    IMAGE: {
        defaultIcon: imageDefault,
        resolveTitle: () => "이미지",
        Shell: ImageProgramShell,
        extraFields: ["src"],
    },
    INFO: {
        defaultIcon: monitor,
        Shell: InfoProgramShell,
        extraFields: ["contents"],
    },
    BROWSER: {
        defaultIcon: folderEmpty,
        hasSubHeader: true,
        Shell: null,  // inline iframe
        extraFields: ["url"],
    },
};
```

---

## 작업 항목

### Task 1: `ProgramType`을 파생 타입으로 변경

**파일:** `src/shared/types/program.ts`

```ts
// Before
export type ProgramType = "FOLDER" | "DOC" | "IMAGE" | "INFO" | "BROWSER";

// After
export type ProgramType = ProgramNode["type"];
```

이렇게 하면 `ProgramNode` union에 새 변형을 추가할 때 `ProgramType`이 자동으로 확장된다.

**완료 조건:**
- [ ] `ProgramType` 파생 변경
- [ ] tsc 통과

### Task 2: Registry 파일 생성

**파일:** `src/shared/lib/programRegistry.ts` (신규)

위 설계의 `ProgramRegistryEntry` 인터페이스와 `programRegistry` 객체를 구현한다.

**주의:** Shell 컴포넌트 import는 순환 참조를 피하기 위해 lazy import 또는 Pages 레이어에서 등록하는 방식을 검토한다.

**순환 참조 해결 방안:**

Registry가 Shell을 import하고, Shell이 store를 import하고, store가 shared를 import하면 순환이 생길 수 있다.

**(a) Registry를 Pages 레이어에 배치:** Shell import에 문제 없음. 단, Feature에서 `defaultIcon`을 사용하려면 아이콘 정보만 별도 분리 필요.

**(b) Registry를 2단 분리:**
```
shared/lib/programRegistry.ts    → defaultIcon, resolveTitle 등 메타데이터만
pages/DesktopPage/programShells.ts → Shell 컴포넌트 매핑
```

**(c) Registry를 shared에 두되, Shell은 콜백으로 등록:**
```ts
// shared/lib/programRegistry.ts
const shellMap: Partial<Record<ProgramType, ComponentType<{ id: ProgramId }>>> = {};
export const registerShell = (type: ProgramType, Shell: ComponentType<{ id: ProgramId }>) => {
    shellMap[type] = Shell;
};
export const getShell = (type: ProgramType) => shellMap[type] ?? null;
```

**추천: (b) 2단 분리.** 메타데이터(아이콘, 타이틀)는 여러 레이어에서 필요하므로 shared에 두고, Shell 매핑은 Pages에서만 사용하므로 Pages에 둔다. 가장 명확하고 순환 참조 위험이 없다.

```
src/shared/lib/programMeta.ts         → defaultIcon, resolveTitle, hasSubHeader, extraFields
src/pages/DesktopPage/programShells.ts → type → Shell 매핑
```

**완료 조건:**
- [ ] `src/shared/lib/programMeta.ts` 생성
- [ ] `src/pages/DesktopPage/programShells.ts` 생성
- [ ] `Record<ProgramType, ...>` 형태로 타입 안전성 확보
- [ ] tsc 통과

### Task 3: 소비처 수정 — 아이콘, 타이틀, subHeader

#### 3-1. `resolveProgramIcon.ts`

```ts
// Before
const FALLBACK_ICONS: Record<string, string> = { IMAGE: ..., DOC: ..., INFO: ... };

// After
import { programMeta } from "./programMeta";
export const resolveProgramIcon = (node: ProgramNode): string =>
    resolveAsset(node.icon) ?? programMeta[node.type].defaultIcon;
```

#### 3-2. `resolveProgramMeta.ts`

```ts
// Before
export const resolveProgramTitle = (node: ProgramNode): string => {
    if (node.type === "IMAGE") return "이미지";
    return node.name;
};

// After
import { programMeta } from "@shared/lib/programMeta";
export const resolveProgramTitle = (node: ProgramNode): string =>
    programMeta[node.type].resolveTitle?.(node.name) ?? node.name;
```

#### 3-3. `ProgramWindow.tsx`

```ts
// Before
const subHeader = node.type === "BROWSER" ? <div ... /> : undefined;

// After
import { programMeta } from "@shared/lib/programMeta";
const subHeader = programMeta[node.type].hasSubHeader
    ? <div className={`headerArea2 headerArea2_${node.type}`} />
    : undefined;
```

**완료 조건:**
- [ ] 3개 파일 수정
- [ ] 기존 switch/if 분기 제거
- [ ] tsc 통과

### Task 4: 소비처 수정 — renderProgramContent

**파일:** `src/pages/DesktopPage/renderProgramContent.tsx`

```tsx
// Before
switch (node.type) {
    case "BROWSER": return <iframe ... />;
    case "FOLDER": return <FolderProgramShell id={node.id} />;
    // ...
}

// After
import { programShells } from "./programShells";

export const renderProgramContent = (node: ProgramNode): ReactNode => {
    // BROWSER는 Shell이 null이므로 별도 처리
    if (node.type === "BROWSER") {
        return (
            <div className="contentsArea_Cover">
                <iframe src="https://www.google.com/webhp?igu=1" title="Google" width="100%" height="100%" />
            </div>
        );
    }
    const Shell = programShells[node.type];
    return Shell ? <Shell id={node.id} /> : null;
};
```

> BROWSER의 inline iframe은 Shell 컴포넌트로 분리하는 것도 고려할 수 있다.
> 그렇게 하면 `renderProgramContent` 자체가 완전히 registry lookup만 하게 된다.
> 이 결정은 구현 시점에 판단한다.

**완료 조건:**
- [ ] switch문 제거 (BROWSER 제외, 또는 BROWSER도 Shell화 시 완전 제거)
- [ ] tsc 통과, 테스트 통과

### Task 5: build/export 일반화

**파일:**
- `src/shared/lib/file-system/buildFileSystem.ts`
- `src/shared/lib/file-system/exportFileSystem.ts`

현재 FOLDER를 제외한 leaf 노드들은 동일한 패턴이다:

```ts
// buildFileSystem — 현재 (leaf 노드마다 case 작성)
case "DOC":
    node = { id, parentId, type: "DOC", name: authoring.name, icon: authoring.icon, contents: authoring.contents };
case "IMAGE":
    node = { id, parentId, type: "IMAGE", name: authoring.name, icon: authoring.icon, src: authoring.src };
```

공통점: `{ id, parentId, type, name, icon }` + **type 고유 필드를 그대로 복사**.

```ts
// After — 일반화
import { programMeta } from "@shared/lib/programMeta";

function buildLeafNode(authoring: AuthoringNode, id: ProgramId, parentId: ProgramId | null): ProgramNode {
    const base = { id, parentId, type: authoring.type, name: authoring.name, icon: authoring.icon };
    const extra: Record<string, unknown> = {};
    for (const key of programMeta[authoring.type].extraFields) {
        extra[key] = (authoring as Record<string, unknown>)[key];
    }
    return { ...base, ...extra } as ProgramNode;
}
```

**exportFileSystem도 동일한 패턴으로 역변환:**

```ts
function exportLeafNode(node: ProgramNode): AuthoringNode {
    const base = { type: node.type, name: node.name, icon: node.icon };
    const extra: Record<string, unknown> = {};
    for (const key of programMeta[node.type].extraFields) {
        extra[key] = (node as Record<string, unknown>)[key];
    }
    return { ...base, ...extra } as AuthoringNode;
}
```

**주의:** 이 일반화는 `as ProgramNode` 캐스팅이 필요해 타입 안전성이 약간 느슨해진다. 
하지만 `extraFields`가 registry에 한곳에서 관리되므로, **필드 누락은 registry만 보면 된다.**

**fileSystemStore의 `NewNodeInput`도 동일하게 처리:**

```ts
// Before — 수동 union
export type NewNodeInput =
    | { type: "FOLDER"; name: string; icon: string }
    | { type: "DOC"; name: string; icon: string; contents: ... }
    | ...

// After — AuthoringNode에서 파생 (FOLDER의 children 제외)
export type NewNodeInput = Omit<AuthoringNode, "children"> extends infer T
    ? T extends { type: "FOLDER" } ? { type: "FOLDER"; name: string; icon: string } : T
    : never;
```

또는 단순하게:
```ts
export type NewNodeInput =
    | { type: "FOLDER"; name: string; icon: string }
    | Exclude<AuthoringNode, { type: "FOLDER" }>;
```

**완료 조건:**
- [ ] `buildFileSystem` leaf 처리 일반화
- [ ] `exportFileSystem` leaf 처리 일반화
- [ ] `NewNodeInput` 파생 타입으로 변경
- [ ] tsc 통과, 테스트 통과

### Task 6: 검증

**자동 검증:**
```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
```

**수동 검증:**
- [ ] 바탕화면 아이콘 더블클릭 → 해당 프로그램 창이 열린다
- [ ] 모든 타입(FOLDER, DOC, IMAGE, INFO, BROWSER)의 윈도우가 정상 렌더된다
- [ ] 윈도우 타이틀이 기존과 동일하다 (IMAGE는 "이미지")
- [ ] 아이콘이 기존과 동일하게 표시된다
- [ ] 작업표시줄 아이콘 및 미리보기가 정상 동작한다
- [ ] BROWSER 윈도우에 subHeader가 표시된다

---

## 새 타입 추가 시 수정 가이드 (Registry 도입 후)

예시: PDF 타입 추가

### 1. 타입 정의 (2곳)

**`src/shared/types/portfolio-schema.ts`:**
```ts
export type AuthoringNode =
    // ...기존 타입들
    | { type: "PDF"; name: string; icon: string; src: string };
```

**`src/shared/types/program.ts`:**
```ts
export type ProgramNode =
    // ...기존 타입들
    | (ProgramBase & { type: "PDF"; src: string });
```

> `ProgramType`은 `ProgramNode['type']`에서 파생되므로 자동 확장된다.

### 2. Registry 등록 (1곳)

**`src/shared/lib/programMeta.ts`:**
```ts
PDF: {
    defaultIcon: pdfDefault,
    Shell: null,  // 아래에서 Shell 등록
    extraFields: ["src"],
},
```

**`src/pages/DesktopPage/programShells.ts`:**
```ts
PDF: PDFProgramShell,
```

### 3. Feature 모듈 생성 (신규)

```
src/features/program-pdf/
  ├── index.ts
  ├── PDFProgram.tsx
  └── PDFProgram.types.ts
src/pages/DesktopPage/shells/
  └── PDFProgramShell.tsx
```

### 수정 불필요한 파일들

- `renderProgramContent.tsx` — registry lookup이므로 수정 불필요
- `resolveProgramIcon.ts` — registry lookup이므로 수정 불필요
- `resolveProgramMeta.ts` — registry lookup이므로 수정 불필요
- `ProgramWindow.tsx` — registry lookup이므로 수정 불필요
- `buildFileSystem.ts` — 일반화되어 수정 불필요
- `exportFileSystem.ts` — 일반화되어 수정 불필요
- `IconBox.tsx` — `resolveProgramIcon` 호출이므로 수정 불필요
- `ProgramIcons.tsx` — `resolveProgramIcon` 호출이므로 수정 불필요

---

## 트레이드오프

### 얻는 것
- 새 타입 추가 시 수정 지점: **10곳 → 4곳** (타입 2 + registry 1~2 + feature 신규)
- AI 작업 시 명확한 패턴: "registry에 등록하고 feature 모듈 만들면 끝"
- switch문 분산 제거로 코드 일관성 향상

### 잃는 것
- build/export 일반화에서 `as ProgramNode` 캐스팅이 필요 (약간의 타입 안전성 감소)
- 특정 타입의 동작을 추적하려면 registry 파일로 점프해야 함 (간접 참조 1단계 추가)
- Registry 자체가 하나의 추가 추상 레이어

### 판단
현재 프로젝트 규모(5개 타입)에서는 약간의 오버엔지니어링일 수 있으나,
AI 작업의 정확도 향상과 확장 패턴 명확화라는 목적에 부합한다.

## Out of scope

- BROWSER를 Shell 컴포넌트로 분리 (선택적으로 이 Phase에서 진행 가능)
- 우클릭 컨텍스트 메뉴
- CRUD UI 연결
- persist 미들웨어
