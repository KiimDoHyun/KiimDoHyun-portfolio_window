# Phase C-2: ResumeData + INFO 바인딩 + projectReulst 오타 수정 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** INFO 프로그램을 3-레이어 아키텍처로 전환하고, `ResumeData` 타입을 확정하여 하드코딩을 데이터 바인딩으로 교체한다. `projectReulst` 오타도 일괄 수정한다.

**Architecture:** DOCProgram 패턴을 그대로 따른다. `InfoProgramShell`(Pages 레이어)이 store를 구독하고, `InfoProgram`(Feature 레이어)은 `contents: ResumeData` prop만 받는 순수 컴포넌트로 유지한다. 아이콘은 `resolveAsset`(C-1) 또는 자체 매니페스트로 resolve한다.

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

### Task 1: projectReulst → projectResult 일괄 rename

**Files:**
- Modify: `src/shared/types/content.ts:17`
- Modify: `src/data/portfolio.json` (8곳)
- Modify: `src/features/program-doc/DOCProgram.tsx:38-39`
- Modify: `src/features/program-doc/__tests__/DOCProgram.test.tsx:12,52`

**Step 1: content.ts 수정**

변경 전 (라인 17):
```ts
    projectReulst: Array<ProjectResult>;
```
변경 후:
```ts
    projectResult: Array<ProjectResult>;
```

**Step 2: portfolio.json 수정**

모든 `"projectReulst"` → `"projectResult"` (8개 DOC 노드).

**Step 3: DOCProgram.tsx 수정**

변경 전 (라인 38-39):
```tsx
{docData.projectReulst &&
    docData.projectReulst.map((resultItem, idx) => (
```
변경 후:
```tsx
{docData.projectResult &&
    docData.projectResult.map((resultItem, idx) => (
```

**Step 4: DOCProgram.test.tsx 수정**

변경 전 (라인 12):
```ts
    projectReulst: [
```
변경 후:
```ts
    projectResult: [
```

변경 전 (라인 52):
```ts
        richProject.projectReulst.forEach((r) => {
```
변경 후:
```ts
        richProject.projectResult.forEach((r) => {
```

**Step 5: 검증**

```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
```

Run: `grep -rn "projectReulst" src/`
Expected: 0건

**Step 6: 커밋**

```bash
git add src/shared/types/content.ts src/data/portfolio.json src/features/program-doc/DOCProgram.tsx src/features/program-doc/__tests__/DOCProgram.test.tsx
git commit -m "fix(types): rename projectReulst typo to projectResult"
```

---

### Task 2: ResumeData 타입 확정

**Files:**
- Modify: `src/shared/types/content.ts`

**Step 1: 타입 정의**

변경 전 (라인 24-25):
```ts
// Placeholder — final shape decided in Phase B/C when INFO program is built out.
export type ResumeData = Record<string, unknown>;
```

변경 후:
```ts
export interface ResumeLink {
    label: string;
    url: string;
    icon: string;
}

export interface ResumeInfoItem {
    label: string;
    value: string;
    icon: string;
}

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    photo: string;
    summary: string;
    links: Array<ResumeLink>;
    details: Array<ResumeInfoItem>;
}
```

**Step 2: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors (portfolio.json의 INFO contents가 아직 `{}`이므로 JSON import가 아닌 런타임 hydrate라 tsc에 영향 없음)

**Step 3: 커밋**

```bash
git add src/shared/types/content.ts
git commit -m "feat(types): define concrete ResumeData schema"
```

---

### Task 3: portfolio.json INFO contents 채우기

**Files:**
- Modify: `src/data/portfolio.json`

**Step 1: INFO 노드 contents 업데이트**

변경 전 (라인 9-12):
```json
{
    "type": "INFO",
    "name": "내컴퓨터",
    "icon": "",
    "contents": {}
}
```

