# Phase C-1: 에셋 매니페스트 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `portfolio.json`의 문자열 키를 webpack import된 이미지로 resolve하는 에셋 매니페스트를 도입하여 아이콘 깨짐을 해결한다.

**Architecture:** `assetManifest.ts`에서 키→이미지 매핑을 중앙 관리한다. 각 컴포넌트는 `resolveAsset(key)`로 이미지를 얻고, 실패 시 type별 fallback을 사용한다. Feature 레이어에서 `@shared/lib/assetManifest`를 직접 import할 수 있다 (store가 아니므로 3-레이어 규칙 위반 아님).

**Tech Stack:** React, TypeScript, Zustand (fileSystemStore), Panda CSS

---

## 규칙

- 패키지 매니저: `pnpm`
- 테스트: `pnpm test --watchAll=false` (단일 `--`)
- 타입체크: `pnpm exec tsc --noEmit`
- `React.FC` 금지, 배열은 `Array<T>`, 응답은 한국어
- 파일 삭제 시 사용자 확인 필수
- Task당 1 커밋

## Commit discipline

- 커밋 메시지: `<type>(<scope>): <summary>`
- Task 순서대로 순차 진행

---

### Task 1: 에셋 매니페스트 생성

**Files:**
- Create: `src/shared/lib/assetManifest.ts`

**Step 1: 매니페스트 파일 생성**

```ts
import monitor from "@images/icons/monitor.png";
import folderEmpty from "@images/icons/folder_empty.png";
import folderFull from "@images/icons/folder_full.png";
import imageDefault from "@images/icons/image_default.png";
import documentDefault from "@images/icons/document_default.png";
import chrome from "@images/icons/chrome.png";
import react from "@images/icons/react.png";
import javascript from "@images/icons/javascript.png";
import redux from "@images/icons/redux.png";
import recoil from "@images/icons/recoil.png";
import nodejs from "@images/icons/nodejs.png";
import html from "@images/icons/html.png";
import css from "@images/icons/css.png";
import styledcomponent from "@images/icons/styledcomponent.png";
import github from "@images/icons/github.png";
import vue from "@images/icons/vue.png";
import python from "@images/icons/python.png";
import bootstrap from "@images/icons/bootstrap.png";
import tailwindCss from "@images/icons/tailwind-css.png";
import vuetify from "@images/icons/vuetify.png";

const assetManifest: Record<string, string> = {
    monitor,
    folder_empty: folderEmpty,
    folder_full: folderFull,
    image_default: imageDefault,
    document_default: documentDefault,
    chrome,
    react,
    javascript,
    redux,
    recoil,
    nodejs,
    html,
    css,
    styledcomponent,
    github,
    vue,
    python,
    bootstrap,
    tailwind_css: tailwindCss,
    vuetify,
};

export const resolveAsset = (key: string): string | undefined =>
    assetManifest[key];
```

**Step 2: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/shared/lib/assetManifest.ts
git commit -m "feat(shared): add asset manifest for icon key resolution"
```

---

### Task 2: portfolio.json icon/src 채우기

**Files:**
- Modify: `src/data/portfolio.json`

**Step 1: icon/src 필드 업데이트**

변경할 노드 목록:

| 노드 | icon 값 | src 값 (IMAGE만) |
|------|---------|-------------------|
| INFO "내컴퓨터" | `"monitor"` | — |
| BROWSER "구글" | `"chrome"` | — |
| IMAGE "React.js" | `"react"` | `"react"` |
| IMAGE "자바스크립트" | `"javascript"` | `"javascript"` |
| IMAGE "리덕스" | `"redux"` | `"redux"` |
| IMAGE "리코일" | `"recoil"` | `"recoil"` |
| IMAGE "노드js" | `"nodejs"` | `"nodejs"` |
| IMAGE "HTML" | `"html"` | `"html"` |
| IMAGE "CSS" | `"css"` | `"css"` |
| IMAGE "styled-component" | `"styledcomponent"` | `"styledcomponent"` |
| IMAGE "Github" | `"github"` | `"github"` |
| IMAGE "Vue.js" | `"vue"` | `"vue"` |
| IMAGE "파이썬" | `"python"` | `"python"` |
| IMAGE "부트스트랩" | `"bootstrap"` | `"bootstrap"` |
| IMAGE "tailwind-css" | `"tailwind_css"` | `"tailwind_css"` |

FOLDER, DOC 노드의 icon은 `""` 유지 (type별 fallback으로 충분).

**Step 2: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/data/portfolio.json
git commit -m "data(portfolio): populate icon and src fields with manifest keys"
```

---

### Task 3: resolveProgramMeta에 resolveAsset 적용

**Files:**
- Modify: `src/pages/DesktopPage/resolveProgramMeta.ts`

