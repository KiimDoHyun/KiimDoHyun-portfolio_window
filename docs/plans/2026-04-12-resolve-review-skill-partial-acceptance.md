# worker-resolve-review 부분 수용 분류 + 회귀 대조 증거 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `worker-resolve-review` 스킬에 "부분 수용" 4번째 분류와 회귀성 지적의 원본 대조 증거 요구사항을 추가한다.

**Architecture:** 단일 마크다운 파일(`SKILL.md`) 편집. Step 0 신설(baseRef 수집), Step 2 확장(4분류 + 회귀 판별 박스), Step 5/6 동기화(reply 템플릿 + 카운트 포맷). 외부 종속 없음.

**Tech Stack:** Markdown, bash (gh CLI 참조 예시), git

**대상 파일:** `.claude/skills/worker-resolve-review/SKILL.md` (프로젝트 루트 기준 경로 — 워크트리 안에서는 `c:\WorkSpace\KiimDoHyun-portfolio_window\.claude\worktrees\skill+resolve-review-partial-acceptance\.claude\skills\worker-resolve-review\SKILL.md`)

**설계 참조:** [`docs/plans/2026-04-12-resolve-review-skill-partial-acceptance-design.md`](./2026-04-12-resolve-review-skill-partial-acceptance-design.md)

## 입력

- 워크트리 `.claude/worktrees/skill+resolve-review-partial-acceptance` (master `0d8c9db` rebase 완료)
- 설계 문서 커밋 `6886f54`
- 대상 파일: `.claude/skills/worker-resolve-review/SKILL.md`

## 작업 내용 (체크리스트)

각 항목은 커밋 1개에 대응한다.

- [ ] Task 1: `docs(worker-resolve-review): Step 0 신설 + 부분 수용 분류 + 회귀 판별 박스 추가`
- [ ] Task 2: `docs(worker-resolve-review): reply 템플릿에 부분 수용/Before 필드 + 카운트 포맷 업데이트`
- [x] ~~Task 3: `docs(plans): worker-resolve-review 부분 수용 구현 계획 추가`~~ (본 계획서, 사전 커밋됨 `f7f5dc7`)
- [ ] Task 3 (재정의): 전체 파일 일관성 검증 + DoD 체크 (코드 수정 발생 시에만 추가 커밋)

## 완료 조건

- 설계 문서의 성공 기준(DoD) 항목 전수 통과
- `git diff origin/master --stat` 결과에 `worker-resolve-review/SKILL.md` + `docs/plans/*.md` 외 파일이 등장하지 않음
- 스킬 파일이 내부 일관성(4분류 명칭, 회귀 판별 박스 참조 링크 등) 유지

---

## Task 1: Step 0 신설 + Step 2 확장 (분류 + 회귀 판별)

**Files:**
- Modify: `.claude/skills/worker-resolve-review/SKILL.md` (Step 1 앞단, Step 2 내부)

### Step 1.1: 현재 SKILL.md 재읽기

Read 도구로 `.claude/skills/worker-resolve-review/SKILL.md` 전체를 다시 읽고 현재 Step 1, Step 2 의 정확한 라인 번호를 확인한다.

목적: 워크트리가 master 기준이므로 편집 직전 파일 상태를 한 번 더 검증한다.

### Step 1.2: Step 0 "PR 메타 수집" 신설

`## Step 1: 지적 목록 수집` 섹션 바로 앞에 다음을 삽입한다.

```markdown
## Step 0: PR 메타 수집

이후 단계에서 참조할 PR 메타 정보를 수집한다.

​```bash
# baseRef (보통 master) — 회귀성 지적 대조에 사용
baseRef=$(gh pr view <PR_NUMBER> --json baseRefName --jq '.baseRefName')
​```

`baseRef` 는 Step 2 의 회귀성 지적 판별 박스와 Step 5 의 `Before:` 필드 작성 시 참조한다.
```

### Step 1.3: Step 2 에 "부분 수용" 분류 삽입

Step 2 의 `### 수정한다 (✅ 수정)` 블록 바로 뒤, `### 기각한다 (❌ 기각)` 블록 앞에 다음을 삽입한다.

