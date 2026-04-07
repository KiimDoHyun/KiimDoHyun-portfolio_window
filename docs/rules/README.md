# 코딩 컨벤션 (Rules)

이 폴더의 문서들은 프로젝트 전반에 적용되는 코딩 규칙을 정의한다. 모든 새 코드와 리팩토링은 이 규칙을 따른다.

## 목록

- [TypeScript](./typescript.md) — 배열 타입 표기, 컴포넌트 prop 타입 등 TS 작성 규칙
- [컴포넌트 파일 구조](./component-structure.md) — `.tsx`에 무엇을 두고 무엇을 분리할지
- [Feature Public API](./feature-public-api.md) — feature 슬라이스의 `index.ts` 사용 규칙, deep import 금지
- [전역 상태 접근 경계](./global-state-boundary.md) — Recoil/URL 등 전역 상태는 `pages/`에서만 접근
- [협업](./collaboration.md) — 추천 옵션 제시 시의 자체 검증 기준

## 새 규칙 추가 시

1. 이 폴더에 `<topic>.md` 작성
2. 위 목록에 추가
3. `CLAUDE.md`의 `@import`는 `README.md`만 참조하므로 자동 반영됨
