# 바탕화면 구조 재정의 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** `src/data/portfolio.json` 바탕화면 트리를 재배치하고, DOC 본문 작성의 표준이 될 마크다운 템플릿 2종을 `docs/rules/content/` 아래에 도입한다.

**Architecture:** 코드 변경 0건. 데이터 파일 하나(`portfolio.json`)와 규칙 문서 3개만 수정한다. 타입·스키마·컴포넌트는 그대로 유지되므로 프로덕션 코드와 테스트(ID/type 기반, 이름 미의존)는 영향을 받지 않는다. 자세한 배경·설계·수동 검증 항목은 설계 문서 참조.

**Tech Stack:** JSON 편집, 마크다운 문서. 신규 의존성 없음.

**Design Doc:** [`docs/plans/2026-04-19-desktop-restructure-design.md`](./2026-04-19-desktop-restructure-design.md)

---

## 전체 체크리스트 & 커밋 매핑

| # | 항목 | 예상 커밋 메시지 |
|---|------|-----------------|
| 1 | `docs/rules/content/` 토픽 생성 + 상위 README 포인터 | `docs(rules): content 토픽 추가 및 rules/README 포인터 연결` |
| 2 | 프로젝트형 템플릿 작성 | `docs(rules): DOC 프로젝트형 템플릿(🅰) 추가` |
| 3 | 이니셔티브형 템플릿 작성 | `docs(rules): DOC 이니셔티브형 템플릿(🅱) 추가` |
| 4 | `portfolio.json` 바탕화면 구조 재정의 | `refactor(data): 바탕화면 트리 재배치 및 department 일관성 정리` |

커밋 규약은 [`docs/rules/commit-convention.md`](../rules/commit-convention.md) 를 따른다.

---

## Phase 1: DOC 템플릿 체계 도입

### 입력

- 설계 문서 §2 "DOC 템플릿 체계" 섹션
- 기존 `docs/rules/` 구조 (새 토픽은 `<topic>/README.md` 진입점 규약, 상위 `docs/rules/README.md` 토픽 목록에 추가)
- AGENTS.md는 포인터 허브이므로 **건드리지 않는다**. 포인터는 `docs/rules/README.md`에만 추가.

### Task 1 — `content/` 토픽 생성 + 상위 README 포인터 연결

**Files:**
- Create: `docs/rules/content/README.md`
- Modify: `docs/rules/README.md` (토픽 목록에 한 줄 추가)

**Step 1: `docs/rules/content/README.md` 작성**

아래 내용으로 생성한다.

````markdown
# 콘텐츠 작성 규칙 (Content)

이 토픽은 `src/data/portfolio.json` 안에 들어가는 **DOC 노드의 `projectDesc` 마크다운 본문**을 어떻게 쓸지에 대한 규칙이다. 타입 시스템은 DOC 본문을 자유 마크다운으로 허용하지만, 포트폴리오 전체의 일관성을 위해 아래 두 템플릿 중 하나를 따른다.

## 템플릿

- [`doc-project-template.md`](./doc-project-template.md) — 🅰 **프로젝트형**: "제품(서비스·앱·도구·프레임워크)을 만들었다"가 주된 이야기인 DOC
- [`doc-initiative-template.md`](./doc-initiative-template.md) — 🅱 **이니셔티브형**: "자발적 개선·문제해결 과제"가 주된 이야기인 DOC

## 템플릿 선택 가이드

| 질문 | 🅰 프로젝트형 | 🅱 이니셔티브형 |
|------|--------------|-----------------|
| 이 DOC의 핵심을 한 문장으로 말하면? | "~를 만들었다" | "~를 개선했다 / 풀었다" |
| 결과물이 있다면? | 제품·기능·화면 | 프로세스·도구·규칙 |
| 읽는 사람이 가장 궁금한 것은? | 어떤 기술로 무엇을 만들었나 | 왜 했고 결과로 뭐가 바뀌었나 |

## 작성 규칙

- 섹션은 `# 헤딩`(h1)으로 구분한다. DOCProgram이 `react-markdown`으로 렌더링한다.
- 각 템플릿의 **필수 섹션**은 반드시 포함한다.
- **선택 섹션은 해당 없으면 제목을 남기지 말고 통째로 생략**한다. 빈 제목은 DOC 본문을 엉성하게 만든다.
- 레퍼런스 예시는 `src/data/portfolio.json` 의 `구알맛-구알맛 오너즈`, `SBL FEMS` 두 DOC이다.
````

**Step 2: `docs/rules/README.md` 토픽 목록에 추가**

기존 토픽 목록 섹션에서 `collaboration/` 줄 바로 아래에 한 줄 추가한다.

수정 전:
```markdown
- [collaboration/](./collaboration/) — 추천 옵션 제시 시의 자체 검증 기준 등 협업 규칙
```

