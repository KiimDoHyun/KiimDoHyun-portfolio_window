# Phase D-1: 아이콘 resolve 로직 공통화

> **브랜치:** `refactor/icon-resolve-unification`
> **선행 조건:** Phase C-1 완료 (master), `resolveAsset` + `assetManifest` 존재
> **관련:** Phase D-2 (Program Registry) 이후 registry에 흡수 가능

---

## 배경 (Why)

현재 아이콘 resolve 로직(매니페스트 키 → 이미지 URL, 실패 시 type별 fallback)이 3곳에 중복 구현되어 있다:

| 파일 | 위치 | 하는 일 |
|------|------|---------|
| `IconBox.tsx` | `fallbackIcon()` (L16-23) | `node.type`별 fallback 아이콘 반환 |
| `resolveProgramMeta.ts` | `resolveProgramIcon()` (L13-27) | `resolveAsset` + type별 fallback |
| `ProgramIcons.tsx` | `renderIconImage()` (L19-38) | `resolveAsset` + type별 fallback + JSX |

문제:
- 새 타입 추가 시 3곳을 모두 수정해야 한다
- 로직이 미묘하게 다르다 (ProgramIcons는 JSX를 반환, 나머지는 string 반환)
- `resolveProgramMeta.ts`에 이미 정답(`resolveProgramIcon`)이 있는데 나머지가 이를 사용하지 않는다

## 설계 규칙

- `resolveProgramIcon`은 `@shared/lib/` 또는 Pages 레이어에 위치한다
- Feature 레이어(`IconBox`, `ProgramIcons`)에서 직접 호출 가능하려면 `@shared/lib/`에 있어야 한다
- 함수는 순수 함수(`ProgramNode → string`)로 유지한다

## 성공 기준 (Definition of Done)

- [ ] 아이콘 resolve 로직이 단 1곳에만 존재한다
- [ ] `IconBox.tsx`의 `fallbackIcon()` 함수가 제거된다
- [ ] `ProgramIcons.tsx`의 `renderIconImage()` 내 switch가 제거된다
- [ ] 모든 아이콘이 기존과 동일하게 렌더된다
- [ ] `tsc --noEmit` 0 errors
- [ ] 기존 테스트 전부 pass

---

## 구조

### Before

```
IconBox.tsx         → import 4개 이미지 + fallbackIcon(switch)
ProgramIcons.tsx    → import 4개 이미지 + renderIconImage(switch)
resolveProgramMeta  → import 4개 이미지 + resolveProgramIcon(switch)
```

### After

```
shared/lib/resolveProgramIcon.ts  → 단일 함수 (resolveAsset + type별 fallback)
  ↑ import
IconBox.tsx         → resolveProgramIcon(node) 호출
ProgramIcons.tsx    → resolveProgramIcon(node) 호출
resolveProgramMeta  → resolveProgramIcon(node) 호출 (또는 re-export)
```

---

## 작업 항목

### Task 1: `resolveProgramIcon` 함수를 `@shared/lib/`로 이동

**현재 위치:** `src/pages/DesktopPage/resolveProgramMeta.ts`
**이동 위치:** `src/shared/lib/resolveProgramIcon.ts` (신규)

```ts
import { resolveAsset } from "./assetManifest";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import defaultDocumentImage from "@images/icons/document_default.png";
import monitor from "@images/icons/monitor.png";
import type { ProgramNode } from "@shared/types/program";

const FALLBACK_ICONS: Record<string, string> = {
    IMAGE: defaultImage,
    DOC: defaultDocumentImage,
    INFO: monitor,
};

const DEFAULT_ICON = folderEmpty;

export const resolveProgramIcon = (node: ProgramNode): string =>
    resolveAsset(node.icon) ?? FALLBACK_ICONS[node.type] ?? DEFAULT_ICON;
```

`resolveProgramTitle`도 같은 파일로 이동하거나, `resolveProgramMeta.ts`에 남겨둔다.

**완료 조건:**
- [ ] `src/shared/lib/resolveProgramIcon.ts` 생성
- [ ] `src/shared/lib/index.ts`에 re-export 추가
- [ ] tsc 통과

### Task 2: 소비처 3곳 수정

#### 2-1. `resolveProgramMeta.ts`

- `resolveProgramIcon`의 원본 구현 제거
- `@shared/lib/resolveProgramIcon`에서 import하여 re-export 또는 직접 사용

#### 2-2. `IconBox.tsx`

- `fallbackIcon()` 함수 제거
- `folderEmpty`, `imageDefault`, `documentDefault`, `monitor` import 4개 제거
- `resolveProgramIcon(item)` 호출로 교체

```tsx
import { resolveProgramIcon } from "@shared/lib";

const IconBox = ({ item, onClick, onDoubleClick }: IconBoxProps) => {
    const icon = resolveProgramIcon(item);
    // ...
};
```

#### 2-3. `ProgramIcons.tsx`

- `renderIconImage()` 내 switch 제거
- `folderEmpty`, `defaultImage`, `monitor`, `defaultDocumentImage` import 4개 제거
- `resolveProgramIcon(node)` 호출로 교체

```tsx
import { resolveProgramIcon } from "@shared/lib";

const renderIconImage = (entry: TaskbarEntry) => {
    const icon = resolveProgramIcon(entry.node);
    return <img src={icon} alt={entry.node.name} />;
};
```

**완료 조건:**
- [ ] 3개 파일 수정
- [ ] 중복 import 및 중복 switch 제거
- [ ] tsc 통과, 테스트 통과

### Task 3: 검증

**자동 검증:**
```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
```

**수동 검증:**
- [ ] 바탕화면 아이콘이 기존과 동일하게 표시된다
- [ ] 폴더 내부 아이콘이 기존과 동일하게 표시된다
- [ ] 작업표시줄 아이콘이 기존과 동일하게 표시된다

---

## Phase D-2와의 관계

Phase D-2(Program Registry)에서 `FALLBACK_ICONS` 맵이 registry의 `defaultIcon` 필드로 흡수될 수 있다. 그 시점에 `resolveProgramIcon`은 registry를 lookup하는 형태로 변경된다. 따라서 이 Phase는 중간 단계이며, D-2 완료 후 `FALLBACK_ICONS`가 제거된다.

## Out of scope

- Program Registry 패턴 도입 (Phase D-2)
- `resolveProgramTitle` 공통화 (필요시 별도 작업)
- FOLDER의 empty/full 아이콘 동적 결정 (현재 hasChildren 기반 로직 유지)
