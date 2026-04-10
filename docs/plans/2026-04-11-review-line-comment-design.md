# PR 리뷰 라인별 코멘트 전환 설계

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** review/resolve 스킬의 출력을 GitHub PR Review 라인별 코멘트로 전환하여 이슈 추적성을 개선한다.

**Architecture:** 3개 스킬 파일(.md) 수정. review는 `gh api`로 PR Review 제출 + 요약 코멘트, resolve는 review comment에 reply + 요약 코멘트, review-loop은 반환값 형태만 조정.

**Tech Stack:** GitHub REST API (`gh api`), Markdown

## 배경

현재 review / resolve 스킬은 `gh pr comment`로 **하나의 큰 코멘트**에 모든 지적과 응답을 담는다.
지적이 많아질수록 가독성이 떨어지고, 개별 이슈 추적이 어렵다.

GitHub PR Review 기능(라인별 review comment + reply 스레드)을 활용하면:
- 지적 1건 = 코멘트 1개 → 해당 코드 위치에 바로 붙음
- resolve 응답이 같은 스레드에 reply로 달림 → 이슈별 추적 완결
- "Resolve conversation"으로 해결된 건은 접을 수 있음

## 변경 대상

| 스킬 | 변경 내용 |
|---|---|
| `review` | `gh pr comment` → `gh api` PR Review 제출 (라인별 comment) + `gh pr comment` (요약) |
| `resolve-review` | `gh pr comment` → 각 review comment에 `gh api` reply + `gh pr comment` (요약) |
| `review-loop` | 변경 없음 (resolve가 API로 직접 review comment 수집) |

## Review 스킬

### 라인별 comment 포맷

```
{심각도} — {제목}

{내용}

**Basis:** {출처} — {근거}

**Suggest:**
\`\`\`ts
// 수정 코드
\`\`\`
```

- 심각도: `🔴 Must Fix`, `🟡 Should Fix`, `🟢 Suggestion`
- `Basis`: 근거 출처를 반드시 명시 (설계 문서, 컨벤션 문서, 구체적 기술 사유 등)
- `Suggest`: 수정 방안이 있을 때만 포함. 없으면 생략

### Review 제출 방식

```bash
gh api repos/{owner}/{repo}/pulls/{pr}/reviews \
  --method POST \
  -f event="REQUEST_CHANGES" \
  -f body="🔍 Review Round N — 총 M건 (🔴 a · 🟡 b · 🟢 c)" \
  -f 'comments=[
    {"path":"src/foo.ts", "line":42, "side":"RIGHT", "body":"🔴 Must Fix — ..."},
    {"path":"src/bar.ts", "line":10, "side":"RIGHT", "body":"🟡 Should Fix — ..."}
  ]'
```

- 지적 있음: `event: "REQUEST_CHANGES"`
- LGTM: `event: "APPROVE"`
- diff 범위 밖 라인에서 422 에러 발생 시: `subject_type: "file"` fallback

### 요약 코멘트

Review 제출과 별도로 `gh pr comment`로 라운드 요약을 남긴다.

```markdown
## 🔍 Review Round N

> 총 M건 (🔴 a · 🟡 b · 🟢 c)

**DoD 점검:**
- ✅ 항목 1
- ❌ 항목 2

**Out of scope 침범 여부:** 없음

**전체 평가:** 한 줄 요약
```

### 반환값

- 지적 있음: `"REVIEW_ID:{id}"` + 지적 건수
- LGTM: `"LGTM"`

## Resolve 스킬

### 지적 수집 방식

독립 실행이든 루프 실행이든 동일한 방식으로 수집한다.

```bash
# 가장 최근 review의 ID 가져오기
gh api repos/{owner}/{repo}/pulls/{pr}/reviews \
  --jq 'map(select(.state == "CHANGES_REQUESTED")) | last | .id'

# 해당 review의 comment 목록
gh api repos/{owner}/{repo}/pulls/{pr}/comments \
  --jq '[.[] | select(.pull_request_review_id == REVIEW_ID) | {id, path, line, body}]'
```