수정 후:
```markdown
- [collaboration/](./collaboration/) — 추천 옵션 제시 시의 자체 검증 기준 등 협업 규칙
- [content/](./content/) — `portfolio.json` DOC 본문 작성 템플릿 (🅰 프로젝트형 / 🅱 이니셔티브형)
```

**Step 3: 커밋**

```bash
git add docs/rules/content/README.md docs/rules/README.md
git commit -m "docs(rules): content 토픽 추가 및 rules/README 포인터 연결"
```

---

### Task 2 — 🅰 프로젝트형 템플릿 작성

**Files:**
- Create: `docs/rules/content/doc-project-template.md`

**Step 1: 파일 작성**

아래 내용으로 생성한다.

````markdown
# DOC 프로젝트형 템플릿 (🅰)

## 언제 이 템플릿을 쓰는가

"제품(서비스·앱·도구·프레임워크)을 만들었다"가 주된 이야기인 DOC.

**예시 (현재 포트폴리오 기준)**: `구알맛-구알맛 오너즈`, `LHWS (집클릭)`, `Araon React Framework`, `SBL FEMS`, `SBL EDM`, `셈틀꾼 홈페이지 제작`, `벼룩시장 프로젝트`.

**이 템플릿을 쓰지 말아야 할 경우**: "기존 시스템을 분리했다", "팀 워크플로를 개선했다", "라이브러리를 도입했다" 같은 이야기는 이니셔티브형(🅱) 템플릿을 쓴다.

## 섹션 스켈레톤

DOC 노드의 `contents.projectDesc` 값에 아래 마크다운을 뼈대로 작성한다.

```markdown
# 개요
한두 문단으로 "무엇을 만든 프로젝트인가"와 역할. 배경이 있으면 여기에.

# 주요 기능
- 사용자·고객이 실제로 쓰는 핵심 기능 bullet

# 기술 스택
| 영역 | 기술 |
|------|------|
| Frontend | ... |
| Backend | ... |

# 담당 업무
- 내가 맡은 부분 bullet (팀 프로젝트면 특히 중요)

# 기술적 도전
## 문제 1: XXX
(상황 → 해결 접근 → 결과)

# 성과
- 수치가 있으면 수치. 없으면 정성적 결과.

# 회고
무엇을 배웠고 다음엔 어떻게 할지.
```

## 필수 / 선택

- **필수**: `# 개요`, `# 담당 업무`
- **선택**: `# 주요 기능`, `# 기술 스택`, `# 기술적 도전`, `# 성과`, `# 회고`
  - 해당 없으면 제목 자체를 생략한다. 빈 제목을 남기지 않는다.

## 레퍼런스

- `src/data/portfolio.json` 의 `구알맛-구알맛 오너즈` 노드 `contents.projectDesc` — 이 템플릿의 모범 사례
- 같은 파일의 `SBL FEMS` — 간결 버전 (일부 섹션 생략)
````

**Step 2: 커밋**

```bash
git add docs/rules/content/doc-project-template.md
git commit -m "docs(rules): DOC 프로젝트형 템플릿(🅰) 추가"
```

---

### Task 3 — 🅱 이니셔티브형 템플릿 작성

**Files:**
- Create: `docs/rules/content/doc-initiative-template.md`

**Step 1: 파일 작성**

아래 내용으로 생성한다.

````markdown
# DOC 이니셔티브형 템플릿 (🅱)

## 언제 이 템플릿을 쓰는가

"자발적 개선·문제해결 과제"가 주된 이야기인 DOC. 명확한 "제품 결과물"보단 **프로세스·도구·규칙의 변화**가 결과인 경우.

**예시 (현재 포트폴리오 기준)**: `NMS 프로젝트 분리`, `깃 코드리뷰 슬랙 알림봇`, `AI 활용 / 개발 워크플로 스킬 도입`, `팀 DX / 코드 품질 자발적 개선`, `SNS 로그인 분석`.

**이 템플릿을 쓰지 말아야 할 경우**: 제품을 만든 이야기면 프로젝트형(🅰) 템플릿을 쓴다.

## 섹션 스켈레톤

DOC 노드의 `contents.projectDesc` 값에 아래 마크다운을 뼈대로 작성한다.

```markdown
# 배경 / 문제
왜 이걸 시작했나. 어떤 불편·리스크·기회가 있었나.

# 접근 방식
어떤 관점으로 풀었나. 선택지와 선택 근거.

# 내가 한 일
- 구체 액션 bullet (설계·구현·설득·도입 등)

# 결과 / 임팩트
- 변한 것. 수치 가능하면 수치.

# 배운 점
회고·다음에 적용할 점.
```

## 필수 / 선택

