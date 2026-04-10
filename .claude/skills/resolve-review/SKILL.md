---
name: resolve-review
description: >
  Use when PR review comments exist and need to be triaged and resolved.
  Trigger on "PR #N 리뷰 확인하고 수정해", "리뷰 반영해", "리뷰 처리해".
  Reads each review comment, judges validity, fixes valid ones, and dismisses invalid ones with reasoning.
---

# Resolve Review

지적 목록을 받아 각 항목의 타당성을 판단하고, 타당한 것은 수정, 타당하지 않은 것은 기각한다.

## 입력 소스

독립 실행이든 루프 실행이든 동일한 방식으로 `gh api`를 통해 review comment를 수집한다.

## 최우선 원칙: 기능 보존

어떤 수정도 기존 동작을 변경하거나 깨뜨려서는 절대 안 된다.
수정 전 해당 함수/컴포넌트의 사용처를 grep으로 확인하고, 반환값/props/시그니처 변경이 있으면 수정하지 않는다.

```dot
digraph resolve_flow {
    "지적 목록 수신" -> "각 지적 순회";
    "각 지적 순회" -> "해당 코드 읽기";
    "해당 코드 읽기" -> "타당성 판단";
    "타당성 판단" -> "코드 수정" [label="타당함"];
    "타당성 판단" -> "기각 사유 기록" [label="타당하지 않음"];
    "타당성 판단" -> "판단 필요 기록" [label="판단 불가"];
    "코드 수정" -> "다음 지적";
    "기각 사유 기록" -> "다음 지적";
    "판단 필요 기록" -> "다음 지적";
    "다음 지적" -> "각 지적 순회" [label="남은 지적"];
    "다음 지적" -> "검증 + 결과 보고" [label="모두 처리"];
}
```

## Step 1: 지적 목록 수집

`gh api`로 가장 최근 `CHANGES_REQUESTED` review의 comment 목록을 수집한다.

```bash
# 가장 최근 review의 ID 가져오기
gh api repos/{owner}/{repo}/pulls/{pr}/reviews \
  --jq 'map(select(.state == "CHANGES_REQUESTED")) | last | .id'

# 해당 review의 comment 목록
gh api repos/{owner}/{repo}/pulls/{pr}/comments \
  --jq '[.[] | select(.pull_request_review_id == REVIEW_ID) | {id, path, line, body}]'
```

각 comment의 `body`에서 심각도, 제목, 내용, Basis, Suggest를 파싱한다.

## Step 2: 각 지적 타당성 판단

각 지적마다 **해당 파일의 실제 코드를 읽고** 타당성을 판단한다.

### 수정한다 (✅ 수정)

- 실제 버그이거나 런타임 문제를 유발하는 경우
- 프로젝트 컨벤션(`docs/rules/`)에 명시적으로 위반하는 경우
- 설계 문서의 성공 기준(DoD)을 충족하지 못하는 경우
- 불필요한 코드가 실제로 존재하는 경우
- 리렌더/성능 문제가 실측 가능한 수준인 경우

### 기각한다 (❌ 기각)

- 리뷰어가 코드를 잘못 읽었거나 컨텍스트를 놓친 경우
- 취향 차이이며 현재 코드도 컨벤션에 부합하는 경우
- 수정 시 오히려 복잡성이 증가하는 경우
- 설계 문서의 Out of scope에 해당하는 경우
- 과도한 최적화 (측정 가능한 성능 차이 없음)

### 판단 불가 (❓ 판단 필요)

- 사용자에게 판단을 위임한다
- 양쪽 논거를 함께 제시한다

## Step 3: 수정 실행

타당한 지적에 대해:
1. 해당 파일:라인의 코드를 수정한다
2. 리뷰 제안 코드가 있으면 참고하되, 그대로 복사하지 않고 컨텍스트에 맞게 적용한다
3. 수정이 다른 코드에 영향을 주는지 확인한다

## Step 4: 검증

```bash
pnpm exec tsc --noEmit
```

## Step 5: Reply + 커밋 + 요약 코멘트

### 각 review comment에 reply

각 지적에 대한 처리 결과를 해당 review comment 스레드에 reply로 남긴다.

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

라운드 번호는 PR의 기존 `## 🔧 Resolve Round` 코멘트 수를 세어 결정한다.

```bash
gh pr comment <PR_NUMBER> --body "$(cat <<'EOF'
## 🔧 Resolve Round N

**요약:** ✅ 수정 a건 · ❌ 기각 b건 · ❓ 판단 필요 c건 · Must Fix 잔여 d건
EOF
)"
```

## Step 6: 결과 반환

처리 결과를 요약하여 반환한다:

```
수정: N건, 기각: N건, 판단 필요: N건, Must Fix 잔여: N건
```

## 독립 실행 경로

"리뷰 반영해" 입력 시:
1. Step 1(독립 실행)~5를 실행하여 PR에 코멘트를 남긴다
2. 사용자에게 처리 결과를 요약하여 보고한다
3. 기각/판단필요 항목에 대해 사용자 피드백을 기다린다
