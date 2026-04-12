# AGENTS.md 정리 및 규칙 이관

## 배경

2026-04-12 커밋 규약을 `docs/rules/commit-convention.md` 로 이관하면서 `AGENTS.md` 전체를 훑어본 결과, §1~§3 (작업 흐름) 은 superpowers 스킬들과 대부분 겹치고, §4 (공통 코딩 규칙) 는 일부가 `docs/rules/` 토픽과 비중복이지만 배치가 어색한 상태였다. 사용자가 "AGENTS.md 가 필요한지 의문" 을 제기해 후속 과제로 분리됐다.

본 작업의 선행 조사(동일 세션) 에서 도출된 핵심 사실:

- **§4 TypeScript 4개 규칙** (명시적 타입 / `any` 금지 / Type 선호 / Union 선호) 은 `docs/rules/typescript/README.md` 와 **비중복** — 합쳐야 완전한 TypeScript 규칙이 됨.
- **§4 Naming Convention 4개 규칙** (Hooks / Utils / Constants / Types 이름 규칙) 은 `docs/rules/` 어느 문서에도 없음 — **고유 내용**.
- **§1~§3 작업 흐름** 은 superpowers 스킬 (`brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `finishing-a-development-branch`) 이 80% 이상 커버. 고유하게 남는 건 3개 뿐이며, 그 중 "추가 개선 제안" 은 이미 `plan-writing-guide.md §5 향후 과제` 에 존재 → **실질 고유 규칙은 2개**.
- **서두 "한글 응답 규칙"** 과 **§5 프론트엔드 컨벤션 포인터** 는 고유·유지 대상.
- **§4 Git Commit Convention** 은 이전 커밋(#35)에서 이미 `commit-convention.md` 포인터로 교체 완료.

## 설계 규칙

- **작업 단위는 한 PR 로 종결**: 메모리 피드백 `feedback_phase_pr.md` 에 따라 phase 단위 PR 을 만들지 않고, 본 작업 전체가 완료되면 단일 PR 로 올린다.
- **커밋 = 체크리스트 1줄**: `plan-writing-guide.md §6` 원칙에 따라 체크리스트 한 줄이 커밋 1개에 대응하도록 작성한다.
- **AGENTS.md 축소는 마지막**: 앞선 이관 커밋이 전부 끝난 뒤에만 AGENTS.md 를 줄여야 한다 (원본 내용이 옮겨지기 전에 줄이면 규칙이 증발함).
- **이관은 삭제가 아닌 이동**: 원본 규칙 문장은 가능한 한 그대로 옮기고, 필요한 경우 대상 문서의 서술 톤에 맞춰 최소한의 문구 조정만 한다.

## 성공 기준 (Definition of Done)

- [x] `docs/rules/naming/README.md` 가 존재하고 4개 식별자 명명 규칙 (Hooks / Utils / Constants / Types) 을 정의한다.
- [x] `docs/rules/typescript/README.md` 에 AGENTS.md §4 의 타입 작성 규칙 4개가 흡수되어 있다.
- [x] `docs/rules/plan-writing-guide.md` 에 "완료 조건 고정" 과 "검증 실패 시 처리" 규칙이 반영되어 있다.
- [x] `.claude/skills/convention-frontend/SKILL.md` 라우팅 테이블에 `naming/` 토픽 행이 추가되어 있다.
- [x] `docs/rules/README.md` 토픽 목록에 `naming/` 이 추가되어 있다.
- [x] `AGENTS.md` 가 포인터 허브로 축소되어 있다 (한글 응답 규칙 + 작업 흐름·코딩 규칙 포인터만 남는 형태).
- [x] AGENTS.md 에 있던 규칙 중 **어떤 것도 누락 없이** 다른 문서로 이관되었다 (설계 규칙 "이관은 삭제가 아닌 이동").
- [x] 빌드/테스트와 무관한 순수 문서 작업이므로 자동화 검증은 없음. 수동 검증 항목으로 대체.

## Phase 1: 규칙 이관 및 AGENTS.md 축소

### 입력

- 본 워크트리 `.claude/worktrees/docs+agents-md-cleanup/` (브랜치 `docs/agents-md-cleanup`, master 에서 분기, clean)
- 선행 조사 결과 (본 문서의 "배경" 섹션)

### 작업 내용

체크리스트 각 항목은 커밋 1개와 매핑된다.

- [x] **`docs/rules/naming/README.md` 신설 및 토픽 목록 등록** — `de75bfb`
  - 새 파일 생성: Hooks(`use` prefix camelCase) / Utils(camelCase) / Constants(UPPER_SNAKE_CASE) / Types(PascalCase) 4개 규칙. 각 규칙에 `✅ / ❌` 예시 포함 (기존 `typescript/README.md` 톤 일치).
  - 문서 서두에 "식별자 명명 규칙만 다룸. 타입 작성 규칙은 `typescript/` 참조" 경계 문구 추가.
  - `docs/rules/README.md` 의 "토픽 목록" 섹션에 `- [naming/](./naming/) — ...` 한 줄 추가.
  - 영향 범위: `docs/rules/naming/README.md` (신규), `docs/rules/README.md`
  - 커밋 제목: `docs(rules): naming 컨벤션 토픽 신설`

- [x] **`docs/rules/typescript/README.md` 에 타입 작성 규칙 4개 흡수** — `44ee28b`
  - 기존 2개 규칙 (배열 `Array<T>`, prop 구조분해) 뒤에 추가 규칙 섹션 삽입: 명시적 타입 / `any` 금지(불가피 시 `unknown`) / Interface 보다 Type 선호 / Enum 대신 Union Type.
  - 각 규칙에 `✅ / ❌` 예시 또는 간단한 코드 블록 포함.
  - 문서 상단 또는 적절한 위치에 "식별자 이름 규칙은 `naming/` 참조" 상호 링크 추가.
  - 영향 범위: `docs/rules/typescript/README.md`
  - 커밋 제목: `docs(rules): typescript 컨벤션에 타입 작성 규칙 확장`

- [x] **`docs/rules/plan-writing-guide.md` 에 완료 조건 고정 및 실패 처리 규칙 추가** — `9d1a1a8`
  - §1 끝에 한 줄 추가: "완료 조건은 문서에 명시한 뒤 작업 중 임의로 수정하지 않는다. 수정이 필요하면 사용자 승인을 거친 뒤 문서에 반영한다."
  - §4 에 "4-3. 검증 실패 시 처리" 하위 섹션 추가: "완료 조건을 3회 이상 만족하지 못하면 해당 단계 반복을 중단하고 사용자에게 상황을 보고하여 방향을 협의한다."
  - AGENTS.md §3 의 "추가 개선 제안" 은 §5 "향후 과제" 와 개념이 동일하므로 **추가하지 않음** (중복 회피).
  - 영향 범위: `docs/rules/plan-writing-guide.md`
  - 커밋 제목: `docs(rules): plan-writing-guide 에 완료 조건 고정과 실패 처리 규칙 추가`

- [x] **`convention-frontend` 스킬 라우팅에 `naming/` 행 추가** — `0da619e`
  - `.claude/skills/convention-frontend/SKILL.md` 의 라우팅 매핑 테이블에 한 행 추가: "새 식별자 (변수/함수/훅/상수/타입) 이름 결정 시 → `docs/rules/naming/README.md`".
  - 적용 범위 밖 섹션은 건드리지 않음.
  - 영향 범위: `.claude/skills/convention-frontend/SKILL.md`
  - 커밋 제목: `docs(skill): convention-frontend 라우팅에 naming 토픽 추가`

- [x] **`AGENTS.md` 를 포인터 허브로 축소** — `8984728`
  - 최종 형태:
    - 서두 "한글 응답 규칙" 유지
    - "작업 흐름" 섹션: superpowers 스킬 (`brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `finishing-a-development-branch`) 에 위임한다는 한 단락 + 각 스킬 한 줄 포인터
    - "코딩 규칙" 섹션: `typescript/`, `naming/`, `commit-convention.md`, 프론트엔드 전반 `docs/rules/` 포인터
  - §1~§3 전문, §4 TypeScript/Naming 본문, §4 Git Commit Convention (이미 포인터이지만 새 구조에 맞게 재배치), §5 는 삭제 또는 포인터 섹션에 흡수.
  - 영향 범위: `AGENTS.md`
  - 커밋 제목: `docs(agents): AGENTS.md 를 포인터 허브로 축소`

