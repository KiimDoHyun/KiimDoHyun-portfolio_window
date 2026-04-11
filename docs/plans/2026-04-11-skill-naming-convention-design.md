# 스킬 네이밍 컨벤션 도입 설계

> **브랜치**: `refactor/skill-naming-convention` (master에서 신설)
> **작성일**: 2026-04-11

## 배경

현재 프로젝트 커스텀 스킬 7개의 네이밍은 일관성이 없고, 이름만 보고는 역할이나 워크플로우 단계를 구분하기 어렵다.

구체적 문제:

- **형식 불일치**: `implement-plan` (동사-명사) vs `frontend-conventions` (명사-명사) vs `review` (명사 단독) — 구조가 제각각.
- **역할 불명**: `review`와 `review-loop`가 형제 관계인지 포함 관계인지 이름으로 알 수 없음. "실행자(worker)"와 "오케스트레이터(orchestrator)" 구분이 안 됨.
- **단계 불명**: `frontend-conventions`가 어느 워크플로우 단계에서 쓰이는지 이름에 안 드러남.
- **확장성 부족**: 스킬 수가 늘어날수록 혼란 가중 예상.

해결 방향으로 **역할 prefix 기반** `<role>-<stage>[-<detail>]` 형식을 도입한다. 역할 prefix는 이름 앞에 고정되어, 디렉터리 정렬 시 역할별로 자동 그룹핑되고 LLM이 스킬 리스트를 스캔할 때 역할이 먼저 눈에 들어온다.

## 설계 규칙

### 네이밍 형식

```
<role>-<stage>[-<detail>][-<pattern>]
```

- 모든 커스텀 스킬은 `worker-` / `orchestrator-` / `convention-` 중 하나의 prefix로 시작
- `worker-*` / `orchestrator-*` 는 **동사-명사 순서** (`<동사>-<명사>[-추가 명사]`)
- `convention-*` 는 **영역명** (명사 단독 또는 명사-명사)
- `orchestrator-*` 는 **실행 패턴 접미사** 포함 (`-loop`, 향후 `-pipeline`, `-fanout`)
  - 현재 프로젝트는 명시성 유지를 위해 항상 패턴 접미사를 붙인다
- `convention-*` 는 패턴 접미사를 갖지 않는다

### 역할 분류 기준

| 역할 prefix | 정의 | 예시 |
|---|---|---|
| **`worker-`** | 특정 단계의 작업을 1회 실제로 수행 | `worker-implement-plan`, `worker-review-code` |
| **`orchestrator-`** | 다른 스킬/Agent를 패턴에 따라 호출·제어. 자기 자신은 직접 작업하지 않음 | `orchestrator-review-loop` |
| **`convention-`** | 프로젝트 규칙 문서로 라우팅하는 횡단 참조 | `convention-frontend` |

### 판별 흐름

새 스킬을 만들거나 기존 스킬을 분류할 때:

1. **"다른 스킬/Agent의 호출 흐름을 제어하나?"**
   - YES → `orchestrator-` + 패턴 접미사 선택 (`-loop` 등)
   - NO → 2단계
2. **"규칙 문서로 안내만 하는가?"**
   - YES → `convention-`
   - NO → `worker-`

### 호환성 / 적용 범위

- **대상**: 이 프로젝트에서 직접 관리하는 커스텀 스킬 (현재 7개)
- **대상 외**: 외부 스킬 (`vercel-*`, `web-design-guidelines`, `superpowers:*`)
  - 외부 패키지는 자체 네이밍 유지. 본 규칙은 강제하지 않는다.

## 성공 기준 (Definition of Done)