각 comment의 `body`에서 심각도, 제목, 내용, Basis, Suggest를 파싱한다.

### 처리 흐름

각 review comment마다:
1. `path`와 `line`으로 해당 코드를 Read
2. `Basis` 출처를 확인하여 타당성 판단
3. 타당하면 코드 수정, 아니면 기각 사유 정리
4. 해당 comment에 reply 남김

### Reply 포맷

**수정:**
```
✅ 수정

{수정 내용 요약}

커밋: `{hash}`
```

**기각:**
```
❌ 기각

**Reason:** {기각 사유 + 출처}
```

**판단 필요:**
```
❓ 판단 필요

- 수정 근거: ...
- 유지 근거: ...
```

### Reply 방식

```bash
gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  --method POST \
  -f body="✅ 수정 — ..."
```

### 검증 + 커밋

수정이 있으면:
```bash
pnpm exec tsc --noEmit
git commit
```

### 요약 코멘트

```markdown
## 🔧 Resolve Round N

**요약:** ✅ 수정 a건 · ❌ 기각 b건 · ❓ 판단 필요 c건 · Must Fix 잔여 d건
```

### 반환값

```
수정: N건, 기각: N건, 판단 필요: N건, Must Fix 잔여: N건
```

## Review Loop 오케스트레이터

변경 사항 없음. 기존 흐름 그대로 유지.

- review 서브에이전트가 `"LGTM"` 또는 `"REVIEW_ID:{id}"` 반환
- resolve 서브에이전트가 API로 직접 review comment 수집
- 오케스트레이터는 LGTM 여부와 라운드 카운팅만 담당

## PR 타임라인 예시

```
📝 PR Review (REQUEST_CHANGES)     ← review: 라인별 comment 포함
💬 🔍 Review Round 1               ← review: 요약 (DoD, 카운트)
💬 replies on each comment          ← resolve: 각 스레드에 응답
💬 🔧 Resolve Round 1              ← resolve: 요약
📝 PR Review (APPROVE)             ← review: LGTM
💬 🔍 Review Round 2               ← review: 요약 (DoD)
```

## 트레이드오프

| 항목 | Before | After |
|---|---|---|
| 지적 가독성 | 한 코멘트에서 스크롤 | 코드 위치에 바로 표시 |
| 이슈 추적 | 번호 매칭 필요 | 스레드 단위로 완결 |
| API 복잡도 | `gh pr comment` 1회 | `gh api` 다수 호출 |
| diff 밖 라인 | 해당 없음 | 422 에러 가능 → file fallback |

---

## 구현 계획

### Task 1: Review 스킬 — Step 3 (PR 코멘트 작성) 재작성

**Files:**
- Modify: `.claude/skills/review/SKILL.md`

**Step 1: Step 3 전체를 설계 문서 기준으로 교체**

기존 Step 3 "PR에 코멘트 작성" 섹션을 다음으로 교체:

- 라운드 번호 결정 방식: 기존 `## 🔍 Review Round` 코멘트 수 세기 → 유지
- 코멘트 작성: `gh pr comment` 단일 호출 → `gh api`로 PR Review 제출 + `gh pr comment`로 요약
- 라인별 comment 포맷: 설계 문서의 "라인별 comment 포맷" 섹션 그대로 적용
- 요약 코멘트 포맷: 설계 문서의 "요약 코멘트" 섹션 그대로 적용
- diff 범위 밖 fallback: 422 에러 시 `subject_type: "file"` 사용 안내 추가
- LGTM 케이스: `gh api`로 `event: "APPROVE"` 제출 + 요약 코멘트

**Step 2: Step 4 (결과 반환) 반환값 변경**

- 지적 있음: `"REVIEW_ID:{id}"` + 지적 건수 반환으로 변경
- LGTM: `"LGTM"` 유지

**Step 3: "리뷰하지 않는 것" / "최우선 원칙" 등 나머지 섹션**

변경 없음. 리뷰 기준과 카테고리는 그대로 유지.

