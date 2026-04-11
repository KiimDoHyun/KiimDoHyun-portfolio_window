# Known Issue: Jest 설정이 전 테스트 스위트를 parse 단계에서 실패시킴

> **상태:** 미해결
> **발견 시점:** 2026-04-11 (`refactor/theme-system` 브랜치 작업 중 검증에서 드러남, master 에서도 재현)
> **권장 처리 브랜치:** `fix/jest-setup` (master 기반)

---

## 현상

`pnpm test -- --watchAll=false` 실행 시 **모든 테스트 스위트(34개)** 가 실행되지 못하고 parse 단계에서 실패한다. 실제로 실행된 테스트는 **0개**.

```
Test Suites: 34 failed, 34 total
Tests:       0 total
Snapshots:   0 total
```

에러 메시지는 두 종류로 관찰된다:

1. `SyntaxError: Cannot use import statement outside a module`
2. `SyntaxError: ...: Unexpected token, expected "from" (X:Y)`
   - 2번은 대부분 `import type { ... } from '...'` 가 있는 테스트 파일에서 발생. babel parser 가 TypeScript `import type` 구문을 type-only import 로 해석하지 못하는 것으로 추정.

또한 에러 스택에 `C:\WorkSpace\KiimDoHyun-portfolio_window\.claude\worktrees\feat+phase-c1-asset-manifest\src\...` 경로가 섞여 나온다. 즉 **`.claude/worktrees/` 하위의 오래된 worktree 복사본** 도 테스트 탐색 대상에 포함되어 있다.

## 재현

```bash
git switch master
pnpm test -- --watchAll=false
```

`refactor/theme-system` 브랜치에서도 동일하게 재현된다. 즉 **테마 작업과 무관한 기존 인프라 문제**다.

## 영향 범위

- **현재:** 자동 테스트 기반 regression 검증이 사실상 마비됨. 모든 변경은 `tsc --noEmit` + `pnpm build` + 수동 검증에만 의존.
- **향후:** 테마 시스템 Phase 2 ~ 6 및 이후 모든 refactor 의 신뢰성이 수동 검증에 의존하는 구조 고착화 위험.

## 추정 원인

1. **`import type` 구문 파싱 실패**
   - 에러 위치가 일관되게 `"from"` 을 expect 하는 시점이라, parser 가 `import` 다음에 온 `type` 키워드를 TypeScript type-only import 로 인식하지 못하고 일반 named import 로 처리하려다 실패하는 패턴.
   - 원인 후보:
     - `babel.config.*` 에 `@babel/preset-typescript` 또는 `@babel/plugin-transform-typescript` 가 누락
     - `@babel/preset-typescript` 버전이 낮아 `import type` 을 지원하지 않음
     - `jest.config.*` 의 `transform` 설정이 TypeScript 파일을 적절한 transformer 로 보내지 않음

2. **`.claude/worktrees/` 가 테스트 탐색 대상에 포함됨**
   - `jest.config.*` 또는 `package.json > jest` 의 `testPathIgnorePatterns` / `modulePathIgnorePatterns` 에 `.claude/` 가 빠져 있다.
   - 결과: 과거 worktree 복사본이 current tree 와 중복으로 탐색되어 동일 테스트가 두 번씩 실패로 집계됨.

## 해결 방향 (조사 필요)

정확한 수정안은 다음을 확인한 뒤 결정:

1. 이 프로젝트가 쓰는 test runner 가 무엇인지
   - `package.json` 의 `test` 스크립트: `react-scripts test` 또는 `craco test` 여부
   - craco config 또는 CRA 기본 jest 설정을 overrides 하는 곳이 있는지
2. babel transform 체인
   - `babel.config.*` 존재 여부와 preset 구성
   - `@babel/preset-typescript` 설치 여부 (`package.json > dependencies` / `devDependencies`)
3. 실제 실패 파일 한 개를 골라 line:col 위치에서 파싱 시도 재현
4. `testPathIgnorePatterns` 에 `/\\.claude/` 추가하여 worktree 복사본 제외

## 작업 격리 방침

- **이 브랜치(`docs/jest-setup-known-issue`)**: 문서화만.
- **수정 작업**: 별도 `fix/jest-setup` 브랜치를 master 기반으로 생성해서 진행. 테마 시스템 브랜치(`refactor/theme-system`) 와 절대 섞지 않는다. 설정 파일(`babel.config`, `jest.config`, `tsconfig`, `craco.config`) 수정이 테마 리팩터와 관심사가 완전히 다르고 PR 단위가 달라지기 때문.

## 관련 기록

- 테마 시스템 설계 문서 [`docs/plans/2026-04-11-theme-system-design.md`](../plans/2026-04-11-theme-system-design.md) 의 Phase 0+1 회고 마지막 줄에 이 이슈가 테마 작업과 무관함을 명시.
- master 커밋 `3839388` (2026-04-11) 기준으로 이미 이 상태.
