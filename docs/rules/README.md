# 코딩 컨벤션 (Rules)

이 폴더의 문서들은 프로젝트 전반에 적용되는 코딩 규칙을 정의한다. 모든 새 코드와 리팩토링은 이 규칙을 따른다.

각 토픽은 자체 폴더를 가지며, 폴더 안의 `README.md` 가 진입점이다. 한 폴더는 한 가지 주제만 다룬다.

## 토픽 목록

- [folder-structure/](./folder-structure/) — `src/` 최상위 폴더 구조 (Feature-First)
- [typescript/](./typescript/) — 배열 타입 표기, 컴포넌트 prop 타입 등 TS 작성 규칙
- [component-structure/](./component-structure/) — `.tsx`에 무엇을 두고 무엇을 분리할지
- [feature-public-api/](./feature-public-api/) — feature 슬라이스의 `index.ts` 사용 규칙, deep import 금지
- [global-state-boundary/](./global-state-boundary/) — 전역 상태 접근 경계
- [collaboration/](./collaboration/) — 추천 옵션 제시 시의 자체 검증 기준 등 협업 규칙

## Claude Code 에서의 사용

`docs/rules/` 의 토픽 문서들은 CLAUDE.md 에 자동 import 되지 않는다. 대신 `.claude/skills/frontend-conventions/` 스킬이 작업 종류에 따라 필요한 문서만 골라 읽는다. 협업 규칙(`collaboration/`)만 항상 컨텍스트에 로드된다.

## 새 규칙 추가 시

1. `docs/rules/<topic>/` 폴더 생성, 그 안에 `README.md` 작성
2. 위 토픽 목록에 추가
3. 필요하면 `.claude/skills/frontend-conventions/SKILL.md` 의 라우팅 매핑에도 추가
