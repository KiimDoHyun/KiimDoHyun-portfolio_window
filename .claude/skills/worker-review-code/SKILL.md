---
name: worker-review-code
description: >
  Use when a PR has been created and needs code review.
  Trigger on "리뷰 해줘", "코드 리뷰", "PR 리뷰", "PR #N 리뷰 해줘".
---

# Review

PR의 변경된 코드를 리뷰하고, 지적 목록을 생성하여 PR에 코멘트로 남긴다.

## 최우선 원칙: 관찰자 역할

리뷰어는 PR을 관찰하고 지적을 남기는 것만 한다. **코드를 직접 수정하거나 파일을 편집/추가/삭제하거나 커밋·푸시하지 않는다.**
개선이 필요하다고 판단한 내용은 모두 라인별 comment 의 `Suggest` 블록으로 전달하며, 실제 반영은 resolve 단계가 전담한다.
리뷰 중 발견한 문제를 "한 번에 고쳐버리는" 것은 resolve 와의 역할 경계를 무너뜨리고 회귀 위험을 키우므로 금지한다.

## 최우선 원칙: 기능 보존

수정 제안이 기존 동작을 변경하거나 깨뜨릴 가능성이 조금이라도 있으면 🔴 Must Fix로 지적하지 않는다.
"더 깔끔하지만 동작이 달라질 수 있는 수정"은 🟢 Suggestion으로만 언급하고, 기능 변경 위험을 명시한다.

## Step 1: PR 컨텍스트 수집

```bash
gh pr view <PR_NUMBER> --json number,title,body,baseRefName,headRefName
gh pr diff <PR_NUMBER>
```

- PR body 또는 브랜치명에서 `docs/plans/`의 관련 설계 문서 탐색 → DoD 추출
- 변경된 파일 목록 확인

## Step 2: 리뷰 기준에 따라 지적 목록 생성

변경된 각 파일을 읽고 다음 기준으로 리뷰한다:

### 리뷰 카테고리

a) **설계 문서 준수**: DoD 충족, After 구조 일치, Out of scope 미침범
b) **프로젝트 아키텍처**: `docs/rules/` 기준 — 전역 상태 경계, Feature Public API, 폴더 구조, 컴포넌트 구조, 단일 책임
c) **TypeScript 컨벤션**: `docs/rules/typescript/README.md` 기준 (Array<T>, React.FC 금지 등)
d) **React 클린코드**: 불필요한 리렌더, derived state, 매 렌더 객체 생성, composition 패턴
e) **코드 품질**: DRY, YAGNI, registry 패턴, 매직 넘버

**React 컴포넌트/훅이 포함된 경우:** `vercel-react-best-practices`, `vercel-composition-patterns` 스킬을 로드하여 해당 규칙 기준으로 검사한다.

## Step 3: PR Review 제출 + 요약 코멘트

라운드 번호는 PR의 기존 `## 🔍 Review Round` 코멘트 수를 세어 결정한다.

### 라인별 comment 포맷

각 지적을 PR Review의 라인별 comment로 작성한다. 포맷:

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

### Review 제출

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
- **diff 범위 밖 라인에서 422 에러 발생 시**: `subject_type: "file"` fallback으로 재시도

### 요약 코멘트

Review 제출과 별도로 `gh pr comment`로 라운드 요약을 남긴다.

```bash
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## 🔍 Review Round N

> 총 M건 (🔴 a · 🟡 b · 🟢 c)

**DoD 점검:**
- ✅ 항목 1
- ❌ 항목 2

**Out of scope 침범 여부:** 없음

**전체 평가:** 한 줄 요약
EOF
)"
```

LGTM인 경우:

```bash
# APPROVE review 제출
gh api repos/{owner}/{repo}/pulls/{pr}/reviews \
  --method POST \
  -f event="APPROVE" \
  -f body="🔍 Review Round N — LGTM"

# 요약 코멘트
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## 🔍 Review Round N

LGTM — 지적 사항 없음

**DoD 점검:**
- ✅ 항목 1
- ✅ 항목 2

**Out of scope 침범 여부:** 없음

**전체 평가:** 한 줄 요약
EOF
)"
```

## Step 4: 결과 반환

- **지적 있음**: `"REVIEW_ID:{id}"` + 지적 건수 반환
- **지적 없음**: 문자열 `"LGTM"` 반환

## 독립 실행 경로

"PR #N 리뷰해" 입력 시:

1. Step 1~3을 실행하여 PR에 코멘트를 남긴다
2. 사용자에게 리뷰 결과를 요약하여 보고한다

## 리뷰하지 않는 것

- 설계 문서 자체의 품질 (별도 프로세스)
- 테스트 코드의 커버리지 (자동화 영역)
- 기존 코드의 문제 (이번 PR에서 변경하지 않은 코드)
- 주석/문서 스타일 (변경한 코드에 한해서만)