**Step 1: resolveAsset 통합**

변경 전 (`resolveProgramIcon`):
```ts
export const resolveProgramIcon = (node: ProgramNode): string => {
    switch (node.type) {
        case "IMAGE":
            return defaultImage;
        case "DOC":
            return defaultDocumentImage;
        case "INFO":
            return monitor;
        default:
            return node.icon || folderEmpty;
    }
};
```

변경 후:
```ts
import { resolveAsset } from "@shared/lib/assetManifest";

export const resolveProgramIcon = (node: ProgramNode): string => {
    const custom = resolveAsset(node.icon);
    if (custom) return custom;

    switch (node.type) {
        case "IMAGE":
            return defaultImage;
        case "DOC":
            return defaultDocumentImage;
        case "INFO":
            return monitor;
        default:
            return folderEmpty;
    }
};
```

> `default` 분기에서 `node.icon ||` 제거 — 이제 `resolveAsset`이 처리하므로 빈 문자열이 여기까지 오면 무조건 fallback.

**Step 2: tsc + 테스트 확인**

Run: `pnpm exec tsc --noEmit && pnpm test --watchAll=false`
Expected: 0 errors, 모든 테스트 pass

**Step 3: 커밋**

```bash
git add src/pages/DesktopPage/resolveProgramMeta.ts
git commit -m "feat(desktop): integrate resolveAsset into resolveProgramIcon"
```

---

### Task 4: IconBox에 resolveAsset 적용 + nodeIcon 캐스트 제거

**Files:**
- Modify: `src/features/desktop/components/IconBox.tsx`

**Step 1: 변경**

변경 전:
```tsx
import defaultImg from "../../../logo.svg";

function nodeIcon(node: ProgramNode): string {
    return (node as unknown as { icon?: string }).icon ?? "";
}

const IconBox = ({ item, onClick, onDoubleClick }: IconBoxProps) => {
    const { name } = item;
    const icon = nodeIcon(item);
    return (
        ...
            <img src={icon ? icon : defaultImg} alt="iconImg" />
        ...
    );
};
```

변경 후:
```tsx
import { resolveAsset } from "@shared/lib/assetManifest";
import folderEmpty from "@images/icons/folder_empty.png";
import imageDefault from "@images/icons/image_default.png";
import documentDefault from "@images/icons/document_default.png";
import monitor from "@images/icons/monitor.png";

function fallbackIcon(node: ProgramNode): string {
    switch (node.type) {
        case "IMAGE": return imageDefault;
        case "DOC": return documentDefault;
        case "INFO": return monitor;
        default: return folderEmpty;
    }
}

const IconBox = ({ item, onClick, onDoubleClick }: IconBoxProps) => {
    const { name } = item;
    const icon = resolveAsset(item.icon) ?? fallbackIcon(item);
    return (
        ...
            <img src={icon} alt="iconImg" />
        ...
    );
};
```

- `logo.svg` import 제거
- `nodeIcon` 캐스트 함수 제거
- `resolveAsset` + type별 fallback 도입

**Step 2: tsc + 테스트 확인**

Run: `pnpm exec tsc --noEmit && pnpm test --watchAll=false`
Expected: 0 errors, 모든 테스트 pass

**Step 3: 커밋**

```bash
git add src/features/desktop/components/IconBox.tsx
git commit -m "refactor(desktop): replace nodeIcon cast with resolveAsset in IconBox"
```

---

### Task 5: FolderGrid에 resolveAsset 적용 + nodeIcon 캐스트 제거

**Files:**
- Modify: `src/features/program-folder/ui/FolderGrid.tsx`

**Step 1: 변경**

변경 전 (라인 16-18, 63-65):
```tsx
function nodeIcon(node: ProgramNode): string {
    return (node as unknown as { icon?: string }).icon ?? "";
}

// 라인 63-65
<img src={nodeIcon(item) || defaultImage} alt={item.name} />
```

변경 후:
```tsx
import { resolveAsset } from "@shared/lib/assetManifest";

// nodeIcon 함수 삭제

// 라인 63-65 교체
<img src={resolveAsset(item.icon) ?? defaultImage} alt={item.name} />
```

FOLDER 분기는 그대로 유지 (hasChildren 로직은 매니페스트와 무관).

**Step 2: tsc + 테스트 확인**

Run: `pnpm exec tsc --noEmit && pnpm test --watchAll=false`
Expected: 0 errors, 모든 테스트 pass

**Step 3: 커밋**

```bash
git add src/features/program-folder/ui/FolderGrid.tsx
git commit -m "refactor(folder): replace nodeIcon cast with resolveAsset in FolderGrid"
```

---

### Task 6: ProgramIcons에 resolveAsset 적용

