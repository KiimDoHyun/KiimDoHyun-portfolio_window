# Skills

이 폴더는 Claude Code 가 사용하는 스킬 정의를 모아둔다. 스킬은 작업 시점에 자동 발동되는 지침 묶음으로, **각 스킬의 `description` 이 발동 트리거를 정의**한다.

스킬 네이밍 규칙은 [`docs/rules/skill-naming.md`](../../docs/rules/skill-naming.md) 를 따른다 (`<role>-<stage>` 형식, role 은 `worker`/`orchestrator`/`convention`).

## 프로젝트 커스텀 스킬

### `convention-*` — 규칙 문서 라우팅

작업 시점에 [`docs/rules/`](../../docs/rules/) 의 해당 문서를 Read 해 그 규칙을 적용한다.

| 스킬 | 트리거 시점 | 라우팅 문서 |
|---|---|---|
| [`convention-frontend`](convention-frontend/SKILL.md) | `src/` 하위 `.tsx`/`.ts` 작업 | typescript, naming, component-structure, feature-public-api, global-state-boundary, folder-structure |
| [`convention-commit`](convention-commit/SKILL.md) | `git commit` 호출 직전 | [commit-convention.md](../../docs/rules/commit-convention.md) |
| [`convention-plan`](convention-plan/SKILL.md) | `docs/plans/` 하위 설계 문서 작성 | [plan-writing-guide.md](../../docs/rules/plan-writing-guide.md) |

> 협업 규칙([`collaboration/`](../../docs/rules/collaboration/)) 은 `CLAUDE.md` 에 항상 import 되어 별도 스킬이 없다.

### `worker-*` — 단계 작업 1회 수행

| 스킬 | 트리거 시점 | 산출물 |
|---|---|---|
| [`worker-implement-plan`](worker-implement-plan/SKILL.md) | "설계 문서대로 구현해" / `docs/plans/*.md` 지시 | 구현 코드 + 커밋들 |
| [`worker-create-pr`](worker-create-pr/SKILL.md) | "PR 만들어줘" | gh CLI 로 생성된 PR |
| [`worker-review-code`](worker-review-code/SKILL.md) | "리뷰 해줘", "PR #N 리뷰" | 리뷰 코멘트 |
| [`worker-resolve-review`](worker-resolve-review/SKILL.md) | "리뷰 반영해" | 리뷰 코멘트 해소 커밋 |
| [`worker-deploy-vercel`](worker-deploy-vercel/SKILL.md) | "배포해", "deploy to vercel" | 배포된 URL |

### `orchestrator-*` — 다른 스킬/Agent 호출 제어

| 스킬 | 트리거 시점 | 패턴 |
|---|---|---|
| [`orchestrator-review-loop`](orchestrator-review-loop/SKILL.md) | "리뷰 루프 돌려줘" | review → resolve 반복 |

## 외부 / 패키지 스킬

본 프로젝트가 가져와 사용하는 외부 스킬. 자체 네이밍 유지 ([`skill-naming.md`](../../docs/rules/skill-naming.md) "적용 범위 외").

- **`vercel-*`** — Vercel CLI / React / Next.js / React Native / View Transitions / Composition Patterns. UI · 배포 작업 시 발동.
- **`web-design-guidelines`** — UI 코드 접근성 · UX 가이드라인 검증.
- **`superpowers:*`** — 작업 흐름 일반 패턴 (brainstorming, writing-plans, executing-plans, verification-before-completion, finishing-a-development-branch 등). [`CLAUDE.md`](../../CLAUDE.md) "작업 흐름" 섹션 참조.

## 새 스킬 추가 시

1. [`docs/rules/skill-naming.md`](../../docs/rules/skill-naming.md) §"체크리스트" 통과 확인 (이름 형식, role, 디렉터리/frontmatter 일치)
2. `<skill-name>/SKILL.md` 작성 — frontmatter `name` / `description` 필수, description 은 발동 트리거를 명시
3. 본 README.md 의 카테고리 표에 추가
4. [`docs/rules/skill-naming.md`](../../docs/rules/skill-naming.md) "현재 스킬 매핑" 표에도 추가