- **필수**: `# 배경 / 문제`, `# 내가 한 일`, `# 결과 / 임팩트`
- **선택**: `# 접근 방식`, `# 배운 점`
  - 해당 없으면 제목 자체를 생략한다.

## 레퍼런스

- 이 템플릿으로 작성될 예정인 5개 DOC은 아직 `projectDesc`가 비어 있다. 이후 채워지면 대표 모범 사례로 이 문단에 링크한다.
````

**Step 2: 커밋**

```bash
git add docs/rules/content/doc-initiative-template.md
git commit -m "docs(rules): DOC 이니셔티브형 템플릿(🅱) 추가"
```

### Phase 1 완료 조건

- `docs/rules/content/README.md`, `doc-project-template.md`, `doc-initiative-template.md` 세 파일이 존재한다
- `docs/rules/README.md` 토픽 목록에 `content/` 포인터가 추가되어 있다
- 3개의 커밋이 위 순서로 쌓여 있다
- 데이터(`portfolio.json`) 는 아직 손대지 않았다

### Phase 1 수동 검증

- [ ] `docs/rules/content/README.md` 를 브라우저/에디터에서 열었을 때, 두 템플릿으로 가는 상대 링크가 깨지지 않는다
- [ ] `docs/rules/README.md` 토픽 목록의 `content/` 링크가 깨지지 않는다

---

## Phase 2: `portfolio.json` 바탕화면 구조 재정의

### 입력

- Phase 1 완료 상태 (템플릿 문서가 존재)
- 설계 문서 §1 "최종 폴더 트리", §3 "청소 & 네이밍 정리", §4 "코드 영향도"

### Task 4 — `portfolio.json` 재작성

**Files:**
- Modify: `src/data/portfolio.json`

**Step 1: 기존 JSON을 바탕으로 아래 변형을 한 번에 적용**

1. **`root.children` 배열을 다음 5개 항목으로 교체** (순서 고정):
   1. 기존 `내컴퓨터` (INFO) 노드를 그대로 유지
   2. 신규 `현직` (FOLDER) — `children`: 기존 `와탭랩스` (FOLDER) 노드 그대로. 와탭랩스 폴더 아래 DOC 4건은 그대로 유지
   3. 신규 `경력` (FOLDER) — `children`: 기존 `(주)아라온소프트` 폴더 **이름만 `아라온소프트`로 변경**한 뒤 그대로 삽입
   4. 신규 `대학교` (FOLDER) — `children`:
      - 기존 `금오공과대학교 셈틀꾼` 폴더 **이름을 `셈틀꾼`으로 변경**한 뒤 삽입
      - 기존 `금오공과대학교 컴퓨터공학과 학생회` 폴더 **이름을 `컴퓨터공학과 학생회`로 변경**한 뒤 삽입
   5. 기존 `기술스택` (FOLDER) 노드를 그대로 유지 (MAIN_TECH / SUB_TECH 포함 전체)
2. **제거 항목**: 기존 `프로젝트` 래퍼 FOLDER, 그 안의 `빈폴더`·`테스트폴더`, 최상위 `구글` BROWSER
3. **DOC `contents.department` 값 정리** (폴더명과 일치시키기):
   - 아라온소프트 소속 6건: `"(주) 아라온소프트"` → `"아라온소프트"`
   - 와탭랩스 소속 4건: 이미 `"와탭랩스"` — 변경 불필요
   - `셈틀꾼 홈페이지 제작`: `"금오공과대학교 셈틀꾼"` → `"셈틀꾼"`
   - `벼룩시장 프로젝트`: `"금오공과대학교 컴퓨터공학과 학생회"` → `"컴퓨터공학과 학생회"`
4. **유지 항목**: 각 DOC의 `projectName`, `projectDesc`, `projectTerm`, `icon` 값. 특히 `구알맛-구알맛 오너즈`·`SBL FEMS`의 긴 `projectDesc` 마크다운은 한 글자도 건드리지 않는다.

**Step 2: 자동 테스트 실행 (round-trip 검증)**

```bash
pnpm test
```

Expected: 전체 통과. 특히 `src/data/__tests__/portfolio.test.ts` 의 `"conforms to PortfolioSchema and round-trips"` 가 통과해야 한다 — `buildFileSystem` → `exportFileSystem` 순회가 새 JSON과 동일한 결과를 낸다는 의미.

실패 시 원인별 대응:
- **스키마 오류** (존재하지 않는 `type`·필드 이름 오타 등): 오류 위치의 노드를 설계 문서 §1의 트리와 대조해 수정
- **round-trip 불일치**: 키 순서 문제는 아님 (`exportFileSystem` 이 스키마 순서로 내보냄). 대개 누락된 필드가 원인 — 설계 문서 §4 의 "스키마 변경: 없음" 원칙을 지켰는지 확인

