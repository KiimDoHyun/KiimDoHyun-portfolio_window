# FSD vs Feature-First 아키텍처 정량 비교 설계

## 목적

현재 FSD 아키텍처와 Feature-First 아키텍처를 동일 코드베이스에서 정량적으로 비교하여,
AI LLM 협업 및 개발 효율성 관점에서 어떤 구조가 더 유리한지 데이터로 판단한다.

## 비교 환경

| 구분 | FSD (현재) | Feature-First |
|------|-----------|---------------|
| 브랜치 | `master` | `refactor/feature-first` |
| 작업 공간 | 원본 | git worktree |

## 측정 시나리오

### S1. 새 프로그램 타입 추가 (음악 플레이어)

- **작업**: 새로운 프로그램 타입(MusicPlayer)을 추가
- **판단 기준**: 새 기능 추가 시 탐색/수정 범위
- **관련 영역**: 프로그램 컴포넌트, 데이터 정의, 상태 관리, 활성화 로직

### S2. ProgramContainer 리사이즈 로직 수정

- **작업**: 윈도우 창 가장자리 드래그 리사이즈 동작 수정
- **판단 기준**: 공통 기능 수정 시 영향 파악 용이성
- **관련 영역**: ProgramContainer, useDrag, 타입 정의

### S3. TaskBar 미리보기 기능 수정

- **작업**: TaskBar의 프로그램 미리보기 UI/동작 변경
- **판단 기준**: 위젯 UI 변경 시 컨텍스트 집중도
- **관련 영역**: TaskBar, TaskBarContainer, 상태 관리

## 측정 지표

### M1. Feature Cohesion (기능 응집도)

- **정의**: 하나의 기능을 이해하려면 몇 개 디렉토리를 봐야 하는가
- **측정 방법**: 시나리오 관련 파일들이 속한 고유 디렉토리 수 count
- **해석**: 낮을수록 좋음 (관련 코드가 한 곳에 모여있음)

### M2. Import Depth (의존성 탐색 깊이)

- **정의**: 진입점에서 관련 코드를 모두 추적하려면 몇 hop인가
- **측정 방법**: 시나리오 진입점 파일에서 관련 모듈까지의 최대 import hop 수
- **해석**: 낮을수록 좋음 (코드 추적이 쉬움)

### M3. AI Context Cost (AI 컨텍스트 비용)

- **정의**: AI가 하나의 기능을 수정하기 위해 읽어야 하는 코드 양
- **측정 방법**: 시나리오 수행에 필요한 모든 파일의 총 줄 수 합산
- **해석**: 낮을수록 좋음 (컨텍스트 윈도우 효율적 사용)

### M4. Change Scope (변경 영향 범위)

- **정의**: 하나의 기능을 수정할 때 변경이 필요한 파일 수
- **측정 방법**: 시나리오를 구현한다고 가정했을 때 수정 필요한 파일 수
- **해석**: 낮을수록 좋음 (변경 범위가 좁음)

## Feature-First 전환 매핑

```
FSD (현재)                              → Feature-First (변환 후)
─────────────────────────────────────────────────────────────────
1_apps/routers/                         → app/
2_pages/DesktopPage                     → features/desktop/
2_pages/LoginPage                       → features/login/
2_pages/ErrorPage                       → app/
3_widgets/Window10/Desktop/             → features/desktop/
3_widgets/Window10/TaskBar/             → features/taskbar/
3_widgets/Window10/StatusBar/           → features/statusbar/
3_widgets/Window10/TimeBar/             → features/timebar/
3_widgets/Window10/InfoBar/             → features/infobar/
3_widgets/Window10/Login/               → features/login/
3_widgets/Window10/HiddenIcon/          → features/hidden-icon/
3_widgets/Window10/DisplayCover/        → features/display-cover/
4_features/program/ProgramContainer     → features/window-shell/
4_features/program/useActiveProgram     → features/window-shell/
4_features/program/components/DOC       → features/program-doc/
4_features/program/components/Folder    → features/program-folder/
4_features/program/components/INFO      → features/program-info/
4_features/program/components/Image     → features/program-image/
4_features/program/components/Program   → features/window-shell/
6_common/hooks/                         → features/window-shell/hooks/ 또는 shared/hooks/
6_common/components/                    → shared/ui/
6_common/Layout/                        → shared/ui/
Common/                                 → shared/lib/
api/                                    → shared/api/
store/                                  → store/
Setting/                                → shared/lib/
types/                                  → types/
```

## 결과 산출물

측정 완료 후 `docs/plans/architecture-comparison-result.md`에 비교표 작성.
