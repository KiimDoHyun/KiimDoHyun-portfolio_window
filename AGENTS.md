# 규칙

- 사용자와 모든 대화는 한글로 합니다.

## 작업 흐름

작업 계획 수립 → 실행 → 완료 처리 전반은 superpowers 스킬이 담당한다. 각 단계에 맞는 스킬을 호출해 흐름을 따른다.

- [`superpowers:brainstorming`](.claude/skills/) — 요구사항 탐색, 옵션 제시, 사용자 승인 하드게이트
- [`superpowers:writing-plans`](.claude/skills/) — 설계 문서 작성 (본 프로젝트 가이드는 [`docs/rules/plan-writing-guide.md`](docs/rules/plan-writing-guide.md))
- [`superpowers:executing-plans`](.claude/skills/) — 설계 문서 기반 순차 실행
- [`superpowers:verification-before-completion`](.claude/skills/) — 완료 주장 전 증거 기반 검증
- [`superpowers:finishing-a-development-branch`](.claude/skills/) — 작업 종료 후 PR / 머지 / 정리 옵션 안내

## 코딩 규칙

- **TypeScript 작성 규칙** (`any` 금지, Type vs Interface, 배열 표기 등): [`docs/rules/typescript/`](docs/rules/typescript/README.md)
- **식별자 명명 규칙** (변수/함수/훅/상수/타입 이름): [`docs/rules/naming/`](docs/rules/naming/README.md)
- **커밋 규약** (type, scope, 메시지 포맷, 단위 기준): [`docs/rules/commit-convention.md`](docs/rules/commit-convention.md)
- **프론트엔드 전반 컨벤션** (컴포넌트 구조, feature public API, 전역 상태 경계 등): [`docs/rules/`](docs/rules/) — `convention-frontend` 스킬이 작업 종류에 따라 필요한 문서로 라우팅한다.
