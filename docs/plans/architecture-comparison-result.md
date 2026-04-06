# FSD vs Feature-First 아키텍처 정량 비교 결과

## 측정 환경

| 구분 | FSD | Feature-First |
|------|-----|---------------|
| 브랜치 | `master` | `refactor/feature-first` |
| 경로 | 원본 | `.worktrees/feature-first` |
| 빌드 | 통과 | 통과 |

---

## 종합 비교표

### S1. 새 프로그램 타입 추가 (음악 플레이어)

| 지표 | FSD | Feature-First | 차이 | 승자 |
|------|-----|---------------|------|------|
| **M1. Feature Cohesion** (디렉토리 수) | 5 | 5 | 0 | 무승부 |
| **M2. Import Depth** (최대 hop) | 3 | 3 | 0 | 무승부 |
| **M3. AI Context Cost** (총 줄 수) | 1,301 | 1,688 | +387 | FSD |
| **M4. Change Scope** (수정 파일 수) | 6 | 6 | 0 | 무승부 |

### S2. 리사이즈 로직 수정

| 지표 | FSD | Feature-First | 차이 | 승자 |
|------|-----|---------------|------|------|
| **M1. Feature Cohesion** (디렉토리 수) | 4 | 2 | -2 | **Feature-First** |
| **M2. Import Depth** (최대 hop) | 2 | 1 | -1 | **Feature-First** |
| **M3. AI Context Cost** (총 줄 수) | 980 | 978 | -2 | 무승부 |
| **M4. Change Scope** (수정 파일 수) | 2 | 2 | 0 | 무승부 |

### S3. TaskBar 미리보기 기능 수정

| 지표 | FSD | Feature-First | 차이 | 승자 |
|------|-----|---------------|------|------|
| **M1. Feature Cohesion** (디렉토리 수) | 4 | 4 | 0 | 무승부 |
| **M2. Import Depth** (최대 hop) | 2 | 2 | 0 | 무승부 |
| **M3. AI Context Cost** (총 줄 수) | 1,292 | 1,346 | +54 | FSD |
| **M4. Change Scope** (수정 파일 수) | 2 | 3 | +1 | FSD |

---

## 시나리오별 승패 집계

| 시나리오 | FSD 승 | Feature-First 승 | 무승부 |
|----------|--------|-------------------|--------|
| S1. 프로그램 추가 | 1 | 0 | 3 |
| S2. 리사이즈 수정 | 0 | 2 | 2 |
| S3. TaskBar 수정 | 2 | 0 | 2 |
| **합계** | **3** | **2** | **7** |

## 지표별 승패 집계

| 지표 | FSD 승 | Feature-First 승 | 무승부 |
|------|--------|-------------------|--------|
| M1. Feature Cohesion | 0 | 1 | 2 |
| M2. Import Depth | 0 | 1 | 2 |
| M3. AI Context Cost | 2 | 0 | 1 |
| M4. Change Scope | 1 | 0 | 2 |

---

## 세부 분석

### FSD가 유리한 영역

**AI Context Cost (M3)에서 FSD가 우세**
- S1: FSD 1,301줄 vs FF 1,688줄 (+387줄)
- S3: FSD 1,292줄 vs FF 1,346줄 (+54줄)
- 이유: Feature-First에서 프로그램 타입별 컨테이너 파일이 별도 디렉토리로 분리되어 참고해야 할 파일이 증가

**S3에서 Change Scope도 FSD 우세**
- FSD: TaskBarContainer + TaskBar = 2파일
- FF: TaskBarContainer + TaskBar + store/taskbar = 3파일

### Feature-First가 유리한 영역

**S2(공통 기능 수정)에서 확실한 우위**
- Cohesion: FSD 4디렉토리 → FF 2디렉토리 (50% 감소)
  - FSD: 4_features/program, 4_features/program/components, 6_common/hooks, 6_common/hooks/useDrag
  - FF: features/window-shell, features/window-shell/hooks
- Import Depth: FSD 2hop → FF 1hop (50% 감소)
  - 관련 파일이 같은 feature 내에 모여있어 import 체인이 짧음

### 무승부가 많은 이유

12개 측정 중 7개가 무승부. 이유:
1. **파일 자체는 동일** - 구조만 바뀌고 코드 내용은 같으므로 줄 수, 수정 파일 수가 유사
2. **Recoil store가 외부에 존재** - 양쪽 모두 store/ 디렉토리 접근 필요
3. **data.ts 중앙 집중** - 프로그램 데이터가 한 파일에 있어 양쪽 동일하게 접근