**Step 4: 커밋**

```bash
git add .claude/skills/review/SKILL.md
git commit -m "refactor(skill): review 스킬 라인별 PR Review comment 전환"
```

---

### Task 2: Resolve 스킬 — 입력 수집 + Reply 방식 전환

**Files:**
- Modify: `.claude/skills/resolve-review/SKILL.md`

**Step 1: Step 1 (지적 목록 수집) 재작성**

기존: `gh pr view --comments`에서 텍스트 파싱
변경: `gh api`로 최근 CHANGES_REQUESTED review의 comment 목록 수집

```bash
# 가장 최근 review ID
gh api repos/{owner}/{repo}/pulls/{pr}/reviews \
  --jq 'map(select(.state == "CHANGES_REQUESTED")) | last | .id'

# 해당 review의 comment 목록
gh api repos/{owner}/{repo}/pulls/{pr}/comments \
  --jq '[.[] | select(.pull_request_review_id == REVIEW_ID) | {id, path, line, body}]'
```

- 독립 실행 / 루프 실행 모두 동일한 수집 방식
- 각 comment `body`에서 심각도, 제목, Basis, Suggest 파싱

**Step 2: Step 5 (커밋 + PR 코멘트) 재작성**

기존: `gh pr comment`로 전체 응답 코멘트
변경:
1. 각 review comment에 `gh api` reply (설계 문서의 Reply 포맷 적용)
2. `gh pr comment`로 라운드 요약만 남김

```bash
# 각 comment에 reply
gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  --method POST -f body="✅ 수정 — ..."

# 요약 코멘트
gh pr comment {pr} --body "## 🔧 Resolve Round N ..."
```

**Step 3: 나머지 섹션 (타당성 판단 기준, 검증 등)**

변경 없음. 판단 로직은 그대로 유지.

**Step 4: 커밋**

```bash
git add .claude/skills/resolve-review/SKILL.md
git commit -m "refactor(skill): resolve 스킬 review comment reply 방식 전환"
```

---

### Task 3: Review Loop 오케스트레이터 — 반환값 핸들링 조정

**Files:**
- Modify: `.claude/skills/review-loop/SKILL.md`

**Step 1: Step 3 루프 내 review 결과 처리 조정**

- review 서브에이전트 반환값: `"LGTM"` 또는 `"REVIEW_ID:{id}"` + 건수
- LGTM 판단 로직: `reviewResult == "LGTM"` → 유지
- resolve에 전달하는 정보: comment URL 대신 PR 번호만 전달 (resolve가 API로 직접 수집)

**Step 2: PR 타임라인 예시 업데이트**

설계 문서의 타임라인 예시로 교체.

**Step 3: 커밋**

```bash
git add .claude/skills/review-loop/SKILL.md
git commit -m "refactor(skill): review-loop 반환값 핸들링 조정"
```

---

### Task 4: 수동 검증

테스트 PR을 대상으로 실제 동작 확인.

- [ ] `review` 스킬 독립 실행 → PR에 라인별 review comment가 붙는지 확인
- [ ] `resolve-review` 스킬 독립 실행 → 각 review comment 스레드에 reply가 달리는지 확인
- [ ] `review-loop` 실행 → 라운드 순환이 정상 동작하는지 확인
- [ ] diff 범위 밖 라인 지적 시 file fallback이 동작하는지 확인
- [ ] LGTM 시 APPROVE review가 제출되는지 확인

---

## 완료 조건 (Definition of Done)

- [ ] review 스킬이 `gh api`로 PR Review를 제출하고 라인별 comment가 코드 위치에 표시된다
- [ ] resolve 스킬이 각 review comment 스레드에 reply로 응답한다
- [ ] 요약 코멘트(DoD, 카운트)가 라운드별로 별도 남는다
- [ ] review-loop 오케스트레이터가 정상 순환한다
- [ ] 기존 독립 실행 경로(`"PR #N 리뷰해"`, `"리뷰 반영해"`)가 정상 동작한다
