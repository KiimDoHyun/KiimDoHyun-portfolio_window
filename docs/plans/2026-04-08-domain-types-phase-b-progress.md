# Phase B 진행 상황 — 세션 브리핑

> 새 세션에서 `docs/plans/2026-04-08-domain-types-phase-b.md`를 이어서 실행할 때 이 문서를 컨텍스트로 제공하세요.

## 현재 상태

- **브랜치:** `feat/phase-b-domain-types` (master 기반)
- **완료:** Task 0 ~ Task 14 (Stage B-1 전체 + Stage B-2 전체)
- **다음:** Task 15 ~ 17 (Stage B-3 일부, **한 세션에서 묶어 진행**)
- **남은:** Task 15 ~ 20

## 완료된 커밋 (master → HEAD, 14개)

```
363ee6b refactor(window-shell): migrate to ProgramNode-based props
9f38f16 refactor(taskbar): migrate to ProgramNode/RunningProgram entries
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

## 검증 상태 (Task 14 시점)

- 테스트: 14 suites / 70 tests pass
- typecheck: 0 errors
- 수동 스모크: 미수행 (Phase B-3 종료 시점에 한 번에 확인 권장). 아이콘 깨짐은 알려진 이슈 (Phase C에서 해결).

## 플랜 이탈 (이후 세션에서 기억할 것)

### 1. Task 4 — parity 테스트에서 icon 비교 제외
- 이유: `data.ts`는 webpack import(`imgReact`)를 쓰고 `portfolio.json`은 빈 문자열.
  Jest에선 basename 문자열, webpack 프로덕션에선 해시 URL — 절대 일치 못 함.
- 조치: `src/data/__tests__/portfolio-parity.test.ts`의 icon 비교 3줄 주석 처리.
- 플랜의 "Replacing `monitor` and other hard-coded image assets in `portfolio.json` with a manifest" (Phase C)에서 정식 해결 예정.

### 2. Task 7 — uiStore 읽기+쓰기를 동시 마이그레이션
- 이유: 플랜 원문은 Task 7에서 **쓰기만** uiStore로 옮기고 **읽기**는 Recoil 유지, Task 16에서 읽기를 전환하라고 지시.
  → 그 중간 상태가 desync(메뉴를 열어도 Recoil 쪽 값은 안 바뀌니 UI가 열리지 않음). 플랜 버그로 판단.
- 조치: Task 7에서 읽기+쓰기 전부 `useUiStore`로 이동. **결과적으로 Task 16의 "DesktopPage에서 useRecoilState(rc_taskbar_*) 제거" 부분은 이미 완료된 상태**. Task 16은 사실상 "`src/store/taskbar.ts` 삭제 + `rc_global_DisplayLight` 제거"만 남음.

### 3. Task 13 — DesktopPage에 인라인 어댑터 남김 → Task 14에서 제거 완료
- Task 13에서 `renderProgramContent` 시그니처를 한 번에 다 바꾸지 않고 인라인 어댑터로 우회. Task 14에서 어댑터/`programList`/`findIdByName`/`WindowShellItem` shim을 모두 제거함. ✅

### 4. Task 14 — DOC/Info 동시 마이그레이션 완료
- `DOCProgram`을 `{type, name}` → `{id}` API로 전환. `useFileSystemStore`로 노드 조회 후 discriminated union의 `node.contents: ProjectData` 직접 사용 (캐스트 없음).
- `DOCProgram.types.ts`는 `@shared/types/content`로 re-export.
- `DOCProgram.test.tsx`는 `hydrateTestFileSystem` + 인라인 `ProjectData` 픽스처로 재작성.
- `InfoProgram`/`InfoProgram.view`의 사용되지 않던 `type` prop 제거.

### 5. 아이콘 전반 깨짐 — 무시 (Phase C)
- DesktopPage/feature들이 `portfolio.json` 기반으로 아이콘을 읽는데, JSON에는 icon 필드가 전부 `""`. Phase C의 manifest로 해결.

## 도구 주의사항

- **테스트 커맨드:** `pnpm test --watchAll=false` (단일 `--`). 플랜 원문의 `pnpm test -- --watchAll=false`(이중 `--`)는 craco가 깨짐.
- **패키지 매니저:** `pnpm` 고정. `npm install` 금지.
- **파일 삭제:** 사용자 확인 필수 (user memory 규칙). 삭제 전 무엇을/왜 삭제할지 안내 후 대기.
- **테스트 헬퍼:** `src/test-utils/hydrateFileSystem.ts`. `hydrateTestFileSystem(schema)` + `findIdByName(name)` 제공.
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

---

## 다음 세션 — Task 15 ~ 17 묶음 진행 메모

세 task 모두 Recoil dead-code 정리이며 매우 작음 → **한 세션에서 batch 처리하고 묶음 단위로 리뷰 대기**.

### Task 15: hidden-icon Recoil 점검 — **사실상 no-op**
- `src/features/hidden-icon/HiddenIcon.tsx`에 있는 `import recoil from "@images/icons/recoil.png"`는 **라이브러리가 아니라 스킬 아이콘 이미지**다. recoil 라이브러리 import 없음, `useRecoilValue` 사용 없음.
- 조치: `git commit --allow-empty -m "chore(hidden-icon): confirm no Recoil usage"` 로 처리하거나, 묶음 커밋 시 생략.

### Task 16: taskbar.ts 삭제 + rc_global_DisplayLight 제거
- **이미 Task 7에서 DesktopPage 읽기/쓰기 모두 `useUiStore`로 옮긴 상태.** Plan Step 1·2 (DesktopPage 수정)는 **건너뜀**.
- 남은 작업:
  1. `src/store/taskbar.ts` 삭제 (5개 atom 모두 dead).
  2. 검증: `grep -rn "@store/taskbar\|store/taskbar\|rc_taskbar_" src/` → 빈 결과.
  3. `src/store/global.ts`에서 `rc_global_DisplayLight` atom 제거 (시간 atom들은 Task 17에서 처리).
  4. 검증: `grep -rn "rc_global_DisplayLight" src/` → 빈 결과.
- 커밋: `refactor: migrate taskbar toggles and displayLight to uiStore`

### Task 17: global.ts 시간 atom 전부 삭제
- 검증: `grep -rn "rc_global_year\|rc_global_month\|rc_global_day\|rc_global_date\|rc_global_hour\|rc_global_min\|rc_global_sec\|rc_global_timeline" src/` → 결과는 `src/store/global.ts` 한 파일만 나와야 함. 다른 곳에서 참조하면 먼저 `useGetCurrentTime()`로 마이그레이션.
- 조치: Task 16 이후 `global.ts`가 시간 atom만 남게 되므로 **파일 통째로 삭제**.
- 검증: `grep -rn "@store/global\|store/global" src/` → 빈 결과.
- 커밋: `chore(store): delete unused time atoms (global.ts)`

### 묶음 검증 (Task 17 끝난 뒤 한 번)
```bash
pnpm exec tsc --noEmit
pnpm test --watchAll=false
grep -rn "rc_taskbar_\|rc_global_" src/   # 빈 결과 기대
grep -rn "from \"recoil\"" src/           # src/index.tsx (RecoilRoot) 와 src/shared/lib/data.ts 만 남아야 함 — 둘 다 Task 18+에서 처리
```

### 파일 삭제 주의
- `src/store/taskbar.ts`, `src/store/global.ts` 는 사용자 메모리 규칙상 **삭제 전 사용자에게 확인**. 묶음 시작 시점에 "이 두 파일을 삭제할 예정"이라고 안내 후 진행.

### 새 세션 시작 프롬프트 (참고)

> docs/plans/2026-04-08-domain-types-phase-b-progress.md 를 먼저 읽고,
> docs/plans/2026-04-08-domain-types-phase-b.md 의 Task 15·16·17 (Recoil dead-code 정리) 을
> 한 묶음으로 진행해줘. superpowers:executing-plans 스킬로,
> 브리핑의 "다음 세션 — Task 15 ~ 17 묶음 진행 메모" 절차대로
> 세 task 끝낸 뒤 한 번에 리뷰 대기. 파일 삭제는 사용자 확인 후 진행.
