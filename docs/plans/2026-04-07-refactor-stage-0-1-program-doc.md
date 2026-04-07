# Stage 0+1: 테스트 셋업 & program-doc 리팩토링 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 테스트 셋업을 정비하고 `program-doc` feature를 새 패턴(Container/Component 통합 + 명시 타입 + 테스트)으로 리팩토링하여 후속 단계의 템플릿을 확립한다.

**Architecture:** `program-doc`은 Recoil을 사용하지 않고 `projectDatas` 정적 데이터에만 의존하므로 패턴 검증에 이상적이다. Container/Component 2파일을 단일 `DOCProgram.tsx` + (선택적) hook으로 통합하고, characterization test로 동작을 보존한다.

**Tech Stack:** React 19, TypeScript, Recoil(이번엔 미사용), Jest, @testing-library/react, @testing-library/user-event v14, Panda CSS

**참조 문서:** [docs/plans/2026-04-07-refactor-global-state-boundary-design.md](./2026-04-07-refactor-global-state-boundary-design.md)

---

## Stage 0: 테스트 셋업 정비

### Task 0.1: user-event v14로 업그레이드

**Files:**
- Modify: `package.json`

**Step 1: 현재 버전 확인**

Run: `pnpm list @testing-library/user-event`
Expected: `@testing-library/user-event 13.5.0`

**Step 2: v14 업그레이드**

Run: `pnpm add -D @testing-library/user-event@^14`
Expected: 정상 설치, `package.json`의 devDependencies가 `^14.x.x`로 변경됨

**Step 3: 기존 테스트가 있다면 동작 확인**

Run: `pnpm test -- --watchAll=false --passWithNoTests`
Expected: PASS (테스트 없음 또는 모두 통과)

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade @testing-library/user-event to v14"
```

---

### Task 0.2: 테스트 작성용 헬퍼 디렉토리 준비

**Files:**
- Create: `src/test-utils/index.ts`

**Step 1: 헬퍼 파일 생성**

```ts
// src/test-utils/index.ts
// 공용 테스트 유틸. 필요해질 때 점진 확장한다.
// 현재는 빈 export로만 placeholder 역할.
export {};
```

**Step 2: Commit**

```bash
git add src/test-utils/index.ts
git commit -m "chore: add test-utils placeholder for shared test helpers"
```

---

## Stage 1: program-doc 리팩토링

### 사전 정보 (Claude는 반드시 읽을 것)

- **현재 구조:**
  - [src/features/program-doc/DOCProgramContainer.tsx](../../src/features/program-doc/DOCProgramContainer.tsx) — `{type, name}` props로 받아 `projectDatas`에서 검색, `DOCData = {data, keys}` 생성 후 Component에 전달. **`useMemo` + 단순 lookup**. Recoil 미사용.
  - [src/features/program-doc/DOCProgramComponent.tsx](../../src/features/program-doc/DOCProgramComponent.tsx) — `DOCData.data`의 필드를 카드 UI로 렌더링. `projectImages`, `projectName`, `projectDesc`, `projectReulst`(오타 - 데이터 원본 그대로 둬야 함), `projectTerm`, `projectType`, `role`, `department`, `stack`, `url` 사용.
  - **`type !== "DOC"` 이면 `DOCData`는 `null`** → Component가 null 참조하면 크래시함. 현 코드는 ProgramComponent에서 `item.type === "DOC"` 일 때만 렌더하므로 안전. 새 컴포넌트에서도 이 가드를 명시해야 함.
- **호출처:** [src/features/window-shell/ProgramComponent.tsx:142](../../src/features/window-shell/ProgramComponent.tsx#L142) — `<DOCProgramContainer type={item.type} name={item.name} />`
- **데이터 소스:** `@shared/lib/data`의 `projectDatas` (정적). 실제 형태를 Task 1.1에서 확인.

---

### Task 1.1: projectDatas 타입 확인

**Files:**
- Read: `src/shared/lib/data.ts` (또는 `data/index.ts`)

**Step 1: 데이터 모듈 위치/형태 파악**

Run: `Glob src/shared/lib/data*` 후 Read로 확인

**Step 2: ProjectData 타입을 메모**

다음 필드들의 실제 타입을 파악해서 다음 Task에서 사용:
- `projectName: string`
- `projectImages: string[]` (옵셔널?)
- `projectDesc: string`
- `projectReulst: { title: string; content: string }[]` (오타 그대로)
- `projectTerm: string[]`
- `projectType: string`
- `role: string[]`
- `department: string`
- `stack: { name: string; img: string }[]`
- `url?: string`

**Step 3: 실제 타입을 확정**

데이터 파일에 이미 타입이 export 되어 있다면 import해서 쓰고, 없다면 다음 Task에서 `ProjectData` 타입을 신규 정의.

**커밋 없음.** 이 Task는 정보 수집만.

---

### Task 1.2: DOCProgram의 사용자 시나리오 characterization test 작성

**Files:**
- Create: `src/features/program-doc/__tests__/DOCProgramContainer.test.tsx`

**Step 1: 실패하는 테스트 작성 (현재 동작 캡처)**

> **주의:** 아직 새 컴포넌트(`DOCProgram.tsx`)가 없으므로, 이 테스트는 **기존 `DOCProgramContainer`를 대상으로** 작성한다. 리팩토링 후에는 import만 새 컴포넌트로 바꾸고 동일하게 통과해야 한다.

```tsx
// src/features/program-doc/__tests__/DOCProgramContainer.test.tsx
import { render, screen } from "@testing-library/react";
import DOCProgramContainer from "../DOCProgramContainer";
import { projectDatas } from "@shared/lib/data";

