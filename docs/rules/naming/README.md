# 식별자 네이밍 컨벤션

이 문서는 **식별자 (변수/함수/훅/상수/타입) 의 이름 짓는 규칙** 만 다룬다. 타입을 어떻게 작성할지 (예: `any` 금지, Interface vs Type) 는 [`typescript/`](../typescript/README.md) 를 참조한다.

## 1. Hooks — `use` prefix + camelCase

- ✅ `useCoinData`, `useFolderNavigation`, `useDebouncedValue`
- ❌ `CoinData`, `get_coin_data`, `UseCoinData`

**이유:** React Hook 규칙상 `use` prefix 가 있어야 훅으로 인식된다. 파일명도 동일하게 `useXxx.ts` 로 맞춘다 ([`component-structure/`](../component-structure/README.md) 참조).

## 2. Utils — camelCase

- ✅ `formatPrice`, `parseDateString`, `clamp`
- ❌ `FormatPrice`, `format_price`, `PRICE_FORMATTER`

일반 함수/변수도 동일. `use` 로 시작하지 않도록 주의 (훅과 혼동 방지).

## 3. Constants — UPPER_SNAKE_CASE

- ✅ `API_BASE_URL`, `MAX_RETRY_COUNT`, `DEFAULT_THEME`
- ❌ `apiBaseUrl`, `maxRetryCount`

모듈 스코프 상수 (런타임 내내 변하지 않는 값) 에 적용한다. 함수 내부 지역 상수는 camelCase 로 둔다.

## 4. Types — PascalCase

- ✅ `CoinDataType`, `UserProfile`, `ApiResponse`
- ❌ `coinDataType`, `user_profile`

타입/인터페이스 **이름** 은 PascalCase. 타입의 작성 방식 (Interface 대신 Type, Union 대신 Enum 등) 은 [`typescript/README.md`](../typescript/README.md) 참조.
