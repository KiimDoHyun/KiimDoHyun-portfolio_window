# Container/Component 네이밍 정리

작성일: 2026-04-07
상위 계획: `docs/plans/2026-04-07-refactor-global-state-boundary-design.md` (완료 기준 정리)
브랜치명 제안: `refactor/rename-container-component`

## 배경

리팩토링 계획의 **완료 기준** 중 하나:
> - [ ] `*Container.tsx` / `*Component.tsx` 파일 패턴 소멸

5단계까지 주요 program feature 들은 Container/Component 패턴을 제거했지만, 주변 feature 와 일부 wrapper 파일에 레거시 네이밍이 남아 있다. 이 작업은 **단순 리네임 + import 경로 수정** 이며 로직 변경이 없다.

## 전제

**이 작업은 6단계(ESLint 경계 강제 + 잔여 lift) 작업이 먼저 끝난 후** 진행하는 것을 권장한다. 이유:
- 6단계에서 Container 파일들을 lift 하면서 일부는 자연스럽게 리네임될 수 있음
- 순서를 반대로 하면 같은 파일을 두 번 건드려 충돌 위험

## 목표

- `src/features/**` 와 그 외 영역에서 `*Container.tsx` / `*Component.tsx` 네이밍을 모두 제거
- import 경로 전수 수정
- 기능/동작 변경 0

## 비목표

- 내부 로직 리팩토링
- 파일 구조 변경 (hooks/ ui/ 도입 등은 6단계에서 끝났다고 가정)
- 테스트 추가

## 사전 조사

```bash
# 리네임 대상 전부 리스트업
find src -name "*Container.tsx" -o -name "*Component.tsx"
```

예상 대상 (정확한 목록은 find 결과로 확정):
- `src/features/infobar/InfoBarContainer.tsx` → `InfoBar.tsx`
- `src/features/timebar/TimeBarContainer.tsx` → `TimeBar.tsx`
- `src/features/statusbar/StatusBarContainer.tsx` → `StatusBar.tsx` (내부에 `components/StatusBar.tsx` 가 있으면 충돌 주의)
- `src/features/desktop/WindowContainer.tsx` → `DesktopWindow.tsx` 또는 제거 (6단계에서 이미 축소됨)
- `src/features/program-info/INFOProgramContainer.tsx` → `InfoProgram.tsx`
- `src/features/program-info/INFOProgramComponent.tsx` → `InfoProgram.view.tsx` 또는 ui/ 하위로
- 내부 `components/` 하위 `*Component.tsx` 도 점검
- 기타

## 리네임 규칙

| Before | After | 비고 |
|---|---|---|
| `XxxContainer.tsx` | `Xxx.tsx` | 단일 컴포넌트 통합 시 |
| `XxxComponent.tsx` | 삭제 or `ui/Xxx.tsx` | presentational 이면 `ui/` 로 이동 |
| `components/Xxx.tsx` | `ui/Xxx.tsx` | 일관성 |

충돌이 생기면 (예: `StatusBar.tsx` 가 이미 있음) → `StatusBarPanel.tsx` 같은 의미 있는 이름으로.

## 작업 단계

### Phase 1: 대상 목록 확정

1. `find` 로 모든 `*Container.tsx` / `*Component.tsx` / `components/` 파일 리스트업
2. 각각 리네임 후 이름 결정 (표로 정리)
3. 충돌 여부 확인

### Phase 2: 리네임 (feature 단위로 하나씩)

각 feature 마다:

1. `git mv` 로 파일명 변경 (내부 `components/` → `ui/` 도 함께)
2. import 경로 수정
   - 해당 파일을 import 하던 곳 모두 grep → 경로/이름 수정
   - `index.ts` 의 re-export 갱신
3. `pnpm build` 로 컴파일 에러 0 확인
4. 작은 커밋

**팁**: IDE 의 rename refactoring 기능을 쓰면 빠르지만, git history 보존을 위해 `git mv` 후 import 만 따로 수정하는 게 깔끔.

### Phase 3: 테스트 파일 경로 갱신

- `__tests__/XxxContainer.test.tsx` 도 같이 리네임
- 테스트 파일 내부의 import 경로도 수정

### Phase 4: 검증

- `find src -name "*Container.tsx" -o -name "*Component.tsx"` 결과 0건 (또는 의도적으로 남긴 파일만)
- `pnpm test` 전체 통과
- `pnpm build` 성공
- 수동 QA 간단히 (리네임만 했으므로 컴파일 성공하면 거의 OK)

## 커밋/PR

단일 PR 로 묶는다. 로직 변경 없는 리네임이라 리뷰 부담 적음.

Commit 예시:
- `refactor(infobar): rename InfoBarContainer to InfoBar`
- `refactor(timebar): rename TimeBarContainer to TimeBar`
- ...
- `refactor: final naming cleanup pass`

## 위험 요소

| 위험 | 완화 |
|---|---|
| import 경로 누락 → 빌드 실패 | 각 리네임마다 build 실행 |
| 동일 이름 충돌 (예: 내부 `components/StatusBar.tsx`) | 사전 조사에서 충돌 확인, 필요 시 의미 있는 이름 부여 |
| git history 끊김 | `git mv` 사용, content 변경과 리네임을 같은 커밋에 넣지 말 것 |
| 경로 alias 캐시 | 필요 시 node_modules/.cache 삭제 |

## 완료 기준

- [ ] `find src -name "*Container.tsx" -o -name "*Component.tsx"` 결과 0건
- [ ] 모든 테스트 통과
- [ ] 빌드 성공
- [ ] 계획 문서 `2026-04-07-refactor-global-state-boundary-design.md` 의 "Container/Component 파일 패턴 소멸" 체크 가능