### 완료 조건

- 위 5개 체크박스 모두 `- [x]`
- `git log docs/agents-md-cleanup ^master --oneline` 이 정확히 5개 커밋을 보여주고, 각 커밋 제목이 위 체크리스트 순서와 매핑된다.
- `git diff master -- AGENTS.md` 에서 삭제된 규칙이 본 문서의 "성공 기준" 체크리스트와 1:1 로 대응된다 (즉 잃어버린 규칙 없음).

### 수동 검증

- [ ] `AGENTS.md` 를 새 Claude Code 세션에서 읽었을 때 "작업 흐름" 과 "코딩 규칙" 에 해당하는 포인터만 있고, 각 포인터가 실제 문서로 연결된다.
- [ ] `docs/rules/naming/README.md` 만 읽었을 때 새 식별자 (훅 / 유틸 / 상수 / 타입) 명명 규칙을 모두 알 수 있다.
- [ ] `docs/rules/typescript/README.md` 만 읽었을 때 타입 작성 규칙 (기존 2개 + 추가 4개) 을 모두 알 수 있다.
- [ ] `docs/rules/plan-writing-guide.md` 에서 "완료 조건 고정" 규칙과 "3회 실패 시 보고" 규칙을 각각 찾을 수 있다.
- [ ] `.claude/skills/convention-frontend/SKILL.md` 의 라우팅 테이블에 `naming/` 행이 있다.
- [ ] (Claude Code 관점) 새 세션에서 "훅 이름 짓는 규칙이 뭐야?" 라고 물었을 때 `convention-frontend` 가 `naming/` 문서로 라우팅한다.