- [ ] `docs/rules/skill-naming.md` 작성 완료 (영구 규칙 문서)
- [ ] 커스텀 스킬 7개 모두 디렉터리명과 frontmatter `name:` 필드가 새 규칙에 부합
- [ ] 스킬 내부의 다른 스킬 참조가 모두 새 이름으로 업데이트
- [ ] `AGENTS.md`, `docs/rules/README.md` 의 스킬 언급이 새 이름으로 업데이트
- [ ] 모든 리네임 후 Claude Code 세션 재시작 시 시스템 리마인더 스킬 리스트에 새 이름 7개가 모두 등장하고 옛 이름은 등장하지 않음
- [ ] `grep` 기반 누락 검사 통과 (Phase 3/4 완료 조건 참조)

## 리네임 매핑 (전체)

| 현재 이름 | 새 이름 | 역할 | 해석 |
|---|---|---|---|
| `implement-plan` | `worker-implement-plan` | worker | 플랜을 구현 |
| `create-pr` | `worker-create-pr` | worker | PR을 생성 |
| `review` | `worker-review-code` | worker | 코드를 리뷰 |
| `resolve-review` | `worker-resolve-review` | worker | 리뷰(코멘트)를 해소 |
| `deploy-to-vercel` | `worker-deploy-vercel` | worker | Vercel에 배포 |
| `review-loop` | `orchestrator-review-loop` | orchestrator (loop) | 리뷰를 루프로 실행 |
| `frontend-conventions` | `convention-frontend` | convention | 프론트엔드 규칙 라우팅 |

**순서 변경 주의**:
- `create-pr` 은 이미 동사-명사라 prefix만 붙으면 됨.
- `deploy-to-vercel` 의 "to" 전치사는 제거 (`deploy-vercel`).
- `resolve-review` 의 "review"는 "review 코멘트"를 의미 (해석 일관성 유지).
- `review` 단독이던 워커는 `review-code` 로 대상 명시.
- `frontend-conventions` 복수형은 `convention-frontend` 단수 prefix 형태로 변경.

## Phase 1 — 영구 규칙 문서 작성

### 입력

- 본 설계 문서의 "설계 규칙" 섹션
- 기존 `docs/rules/` 폴더 구조 (토픽별 하위 폴더 패턴)

### 작업 내용

- [ ] `docs/rules/skill-naming.md` 신규 작성
  - 형식 정의 `<role>-<stage>[-<detail>][-<pattern>]`
  - 역할 prefix 3종 정의 + 판별 기준
  - 동사-명사 규칙 (worker/orchestrator)
  - 명사 중심 규칙 (convention)
  - orchestrator 패턴 접미사 (`-loop`, 예약 `-pipeline`, `-fanout`)
  - 구체 예시 (본 문서의 리네임 매핑 표 전체 복사)
  - 대상/대상 외 명시
- [ ] `docs/rules/README.md` 에 `skill-naming.md` 링크 추가
  - 적절한 섹션 선정 (예: "메타 규칙" 또는 파일 목록)

### 완료 조건

- `docs/rules/skill-naming.md` 가 존재
- 본 설계 문서 "설계 규칙" 섹션의 모든 규정이 `skill-naming.md` 에 포함됨
- `docs/rules/README.md` 에서 해당 파일 링크 접근 가능

#### 수동 검증

- [ ] `docs/rules/skill-naming.md` 를 열어 본 설계 문서와 대조 — 누락 없음
- [ ] `docs/rules/README.md` 링크 클릭으로 새 문서 열림

## Phase 2 — 스킬 디렉터리 및 frontmatter 리네임

### 입력

- Phase 1 완료
- 현재 7개 스킬 디렉터리

### 작업 내용

각 스킬에 대해 `git mv` + frontmatter `name:` 필드 업데이트를 함께 수행:

- [ ] `git mv .claude/skills/implement-plan .claude/skills/worker-implement-plan`
  - 내부 `SKILL.md` 의 `name: implement-plan` → `name: worker-implement-plan`
- [ ] `git mv .claude/skills/create-pr .claude/skills/worker-create-pr`
  - `name: create-pr` → `name: worker-create-pr`
- [ ] `git mv .claude/skills/review .claude/skills/worker-review-code`
  - `name: review` → `name: worker-review-code`