**Step 3: 빌드 검증**

```bash
pnpm build
```

Expected: 성공. JSON 변경이 TS 컴파일에 영향을 주진 않지만, Vite 번들에서 `portfolio.json` import 타입 추론이 깨지지 않는지 확인.

**Step 4: 수동 검증 — 개발 서버로 UI 확인**

```bash
pnpm dev
```

브라우저에서 로그인 후 다음을 **순서대로** 확인한다. 설계 문서 §수동 검증과 동일 항목.

- [ ] 바탕화면에 아이콘이 **정확히 5개** 보인다: `내컴퓨터 / 현직 / 경력 / 대학교 / 기술스택`
- [ ] `구글`, `빈폴더`, `테스트폴더`가 **보이지 않는다**
- [ ] `현직` 더블클릭 → `와탭랩스/` 서브폴더 → DOC 4건(`NMS 프로젝트 분리` · `깃 코드리뷰 슬랙 알림봇` · `AI 활용 / 개발 워크플로 스킬 도입` · `팀 DX / 코드 품질 자발적 개선`) 이 보인다
- [ ] 위 DOC 중 아무거나 열었을 때 헤더에 `소속  와탭랩스` 가 표시된다
- [ ] `경력` 더블클릭 → `아라온소프트/` 서브폴더 → DOC 6건이 보인다
- [ ] `구알맛-구알맛 오너즈` 열기 → 마크다운 본문이 기존 그대로 렌더된다. 헤더에 `소속  아라온소프트`, `기간  2023.03 ~ 2023.08` 가 표시된다 (괄호 없음·공백 없음 확인)
- [ ] `SBL FEMS` 열기 → 마크다운 본문이 기존 그대로 렌더된다. 헤더에 `소속  아라온소프트` 로 표시된다
- [ ] `대학교` 더블클릭 → `셈틀꾼/`, `컴퓨터공학과 학생회/` 서브폴더 2개가 보인다
- [ ] `대학교/셈틀꾼/셈틀꾼 홈페이지 제작` 열기 → 헤더 `소속  셈틀꾼`
- [ ] `대학교/컴퓨터공학과 학생회/벼룩시장 프로젝트` 열기 → 헤더 `소속  컴퓨터공학과 학생회`
- [ ] `기술스택` 더블클릭 → `MAIN_TECH / SUB_TECH` 두 폴더가 기존과 동일하게 보인다. 각 IMAGE 노드도 그대로
- [ ] 상태바/route breadcrumb 이 새 경로를 따라 `/ KDH / root / 현직 / 와탭랩스 / NMS 프로젝트 분리` 형태로 정확히 표시된다

**Step 5: 커밋**

```bash
git add src/data/portfolio.json
git commit -m "refactor(data): 바탕화면 트리 재배치 및 department 일관성 정리"
```

### Phase 2 완료 조건

- Phase 1 의 성공 기준 + 아래
- 설계 문서 §성공 기준 (Definition of Done) 항목 전부 ✓
- `pnpm test` 전체 통과
- `pnpm build` 성공
- Step 4 의 수동 검증 체크리스트 전부 통과
- 4번 커밋 (`refactor(data): ...`)이 쌓였다

---

## 전체 수정 파일 목록

| 파일 | 변경 유형 | Phase |
|------|---------|-------|
| `docs/rules/content/README.md` | 신규 | 1 |
| `docs/rules/content/doc-project-template.md` | 신규 | 1 |
| `docs/rules/content/doc-initiative-template.md` | 신규 | 1 |
| `docs/rules/README.md` | 토픽 목록에 1줄 추가 | 1 |
| `src/data/portfolio.json` | 전면 재작성 (트리 재배치 + department 정리) | 2 |

총 4 커밋, 5 파일 변경.

## PR 전략

- Phase 1·2 를 **하나의 PR로 묶어 올린다** (분할하지 않음). 이번 작업은 원래 단일 목표이며, Phase는 실행 편의상의 구분일 뿐이다.
- PR 제목 예시: `refactor(data): 바탕화면 구조 재정의 및 DOC 템플릿 도입`
- PR 본문 템플릿은 `superpowers:worker-create-pr` 스킬 (프로젝트 표준: 배경 / 변경 사항 / 동작 방식 / 테스트 / 영향 범위) 을 사용한다.

## 이후 작업 (이번 스코프 밖)

다음 세션에서 순차적으로 진행할 만한 후속:

1. 11건의 빈 DOC 본문을 본 템플릿을 따라 작성 (사용자 오프라인 작업 중심 + Claude 교정 지원)
2. 이력서 DOC + PDF 타입 도입 (파일 형식 확장과 함께)
3. `내컴퓨터` ResumeData 개편 (links 아이콘 체계 정돈)