describe("DOCProgramContainer", () => {
  // 테스트 대상으로 첫 번째 프로젝트 사용
  const sample = projectDatas[0];

  it("프로젝트명을 렌더한다", () => {
    render(<DOCProgramContainer type="DOC" name={sample.projectName} />);
    expect(screen.getByText(sample.projectName)).toBeInTheDocument();
  });

  it("프로젝트 설명을 렌더한다", () => {
    render(<DOCProgramContainer type="DOC" name={sample.projectName} />);
    expect(screen.getByText(sample.projectDesc)).toBeInTheDocument();
  });

  it("프로젝트 성과 항목들을 렌더한다", () => {
    render(<DOCProgramContainer type="DOC" name={sample.projectName} />);
    sample.projectReulst?.forEach((r: { title: string }) => {
      expect(
        screen.getByText(new RegExp(r.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      ).toBeInTheDocument();
    });
  });

  it("스택 아이템들을 렌더한다", () => {
    render(<DOCProgramContainer type="DOC" name={sample.projectName} />);
    sample.stack.forEach((s: { name: string }) => {
      expect(screen.getByText(s.name)).toBeInTheDocument();
    });
  });

  it("프로젝트 이미지가 없을 때 안내 문구를 표시한다", () => {
    // projectImages가 빈 배열인 프로젝트 찾기 또는 mock
    const noImageProject = projectDatas.find(
      (p: any) => !p.projectImages || p.projectImages.length === 0
    );
    if (!noImageProject) {
      // 모든 프로젝트가 이미지를 가진 경우 스킵
      return;
    }
    render(<DOCProgramContainer type="DOC" name={noImageProject.projectName} />);
    expect(screen.getByText("프로젝트 이미지가 없습니다.")).toBeInTheDocument();
  });

  it("url이 없을 때 '공개된 URL 없음'을 표시한다", () => {
    const noUrlProject = projectDatas.find((p: any) => !p.url);
    if (!noUrlProject) return;
    render(<DOCProgramContainer type="DOC" name={noUrlProject.projectName} />);
    expect(screen.getByText("공개된 URL 없음")).toBeInTheDocument();
  });
});
```

**Step 2: 테스트 실행하여 통과 확인 (characterization 이므로 기존 동작이 그대로 통과해야 함)**

Run: `pnpm test -- --watchAll=false src/features/program-doc`
Expected: 모든 테스트 PASS. 만약 FAIL이면 테스트가 실제 데이터와 안 맞는 것 — 데이터를 확인하여 테스트를 수정.

> **중요:** 여기서 FAIL이 나면 리팩토링을 시작하면 안 된다. 먼저 테스트가 현재 동작에 맞춰 그린이 되어야 안전망이 된다.

**Step 3: Commit**

```bash
git add src/features/program-doc/__tests__/DOCProgramContainer.test.tsx
git commit -m "test: add characterization tests for DOCProgramContainer"
```

---

### Task 1.3: 새 단일 컴포넌트 DOCProgram.tsx 생성 (타입 명시 + 통합)

**Files:**
- Create: `src/features/program-doc/DOCProgram.tsx`

**Step 1: 새 컴포넌트 작성**

> Container/Component 통합. 로직이 단순(useMemo + lookup)하므로 hook 추출은 생략. props에 명시 타입 부여.

```tsx
// src/features/program-doc/DOCProgram.tsx
import React, { useMemo } from "react";
import { css } from "@styled-system/css";
import { projectDatas } from "@shared/lib/data";

// 타입은 가능한 한 데이터 모듈에서 import. 없으면 여기서 정의.
interface ProjectResult {
  title: string;
  content: string;
}
interface ProjectStack {
  name: string;
  img: string;
}
interface ProjectData {
  projectName: string;
  projectImages?: string[];
  projectDesc: string;
  projectReulst?: ProjectResult[]; // 데이터 원본 오타 유지
  projectTerm: string[];
  projectType: string;
  role: string[];
  department: string;
  stack: ProjectStack[];
  url?: string;
}

interface DOCProgramProps {
  type: string;
  name: string;
}

const DOCProgram: React.FC<DOCProgramProps> = ({ type, name }) => {
  const docData = useMemo<ProjectData | null>(() => {
    if (type !== "DOC") return null;
    const target = projectDatas.find(
      (item: ProjectData) => item.projectName === name
    );
    return target ?? null;
  }, [type, name]);

  if (!docData) return null;

  return (
    <>
      <div className={`headerArea2 headerArea2_${type}`} />
      <div className={`${docProgramContentStyle} contentsArea_Cover`}>
        <div className="contentsArea_doc">
          <div className="doc_imageArea">
            {docData.projectImages && docData.projectImages.length > 0 ? (
              docData.projectImages.map((imageItem, idx) => (
                <div key={idx} className="projectImageItem">
                  <img src={imageItem} alt={`${imageItem}${idx + 1}`} />
                </div>
              ))
            ) : (
              <div className="noProjectImage">프로젝트 이미지가 없습니다.</div>
            )}
          </div>

          <div className={`${docProgramContentStyle} doc_contentsArea`}>
            <DocCard title="프로젝트 명">{docData.projectName}</DocCard>
            <DocCard title="프로젝트 설명">{docData.projectDesc}</DocCard>
            <DocCard title="프로젝트 성과">
              <div className="doc_reulst">
                {docData.projectReulst?.map((resultItem, idx) => (
                  <div key={idx} className="cardResult">
                    <div className="resultTitle">
                      {`${idx + 1}. `} {resultItem.title}
                    </div>
                    <div className="resultContent">{resultItem.content}</div>
                  </div>
                ))}
              </div>
            </DocCard>
            <DocCard title="프로젝트 기간">
              {docData.projectTerm.map((termItem, idx) => (
                <div key={idx}>{termItem}</div>
              ))}
            </DocCard>
            <DocCard title="프로젝트 성격">{docData.projectType}</DocCard>
            <DocCard title="담당 역할">
              {docData.role.map((roleItem, idx) => (
                <div key={idx}>
                  {`${idx + 1}. `}
                  {roleItem}
                </div>
              ))}
            </DocCard>
            <DocCard title="개발부서">{docData.department}</DocCard>
            <DocCard title="사용한 기술 스택">
              <div className="doc_stack">
                {docData.stack.map((stackItem, idx) => (
                  <div className="stackItem" key={idx}>
                    <div className="stackItem_name">{stackItem.name}</div>
                    <div className="stackItem_Image">
                      <img src={stackItem.img} alt="stackImage" />
                    </div>
                  </div>
                ))}
              </div>
            </DocCard>
            <DocCard title="url">{docData.url || "공개된 URL 없음"}</DocCard>
          </div>
        </div>
      </div>
    </>
  );
};

// 작은 presentational 헬퍼. 같은 파일 내에 둬도 충분 (DRY 위해 추출).
interface DocCardProps {
  title: string;
  children: React.ReactNode;
}
const DocCard: React.FC<DocCardProps> = ({ title, children }) => (
  <div className="doc_card">
    <div className="cardTitle">{title}</div>
    <div className="cardContent">{children}</div>
  </div>
);

const docProgramContentStyle = css({
  // 기존 DOCProgramComponent.tsx의 스타일을 그대로 복사
});

export default DOCProgram;
```

> **중요:** `docProgramContentStyle`의 내용은 [src/features/program-doc/DOCProgramComponent.tsx:139-278](../../src/features/program-doc/DOCProgramComponent.tsx#L139-L278)에서 **그대로 복사**해 붙여넣어야 한다. 스타일 변경 금지.

**Step 2: TypeScript 컴파일 확인**

Run: `pnpm build`
Expected: 컴파일 에러 없음. (Panda codegen 포함)

만약 `projectDatas`에 이미 타입이 있다면 위 인터페이스 정의는 삭제하고 `import type { ProjectData } from "@shared/lib/data"` 사용.

**Step 3: Commit**

```bash
git add src/features/program-doc/DOCProgram.tsx
git commit -m "feat(program-doc): add unified DOCProgram component with explicit types"
```

---

### Task 1.4: 호출처를 새 컴포넌트로 교체

**Files:**
- Modify: `src/features/program-doc/index.ts`
- Modify: `src/features/window-shell/ProgramComponent.tsx:15, 142`

**Step 1: index.ts 업데이트**

```ts
// src/features/program-doc/index.ts
export { default as DOCProgram } from "./DOCProgram";
// 기존 export는 다음 Task에서 파일과 함께 삭제
```

**Step 2: ProgramComponent.tsx import 교체**

[ProgramComponent.tsx:15](../../src/features/window-shell/ProgramComponent.tsx#L15)
```tsx
// Before
import DOCProgramContainer from "@features/program-doc/DOCProgramContainer";
// After
import { DOCProgram } from "@features/program-doc";
```

[ProgramComponent.tsx:142](../../src/features/window-shell/ProgramComponent.tsx#L142)
```tsx
// Before
{item.type === "DOC" && (
  <DOCProgramContainer type={item.type} name={item.name} />
)}
// After
{item.type === "DOC" && (
  <DOCProgram type={item.type} name={item.name} />
)}
```

**Step 3: 테스트 파일도 새 컴포넌트를 import 하도록 수정**

`src/features/program-doc/__tests__/DOCProgramContainer.test.tsx`의 import만 교체:
```tsx
// Before
import DOCProgramContainer from "../DOCProgramContainer";
// After
import DOCProgram from "../DOCProgram";
```

그리고 `render(<DOCProgramContainer ... />)`를 모두 `render(<DOCProgram ... />)`로 교체.

파일명도 변경:
```bash
git mv src/features/program-doc/__tests__/DOCProgramContainer.test.tsx \
       src/features/program-doc/__tests__/DOCProgram.test.tsx
```

**Step 4: 테스트 실행**

Run: `pnpm test -- --watchAll=false src/features/program-doc`
Expected: 모든 테스트 PASS. (characterization 테스트가 새 구현에서도 그대로 통과 = 동작 보존 증명)

**Step 5: 빌드 확인**

Run: `pnpm build`
Expected: 성공

**Step 6: Commit**

```bash
git add src/features/program-doc/index.ts \
        src/features/window-shell/ProgramComponent.tsx \
        src/features/program-doc/__tests__/
git commit -m "refactor(program-doc): switch callers to unified DOCProgram"
```

---

### Task 1.5: 구 Container/Component 파일 삭제

**Files:**
- Delete: `src/features/program-doc/DOCProgramContainer.tsx`
- Delete: `src/features/program-doc/DOCProgramComponent.tsx`

**Step 1: 다른 참조가 없는지 최종 확인**

Run: `Grep "DOCProgramContainer|DOCProgramComponent" --type tsx --type ts`
Expected: 매치 0건 (또는 docs/madge svg 같은 비-소스 파일만)

**Step 2: 파일 삭제**

```bash
git rm src/features/program-doc/DOCProgramContainer.tsx \
       src/features/program-doc/DOCProgramComponent.tsx
```

**Step 3: 최종 검증**

```bash
pnpm test -- --watchAll=false
pnpm build
```
Expected: 둘 다 성공

**Step 4: Commit**

```bash
git commit -m "refactor(program-doc): remove legacy Container/Component files"
```

---

### Task 1.6: PR 생성 (선택)

**Step 1: 변경 사항 확인**

Run: `git log --oneline origin/master..HEAD`
Expected: Stage 0 + Stage 1 커밋들 (5~7개)

**Step 2: 사용자에게 PR 생성 여부 확인**

수동 확인 후 `gh pr create` 또는 다음 단계로 진행.

---

## Stage 1 완료 기준

- [x] `program-doc` 폴더에 `DOCProgram.tsx` + `__tests__/` 만 존재
- [x] `DOCProgramContainer.tsx`, `DOCProgramComponent.tsx` 삭제됨
- [x] 모든 props에 명시 타입 부여
- [x] characterization 테스트 그린
- [x] `pnpm build` 성공
- [x] `ProgramComponent.tsx` 호출처 업데이트됨

## 다음 단계

Stage 2 (`program-folder`)부터는 **전역 상태 끌어올리기**가 본격적으로 등장한다. Stage 1 완료 후 별도 plan 문서로 작성한다 (`docs/plans/2026-04-XX-refactor-stage-2-program-folder.md`).