변경 후:
```json
{
    "type": "INFO",
    "name": "내컴퓨터",
    "icon": "",
    "contents": {
        "name": "김도현",
        "email": "bzidol@naver.com",
        "phone": "010-7793-5630",
        "photo": "kdh_profile",
        "summary": "남자 / 27 세",
        "links": [
            { "label": "Git", "url": "https://github.com/KiimDoHyun", "icon": "github_line" },
            { "label": "Blog", "url": "https://velog.io/@kdh123", "icon": "blog_line" },
            { "label": "Company", "url": "https://www.whatap.io/ko/", "icon": "company_line" },
            { "label": "linkedin", "url": "https://www.linkedin.com/in/%EB%8F%84%ED%98%84-%EA%B9%80-b4a477252/", "icon": "linkedin_line" }
        ],
        "details": [
            { "label": "대학교", "value": "금오공과대학교", "icon": "campus_line_blue" },
            { "label": "학과", "value": "컴퓨터공학과", "icon": "book_line_blue" },
            { "label": "경력", "value": "1 년(주니어)", "icon": "business_line_blue" },
            { "label": "분야", "value": "Front-end", "icon": "web_line_blue" },
            { "label": "회사", "value": "와탭랩스", "icon": "company_line_blue" },
            { "label": "주 스택", "value": "React", "icon": "gear_line_blue" },
            { "label": "주 언어", "value": "자바스크립트", "icon": "coding_line_blue" }
        ]
    }
}
```

> `icon` 필드(노드 아이콘)는 C-1 영역이므로 빈 문자열 유지.

**Step 2: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors

**Step 3: 커밋**

```bash
git add src/data/portfolio.json
git commit -m "data(portfolio): populate INFO contents with ResumeData"
```

---

### Task 4: 에셋 매니페스트에 INFO 아이콘 등록

**Files:**
- Create or Modify: `src/shared/lib/assetManifest.ts`

C-1이 이미 머지되었다면 기존 파일에 키만 추가. 아니면 신규 생성.

**Step 1: C-1 매니페스트 존재 여부 확인**

```bash
ls src/shared/lib/assetManifest.ts
```

**Step 2a: 매니페스트가 이미 있으면 키 추가**

추가할 import + 키:

```ts
import kdhProfile from "@images/김도현.jpg";
import githubLine from "@images/icons/github_line.png";
import blogLine from "@images/icons/blog_line.png";
import companyLine from "@images/icons/company_line.png";
import linkedinLine from "@images/icons/linkedin_line.png";
import campusLineBlue from "@images/icons/campus_line_blue.png";
import bookLineBlue from "@images/icons/book_line_blue.png";
import codingLineBlue from "@images/icons/coding_line_blue.png";
import businessLineBlue from "@images/icons/business_line_blue.png";
import gearLineBlue from "@images/icons/gear_line_blue.png";
import webLineBlue from "@images/icons/web_line_blue.png";
import companyLineBlue from "@images/icons/company_line_blue.png";
```

매니페스트 객체에 추가:
```ts
    kdh_profile: kdhProfile,
    github_line: githubLine,
    blog_line: blogLine,
    company_line: companyLine,
    linkedin_line: linkedinLine,
    campus_line_blue: campusLineBlue,
    book_line_blue: bookLineBlue,
    coding_line_blue: codingLineBlue,
    business_line_blue: businessLineBlue,
    gear_line_blue: gearLineBlue,
    web_line_blue: webLineBlue,
    company_line_blue: companyLineBlue,
```

**Step 2b: 매니페스트가 없으면 신규 생성**

위 import + 키만 포함하는 `assetManifest.ts` 생성. `resolveAsset` 함수도 동일하게 export.

**Step 3: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: 0 errors

**Step 4: 커밋**

```bash
git add src/shared/lib/assetManifest.ts
git commit -m "feat(shared): register INFO program icons in asset manifest"
```

---

### Task 5: InfoProgramShell 생성 + renderProgramContent 연결

**Files:**
- Create: `src/pages/DesktopPage/shells/InfoProgramShell.tsx`
- Modify: `src/pages/DesktopPage/renderProgramContent.tsx`

**Step 1: InfoProgramShell 생성**

