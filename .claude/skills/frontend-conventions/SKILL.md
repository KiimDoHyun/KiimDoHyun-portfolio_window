---
name: frontend-conventions
description: Use when writing, modifying, reviewing, or planning any frontend code in this project's src/ folder (React/TypeScript, feature-first architecture). Routes to the appropriate convention document(s) under docs/rules/ based on the task type. Invoke before touching .tsx/.ts files in src/.
---

# Frontend Conventions Router

이 프로젝트의 프론트엔드 컨벤션은 [`docs/rules/`](../../../docs/rules/) 에 토픽별 폴더로 분리되어 있다. 작업 종류에 따라 아래 매핑을 보고 **해당 문서를 Read 해서 그 안의 규칙을 따른 뒤 코드를 작성/수정/리뷰** 하라.

## 라우팅 매핑

작업이 여러 항목에 해당하면 **모두** 읽어라. 확신이 없으면 더 많이 읽는 쪽을 택하라.

| 작업 종류 | 읽을 문서 |
|---|---|
| TypeScript 코드 작성/수정 (타입, prop, 배열 표기 등) | [`docs/rules/typescript/README.md`](../../../docs/rules/typescript/README.md) |
| 컴포넌트 신규 생성 또는 리팩터 (`.tsx` 파일 분할/구조) | [`docs/rules/component-structure/README.md`](../../../docs/rules/component-structure/README.md) |
| feature 간 import, `index.ts` 공개 API 변경 | [`docs/rules/feature-public-api/README.md`](../../../docs/rules/feature-public-api/README.md) |
| Recoil/URL 등 전역 상태 접근 또는 페이지 경계 작업 | [`docs/rules/global-state-boundary/README.md`](../../../docs/rules/global-state-boundary/README.md) |
| 새 폴더/파일 위치 결정, `src/` 최상위 구조 관련 판단 | [`docs/rules/folder-structure/README.md`](../../../docs/rules/folder-structure/README.md) |
| 코드 리뷰 (모든 변경 검증) | 위 문서 중 변경된 영역에 해당하는 것 모두 |

## 사용 절차

1. 사용자의 요청을 보고 위 표에서 해당하는 행을 모두 식별한다
2. 해당 문서들을 Read 한다 (병렬로)
3. 문서의 규칙을 명시적으로 따르며 작업한다
4. 작업 후 자기 검증: 적용한 규칙을 짧게 보고한다 ("typescript/README.md 의 X 규칙에 따라 ...")

## 적용 범위 밖

- `src/` 외부 파일 (예: `docs/`, `.claude/`, 빌드 설정) 작업에는 이 스킬을 적용하지 않는다
- 협업 규칙([`collaboration/`](../../../docs/rules/collaboration/)) 은 CLAUDE.md 에 자동 로드되므로 별도로 읽을 필요 없다
