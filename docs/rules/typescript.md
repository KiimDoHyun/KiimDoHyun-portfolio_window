# TypeScript 컨벤션

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
