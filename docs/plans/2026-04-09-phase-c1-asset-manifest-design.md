# Phase C-1: 에셋 매니페스트 — 아이콘 깨짐 해결

> **브랜치:** 별도 브랜치 → 별도 PR로 master 머지
> **선행 조건:** Phase B 완료 (master), 3-레이어 디커플링 완료
> **관련:** Phase C-2 (ResumeData + INFO 바인딩)와 병렬 진행 가능

---

## 배경 (Why)

Phase B에서 데이터 원천이 `data.ts` → `portfolio.json` + `fileSystemStore`로 전환되었다.
그러나 `portfolio.json`의 모든 노드에서 `icon: ""`(빈 문자열)이라서, 바탕화면·폴더·작업표시줄의 아이콘이 전부 fallback 이미지로 렌더된다.

원인: webpack import로만 이미지를 사용할 수 있는데, JSON 파일에는 webpack import 경로를 넣을 수 없다.
해결: JSON에는 문자열 **키**를 넣고, 런타임에 키 → webpack import된 이미지로 resolve하는 매니페스트를 도입한다.

## 설계 규칙

- Feature 레이어는 `@store/*`를 직접 import하지 않는다 (3-레이어 아키텍처).
- `resolveAsset`은 `@shared/lib/`에 위치하므로 Feature에서 직접 호출 가능하다.
- 매니페스트에 없는 키는 `undefined`를 반환하고, 호출 측에서 type별 fallback으로 처리한다.

## 성공 기준 (Definition of Done)

- [ ] `portfolio.json`의 모든 `icon` 필드에 매니페스트 키가 채워져 있다
- [ ] IMAGE 노드의 `src` 필드에도 매니페스트 키가 채워져 있다
- [ ] 바탕화면 아이콘이 노드 타입에 맞는 이미지로 표시된다
- [ ] 폴더 내부 아이콘이 정상 표시된다
- [ ] 작업표시줄 아이콘이 정상 표시된다
- [ ] 윈도우 헤더 아이콘이 정상 표시된다
- [ ] `tsc --noEmit` 0 errors
- [ ] 기존 테스트 전부 pass

---

## 구조

```
portfolio.json          src/shared/lib/assetManifest.ts        컴포넌트
icon: "monitor"   →     resolveAsset("monitor") → import된 이미지  →  <img src={...} />
                         resolveAsset("???")     → undefined       →  type별 fallback
```

---

## 작업 항목

### Task 1: 에셋 매니페스트 생성

**파일:** `src/shared/lib/assetManifest.ts` (신규)

매니페스트에 등록할 아이콘 목록 (현재 컴포넌트에서 import하는 것들):

| 키 | import 경로 | 사용처 |
|----|------------|--------|
| `monitor` | `@images/icons/monitor.png` | INFO 노드 아이콘 |
| `folder_empty` | `@images/icons/folder_empty.png` | 빈 FOLDER fallback |
| `folder_full` | `@images/icons/folder_full.png` | 자식 있는 FOLDER |
| `image_default` | `@images/icons/image_default.png` | IMAGE fallback |
| `document_default` | `@images/icons/document_default.png` | DOC fallback |
| `chrome` | `@images/icons/chrome.png` | BROWSER 아이콘 |
| `react` | `@images/icons/react.png` | 기술스택 IMAGE |
| `javascript` | `@images/icons/javascript.png` | 기술스택 IMAGE |
| `redux` | `@images/icons/redux.png` | 기술스택 IMAGE |
| `recoil` | `@images/icons/recoil.png` | 기술스택 IMAGE |
| `nodejs` | `@images/icons/nodejs.png` | 기술스택 IMAGE |
| `html` | `@images/icons/html.png` | 기술스택 IMAGE |
| `css` | `@images/icons/css.png` | 기술스택 IMAGE |
| `styledcomponent` | `@images/icons/styledcomponent.png` | 기술스택 IMAGE |
| `github` | `@images/icons/github.png` | 기술스택 IMAGE |
| `vue` | `@images/icons/vue.png` | 기술스택 IMAGE |
| `python` | `@images/icons/python.png` | 기술스택 IMAGE |
| `bootstrap` | `@images/icons/bootstrap.png` | 기술스택 IMAGE |
| `tailwind_css` | `@images/icons/tailwind-css.png` | 기술스택 IMAGE |
| `vuetify` | `@images/icons/vuetify.png` | 기술스택 IMAGE |

```ts
import monitor from "@images/icons/monitor.png";
// ... 기타 import

const assetManifest: Record<string, string> = {
    monitor,
    // ...
};

export const resolveAsset = (key: string): string | undefined =>
    assetManifest[key];
```

**완료 조건:**
- [ ] 파일 생성, `resolveAsset` export
- [ ] tsc 통과

