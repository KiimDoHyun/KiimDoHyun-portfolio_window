# Phase C-2: ResumeData 확정 + INFO 바인딩 + projectReulst 오타 수정

> **브랜치:** 별도 브랜치 → 별도 PR로 master 머지
> **선행 조건:** Phase B 완료 (master), 3-레이어 디커플링 완료
> **관련:** Phase C-1 (에셋 매니페스트)와 병렬 진행 가능

---

## 배경 (Why)

### INFO 프로그램의 아키텍처 불일치

Phase B + 3-레이어 디커플링 후, DOC/FOLDER/IMAGE 프로그램은 모두 동일한 데이터 흐름을 따른다:

```
portfolio.json → fileSystemStore → Shell(store 구독) → Feature(순수 컴포넌트, props)
```

그러나 INFO 프로그램만 이 흐름을 따르지 않는다:
- `ResumeData`가 `Record<string, unknown>` placeholder
- `portfolio.json`의 INFO 노드 contents가 `{}`(빈 객체)
- `InfoProgram.view.tsx`에 이름/이메일/학교/경력 등이 306줄 하드코딩
- `InfoProgramShell`이 없어서 `renderProgramContent`에서 `<InfoProgram />`을 직접 렌더

### projectReulst 오타

`content.ts`의 `ProjectData.projectReulst` 필드명이 오타(`Reulst` → `Result`).
타입, JSON 데이터, 컴포넌트, 테스트에 걸쳐 일관적으로 잘못되어 있다.

## 설계 규칙

- Feature 레이어는 `@store/*`를 직접 import하지 않는다 (3-레이어 아키텍처).
- Shell은 store 구독 + type guard만 담당하고, 로직을 넣지 않는다.
- `React.FC` 사용 금지 → `({ ... }: Props)` 구조분해.
- 배열 타입은 `Array<T>`. `T[]` 사용 금지.

## 성공 기준 (Definition of Done)

- [ ] `projectReulst` → `projectResult`로 rename 완료 (타입, JSON, 컴포넌트, 테스트)
- [ ] `ResumeData`가 구체적인 인터페이스로 확정
- [ ] `portfolio.json`의 INFO contents에 실제 데이터가 채워져 있다
- [ ] `InfoProgramShell` 생성, `renderProgramContent`에서 사용
- [ ] `InfoProgram`이 `contents: ResumeData`를 props로 받는다
- [ ] `InfoProgram.view`가 props 기반으로 렌더링한다 (하드코딩 문자열 0개)
- [ ] `tsc --noEmit` 0 errors
- [ ] 기존 테스트 전부 pass

---

## 작업 항목

### Task 1: projectReulst → projectResult 오타 수정

일괄 rename 대상:

| 파일 | 변경 내용 |
|------|-----------|
| `src/shared/types/content.ts:17` | `projectReulst` → `projectResult` |
| `src/data/portfolio.json` | 모든 DOC 노드의 `"projectReulst"` 키 (8개) |
| `src/features/program-doc/DOCProgram.tsx:38-39` | `docData.projectReulst` → `docData.projectResult` |
| `src/features/program-doc/__tests__/DOCProgram.test.tsx` | fixture의 `projectReulst` 키 |

**완료 조건:**
- [ ] `grep -rn "projectReulst" src/` → 0건
- [ ] tsc 통과, 테스트 통과

### Task 2: ResumeData 타입 확정

**파일:** `src/shared/types/content.ts`

`InfoProgram.view.tsx`의 하드코딩 값을 분석하여 추출한 스키마:

```ts
export interface ResumeLink {
    label: string;    // "Git", "Blog", "Company", "linkedin"
    url: string;      // "https://github.com/KiimDoHyun"
    icon: string;     // 에셋 매니페스트 키 (예: "github_line")
}

export interface ResumeInfoItem {
    label: string;    // "대학교", "학과", "경력" 등
    value: string;    // "금오공과대학교", "컴퓨터공학과" 등
    icon: string;     // 에셋 매니페스트 키 (예: "campus_line_blue")
}

export interface ResumeData {
    name: string;         // "김도현"
    email: string;        // "bzidol@naver.com"
    phone: string;        // "010-7793-5630"
    photo: string;        // 에셋 매니페스트 키 (예: "kdh_profile")
    summary: string;      // "남자 / 27 세"
    links: Array<ResumeLink>;
    details: Array<ResumeInfoItem>;
}
```

기존 `export type ResumeData = Record<string, unknown>;`을 위 인터페이스로 교체.

**완료 조건:**
- [ ] `ResumeData`가 구체적 필드를 가진 인터페이스로 변경
- [ ] `ResumeLink`, `ResumeInfoItem` export
- [ ] tsc 통과

### Task 3: portfolio.json INFO contents 채우기

**파일:** `src/data/portfolio.json`

INFO 노드의 `contents`를 `ResumeData` 스키마에 맞게 채운다:

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

> `icon` 필드(노드 아이콘)는 C-1에서 채우므로 여기서는 빈 문자열 유지. C-1이 먼저 머지되면 이미 채워진 상태.