**Files:**
- Modify: `src/features/taskbar/ui/ProgramIcons.tsx`

**Step 1: 변경**

변경 전 (`renderIconImage`, 라인 18-34):
```tsx
const renderIconImage = (entry: TaskbarEntry) => {
    const { node } = entry;
    switch (node.type) {
        case "IMAGE":
            return <img src={defaultImage} alt={node.name} />;
        case "FOLDER":
            return <img src={folderEmpty} alt={node.name} />;
        case "DOC":
            return <img src={defaultDocumentImage} alt={node.name} />;
        case "INFO":
            return <img src={monitor} alt={node.name} />;
        case "BROWSER":
            return <img src={node.icon || folderEmpty} alt={node.name} />;
        default:
            return null;
    }
};
```

변경 후:
```tsx
import { resolveAsset } from "@shared/lib/assetManifest";

const renderIconImage = (entry: TaskbarEntry) => {
    const { node } = entry;
    const custom = resolveAsset(node.icon);
    if (custom) return <img src={custom} alt={node.name} />;

    switch (node.type) {
        case "IMAGE":
            return <img src={defaultImage} alt={node.name} />;
        case "FOLDER":
            return <img src={folderEmpty} alt={node.name} />;
        case "DOC":
            return <img src={defaultDocumentImage} alt={node.name} />;
        case "INFO":
            return <img src={monitor} alt={node.name} />;
        case "BROWSER":
            return <img src={folderEmpty} alt={node.name} />;
        default:
            return null;
    }
};
```

**Step 2: tsc + 테스트 확인**

Run: `pnpm exec tsc --noEmit && pnpm test --watchAll=false`
Expected: 0 errors, 모든 테스트 pass

**Step 3: 커밋**

```bash
git add src/features/taskbar/ui/ProgramIcons.tsx
git commit -m "refactor(taskbar): integrate resolveAsset into ProgramIcons"
```

---

### Task 7: ImageProgram의 src resolve 적용

**Files:**
- Modify: `src/pages/DesktopPage/shells/ImageProgramShell.tsx`

IMAGE 노드의 `src` 필드도 매니페스트 키로 채웠으므로, 이미지 뷰어에서 실제 이미지를 표시하려면 Shell에서 resolve해야 한다.

현재 `ImageProgram`은 `images: Array<ProgramNode>`를 통째로 받고, 내부에서 `node.src`(IMAGE 타입일 때)를 직접 `<img src={...}>`에 넣는 구조인지 확인 필요.

**Step 1: ImageProgram이 src를 어떻게 사용하는지 확인**

읽을 파일:
- `src/features/program-image/hooks/useImageNavigation.ts`
- `src/features/program-image/ui/ImageViewer.tsx`

`src` 필드가 `<img src={}>`에 직접 들어간다면, Shell에서 resolve된 URL로 교체하거나, ImageViewer에서 `resolveAsset`을 호출해야 한다.

**Step 2: resolve 로직 적용**

ImageViewer 또는 ImageProgramShell에서 `resolveAsset(node.src)` 적용.

> 정확한 코드는 Step 1 확인 후 결정. 이 Task는 탐색 + 구현을 포함한다.

**Step 3: tsc + 테스트 확인**

Run: `pnpm exec tsc --noEmit && pnpm test --watchAll=false`
Expected: 0 errors, 모든 테스트 pass

**Step 4: 커밋**

```bash
git commit -m "feat(image): resolve IMAGE src through asset manifest"
```

---

### Task 8: 최종 검증

**Step 1: 자동 검증**

```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
```

**Step 2: 수동 스모크 테스트 (`pnpm start`)**

체크리스트:
- [ ] 바탕화면: 내컴퓨터 아이콘 = monitor.png
- [ ] 바탕화면: 구글 아이콘 = chrome.png
- [ ] 바탕화면: 폴더 아이콘 = folder_empty.png 또는 folder_full.png
- [ ] 기술스택 폴더 열기: React, JavaScript 등 각각의 아이콘 표시
- [ ] IMAGE 프로그램 열기: 기술스택 이미지가 뷰어에 표시
- [ ] DOC 프로그램 열기: document_default.png 아이콘
- [ ] 작업표시줄: 실행 중인 프로그램 아이콘이 정상 표시
- [ ] 윈도우 헤더: 프로그램 아이콘이 정상 표시

> 수동 스모크는 사용자에게 부탁. 커밋 없음 (검증만).

---

## 체크포인트

- Task 1~2 완료 후: 데이터 준비 완료, 이후는 컴포넌트 수정
- Task 6 완료 후: 모든 컴포넌트 수정 완료, Task 7은 이미지 뷰어 확인
- Task 8: 최종 검증 후 사용자 리뷰 대기