### Task 2: portfolio.json icon/src 필드 채우기

모든 노드의 `icon` 필드에 매니페스트 키를 채운다.

| 노드 타입 | icon 값 | 비고 |
|-----------|---------|------|
| INFO "내컴퓨터" | `"monitor"` | |
| FOLDER (전부) | `""` (유지) | FOLDER는 hasChildren에 따라 동적 결정이므로 icon 필드 불필요 |
| DOC (전부) | `""` (유지) | type별 fallback(`document_default`)으로 충분 |
| BROWSER "구글" | `"chrome"` | |
| IMAGE (기술스택) | 각각 해당 키 | `"react"`, `"javascript"`, `"redux"` 등 |

IMAGE 노드의 `src` 필드도 동일한 매니페스트 키로 채운다 (이미지 뷰어에서 표시할 실제 이미지).

**완료 조건:**
- [ ] portfolio.json 업데이트
- [ ] hydrate 후 노드에 올바른 icon/src 값이 들어감

### Task 3: 아이콘 resolve 로직 통합

4개 파일을 수정한다:

#### 3-1. `src/pages/DesktopPage/resolveProgramMeta.ts`

기존 type별 하드코딩 fallback에 `resolveAsset` 우선 적용:
```ts
import { resolveAsset } from "@shared/lib/assetManifest";

export const resolveProgramIcon = (node: ProgramNode): string => {
    const custom = resolveAsset(node.icon);
    if (custom) return custom;

    switch (node.type) {
        case "IMAGE": return defaultImage;
        case "DOC": return defaultDocumentImage;
        case "INFO": return monitor;
        default: return folderEmpty;
    }
};
```

> 이 파일은 Pages 레이어이므로 매니페스트 import에 문제 없음.

#### 3-2. `src/features/desktop/components/IconBox.tsx`

- `nodeIcon` 캐스트 함수 제거 (`node.icon`으로 직접 접근)
- `logo.svg` fallback → `resolveProgramMeta`의 `resolveProgramIcon` 사용

**3-레이어 고려:** IconBox는 Feature 레이어이므로 `resolveProgramIcon`(Pages 레이어)을 직접 호출할 수 없다. 두 가지 방안:

- **(a)** `resolveAsset`은 `@shared/lib/`이므로 Feature에서 호출 가능. IconBox에서 `resolveAsset(node.icon)` + 인라인 fallback.
- **(b)** IconBox가 `resolvedIcon: string` prop을 받도록 변경하고, Shell(DesktopWindowShell 등)에서 resolve.

현재 IconBox는 `item: ProgramNode`을 직접 받고 있으므로 **(a)**가 자연스럽다. `resolveAsset`은 순수 함수이고 `@shared/lib/` 경로이므로 규칙 위반이 아니다.

#### 3-3. `src/features/program-folder/ui/FolderGrid.tsx`

- `nodeIcon` 캐스트 함수 제거
- `resolveAsset(node.icon)` + 기존 type별 fallback 유지

#### 3-4. `src/features/taskbar/ui/ProgramIcons.tsx`

- `renderIconImage`에서 `resolveAsset(node.icon)` 우선, 없으면 기존 type별 fallback

**완료 조건:**
- [ ] 4개 파일 수정
- [ ] `nodeIcon` 캐스트 함수 삭제 (IconBox, FolderGrid)
- [ ] tsc 통과, 테스트 통과

### Task 4: 검증

**자동 검증:**
```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
```

**수동 검증:**
- [ ] 바탕화면: 내컴퓨터 아이콘 = monitor, 구글 아이콘 = chrome, 폴더 아이콘 = folder
- [ ] 폴더 열기: 하위 DOC 노드에 document_default 아이콘, IMAGE 노드에 해당 기술스택 아이콘
- [ ] 기술스택 폴더: React, JavaScript 등 각각의 아이콘이 정상 표시
- [ ] 작업표시줄: 실행 중인 프로그램 아이콘이 type에 맞게 표시
- [ ] 윈도우 헤더: 프로그램 아이콘이 정상 표시
- [ ] IMAGE 프로그램 열기: 기술스택 이미지가 뷰어에 표시

---

## Phase C-2와의 관계

C-2(ResumeData + INFO 바인딩)에서 INFO 프로그램의 링크/상세 아이콘도 매니페스트 키를 사용한다.
두 작업이 병렬 진행될 경우, C-2에서 필요한 키(`github_line`, `blog_line` 등)를 자체적으로 매니페스트에 추가하고, 머지 시 통합한다.

## Out of scope

- 우클릭 컨텍스트 메뉴
- CRUD UI 연결
- persist 미들웨어
- DOC 노드의 `stack[].img` 필드 (현재 빈 문자열 — 별도 작업으로 매니페스트 키 채우기 가능)