```tsx
import { useFileSystemStore } from "@store/fileSystemStore";
import InfoProgram from "@features/program-info/InfoProgram";
import type { ProgramId } from "@shared/types/program";

interface InfoProgramShellProps {
    id: ProgramId;
}

const InfoProgramShell = ({ id }: InfoProgramShellProps) => {
    const node = useFileSystemStore((s) => s.nodes[id]);

    if (!node || node.type !== "INFO") return null;

    return <InfoProgram contents={node.contents} />;
};

export default InfoProgramShell;
```

**Step 2: renderProgramContent.tsx 수정**

변경 전 (라인 3, 31-32):
```tsx
import InfoProgram from "@features/program-info/InfoProgram";
...
case "INFO":
    return <InfoProgram />;
```

변경 후:
```tsx
import InfoProgramShell from "./shells/InfoProgramShell";
...
case "INFO":
    return <InfoProgramShell id={node.id} />;
```

`InfoProgram` 직접 import 제거.

**Step 3: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: error — `InfoProgram`이 아직 `contents` prop을 받지 않으므로 타입 에러 가능.
이 경우 Task 6과 함께 해결. tsc 에러가 나도 커밋하지 않고 Task 6으로 진행.

> **판단 포인트:** tsc가 통과하면 여기서 커밋. 에러가 나면 Task 6과 묶어서 커밋.

---

### Task 6: InfoProgram props 전환

**Files:**
- Modify: `src/features/program-info/InfoProgram.tsx`

**Step 1: props 수신으로 변경**

변경 전:
```tsx
import InfoProgramView from "./InfoProgram.view";

const InfoProgram = () => {
    return <InfoProgramView />;
};

export default InfoProgram;
```

변경 후:
```tsx
import InfoProgramView from "./InfoProgram.view";
import type { ResumeData } from "@shared/types/content";

interface InfoProgramProps {
    contents: ResumeData;
}

const InfoProgram = ({ contents }: InfoProgramProps) => {
    return <InfoProgramView data={contents} />;
};

export default InfoProgram;
```

**Step 2: tsc 확인**

Run: `pnpm exec tsc --noEmit`
Expected: error — `InfoProgramView`가 아직 `data` prop을 받지 않음. Task 7에서 해결.

> Task 5~7은 서로 의존적이므로, tsc 통과 시점에서 묶어 커밋해도 된다.

---

### Task 7: InfoProgram.view 데이터 바인딩

**Files:**
- Modify: `src/features/program-info/InfoProgram.view.tsx`

**Step 1: props 인터페이스 추가 + 이미지 import 교체**

변경 전 (라인 1-17):
```tsx
import { css } from "@styled-system/css";

import KDH from "@images/김도현.jpg";
import blogLine from "@images/icons/blog_line.png";
import githubLine from "@images/icons/github_line.png";
import companyLine from "@images/icons/company_line.png";
import linkedin from "@images/icons/linkedin_line.png";

import campus from "@images/icons/campus_line_blue.png";
import book from "@images/icons/book_line_blue.png";
import coding from "@images/icons/coding_line_blue.png";
import business from "@images/icons/business_line_blue.png";
import gear from "@images/icons/gear_line_blue.png";
import web from "@images/icons/web_line_blue.png";
import companyBlue from "@images/icons/company_line_blue.png";

const InfoProgramView = () => {
```

변경 후:
```tsx
import { css } from "@styled-system/css";
import { resolveAsset } from "@shared/lib/assetManifest";
import type { ResumeData } from "@shared/types/content";

interface InfoProgramViewProps {
    data: ResumeData;
}

const InfoProgramView = ({ data }: InfoProgramViewProps) => {
```

**Step 2: top 영역 — 프로필 + 링크**

변경 전 (라인 23-99, 하드코딩):
```tsx
<div className="info1">
    <div className="myImageArea">
        <img src={KDH} alt="김도현" />
    </div>
    <div className="myInfoArea">
        <h1>김도현</h1>
        <p style={{ userSelect: "text" }}>bzidol@naver.com</p>
        <p>010-7793-5630</p>
        <p>{"남자 / 27 세"}</p>
    </div>
</div>
<div className="info2">
    {/* 4개 링크 아이템이 각각 하드코딩 */}
</div>
```

