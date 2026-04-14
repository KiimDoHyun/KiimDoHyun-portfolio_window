# DOC 프로그램 포맷 변경 설계

## 배경 (Why)

현재 프로젝트 경험(DOC) 화면에 두 가지 문제가 있다:

1. **이중 스크롤**: `contentsArea_Cover`와 `doc_contentsArea` 모두 `overflow: auto`를 갖고 있어 스크롤이 중첩된다.
2. **과잉 필드**: `ProjectData`에 10개 필드가 있지만, 실제로 사용하는 필드는 `projectName`과 `department`뿐이고 나머지는 모두 빈 값이다.
3. **경직된 레이아웃**: 항목마다 "타이틀 + 내용" 카드가 반복되는 구조로, 프로젝트 설명을 자유롭게 작성하기 어렵다.

이를 해결하기 위해 데이터 포맷을 축소하고, UI를 "헤더 + 마크다운 본문" 구조로 변경한다.

## 설계 규칙

- Shell(`DOCProgramShell`)에는 로직을 넣지 않는다.
- `department`는 데이터에 보존하되 UI에 표시하지 않는다.
- 마크다운 렌더링에는 `react-markdown`을 사용한다.

## 성공 기준 (Definition of Done)

- [ ] `ProjectData` 인터페이스가 4개 필드(`projectName`, `projectDesc`, `projectTerm`, `department`)만 갖는다
- [ ] `ProjectResult`, `ProjectStack` 타입이 제거되었다
- [ ] `portfolio.json`의 모든 DOC 노드가 새 포맷을 따른다
- [ ] DOC 프로그램 UI가 "헤더(이름·기간) + 마크다운 본문" 구조로 렌더된다
- [ ] 이중 스크롤이 발생하지 않는다 (본문 영역만 스크롤)
- [ ] `DocCard` 컴포넌트가 삭제되었다
- [ ] 기존 테스트가 새 구조에 맞게 수정되어 통과한다
- [ ] `pnpm build` 성공

---

## Phase 1: 데이터 레이어 변경

### 입력

- 현재 `ProjectData` 인터페이스 (`src/shared/types/content.ts`)
- 현재 `portfolio.json` (`src/data/portfolio.json`)

### 작업 내용

- [ ] `content.ts`에서 `ProjectResult`, `ProjectStack` 인터페이스 제거
- [ ] `ProjectData`를 `projectName`, `projectDesc`, `projectTerm`, `department` 4개 필드로 축소
- [ ] `DOCProgram.types.ts`의 re-export에서 `ProjectResult`, `ProjectStack` 제거
- [ ] `index.ts`의 re-export에서 `ProjectResult`, `ProjectStack` 제거
- [ ] `portfolio.json`의 모든 DOC 노드 contents에서 제거된 필드 삭제

### 완료 조건

- `ProjectData`가 4개 필드만 가진다
- `ProjectResult`, `ProjectStack` 타입이 코드베이스에 존재하지 않는다
- `portfolio.json`의 DOC 노드가 새 포맷을 따른다
- TypeScript 컴파일 에러가 없다 (`pnpm build` 기준이 아닌 타입 체크 수준)

---

## Phase 2: UI 변경 + 마크다운 지원

### 입력

- Phase 1 완료 상태
- `react-markdown` 패키지 미설치 상태

### 작업 내용

- [ ] `pnpm add react-markdown` 실행
- [ ] `DOCProgram.tsx`를 헤더(이름·기간) + 마크다운 본문 구조로 재작성
- [ ] `DOCProgram.style.ts`에서 이미지/카드 관련 스타일 제거, 헤더+본문 스타일 추가
- [ ] `DocCard.tsx` 삭제
- [ ] `DOCProgram.style.ts`에 마크다운 요소 기본 스타일 추가 (heading, list, code, paragraph 등)

### UI 구조

```
┌──────────────────────────────────┐
│  WindowHeader (기존 유지)          │
│──────────────────────────────────│
│  headerArea2 (기존 서브헤더)        │
│──────────────────────────────────│
│  ┌─ doc_header ────────────────┐ │
│  │ 프로젝트 이름     2024.01~06 │ │  ← 스크롤 안 됨
│  └─────────────────────────────┘ │
│  ┌─ doc_body (overflow: auto) ─┐ │
│  │                             │ │
│  │  react-markdown 렌더링       │ │  ← 이 영역만 스크롤
│  │                             │ │
│  └─────────────────────────────┘ │
│  bottomArea                      │
└──────────────────────────────────┘
```

- `contentsArea_Cover`는 `display: grid; grid-template-rows: auto 1fr`로 변경하여 헤더 고정 + 본문 스크롤 분리
- `doc_header`: 프로젝트 이름(좌) + 기간(우)을 한 줄에 배치
- `doc_body`: `overflow: auto`, `react-markdown`으로 `projectDesc` 렌더링

### 완료 조건

- DOC 프로그램이 헤더 + 마크다운 본문으로 렌더된다
- 이중 스크롤이 발생하지 않는다
- `DocCard.tsx` 파일이 존재하지 않는다
- 마크다운 문법(heading, list, code block, bold/italic 등)이 올바르게 렌더된다

---

## Phase 3: 테스트 수정 + 최종 검증

### 입력

- Phase 2 완료 상태

### 작업 내용

- [ ] `DOCProgram.test.tsx`를 새 `ProjectData` 구조와 UI에 맞게 재작성
- [ ] 테스트 실행 (`pnpm test`) 통과 확인
- [ ] `pnpm build` 성공 확인

### 완료 조건

- 모든 테스트 통과
- 빌드 성공

---

## 수정 파일 목록

| 파일 | 변경 |
|------|------|
| `src/shared/types/content.ts` | `ProjectData` 축소, `ProjectResult`·`ProjectStack` 제거 |
| `src/features/program-doc/DOCProgram.types.ts` | re-export 정리 |
| `src/features/program-doc/index.ts` | re-export 정리 |
| `src/data/portfolio.json` | 각 DOC의 contents 축소 |
| `src/features/program-doc/DOCProgram.tsx` | 헤더+마크다운 본문 구조로 재작성 |
| `src/features/program-doc/DOCProgram.style.ts` | 스타일 전면 교체 |
| `src/features/program-doc/ui/DocCard.tsx` | 삭제 |
| `src/features/program-doc/__tests__/DOCProgram.test.tsx` | 새 구조에 맞게 재작성 |
| `package.json` | `react-markdown` 추가 |

## 수동 검증

- [ ] DOC 아이템 더블클릭 → 윈도우가 열리고, 상단에 프로젝트 이름·기간이 표시된다
- [ ] 본문 영역에 마크다운이 올바르게 렌더된다 (heading, list, bold 등)
- [ ] 본문이 길 때 본문 영역만 스크롤되고, 헤더는 고정된다
- [ ] 이중 스크롤바가 나타나지 않는다