**완료 조건:**
- [ ] INFO contents가 `ResumeData` 스키마와 일치
- [ ] tsc 통과

### Task 4: 에셋 매니페스트에 INFO 아이콘 등록

C-1이 먼저 머지되지 않은 경우를 대비하여, INFO에서 사용하는 아이콘을 매니페스트에 등록한다.

C-1이 이미 존재하면 해당 파일에 키를 추가하고, 없으면 `src/shared/lib/assetManifest.ts`를 신규 생성한다.

등록할 키:

| 키 | import 경로 |
|----|------------|
| `kdh_profile` | `@images/김도현.jpg` |
| `github_line` | `@images/icons/github_line.png` |
| `blog_line` | `@images/icons/blog_line.png` |
| `company_line` | `@images/icons/company_line.png` |
| `linkedin_line` | `@images/icons/linkedin_line.png` |
| `campus_line_blue` | `@images/icons/campus_line_blue.png` |
| `book_line_blue` | `@images/icons/book_line_blue.png` |
| `coding_line_blue` | `@images/icons/coding_line_blue.png` |
| `business_line_blue` | `@images/icons/business_line_blue.png` |
| `gear_line_blue` | `@images/icons/gear_line_blue.png` |
| `web_line_blue` | `@images/icons/web_line_blue.png` |
| `company_line_blue` | `@images/icons/company_line_blue.png` |

**완료 조건:**
- [ ] `resolveAsset` 함수가 위 키들을 resolve 가능
- [ ] tsc 통과

### Task 5: InfoProgramShell 생성

**파일:** `src/pages/DesktopPage/shells/InfoProgramShell.tsx` (신규)

DOCProgramShell 패턴과 동일:

```ts
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

**`renderProgramContent.tsx` 수정:**

```ts
// 변경 전
case "INFO":
    return <InfoProgram />;

// 변경 후
case "INFO":
    return <InfoProgramShell id={node.id} />;
```

**완료 조건:**
- [ ] InfoProgramShell 생성
- [ ] renderProgramContent에서 Shell 사용
- [ ] tsc 통과

### Task 6: InfoProgram props 전환

**파일:** `src/features/program-info/InfoProgram.tsx`

```ts
// 변경 전
const InfoProgram = () => {
    return <InfoProgramView />;
};

// 변경 후
import type { ResumeData } from "@shared/types/content";

interface InfoProgramProps {
    contents: ResumeData;
}

const InfoProgram = ({ contents }: InfoProgramProps) => {
    return <InfoProgramView data={contents} />;
};
```

**완료 조건:**
- [ ] InfoProgram이 `contents: ResumeData`를 prop으로 받음
- [ ] InfoProgramView에 `data` prop 전달

### Task 7: InfoProgram.view 데이터 바인딩

**파일:** `src/features/program-info/InfoProgram.view.tsx`

변경 사항:
1. 14개 이미지 import 제거 → `resolveAsset` 사용
2. Props 인터페이스 추가: `{ data: ResumeData }`
3. 하드코딩 문자열 → `data.*` props로 교체
4. links 섹션을 `data.links.map(...)` 반복으로 교체
5. body 섹션을 `data.details.map(...)` 반복으로 교체

**CSS 스타일은 변경하지 않는다.** HTML 구조와 클래스명도 최대한 유지하여 시각적 변화를 방지한다.

**완료 조건:**
- [ ] 이미지 import 0개 (resolveAsset 사용)
- [ ] 하드코딩 문자열 0개 (data props 사용)
- [ ] tsc 통과, 테스트 통과

### Task 8: 검증

**자동 검증:**
```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
grep -rn "projectReulst" src/     # 0건
```

**수동 검증:**
- [ ] 바탕화면에서 "내컴퓨터" 더블클릭 → INFO 프로그램 창 열림
- [ ] 프로필 사진 표시
- [ ] 이름, 이메일, 전화번호, 요약 정보 표시
- [ ] Git/Blog/Company/linkedin 링크 4개 표시, 클릭 시 새 탭 열림
- [ ] 하단 7개 항목(대학교, 학과, 경력, 분야, 회사, 주 스택, 주 언어) 표시
- [ ] 각 항목에 아이콘 정상 표시
- [ ] DOC 프로그램 열기 → "프로젝트 성과" 섹션 정상 표시 (projectResult rename 확인)

---

## Phase C-1과의 관계

- `resolveAsset` 함수와 매니페스트 파일은 C-1에서 생성된다.
- C-2가 먼저 진행될 경우, Task 4에서 매니페스트를 자체 생성한다.
- C-1이 먼저 머지된 상태라면, Task 4에서 기존 매니페스트에 키만 추가한다.
- 두 브랜치 머지 시 `assetManifest.ts`에서 conflict이 발생할 수 있으나, 단순 키 추가이므로 resolve가 쉽다.

## Out of scope

- 우클릭 컨텍스트 메뉴
- CRUD UI 연결
- persist 미들웨어
- DOC 노드의 빈 필드 채우기 (projectImages, projectTerm 등)
