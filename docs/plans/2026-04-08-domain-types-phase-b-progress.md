# Phase B 진행 상황 — 세션 브리핑

> 새 세션에서 `docs/plans/2026-04-08-domain-types-phase-b.md`를 이어서 실행할 때 이 문서를 컨텍스트로 제공하세요.

## 현재 상태

- **브랜치:** `feat/phase-b-domain-types` (master 기반)
- **완료:** Task 0 ~ Task 20 (Phase B 전부)
- **다음:** Phase C (에셋 manifest로 아이콘 이슈 해결)
- **남은:** 없음

## 완료된 커밋 (master → HEAD, 17개)

```
b50fce6 chore(store): delete unused time atoms (global.ts)
018ac4f refactor: migrate taskbar toggles and displayLight to uiStore
403954a chore(hidden-icon): confirm no Recoil usage
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

## 검증 상태 (Task 17 시점)

- 테스트: 14 suites / 70 tests pass
- typecheck: 0 errors
- `grep rc_taskbar_|rc_global_` (src, madge 제외) → 0건
- `grep from "recoil"` → `src/index.tsx`의 `RecoilRoot` 1건만 (Task 19에서 제거)
- 수동 스모크: 미수행 (Task 20에서 한 번에 확인). 아이콘 깨짐은 알려진 이슈 (Phase C에서 해결).

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

### 5. Task 15·16·17 — 묶음 처리 완료
- Task 15는 사실상 no-op (`hidden-icon`의 `recoil.png`는 스킬 아이콘 이미지). `--allow-empty` 커밋으로 기록.
- Task 16: `src/store/taskbar.ts` 삭제만 수행 (DesktopPage 마이그레이션은 Task 7에서 이미 완료).
- Task 17: `src/store/global.ts` 통째 삭제 (`rc_global_DisplayLight` + 시간 atom 8개 모두 dead).
- 묶음 검증: tsc 0 errors / 14 suites 70 tests pass.

### 6. 아이콘 전반 깨짐 — 무시 (Phase C)
- DesktopPage/feature들이 `portfolio.json` 기반으로 아이콘을 읽는데, JSON에는 icon 필드가 전부 `""`. Phase C의 manifest로 해결.

### 7. Task 19 후 ESLint `no-restricted-imports` 규칙 충돌 → 규칙 완화
- 이유: Recoil 시대의 "features/shared는 `@store/*` import 금지, pages/에서만 접근" 규칙이 zustand 전환 후에도 `package.json` eslintConfig에 남아있었다. Phase B에서 features/desktop, program-folder, program-doc, statusbar 등을 의도적으로 zustand 스토어 직접 구독으로 전환했기 때문에 `craco start`(webpack dev eslint) 단계에서 전부 error. `tsc`/`jest`는 eslint를 돌리지 않아 Task 19 커밋 시점까지 못 잡음.
- 조치: `package.json` eslintConfig의 `@store/*` + `**/store/*` 패턴 제거, `recoil` 금지는 재유입 가드로 유지. 별도 커밋 `9b05539 chore(lint): allow zustand store imports in features`.
- 영향: Phase B의 "features가 스토어를 직접 구독" 의도와 ESLint 규칙이 일치. uiStore는 여전히 features 접근 0건(자연 유지).

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

## 다음 세션 — Task 18 ~ 20 묶음 진행 메모

Phase B의 최종 정리. **Task 18·19는 코드 변경 + 커밋, Task 20은 검증만**. 한 세션에서 묶어 진행하고 Task 20 결과로 리뷰 대기.

### 사전 정찰 결과 (이 세션에서 미리 grep으로 확인 완료)

- **삭제 대상 4개 파일은 모두 존재**:
  - `src/pages/DesktopPage/DesktopDataContext.tsx`
  - `src/pages/DesktopPage/useDesktopData.ts`
  - `src/data/__tests__/portfolio-parity.test.ts`
  - `src/shared/lib/data.ts` (아래 분석 참고)
- **`DirectoryItem` / `DirectoryTree`**: `useDesktopData.ts`와 `DesktopDataContext.tsx` **두 파일에만** 존재. 두 파일 삭제 시 자연 소멸 — 다른 cleanup 불필요.
- **`WindowShellItem` / `TaskbarProgramItem` / `ImageItem`**: 이미 Task 13/14에서 제거됨. grep 0건. Plan Task 18 Step 4는 **건너뛰기**.
- **`src/shared/lib/data.ts`**: `directory` export는 parity test에서만 import됨 (parity test 자체도 삭제). `projectDatas` export는 **어디에서도 import되지 않음** — statusbar의 `projectDatas`는 동명의 로컬 변수. 따라서 **`data.ts` 통째로 삭제**.
- **`src/index.tsx`**: 현재 `RecoilRoot` import + React 19 internals polyfill 포함. Task 19에서 둘 다 제거.

### Task 18: 어댑터 + legacy 도메인 타입 삭제

**삭제할 파일 (사용자 확인 필수, user memory 규칙):**
1. `src/pages/DesktopPage/DesktopDataContext.tsx`
2. `src/pages/DesktopPage/useDesktopData.ts`
3. `src/data/__tests__/portfolio-parity.test.ts`
4. `src/shared/lib/data.ts`

**진행 순서:**
1. 묶음 시작 시점에 위 4개 파일 삭제 예고 → 사용자 승인 대기.
2. 4개 파일 삭제.
3. 검증:
   ```bash
   grep -rn "DesktopDataContext\|useDesktopData\|DirectoryItem\|DirectoryTree" src/  # 빈 결과
   grep -rn "from ['\"]@?shared/lib/data['\"]" src/                                  # 빈 결과
   pnpm exec tsc --noEmit                                                             # 0 errors
   pnpm test --watchAll=false                                                         # 그린 (테스트 수: 70 → 69, parity 1개 감소)
   ```
4. 커밋: `chore: delete DesktopDataContext adapter and legacy domain types`

**주의:** parity test 삭제로 테스트 카운트 1 감소가 정상. Plan 원문은 Task 18에서 `data.ts`의 `directory`만 지우고 `projectDatas`는 조건부 보존하라 했지만, 정찰상 후자도 dead라 파일 통째 삭제로 단순화.

### Task 19: RecoilRoot + React 19 polyfill + recoil 의존성 제거

**파일:**
- 수정: `src/index.tsx` — `RecoilRoot`, `import { RecoilRoot } from "recoil"`, React 19 internals polyfill 블록 전부 제거.
- 수정: `package.json` / `pnpm-lock.yaml` — `pnpm remove recoil`.

**진행 순서:**
1. `grep -rn "recoil\|RecoilRoot\|useRecoil" src/` → 결과는 `src/index.tsx`의 RecoilRoot 1~2줄만 기대.
2. `src/index.tsx`를 plan에 명시된 형태로 수정 (RecoilRoot 래핑/polyfill 제거, `useFileSystemStore.getState().hydrate(...)` 보존).
3. `pnpm remove recoil`
4. `pnpm install && pnpm exec tsc --noEmit && pnpm test --watchAll=false` → 모두 그린.
5. **수동 스모크 권장**: `pnpm start`로 부팅 확인 (Task 20 전 1차 sanity check).
6. 커밋: `chore: remove Recoil and React 19 internals polyfill`

### Task 20: 최종 acceptance (커밋 없음, 검증만)

**자동 검증:**
```bash
pnpm exec tsc --noEmit                                # 0 errors
pnpm test --watchAll=false                            # 전부 그린
grep -rn "recoil" src/                                # 빈 결과
pnpm list recoil                                      # not found
grep -rn "DesktopDataContext\|useDesktopData\|DirectoryItem\|DirectoryTree\|WindowShellItem\|TaskbarProgramItem" src/  # 빈 결과
grep -rn "rc_global_\|rc_program_\|rc_taskbar_" src/  # 빈 결과
grep -rn "SetDirectory" src/                          # 빈 결과
grep '"recoil"' package.json                          # 빈 결과
git log --oneline master..HEAD                        # 약 19개 커밋
```

**수동 스모크 체크리스트** — plan Task 20 Step 2 항목 그대로 (앱 부팅 / 폴더 / 이미지 / DOC / 브라우저 / INFO / 작업표시줄 / 시계 / displayLight 등). 아이콘 깨짐은 known issue (Phase C).

**Task 20 결과 보고:**
- 커밋 수 + 메시지 리스트
- 테스트 카운트 (baseline 대비 델타)
- 플랜 이탈 항목 (이 브리핑의 "플랜 이탈" 절 참고)
- Phase C가 다음 단계임을 확인

### 묶음 진행 시 체크포인트
- Task 18 끝 → 사용자 리뷰 없이 바로 Task 19로 (둘 다 mechanical)
- Task 19 끝 → `pnpm start` 수동 스모크는 사용자에게 부탁 (브라우저 띄울 수 있는 사람이 해야 의미 있음)
- Task 20 자동 검증 끝 → **최종 리뷰 대기**

### 파일 삭제 주의 (재강조)
사용자 메모리 규칙: 아래 4개 파일은 **삭제 전 사용자 승인 필수**. 묶음 시작 시 한꺼번에 안내.
- `src/pages/DesktopPage/DesktopDataContext.tsx`
- `src/pages/DesktopPage/useDesktopData.ts`
- `src/data/__tests__/portfolio-parity.test.ts`
- `src/shared/lib/data.ts`

### 새 세션 시작 프롬프트 (복사용)

> docs/plans/2026-04-08-domain-types-phase-b-progress.md 를 먼저 읽고,
> docs/plans/2026-04-08-domain-types-phase-b.md 의 Task 18·19·20 을
> 한 묶음으로 진행해줘. superpowers:executing-plans 스킬로,
> 브리핑의 "다음 세션 — Task 18 ~ 20 묶음 진행 메모" 절차대로.
> Task 18 시작 전 4개 파일 삭제 승인 받고, Task 19 후에 pnpm start 수동 스모크는 나에게 부탁,
> Task 20 자동 검증까지 끝낸 뒤 최종 리뷰 대기.
