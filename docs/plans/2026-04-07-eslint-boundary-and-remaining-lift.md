# ESLint 경계 강제 + 잔여 Recoil 사용 리프팅

작성일: 2026-04-07
상위 계획: `docs/plans/2026-04-07-refactor-global-state-boundary-design.md` (6단계)
브랜치명 제안: `chore/enforce-global-state-boundary`

## 배경

5단계까지 `program-doc`, `program-folder`, `program-image`, `taskbar`, `window-shell` 5개 feature 를 DesktopPage 로 lift 완료. 그러나 `features/**` 전역에 여전히 Recoil 을 직접 구독하는 feature 들이 남아 있음.

계획 문서 6단계 목표:
1. 남은 feature 들의 Recoil 직접 구독을 DesktopPage 로 lift
2. ESLint `no-restricted-imports` 룰로 `features/**` 와 `shared/**` 에서 `recoil` / `@store/**` import 금지
3. 룰 위반이 없도록 최종 정리

## 목표

- `src/features/**` 아래 어떤 파일도 `recoil` 또는 `@store/**` 를 import 하지 않는다
- ESLint 룰로 이를 컴파일 타임에 강제한다
- 기존 동작 회귀 없음

## 비목표

- Container/Component 파일명 리네임 (별도 작업)
- preview 팝업 레이아웃 정리 (별도 작업)
- Recoil → 다른 상태 라이브러리 마이그레이션
- 신규 기능

## 사전 조사 (첫 단계에서 수행)

```bash
# 1. features 쪽의 recoil/@store 직접 import 전부 찾기
grep -rn "from \"recoil\"\|from '@store" src/features src/shared
```

예상 후보 (정확한 목록은 grep 결과로 확정):
- `src/features/hidden-icon/**`
- `src/features/display-cover/**`
- `src/features/infobar/InfoBarContainer.tsx`
- `src/features/timebar/TimeBarContainer.tsx`
- `src/features/statusbar/StatusBarContainer.tsx` (일부 남아 있을 수 있음)
- 기타

각 파일을 읽고 **어떤 atom 을 구독하는지 / 어떤 핸들러가 필요한지** 메모.

## 작업 단계

### Phase 1: 전수 조사

1. grep 으로 `features/**` + `shared/**` 에서 `recoil` / `@store/` import 모두 리스트업
2. 파일별로 "무엇을 read/write 하는지" 표로 정리
3. DesktopPage 에 추가로 lift 할 atom 목록 및 필요한 handler 시그니처 결정
4. 이 조사 결과를 `docs/plans/2026-04-07-boundary-audit.md` 로 잠깐 남겨두면 좋음 (작업 중 체크리스트)

### Phase 2: Feature 별 lift (작은 단위로 하나씩)

각 feature 마다 4단계 워크플로우를 반복:

1. **atom read/write → props 로 치환**: feature 컴포넌트에 props 추가, Recoil 호출 제거
2. **DesktopPage 에 atom hook 추가 + handler 구현**: 필요한 state/setter 를 DesktopPage 로 올리고 JSX 에서 props 로 주입
3. **characterization test 추가**(해당 feature 에 아직 없다면): 주요 사용자 시나리오 1~2개
4. **tsc/test/build 통과 확인 + 작은 커밋**

권장 순서 (간단한 것부터):
- `display-cover` (Recoil 사용 작음 예상)
- `hidden-icon`
- `timebar` / `infobar`
- `statusbar` (잔여 분량만)
- 그 외 grep 결과

**팁**: feature 하나 lift 할 때마다 DesktopPage 의 props 목록이 길어진다. 10개 넘어가면 `useMemo` 로 묶어서 객체 prop 으로 전달하거나 `useDesktopHandlers` 같은 custom hook 으로 정리 고려 (과도한 추상화는 피할 것).

### Phase 3: ESLint 룰 도입

`.eslintrc` 또는 CRA 기본 ESLint 설정 확인 후, 다음 룰 override 추가:

```json
{
  "overrides": [
    {
      "files": ["src/features/**/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
      "excludedFiles": ["**/__tests__/**"],
      "rules": {
        "no-restricted-imports": [
          "error",
          {
            "patterns": [
              {
                "group": ["recoil"],
                "message": "전역 상태는 pages/ 에서만 접근하세요"
              },
              {
                "group": ["@store/*", "**/store/**"],
                "message": "atom 은 pages/ 에서만 import 하세요"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

- 룰 추가 후 `pnpm build` 또는 `npx eslint src --ext .ts,.tsx` 로 위반 0건 확인
- 위반이 남아 있다면 Phase 2 로 돌아감

### Phase 4: 최종 검증

- `pnpm test` 전체 통과
- `pnpm build` 성공 (ESLint 경고에 새 위반 없음)
- 수동 QA:
  - 데스크탑 아이콘 동작
  - 모든 프로그램 open/close/min/max
  - taskbar / statusbar / timebar / infobar 각각 정상
  - hidden-icon, display-cover 정상

## 커밋/PR 전략

**작게 나눠서**: feature lift 하나당 커밋 하나. PR 은 전체를 하나로 묶거나 Phase 별로 분리.

- 1개 PR 로 제출 시: 리뷰 부담은 크지만 중간 상태가 깔끔
- Phase 별로 나눌 시: 각 PR 이 작고 회귀 추적 쉬움 — **권장**

권장: `feature lift 일괄` PR + `ESLint 룰 도입` PR 2개로 분리.

## 위험 요소

| 위험 | 완화 |
|---|---|
| Lift 과정에서 회귀 | feature 하나씩 작업, 각 단계마다 build/test |
| DesktopPage 비대화 | custom hook(`useDesktopHandlers`) 로 정리 고려, 단 과도한 추상화는 피할 것 |
| ESLint 룰이 기존 테스트 파일까지 막을 수 있음 | `excludedFiles: **/__tests__/**` 로 예외 |
| `@store/*` 경로 alias 가 CRA/craco 설정에 있는지 확인 필요 | tsconfig.paths 와 craco config 확인 |

## 완료 기준

- [ ] `grep "from \"recoil\"" src/features src/shared` 결과 0건
- [ ] `grep "@store" src/features src/shared` 결과 0건
- [ ] ESLint 룰 적용, 빌드/린트 경고 0
- [ ] 모든 테스트 통과
- [ ] 수동 QA 체크리스트 통과
- [ ] 계획 문서 `2026-04-07-refactor-global-state-boundary-design.md` 의 10. 완료 기준 항목 대부분 체크됨