- [ ] `git mv .claude/skills/resolve-review .claude/skills/worker-resolve-review`
  - `name: resolve-review` → `name: worker-resolve-review`
- [ ] `git mv .claude/skills/deploy-to-vercel .claude/skills/worker-deploy-vercel`
  - `name: deploy-to-vercel` → `name: worker-deploy-vercel`
- [ ] `git mv .claude/skills/review-loop .claude/skills/orchestrator-review-loop`
  - `name: review-loop` → `name: orchestrator-review-loop`
- [ ] `git mv .claude/skills/frontend-conventions .claude/skills/convention-frontend`
  - `name: frontend-conventions` → `name: convention-frontend`

### 완료 조건

- 7개 디렉터리 모두 새 이름으로 존재
- 각 `SKILL.md` 의 `name:` 필드가 디렉터리명과 정확히 일치
- `git status` 에서 rename 으로 인식되어 파일 히스토리가 유지됨 (`R` 상태)

#### 수동 검증

- [ ] Claude Code 세션 재시작 후 시스템 리마인더의 스킬 리스트에 새 이름 7개가 모두 등장
- [ ] 기존 이름(`implement-plan`, `review` 등)은 리스트에 없음
- [ ] 임의로 한 스킬을 `Skill` 도구로 호출 시 정상 로드

## Phase 3 — 스킬 내부 상호 참조 업데이트

### 입력

- Phase 2 완료

### 작업 내용

스킬 본문에 다른 스킬 이름이나 경로가 하드코딩된 곳을 모두 새 이름으로 업데이트한다. 알려진 지점:

- [ ] `worker-implement-plan/SKILL.md`
  - `frontend-conventions` → `convention-frontend` (2곳 이상, 본문 및 Step 2 참조 리스트)
  - `create-pr` → `worker-create-pr` (Step 4)
- [ ] `orchestrator-review-loop/SKILL.md`
  - `Agent: review` → `Agent: worker-review-code` (flowchart 및 본문)
  - `Agent: resolve-review` → `Agent: worker-resolve-review`
  - 경로 `.claude/skills/review/SKILL.md` → `.claude/skills/worker-review-code/SKILL.md`
  - 경로 `.claude/skills/resolve-review/SKILL.md` → `.claude/skills/worker-resolve-review/SKILL.md`
- [ ] `worker-deploy-vercel/SKILL.md`
  - 자기 경로 참조 `/mnt/skills/user/deploy-to-vercel/` → `/mnt/skills/user/worker-deploy-vercel/` (여러 곳)
  - `~/.claude/skills/deploy-to-vercel/` → `~/.claude/skills/worker-deploy-vercel/`
- [ ] 미처 발견 못한 참조 확인을 위해 최종 `grep` 수행:
  ```
  grep -rn "implement-plan\|create-pr\|frontend-conventions\|review-loop\|resolve-review\|deploy-to-vercel" .claude/skills/
  grep -rn "name: review$\| review\b" .claude/skills/orchestrator-review-loop/
  ```
  매치가 0건이어야 한다 (디렉터리명 자체 매치 제외).

### 완료 조건

- 위 grep 명령이 모두 0건 매치
- 리네임된 스킬의 본문에서 옛 이름이 사라짐

#### 수동 검증

- [ ] `orchestrator-review-loop/SKILL.md` 본문을 읽어서 Agent 호출 기술이 새 이름 `worker-review-code` / `worker-resolve-review` 로 일관되는지 확인
- [ ] `worker-implement-plan/SKILL.md` 본문의 Step 2/Step 4 참조가 새 이름인지 확인

## Phase 4 — 프로젝트 문서 업데이트

### 입력

- Phase 3 완료

### 작업 내용

- [ ] `AGENTS.md`
  - line 100 부근: `frontend-conventions` → `convention-frontend`
