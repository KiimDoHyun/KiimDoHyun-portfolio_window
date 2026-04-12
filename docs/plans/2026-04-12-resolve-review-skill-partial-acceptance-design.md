# worker-resolve-review 스킬 — 부분 수용 분류 + 회귀 대조 증거 도입

작성일: 2026-04-12
상태: 설계 확정, 구현 대기

## 배경

Theme 리팩터링 PR(#34) Round 1 리뷰 루프를 돌린 결과, `worker-resolve-review` 스킬의 **두 가지 공백**이 관찰됐다.

### 공백 A — 부분 수용 카운팅 누수

Round 1 지적 중 4번 (HiddenIcon rgba → semantic) 은 리뷰어가 "동일 원칙이 HiddenIcon/InfoBar/CommitItem/windowChrome.buttonHover/overlay.hover 5군데에 적용된다"고 명시했다. 그러나 resolve 실행 결과는 HiddenIcon 한 곳만 수정하고 나머지는 "범위 밖 — 후속 티켓"으로 유예했다.

현재 스킬 분류는 `수정 / 기각 / 판단 필요` 3분기이며, 이 케이스는 "원칙 수용, 스코프 축소" 인데 단순히 "수정 5건" 에 흡수돼 Resolve Round 1 요약 코멘트에 기록됐다. 결과적으로:

- 리뷰어 입장에서는 "원칙이 5군데 적용돼야 한다"고 말했는데 worker가 "5건 전부 수정"으로 응답 → 실제로는 1군데만 수정 → **카운트와 실질의 불일치**
- 사후 추적 시 "왜 나머지 4군데는 안 고쳤지?"가 요약에서 보이지 않음

### 공백 B — 회귀성 지적의 원본 대조 증거 부재

Round 1 지적 중 2·3번은 "기존 hover tone shift 소실" / "이전·다음 달 셀 명도 구분 상실" 이라는 **회귀성 지적**이었다. resolve는 "복원" 이라는 표현으로 수정했지만, reply/커밋 메시지 어디에도 **master의 원본 색상값을 실제로 대조한 증거**(`git show master:<path>` 발췌, 이전 해시 등)가 남지 않았다.

"복원"이 정말 원본과 일치하는지, 혹은 worker가 리뷰어 주장만 믿고 새 색상을 임의로 찍은 건지 사후 추적이 불가능하다.

## 설계 규칙

1. **분류는 4분기로 확장한다** — `수정 / 부분 수용 / 기각 / 판단 필요`. "부분 수용"은 "원칙·근거는 타당, 적용 범위를 축소"하는 케이스를 상위 카테고리로 분리한다.
2. **회귀성 지적은 원본 대조 증거를 reply에 필수 포함한다** — `git show <baseRef>:<path>` 로 원본을 직접 읽고, reply body의 `Before:` 필드에 발췌 2~6줄을 인라인한다.
3. **회귀성 판정은 휴리스틱 기반이되 OR 조건**이다 — ① 본문 키워드(회귀/원래/기존/이전/regression) OR ② Basis 필드의 DoD 회귀 관련 인용("회귀 없음"/"외관 차이 없음"/"기존 동작 보존" 류) 중 하나라도 맞으면 회귀로 판정.
4. **`worker-resolve-review` 스킬 한 파일만 수정한다** — `worker-review-code` 는 건드리지 않는다. 지적 작성이 아니라 지적 처리 단계의 공백이므로.

## 변경 사항

### 변경 1. Step 2 "각 지적 타당성 판단" — 4번째 분류 추가

기존 `✅ 수정 / ❌ 기각 / ❓ 판단 필요` 사이에 다음을 삽입한다.

```markdown
### 부분 수용 (🟨 부분 수용)

- 리뷰어가 제시한 원칙·근거는 타당하다
- 그러나 적용 범위(N개 지점)를 이번 PR 스코프 내에서 축소(M개, M < N)하여 반영한다
- 유예된 (N - M)개는 **반드시 후속 티켓/이슈 번호와 함께** 유예 사유를 명시한다

전형적인 사유:
- 나머지 지점은 다른 기능 영역의 리스크가 있어 별도 PR 로 분리
- 본 PR 스코프(Phase N) 밖의 파일
- 리그레션 검증 비용이 커서 이번 라운드에서 전부 검증 어려움
```

### 변경 2. Step 2 — 회귀성 지적 판별 박스 신설

Step 2 말미에 다음 박스를 추가한다.

```markdown
### 회귀성 지적 판별

다음 중 하나라도 맞으면 "회귀성 지적"으로 판정한다:

1. 지적 본문에 아래 키워드 중 하나 등장: `회귀`, `원래`, `기존`, `이전`, `regression`
2. Basis 필드가 설계 문서의 DoD 중 회귀 관련 항목을 인용: `회귀 없음`, `외관 차이 없음`, `기존 동작 보존`, `시각적 차이가 없다` 류

회귀성으로 판정되면:
- 수정 전 반드시 base branch 원본을 확인한다: `git show <baseRef>:<path>`
- 해당 확인 결과를 Step 5 reply 의 `Before:` 필드에 발췌하여 포함한다
- 대조 없이 리뷰어 주장만 신뢰하여 수정하지 않는다

`<baseRef>` 는 PR 의 `baseRefName` (보통 `master`).
```

### 변경 3. Step 5 — Reply 템플릿 확장

기존 "수정 / 기각 / 판단 필요" 템플릿 사이에 **부분 수용** 템플릿을 추가하고, **수정** 템플릿에 조건부 Before 필드를 넣는다.

```markdown
**수정 (회귀성 지적인 경우):**
​```
✅ 수정

{수정 내용 요약}

**Before** (`git show <baseRef>:<path>` 발췌):
​```diff
{원본 코드 2~6줄}
​```

커밋: `{hash}`
​```

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

### 변경 4. Step 5 — Resolve Round 요약 카운트 형식 변경

기존:

```
**요약:** ✅ 수정 a건 · ❌ 기각 b건 · ❓ 판단 필요 c건 · Must Fix 잔여 d건
```

변경:

```
**요약:** ✅ 수정 a · 🟨 부분 수용 b · ❌ 기각 c · ❓ 판단 필요 d · Must Fix 잔여 e
```

### 변경 5. Step 6 "결과 반환" 포맷 동기화

기존:
```
수정: N건, 기각: N건, 판단 필요: N건, Must Fix 잔여: N건
```

변경:
```
수정: N건, 부분 수용: N건, 기각: N건, 판단 필요: N건, Must Fix 잔여: N건
```

### 변경 6. Step 1 앞단 — baseRef 수집 명시

회귀성 지적 판별 박스가 `<baseRef>` 를 참조하므로, Step 1 혹은 그 직전에 baseRef 를 `gh pr view` 로 수집하는 부분이 명시돼 있어야 한다. 기존 스킬 Step 1 이 `gh api` 로 review comment 만 수집하고 있으니, **"Step 0: PR 메타 수집"** 을 신설하여 `baseRefName` 을 가져오도록 한다.

```bash
baseRef=$(gh pr view <PR_NUMBER> --json baseRefName --jq '.baseRefName')
```

## 성공 기준 (Definition of Done)

- [ ] `worker-resolve-review/SKILL.md` 에 4분류가 반영되고, 부분 수용 정의·템플릿·카운트·결과 반환 포맷이 일관되게 업데이트됨
- [ ] 회귀성 지적 판별 휴리스틱과 `Before:` 필드 요구사항이 Step 2·5 에 명시됨
- [ ] Step 0 (또는 Step 1 앞단) 에서 `baseRef` 수집이 명시됨
- [ ] 파일 외 다른 스킬(`worker-review-code`, `orchestrator-review-loop`)은 수정되지 않음
- [ ] 리뷰 루프 재실행 시 HiddenIcon 사례 같은 "부분 수용" 케이스를 worker 가 분류에 반영하고, 회귀성 지적 reply 에 Before 필드가 등장함을 수동 시나리오로 확인 가능

## 수동 검증 (구현 후)

- [ ] 신규 4분류가 Step 2 에 모두 기술됨 (수정/부분 수용/기각/판단 필요)
- [ ] "부분 수용" 정의 박스에 "유예 범위/후속 티켓" 필드가 들어 있음
- [ ] Step 5 reply 템플릿에 부분 수용 양식과 회귀성 수정의 Before 양식이 모두 존재
- [ ] Step 5 Resolve Round 요약 카운트가 5필드(수정/부분 수용/기각/판단 필요/잔여)로 업데이트
- [ ] Step 6 결과 반환 포맷이 4개 분류 + 잔여 를 포함
- [ ] 회귀성 지적 판별 휴리스틱 박스가 존재하고 OR 조건임이 명시

## Out of Scope

- `worker-review-code` 스킬 수정 (지적 작성 측 변경 없음)
- `orchestrator-review-loop` 스킬 수정 (카운트는 resolve 의 출력 포맷만 따르므로)
- Review cycle limit 훅 수정
- 과거 PR (#34) 에 대한 Round 1 정정 reply 작성 — 이번 스킬 개정 범위 밖, 필요하면 별도 티켓에서 처리

## 파생 후속 과제 (이번 PR 에서는 다루지 않음)

- HiddenIcon rgba 원칙 적용 잔여 4지점 (InfoBar/CommitItem/windowChrome.buttonHover/overlay.hover) — 별도 후속 티켓에서 semantic 토큰 경유 처리