변경 후:
```tsx
<div className="info1">
    <div className="myImageArea">
        <img src={resolveAsset(data.photo) ?? ""} alt={data.name} />
    </div>
    <div className="myInfoArea">
        <h1>{data.name}</h1>
        <p style={{ userSelect: "text" }}>{data.email}</p>
        <p>{data.phone}</p>
        <p>{data.summary}</p>
    </div>
</div>
<div className="info2">
    {data.links.map((link) => (
        <div className="infoItem" key={link.label}>
            <div className="myImageArea">
                <img src={resolveAsset(link.icon) ?? ""} alt={link.label} />
            </div>
            <div className="myInfoArea">
                <p>{link.label}</p>
                <a target="_blank" href={link.url} rel="noreferrer">
                    이동하기
                </a>
            </div>
        </div>
    ))}
</div>
```

**Step 3: body 영역 — 상세 정보**

변경 전 (라인 101-166, 7개 아이템 각각 하드코딩):
```tsx
<div className="body">
    <div className="infoItem">
        <div className="myImageArea"><img src={campus} alt="campus" /></div>
        <div className="myInfoArea">
            <p className="title">대학교</p>
            <p className="desc">금오공과대학교</p>
        </div>
    </div>
    {/* 나머지 6개 반복... */}
</div>
```

변경 후:
```tsx
<div className="body">
    {data.details.map((item) => (
        <div className="infoItem" key={item.label}>
            <div className="myImageArea">
                <img src={resolveAsset(item.icon) ?? ""} alt={item.label} />
            </div>
            <div className="myInfoArea">
                <p className="title">{item.label}</p>
                <p className="desc">{item.value}</p>
            </div>
        </div>
    ))}
</div>
```

**Step 4: CSS 스타일은 변경하지 않음** — `infoProgramContentStyle` 그대로 유지.

**Step 5: tsc + 테스트 확인**

Run: `pnpm exec tsc --noEmit && pnpm test --watchAll=false`
Expected: 0 errors, 모든 테스트 pass

**Step 6: Task 5~7 묶어 커밋**

```bash
git add src/pages/DesktopPage/shells/InfoProgramShell.tsx src/pages/DesktopPage/renderProgramContent.tsx src/features/program-info/InfoProgram.tsx src/features/program-info/InfoProgram.view.tsx
git commit -m "refactor(info): apply 3-layer architecture with ResumeData binding"
```

---

### Task 8: 최종 검증

**Step 1: 자동 검증**

```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
grep -rn "projectReulst" src/       # 0건
grep -rn "Record<string, unknown>" src/shared/types/content.ts  # 0건
```

**Step 2: 수동 스모크 테스트 (`pnpm start`)**

체크리스트:
- [ ] 바탕화면에서 "내컴퓨터" 더블클릭 → INFO 프로그램 창 열림
- [ ] 프로필 사진(김도현.jpg) 표시
- [ ] 이름 "김도현", 이메일, 전화번호, "남자 / 27 세" 표시
- [ ] Git/Blog/Company/linkedin 링크 4개 + 아이콘 표시
- [ ] 각 링크 클릭 시 새 탭에서 해당 URL 열림
- [ ] 하단 7개 항목(대학교~주 언어) + 아이콘 표시
- [ ] DOC 프로그램 열기 → "프로젝트 성과" 섹션 정상 렌더 (projectResult rename 확인)

> 수동 스모크는 사용자에게 부탁. 커밋 없음.

---

## 체크포인트

- Task 1 완료 후: 오타 수정 독립 검증 가능
- Task 4 완료 후: 데이터 + 타입 + 매니페스트 준비 완료
- Task 7 완료 후: 전체 바인딩 완료, 최종 검증 진입
- Task 8: 사용자 리뷰 대기