```markdown
### 부분 수용 (🟨 부분 수용)

- 리뷰어가 제시한 원칙·근거는 타당하다
- 그러나 적용 범위(N개 지점)를 이번 PR 스코프 내에서 축소(M개, M < N)하여 반영한다
- 유예된 (N - M)개는 **반드시 후속 티켓 또는 이슈 번호와 함께** 유예 사유를 명시한다

전형적인 사유:
- 나머지 지점은 다른 기능 영역의 리스크가 있어 별도 PR 로 분리
- 본 PR 스코프(Phase N) 밖의 파일
- 리그레션 검증 비용이 커서 이번 라운드에서 전부 검증 어려움

**주의:** "원칙은 받아들이되 일부만 적용" 패턴이 나타나면 `수정`이 아니라 반드시 `부분 수용`으로 분류한다. 카운트 왜곡을 막기 위한 핵심 규칙이다.
```

### Step 1.4: Step 2 말미에 "회귀성 지적 판별" 박스 삽입

Step 2 의 `### 판단 불가 (❓ 판단 필요)` 블록 뒤, `## Step 3: 수정 실행` 섹션 앞에 다음을 삽입한다.

```markdown
### 회귀성 지적 판별

다음 중 하나라도 맞으면 "회귀성 지적"으로 판정한다:

1. 지적 본문에 키워드 중 하나 등장: `회귀`, `원래`, `기존`, `이전`, `regression`
2. Basis 필드가 설계 문서 DoD 중 회귀 관련 항목을 인용: `회귀 없음`, `외관 차이 없음`, `기존 동작 보존`, `시각적 차이가 없다` 류

회귀성으로 판정되면:

- 수정 전 반드시 base branch 원본을 확인한다:
  ​```bash
  git show <baseRef>:<path>
  ​```
- 해당 확인 결과를 Step 5 reply 의 `Before:` 필드에 발췌(2~6줄)하여 포함한다
- 대조 없이 리뷰어 주장만 신뢰하여 수정하지 않는다

`<baseRef>` 는 Step 0 에서 수집한 값.
```

### Step 1.5: 변경 검증

Read 도구로 SKILL.md 재읽기 후 다음을 확인:

- Step 0 이 Step 1 앞에 존재함
- Step 2 안에 4개 분류(수정 / 부분 수용 / 기각 / 판단 필요)가 순서대로 존재
- Step 2 말미에 "회귀성 지적 판별" 박스가 존재
- 기존 Step 1, 3, 4, 5, 6 의 제목과 순서는 변경되지 않음

Grep 으로 이하 키워드 매치 확인:

```
Grep pattern: "## Step 0: PR 메타 수집" → 1 match
Grep pattern: "### 부분 수용" → 1 match (Step 2)
Grep pattern: "### 회귀성 지적 판별" → 1 match
Grep pattern: "^## Step [0-6]:" → 7 matches (Step 0~6)
```

### Step 1.6: 커밋

```bash
git add .claude/skills/worker-resolve-review/SKILL.md
git commit -m "docs(worker-resolve-review): Step 0 신설 + 부분 수용 분류 + 회귀 판별 박스 추가"
```

---

## Task 2: Step 5 Reply 템플릿 확장 + Step 6 결과 반환 동기화

**Files:**
- Modify: `.claude/skills/worker-resolve-review/SKILL.md` (Step 5, Step 6)

### Step 2.1: Step 5 내부 "수정" 템플릿에 조건부 Before 필드 추가

기존 "**수정:**" 블록을 다음과 같이 확장한다. 비-회귀성일 때는 Before 필드를 생략한다는 안내를 포함한다.

```markdown
**수정:**
​```
✅ 수정

{수정 내용 요약}

커밋: `{hash}`
​```

**수정 (회귀성 지적인 경우 — Step 2 판별 박스 참조):**
​```
✅ 수정

{수정 내용 요약}

**Before** (`git show <baseRef>:<path>` 발췌):
​```diff
{원본 코드 2~6줄}
​```

커밋: `{hash}`
​```
```

### Step 2.2: Step 5 "기각" 템플릿 앞에 "부분 수용" 템플릿 삽입

기존 "**수정:**" / "**기각:**" 사이(혹은 "**기각:**" 바로 앞)에 다음을 삽입한다.

```markdown
**부분 수용:**
​```
🟨 부분 수용

**적용 범위:** {이 PR 에서 고친 지점 목록}
**유예 범위:** {같은 원칙이 적용되지만 이번엔 안 고친 지점 목록}
**사유:** {유예 사유 — 스코프/리스크/기능 경계}
**후속 티켓:** {이슈 번호 또는 "TBD — 이번 Round 종료 후 생성"}

커밋: `{hash}`
​```
```

### Step 2.3: Step 5 요약 코멘트 카운트 포맷 업데이트

기존:

```markdown
**요약:** ✅ 수정 a건 · ❌ 기각 b건 · ❓ 판단 필요 c건 · Must Fix 잔여 d건
```

