# TypeScript 컨벤션

이 문서는 **타입을 어떻게 작성하고 쓸지** 를 다룬다. 식별자 (변수/함수/훅/타입 등) 의 **이름 짓는 규칙** 은 [`naming/`](../naming/README.md) 을 참조한다.

## 1. 배열 타입은 `Array<T>`

- ✅ `Array<string>`, `Array<User>`, `Array<{ id: string }>`
- ❌ `string[]`, `User[]`

**이유:** 대괄호 표기 `[...]`는 **튜플(고정 길이/타입) 전용**으로 예약. 배열과 튜플을 시각적으로 구분.

```ts
// 배열
type Names = Array<string>;

// 튜플
type Point = [number, number];
type Entry = [string, number, boolean];
```

## 2. 컴포넌트 prop 타입은 구조분해 어노테이션

- ✅ `const Foo = ({ a, b }: FooProps) => { ... }`
- ❌ `const Foo: React.FC<FooProps> = ({ a, b }) => { ... }`

**이유:** `React.FC`는 React 18+ 권장에서 빠짐 (children 자동 포함, 제네릭 추론 문제). 직접 어노테이션이 더 명시적이고 깔끔.

`React` 네임스페이스(`React.ReactNode` 등)는 필요할 때 그대로 import해서 사용.

## 3. 모든 컴포넌트와 함수에 명시적 타입 지정

- ✅ `const getUser = (id: string): Promise<User> => { ... }`
- ❌ `const getUser = (id) => { ... }` (암시적 `any` 허용)

**이유:** 추론에만 기대면 공용 경계(함수 시그니처) 의 계약이 약해진다. 호출부에서 타입 힌트를 받지 못하거나 변경 시 리그레션을 놓치기 쉬움.

## 4. `any` 사용 금지 — 불가피한 경우 `unknown`

- ✅ `const parseJson = (raw: string): unknown => JSON.parse(raw);`
- ❌ `const parseJson = (raw: string): any => JSON.parse(raw);`

**이유:** `any` 는 타입 체크를 통째로 무력화한다. 정말 모르는 타입이라면 `unknown` 을 써서 **사용 시점에 narrow 하도록** 강제한다.

## 5. Interface 보다 Type 선호

- ✅ `type User = { id: string; name: string };`
- ❌ `interface User { id: string; name: string }`

**이유:** `type` 은 유니온/인터섹션/매핑 등 표현력이 넓고, 선언 병합 (declaration merging) 으로 인한 예기치 못한 확장이 없다.

**예외:** 외부 라이브러리 타입 확장처럼 선언 병합이 **필요한** 경우에만 `interface` 를 쓴다.

## 6. Enum 대신 Union Type

- ✅ `type Status = 'idle' | 'loading' | 'success' | 'error';`
- ❌ `enum Status { Idle, Loading, Success, Error }`

**이유:** TS `enum` 은 런타임 객체를 만들어내 번들 크기를 키우고, 숫자 enum 의 암시적 역매핑·reverse mapping 이슈가 있다. 문자열 union 이 더 가볍고 직관적이며 JSON 친화적이다.
