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

커밋 규약(type, scope, 메시지 포맷, 단위 기준, 수정 스택 방식)은 [`docs/rules/commit-convention.md`](docs/rules/commit-convention.md) 를 따른다.

## 프론트엔드 컨벤션

프론트엔드 작업 시 적용할 컨벤션은 [`docs/rules/`](docs/rules/) 에 토픽별 폴더로 정리되어 있다. Claude Code 는 `convention-frontend` 스킬이 작업 종류에 따라 적절한 문서를 자동으로 라우팅한다.