---

## 정량 데이터 외 정성적 차이

### 디렉토리 네이밍의 직관성

```
FSD:            "src/fsd/window/4_features/program/components/DOCProgramComponent.tsx"
Feature-First:  "src/features/program-doc/DOCProgramComponent.tsx"
```
→ Feature-First가 경로만으로 역할을 즉시 파악 가능

### AI 탐색 시 첫 번째 시도 적중률

"리사이즈 관련 코드를 찾아줘" 요청 시:
- FSD: `4_features/program` + `6_common/hooks/useDrag` 두 곳 탐색 필요
- Feature-First: `features/window-shell` 한 곳에서 모두 발견

### 레이어 규칙의 인지 부하

- FSD: "4_features는 6_common만 참조 가능" 같은 규칙을 기억해야 함
- Feature-First: feature 간 의존성만 단방향으로 유지하면 됨

---

## 프로젝트 규모에 따른 스케일링 분석

### 현재 규모에서 차이가 작은 이유

현재 프로젝트는:
- FSD 전체 파일 **~77개**, feature당 파일 수가 **2-5개** 수준
- 레이어가 있어도 각 레이어에 파일이 **몇 개 안 됨** → 탐색 부담이 원래 작음
- store, data.ts 같은 **중앙 집중 파일의 비중이 큼** → 어떤 구조든 결국 같은 파일을 읽어야 함

12개 측정 중 7개가 무승부인 것은 규모가 작아 구조 차이가 체감되기 어려운 수준이기 때문이다.

### 규모가 커지면 차이가 벌어지는 구조

프로그램 타입이 5개 → 20개로 늘어난다고 가정했을 때:

| 관점 | FSD | Feature-First |
|------|-----|---------------|
| **M1 (S2 기준)** | `4_features/program/components/`에 20개 컴포넌트가 쌓임. 리사이즈 수정 시 관련 없는 파일도 같은 디렉토리에 존재 | `window-shell/`은 그대로 2디렉토리 유지. 개별 프로그램은 별도 feature로 격리 |
| **M3 (S1 기준)** | ProgramComponent.tsx의 분기문이 20개로 증가 → 한 파일이 1,000줄 이상으로 비대화 | 각 program-*이 독립 feature → 새 프로그램 추가 시 읽을 기존 파일이 늘지 않음 |
| **팽창 방향** | 레이어 안에서 수평으로 팽창 (같은 디렉토리에 파일이 누적) | feature 단위로 격리된 채 팽창 (디렉토리가 늘지만 각각은 작게 유지) |

FSD의 레이어별 분류는 규모가 커질수록 **하나의 레이어 안에 이질적인 파일들이 혼재**하게 된다. 반면 Feature-First는 feature 경계가 곧 관심사 경계이므로 **규모에 비례하여 탐색 범위가 늘지 않는다**.

현재 S2에서 Feature-First가 50% 우세했던 것(디렉토리 4→2, hop 2→1)은 규모가 커질수록 격차가 더 벌어질 가능성이 높고, FSD가 우세했던 Context Cost 차이(+387줄)는 참고용 파일 분산에서 기인하므로 규모와 무관하게 **일정 수준에서 수렴**한다.

---

## 결론

정량적 수치만 보면 **FSD와 Feature-First는 대등**하다 (FSD 3승, FF 2승, 무승부 7).

그러나:
1. 현재 대등한 결과는 **프로젝트 규모가 작아 구조 차이가 드러나지 않기 때문**
2. Feature-First가 **확실히 우세한 영역(S2: 공통 기능 수정)**은 감소폭이 50%로 크고, 규모 증가 시 이 격차는 더 벌어짐
3. FSD가 우세한 영역은 **차이가 상대적으로 작으며** (Context Cost 차이의 대부분은 참고용 파일), 규모 증가와 무관하게 수렴
4. **정성적 차이**(경로 직관성, 탐색 적중률, 규칙 단순성)에서 Feature-First가 유리

따라서 **현재 규모에서는 큰 차이가 없으나, AI 협업 관점에서 Feature-First가 더 적합**하며, 프로젝트가 성장할수록 그 이점이 더 두드러질 것으로 판단된다.
