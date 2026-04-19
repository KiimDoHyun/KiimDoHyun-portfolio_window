# 스킬 라우팅 구멍 메우기 — 설계

## 배경

CLAUDE.md 의 규칙 포인터 중 **두 항목은 적절한 시점에 자동 로드되는 메커니즘이 없다**:

1. [`docs/rules/commit-convention.md`](../rules/commit-convention.md) — 단독 커밋 작성 시 라우팅 스킬 부재. PR 생성 시는 [`worker-create-pr`](../../.claude/skills/worker-create-pr/) 가 참조하지만, 일반 커밋 작성에서는 Claude 가 CLAUDE.md 포인터를 보고 자발적으로 읽어야 한다 — 보장 X.
2. [`docs/rules/plan-writing-guide.md`](../rules/plan-writing-guide.md) — `superpowers:writing-plans` 는 일반 가이드라 본 프로젝트의 설계 가이드를 모른다. CLAUDE.md 본문에 포인터로 같이 언급하긴 했지만 자동 로드 보장 X.

또한 `.claude/skills/` 와 `docs/rules/` 의 항목이 늘어나면서 **어떤 스킬이 어떤 시점에 발동하고 어느 문서를 라우팅하는지** 한눈에 파악하기 어렵다. `docs/rules/` 측은 [`README.md`](../rules/README.md) 가 인덱스 역할을 하지만, 스킬 측은 인덱스가 없다.

## 결정

### 1. 신설 스킬 2개

기존 [`convention-frontend`](../../.claude/skills/convention-frontend/SKILL.md) 패턴을 차용한다. description 트리거로 적시 자동 로드, 본문은 라우팅 + 짧은 절차.

#### `convention-commit`
- 위치: `.claude/skills/convention-commit/SKILL.md`
- description: "Use when creating or amending git commits in this project — routes to commit-convention.md and ensures the `<type>(<scope>): <대상> — <성격>` format. Invoke before any `git commit` call."
- 라우팅: [`docs/rules/commit-convention.md`](../rules/commit-convention.md)
- 본문 구조: ① 시점/적용 범위 → ② commit-convention.md Read 지시 → ③ 메시지 초안 절차 → ④ 적용 범위 밖 (수정 amend 예외 등)

#### `convention-plan`
- 위치: `.claude/skills/convention-plan/SKILL.md`
- description: "Use when writing a project design/plan document under `docs/plans/` — routes to plan-writing-guide.md (project-specific guide that complements superpowers:writing-plans)."
- 라우팅: [`docs/rules/plan-writing-guide.md`](../rules/plan-writing-guide.md)
- 본문 구조: ① 시점/적용 범위 → ② plan-writing-guide.md Read 지시 → ③ `superpowers:writing-plans` 와의 보완 관계 (일반 패턴은 superpowers, 본 프로젝트 형식·검증·체크리스트 매핑은 본 가이드) → ④ 산출물 위치 (`docs/plans/YYYY-MM-DD-<topic>-{design,plan}.md`)

### 2. 스킬 인덱스 신설

**`.claude/skills/README.md`** — GitHub/IDE 폴더 진입점.

구조:
- 카테고리별 그룹: `convention-*` / `worker-*` / `orchestrator-*` / 외부(`vercel-*`, `web-design-guidelines`, `superpowers:*`)
- 각 항목: 한 줄 설명 + 트리거 시점 + 라우팅 문서(있으면)
- "새 스킬 추가 시" 절차 — [`docs/rules/skill-naming.md`](../rules/skill-naming.md) 참조 + 매핑 표 갱신 의무 명시

### 3. 부수 갱신

- [`docs/rules/README.md`](../rules/README.md) "Claude Code 에서의 사용" 섹션 — `commit-convention.md` / `plan-writing-guide.md` 도 라우팅 스킬을 갖는다는 사실 추가, `.claude/skills/README.md` 포인터 한 줄
- [`CLAUDE.md`](../../CLAUDE.md) 본문 — `.claude/skills/README.md` 포인터 한 줄 (스킬 전체 인덱스)
- [`docs/rules/skill-naming.md`](../rules/skill-naming.md) "현재 스킬 매핑" 표 — `convention-commit`, `convention-plan` 추가

## 작업 항목 (체크리스트)

각 항목은 커밋 1개에 매핑된다 ([`commit-convention.md`](../rules/commit-convention.md) §2 단위 기준).

- [ ] `convention-commit` 스킬 신설 (`.claude/skills/convention-commit/SKILL.md`)
- [ ] `convention-plan` 스킬 신설 (`.claude/skills/convention-plan/SKILL.md`)
- [ ] `.claude/skills/README.md` 신설 (스킬 인덱스)
- [ ] `docs/rules/README.md` 보강 (라우팅 스킬 정보 + 스킬 인덱스 포인터)
- [ ] `CLAUDE.md` 본문에 스킬 인덱스 포인터 추가
- [ ] `docs/rules/skill-naming.md` "현재 스킬 매핑" 표에 신설 스킬 2개 추가

## 성공 기준 (Definition of Done)

- 단독 커밋 작성 시 `convention-commit` 스킬이 description 트리거로 발동되어 `commit-convention.md` 가 로드된다
- `docs/plans/` 하위 설계 문서 작성 시 `convention-plan` 스킬이 발동되어 `plan-writing-guide.md` 가 로드된다
- `.claude/skills/README.md` 만 봐도 어떤 스킬이 어떤 시점에 발동하는지 파악 가능
- 신설 스킬 2개 이름이 [`skill-naming.md`](../rules/skill-naming.md) 체크리스트(§"체크리스트")를 통과 — `<role>-<stage>` 형식, `convention-` 영역명 단명사

## 영향 범위

- **새 파일 3개**: `.claude/skills/convention-commit/SKILL.md`, `.claude/skills/convention-plan/SKILL.md`, `.claude/skills/README.md`
- **갱신 파일 3개**: `docs/rules/README.md`, `CLAUDE.md`, `docs/rules/skill-naming.md`
- **기능 코드 변경 없음** (문서 + 스킬 정의만)
- **PR**: 이미 진행 중인 PR #47 (`docs/consolidate-claude-md`) 에 추가 커밋으로 누적

## 비-목표 (Out of Scope)

- 기존 스킬의 설명/동작 변경
- `docs/rules/` 의 다른 토픽 신설/수정
- hook (settings.json) 기반 강제 메커니즘 도입 — description 트리거로 충분하다고 판단