- [ ] `docs/rules/README.md`
  - line 18 부근: `frontend-conventions` → `convention-frontend` (스킬명)
  - line 18 부근: 경로 `.claude/skills/frontend-conventions/` → `.claude/skills/convention-frontend/`
  - line 24 부근: 경로 `.claude/skills/frontend-conventions/SKILL.md` → `.claude/skills/convention-frontend/SKILL.md`
- [ ] 최종 검증 grep:
  ```
  grep -rn "implement-plan\|create-pr\|frontend-conventions\|review-loop\|resolve-review\|deploy-to-vercel" AGENTS.md docs/rules/
  ```
  매치 0건.

**의도적 제외:**

- `docs/plans/2026-04-11-review-line-comment-design.md` 등 기존 설계 문서는 **역사적 기록**이므로 업데이트하지 않는다. 당시 이름 그대로 둔다.
- `localhost_3000-*.html` 같은 아티팩트는 대상 외.
- `.claude/settings.json` 의 hook 설정은 skill 이름을 참조하지 않으므로 수정 불필요.

### 완료 조건

- `AGENTS.md`, `docs/rules/README.md` 에 옛 이름 잔존 없음
- grep 명령 0건

#### 수동 검증

- [ ] `AGENTS.md` 와 `docs/rules/README.md` 를 에디터로 열어 새 이름 확인
- [ ] 세션 재시작 후 CLAUDE.md 컨텍스트가 새 이름으로 업데이트된 `AGENTS.md` 를 import 하는지 확인

## 브랜치 / 실행 전제

- **새 브랜치**: `refactor/skill-naming-convention` — master 기준으로 신설
- **Why 새 브랜치**: 현재 `refactor/skill-description-cleanup` 브랜치는 "description/hook 정리"라는 다른 스코프. 네이밍 컨벤션 변경과 스코프가 겹치지 않도록 분리한다.
- **선행 조건**: `refactor/skill-description-cleanup` PR 을 먼저 병합하거나, 최소한 충돌 지점인 `implement-plan/SKILL.md` · `review/SKILL.md` · `resolve-review/SKILL.md` 의 변경이 확정된 뒤에 본 작업을 시작한다. 동시 진행 시 rename vs edit 충돌 위험.

## 영향 범위 / 리스크

### 리스크 1 — 세션 캐시와 리네임 불일치

Claude Code 세션이 이미 옛 이름으로 스킬 리스트를 캐시한 상태에서 리네임이 진행되면, 세션 내 호출이 실패할 수 있다.

**완화**: Phase 2 완료 직후 Claude Code 세션을 재시작한다. 수동 검증 항목에 포함.

### 리스크 2 — grep 누락으로 참조 깨짐

스킬 본문에 생각지 못한 곳에 하드코딩된 옛 이름이 남을 수 있다 (주석, 예시 코드 등).

**완화**: Phase 3/4 완료 조건에 grep 명령과 기대 결과(0건)를 명시. 각 Phase 종료 시 반드시 수행.

### 리스크 3 — 외부 도구 참조

에디터 북마크, 사용자의 슬래시 명령 기억, 외부 문서 등에서 옛 이름으로 스킬을 호출할 수 있다.

**완화**: 본 설계에서는 대응하지 않는다. 필요 시 후속 과제로 "옛 이름 → 새 이름 매핑 문서" 를 별도 작성할 수 있다.

## 향후 과제

- (선택) `.claude/skills/convention-skill-naming/SKILL.md` 메타 스킬 신설 — `docs/rules/skill-naming.md` 로 라우팅하는 얇은 래퍼. 새 스킬 작성 시 자동으로 규칙이 환기되도록.
- (선택) 외부 스킬(`vercel-*`, `web-design-guidelines`)도 본 컨벤션에 맞출지 논의. 기본은 제외.
- (선택) 스킬 간 상호 참조를 자동 검증하는 lint 스크립트 (`grep` 래퍼) 를 `.claude/hooks/` 에 추가.
