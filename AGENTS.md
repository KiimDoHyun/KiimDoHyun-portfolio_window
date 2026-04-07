# 규칙

- 사용자와 모든 대화는 한글로 합니다.

## 1. 작업 요청 시 계획 수립

사용자가 기능 개발/수정을 요청하면 다음 단계를 따른다:

### Step 1: 요구사항 분석

- 요청 내용을 정리하여 사용자에게 확인받는다
- 불명확한 부분은 질문하여 명확히 한다

### Step 2: 작업 계획 수립

작업을 단계별로 분리하고, 각 단계마다 다음을 정의한다:

- **작업 내용**: 무엇을 할 것인지
- **영향 범위**: 어떤 파일/모듈이 변경되는지
- **완료 조건**: 이 단계가 완료되었다고 판단하는 기준

예시:

```
[단계 1] API 함수 작성
- 작업 내용: getLoginUser API 함수 생성
- 영향 범위: features/user/api/getLoginUser.ts
- 완료 조건:
  - [ ] API 함수가 정상 호출됨
  - [ ] 타입이 정의됨
  - [ ] 에러 처리가 포함됨
```

### Step 3: 사용자 승인

- 계획을 사용자에게 제시하고 승인을 받은 후 작업을 시작한다
- 승인 없이 작업을 시작하지 않는다

## 2. 작업 실행 규칙

### 순차 진행

- 반드시 단계 순서대로 진행한다
- 이전 단계의 완료 조건을 모두 만족해야 다음 단계로 넘어간다

### 완료 조건 고정

- 작업 진행 중 완료 조건을 임의로 수정하지 않는다
- 조건 수정이 필요하면 사용자에게 사유를 설명하고 승인을 받는다

### 실패 시 처리

- 완료 조건을 달성하지 못하면 해당 단계를 반복한다
- 3회 이상 실패 시 사용자에게 상황을 보고하고 방향을 협의한다

### 단계 완료 보고

각 단계 완료 시 다음을 보고한다:

- 완료된 작업 내용
- 변경된 파일 목록
- 완료 조건 달성 여부 (체크리스트)

## 3. 작업 완료

모든 단계 완료 후:

- 전체 변경 사항 요약
- 테스트 필요 항목 안내
- 추가 개선 가능 사항 제안 (선택)

## 공통 코딩 규칙

### TypeScript

- 모든 컴포넌트와 함수에 명시적 타입 지정
- `any` 타입 사용 금지 (불가피한 경우 `unknown` 사용)
- Interface보다 Type 선호 (확장성이 필요한 경우만 Interface)
- Enum 대신 Union Type 사용

### Naming Convention

- **Hooks**: `use` prefix camelCase (예: `useCoinData`)
- **Utils**: camelCase (예: `formatPrice`)
- **Constants**: UPPER_SNAKE_CASE (예: `API_BASE_URL`)
- **Types**: PascalCase (예: `CoinDataType`)

### Git Commit Convention

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `refactor:` 코드 리팩토링
- `style:` 코드 포맷팅
- `docs:` 문서 수정
- `test:` 테스트 코드
- `chore:` 빌드, 패키지 설정 등

## 에이전트 목록

### 프론트엔드 (`src/`)

| 에이전트                    | 역할                   | 파일                                                                                     |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| **frontend-pm**             | 기능 기획, 명세서 작성 | [`.claude/agents/frontend-pm.md`](.claude/agents/frontend-pm.md)                         |
| **frontend-implementation** | feature-first 기반 코드 구현 | [`.claude/agents/frontend-implementation.md`](.claude/agents/frontend-implementation.md) |
| **frontend-reviewer**       | 코드 리뷰, 품질 검증   | [`.claude/agents/frontend-reviewer.md`](.claude/agents/frontend-reviewer.md)             |

## 프론트엔드 규칙 (Feature-First Architecture)

### 폴더 구조 (최상위)

```
src/
├── app/        # 앱 설정, 라우터, 프로바이더
├── pages/      # 라우터에 등록할 페이지
├── features/   # 기능 단위 모듈 (각 기능별 독립 슬라이스)
├── shared/     # 도메인 무관 공유 코드 (ui, hooks, utils 등)
├── store/      # 전역 상태
└── types/      # 전역 타입
```

### 핵심 규칙

- **컴포넌트**: 함수형만 사용, PascalCase 파일명
- **상세 컨벤션**: [`docs/rules/`](docs/rules/) 의 개별 문서를 참조
  - TypeScript 규칙 → [`docs/rules/typescript.md`](docs/rules/typescript.md)
  - 컴포넌트 구조 → [`docs/rules/component-structure.md`](docs/rules/component-structure.md)
  - feature 공개 API → [`docs/rules/feature-public-api.md`](docs/rules/feature-public-api.md)
  - 전역 상태 경계 → [`docs/rules/global-state-boundary.md`](docs/rules/global-state-boundary.md)
