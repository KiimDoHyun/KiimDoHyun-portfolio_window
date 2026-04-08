# Phase B 진행 상황 — 세션 브리핑

> 새 세션에서 `docs/plans/2026-04-08-domain-types-phase-b.md`를 이어서 실행할 때 이 문서를 컨텍스트로 제공하세요.

## 현재 상태

- **브랜치:** `feat/phase-b-domain-types` (master 기반)
- **완료:** Task 0 ~ Task 12 (Stage B-1 전체 + Stage B-2 중 9·10·11·12)
- **다음:** Task 13 (taskbar 마이그레이션)
- **남은:** Task 13 ~ 20

## 완료된 커밋 (master → HEAD, 12개)

```
5b4b34e chore(ts): enable jest+jest-dom types and skipLibCheck
ca5f3b3 refactor(statusbar): migrate to fileSystemStore selectors
e48a036 refactor(desktop): migrate DesktopWindow to ProgramNode selectors
4d1acf0 refactor(program-image): migrate to ProgramNode + id-based API
5616295 refactor(program-folder): migrate to ProgramNode + id-based API
acfa8aa refactor(desktop): migrate DesktopPage off Recoil to zustand stores
1b7e220 refactor(desktop-data): rewrite useDesktopData as adapter over new stores
f39f05d feat(boot): hydrate fileSystemStore from portfolio.json on startup
f003d55 test(data): assert portfolio.json parity with legacy directory
c609af7 feat(file-system): add getRoute helper for ancestor path strings
0a98381 feat(store): add uiStore for taskbar menu toggles and displayLight
95f3b42 feat(store): add runningProgramsStore with id-based CRUD and z-index
```

## 검증 상태 (Task 12 시점)

- 테스트: 14 suites / 70 tests pass
- typecheck: 0 errors
- 수동 스모크: 기능 동작 OK, 아이콘 깨짐은 알려진 이슈 (Phase C에서 해결)

## 플랜 이탈 (이후 세션에서 기억할 것)

### 1. Task 4 — parity 테스트에서 icon 비교 제외
- 이유: `data.ts`는 webpack import(`imgReact`)를 쓰고 `portfolio.json`은 빈 문자열.
  Jest에선 basename 문자열, webpack 프로덕션에선 해시 URL — 절대 일치 못 함.
- 조치: `src/data/__tests__/portfolio-parity.test.ts`의 icon 비교 3줄 주석 처리.
- 플랜의 "Replacing `monitor` and other hard-coded image assets in `portfolio.json` with a manifest" (Phase C)에서 정식 해결 예정.

### 2. Task 7 — uiStore 읽기+쓰기를 동시 마이그레이션
- 이유: 플랜 원문은 Task 7에서 **쓰기만** uiStore로 옮기고 **읽기**는 Recoil 유지, Task 16에서 읽기를 전환하라고 지시.
  → 그 중간 상태가 desync(메뉴를 열어도 Recoil 쪽 값은 안 바뀌니 UI가 열리지 않음). 플랜 버그로 판단.
- 조치: Task 7에서 읽기+쓰기 전부 `useUiStore`로 이동. Task 16은 "recoil 파일 삭제"만 하는 더 단순한 task가 됨.

### 3. 아이콘 전반 깨짐 — 무시 (Phase C)
- Task 5 이후 DesktopPage/feature들이 `portfolio.json` 기반으로 아이콘을 읽는데, JSON에는 icon 필드가 전부 `""`. Phase C의 manifest로 해결.
- 기능 테스트/수동 검증에서 "아이콘 안 뜸"은 정상.

## 도구 주의사항

- **테스트 커맨드:** `pnpm test --watchAll=false` (단일 `--`). 플랜 원문의 `pnpm test -- --watchAll=false`(이중 `--`)는 craco가 깨짐.
- **패키지 매니저:** `pnpm` 고정. `npm install` 금지.
- **파일 삭제:** 사용자 확인 필수 (user memory 규칙). 삭제 전 무엇을/왜 삭제할지 안내 후 대기.
- **테스트 헬퍼:** `src/test-utils/hydrateFileSystem.ts` (Task 9에서 추가). `hydrateTestFileSystem(schema)` + `findIdByName(name)` 제공.
- **test file import 경로:** 프로젝트에 `@/*` 별칭이 없음. `../../../test-utils/hydrateFileSystem` 형태의 상대경로 사용.

## 프로젝트 규칙 (사용자 메모리에서)

- `React.FC` 금지 → `({...}: Props)` 구조분해
- 배열 타입은 `Array<T>`, `T[]` 금지
- 모든 응답 한국어

## 각 Task 실행 시 체크리스트

1. 해당 Task 소스 코드/테스트 읽기
2. 플랜 지시대로 구현
3. `pnpm test --watchAll=false` + `pnpm exec tsc --noEmit` 둘 다 그린 확인
4. 플랜이 지시하는 정확한 커밋 메시지로 커밋 (task당 1커밋 원칙)
5. 사용자 체크포인트에서 멈춤

## Task 13 특이사항 (다음 세션에서)

- `TaskBar.types.ts`를 완전히 새 모양(`TaskbarEntry { node, running }`, `activeId`)으로 재작성
- 관련 파일: `TaskBar.tsx`, `ui/ProgramIcons.tsx`, `ui/PreviewPopup.tsx`, `ui/PreviewWindowFrame.tsx`, `hooks/useTaskbarHover.ts`, `__tests__/TaskBar.test.tsx`
- DesktopPage의 `programList`(WindowShellItem shim)를 `entries`(Array<TaskbarEntry>)로 변환해 TaskBar에 넘기도록 수정 — 이건 `features/taskbar` 경계 밖이지만 허용됨
- `renderProgramContent`도 `TaskbarEntry` 또는 별도 시그니처로 변경 가능 (Task 14에서 한번 더 건드리므로 최소 변경 권장)
- `resolveProgramMeta.ts`는 Task 14에서 `ProgramNode`로 전환 예정 — Task 13에선 그대로 두고 entry.node에서 필요한 필드 뽑아 호출
