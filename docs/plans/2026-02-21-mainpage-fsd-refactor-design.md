# MainPage FSD Refactoring Design

## Overview

`src/page/MainPage.tsx`(FSD 외부)를 `src/fsd/window/2_pages/DesktopPage.tsx`로 마이그레이션.
Container/Component 패턴의 기존 코드를 FSD 레이어(widgets, features, common)로 재배치.

## Decisions

| 항목 | 결정 |
|------|------|
| 스타일링 | styled-components 유지 (PandaCSS 전환은 별도) |
| Store | `src/store/` 현재 위치 유지 |
| Common/api/Setting | 현재 위치 유지 |
| Widget 구성 | 기능별 개별 위젯 (7개) |
| 접근 방식 | Bottom-up: hooks → features → widgets → page |
| 원본 파일 | 이동 완료 후 삭제 |

## Target FSD Structure

```
src/fsd/window/
├── 2_pages/
│   └── DesktopPage.tsx              ← MainPage 내용 + MainPageBlock 스타일
│
├── 3_widgets/Window10/
│   ├── Desktop/                     ← WindowContainer 계열
│   │   ├── WindowContainer.tsx
│   │   ├── components/
│   │   │   ├── Window.tsx
│   │   │   └── IconBox.tsx
│   │   └── index.ts
│   │
│   ├── TaskBar/                     ← TaskBar 계열
│   │   ├── TaskBarContainer.tsx
│   │   ├── components/
│   │   │   ├── TaskBar.tsx
│   │   │   └── SkillIcon.tsx
│   │   └── index.ts
│   │
│   ├── StatusBar/                   ← StatusBar 계열
│   │   ├── StatusBarContainer.tsx
│   │   ├── components/
│   │   │   ├── StatusBar.tsx
│   │   │   ├── LeftAreaBox.tsx
│   │   │   ├── CenterAreaBox.tsx
│   │   │   └── RightAreaBox.tsx
│   │   └── index.ts
│   │
│   ├── TimeBar/                     ← TimeBar 계열
│   │   ├── TimeBarContainer.tsx
│   │   ├── components/
│   │   │   └── TimeBar.tsx
│   │   └── index.ts
│   │
│   ├── InfoBar/                     ← InfoBar 계열
│   │   ├── InfoBarContainer.tsx
│   │   ├── components/
│   │   │   └── InfoBar.tsx
│   │   └── index.ts
│   │
│   ├── HiddenIcon/
│   │   ├── HiddenIcon.tsx
│   │   └── index.ts
│   │
│   └── DisplayCover/
│       ├── DisplayCover.tsx
│       └── index.ts
│
├── 4_features/
│   └── program/                     ← 프로그램 열기/관리
│       ├── ProgramContainer.tsx
│       ├── components/
│       │   ├── ProgramComponent.tsx
│       │   ├── DOCProgramContainer.tsx
│       │   ├── DOCProgramComponent.tsx
│       │   ├── FolderProgramContainer.tsx
│       │   ├── FolderProgramComponent.tsx
│       │   ├── ImageProgramContainer.tsx
│       │   ├── ImageProgramComponent.tsx
│       │   ├── INFOProgramContainer.tsx
│       │   └── INFOProgramComponent.tsx
│       ├── hooks/
│       │   └── useActiveProgram.tsx
│       └── index.ts
│
└── 6_common/
    └── hooks/
        ├── useGetCurrentTime.ts     ← src/hooks에서 이동
        ├── useOutsideClick.ts       ← src/hooks에서 이동
        ├── useAxios.ts              ← src/hooks에서 이동
        └── index.ts                 ← export 추가
```

## Unchanged Directories

- `src/store/` — Recoil atoms (별도 마이그레이션 시점에 처리)
- `src/Common/` — 공용 데이터 (data.ts, common.ts 등)
- `src/api/` — API 클라이언트
- `src/Setting/` — SetDirectory 초기화

## Files to Delete After Migration

- `src/page/MainPage.tsx`
- `src/Container/` (전체)
- `src/Component/` (전체)
- `src/hooks/` (전체 — 6_common 및 4_features로 이동 확인 후)

## Implementation Order (Bottom-up)

### Phase 1: Common Hooks
- `useGetCurrentTime`, `useOutsideClick`, `useAxios` → `6_common/hooks/`
- Update `6_common/hooks/index.ts` exports

### Phase 2: Program Feature
- ProgramContainer + 4종 type containers/components → `4_features/program/`
- `useActiveProgram` → `4_features/program/hooks/`
- Create `4_features/program/index.ts`

### Phase 3: Widgets (dependency order)
1. DisplayCover — 의존성 없음 (store/global만)
2. HiddenIcon — 의존성 없음 (store/taskbar만)
3. TimeBar — useGetCurrentTime (6_common)
4. InfoBar — useAxios (6_common), api/git
5. StatusBar — useActiveProgram (4_features), useOutsideClick (6_common)
6. TaskBar — useActiveProgram, useGetCurrentTime, useOutsideClick
7. Desktop — program feature (4_features), store

### Phase 4: DesktopPage
- 7개 위젯 조합
- MainPageBlock 스타일 inline 이동
- 팝업 닫기 로직 (store 직접 참조 — 허용된 타협)

### Phase 5: Cleanup
- 원본 파일 삭제
- tsconfig path alias 정리 (미사용 alias 제거)
- import 경로 전체 검증

## Notes

- DesktopPage에서 `@store/taskbar` 직접 참조는 FSD 순수성에서 벗어나지만, store를 현재 위치에 유지하기로 한 결정의 자연스러운 결과. store를 5_entities/로 이동할 때 함께 정리.
- 위젯 내부는 기존 Container/Component 패턴 유지 (리팩터링 범위 최소화).
- 파일명은 원본 그대로 유지하여 diff 최소화.