변경:

```markdown
**요약:** ✅ 수정 a · 🟨 부분 수용 b · ❌ 기각 c · ❓ 판단 필요 d · Must Fix 잔여 e
```

(단위 "건" 을 제거하여 더 짧게. 기존 문서에서 한 군데만 해당 표현이 있으니 그 한 줄만 치환.)

### Step 2.4: Step 6 결과 반환 포맷 업데이트

기존:

```markdown
수정: N건, 기각: N건, 판단 필요: N건, Must Fix 잔여: N건
```

변경:

```markdown
수정: N건, 부분 수용: N건, 기각: N건, 판단 필요: N건, Must Fix 잔여: N건
```

### Step 2.5: 변경 검증

Read 도구로 Step 5, Step 6 재확인. Grep 매치:

```
Grep pattern: "🟨 부분 수용" → 3 matches
  (Step 2 분류, Step 5 템플릿 헤더, Step 5 카운트)
Grep pattern: "Before\*\* \(\`git show" → 1 match
Grep pattern: "부분 수용: N건" → 1 match (Step 6)
```

### Step 2.6: 커밋

```bash
git add .claude/skills/worker-resolve-review/SKILL.md
git commit -m "docs(worker-resolve-review): reply 템플릿에 부분 수용/Before 필드 + 카운트 포맷 업데이트"
```

---

## Task 3: 전체 파일 일관성 최종 검증 + 설계 문서 DoD 체크

**Files:**
- Read: `.claude/skills/worker-resolve-review/SKILL.md` (전체)
- Read: `docs/plans/2026-04-12-resolve-review-skill-partial-acceptance-design.md` (DoD 섹션)

### Step 3.1: SKILL.md 전체 재읽기

Read 도구로 파일 전체를 처음부터 끝까지 읽는다.

### Step 3.2: 설계 문서 DoD 체크리스트 대조

설계 문서의 `## 성공 기준 (Definition of Done)` 섹션과 `## 수동 검증 (구현 후)` 섹션 항목을 차례로 읽으며 각 항목이 실제 SKILL.md 에 반영돼 있는지 확인한다:

- [ ] 4분류가 Step 2 에 모두 기술됨 (수정/부분 수용/기각/판단 필요)
- [ ] 부분 수용 정의 박스에 "유예 범위/후속 티켓" 필드가 들어 있음
- [ ] Step 5 reply 템플릿에 부분 수용 양식과 회귀성 수정의 Before 양식이 모두 존재
- [ ] Step 5 Resolve Round 요약 카운트가 5필드(수정/부분 수용/기각/판단 필요/잔여)로 업데이트
- [ ] Step 6 결과 반환 포맷이 4개 분류 + 잔여 를 포함
- [ ] 회귀성 지적 판별 휴리스틱 박스가 존재하고 OR 조건임이 명시
- [ ] Step 0 에서 baseRef 수집이 명시됨

### Step 3.3: 다른 스킬 미변경 확인

```bash
git diff master --stat
```

Expected output: `.claude/skills/worker-resolve-review/SKILL.md` 와 `docs/plans/*design.md`, `docs/plans/*.md` (본 계획서) 만 변경됨. `worker-review-code/SKILL.md` 와 `orchestrator-review-loop/SKILL.md` 는 변경 안 됨.

만약 의도치 않은 파일이 나오면 즉시 중단하고 사용자에게 보고한다.

### Step 3.4: 최종 보고

사용자에게 다음을 보고한다:

- 변경된 파일 목록 (`git diff master --stat`)
- 각 태스크 커밋 해시
- DoD 체크리스트 전수 통과 여부
- 다음 단계 선택지: PR 생성 / 추가 수정 / 머지 대기

---

## 실행 원칙

- **TDD 대체재:** 이 작업은 마크다운 편집이므로 코드 TDD 는 적용되지 않음. 대신 **Grep 기반 검증**(각 태스크 Step X.5)을 "테스트" 역할로 사용한다.
- **커밋 빈도:** 각 태스크 종료마다 커밋 — 총 3개 커밋 + 본 계획서 커밋.
- **DRY/YAGNI:** 동일한 정보(예: 4분류 명칭)를 여러 섹션에서 반복할 때 각 섹션 목적에 맞는 최소 형태로만 기술. 회귀성 판별 기준은 Step 2 한 곳에만 두고 Step 5 에서는 "Step 2 판별 박스 참조" 로 링크.
- **중단 조건:** Task 3 Step 3.3 에서 의도치 않은 파일 변경이 감지되면 즉시 중단하고 사용자에게 보고한다.
