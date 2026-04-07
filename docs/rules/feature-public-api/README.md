# Feature Public API 컨벤션

## 1. feature 슬라이스의 `index.ts`는 외부 진입점

각 feature 슬라이스(`features/<name>/`)는 **`index.ts`를 단일 public API**로 갖는다. 외부(다른 feature, pages, app)는 반드시 `index.ts`를 통해서만 import한다.

### 허용
```ts
// ✅ index.ts를 통한 import
import { DOCProgram, ProjectData } from "@features/program-doc";
```

### 금지 (deep import)
```ts
// ❌ feature 내부 파일 직접 import
import DOCProgram from "@features/program-doc/DOCProgram";
import { ProjectData } from "@features/program-doc/types";
import { docProgramContentStyle } from "@features/program-doc/DOCProgram.style";
```

## 2. 무엇을 export하는가

**원칙: 외부에서 쓰일 가능성이 있는 것만 export.** 내부 구현 디테일은 절대 노출하지 않는다.

| 종류 | export 여부 | 비고 |
|---|---|---|
| 메인 컴포넌트 | ✅ | 거의 항상 |
| 다른 feature/page에서 재사용 가능한 타입 | ✅ | 예: `ProjectData` |
| feature 전용 hook | ⚠️ | 외부 사용 명확할 때만 |
| 스타일 (`*.style.ts`) | ❌ | 절대 |
| 내부 서브 컴포넌트 (`ui/*`) | ❌ | 내부 전용 |
| 컴포넌트 prop 타입 | ⚠️ | 외부에서 사용 시에만 |

## 3. 작성 예시

```ts
// features/program-doc/index.ts
export { default as DOCProgram } from "./DOCProgram";
export type { ProjectData, ProjectResult, ProjectStack } from "./DOCProgram.types";
```

## 4. 이점

1. **캡슐화**: 내부 구조를 자유롭게 리팩토링해도 `index.ts`만 안 깨면 외부 영향 없음.
2. **순환 의존 방지**: deep import 금지로 슬라이스 간 의존이 단방향 정리.
3. **재사용 경로 단일화**: "다른 곳에서 쓸 수 있는 것"의 진입점이 명확.
4. **Tree-shaking 친화적**.

## 5. 향후 ESLint 강제 (예정)

```json
"no-restricted-imports": ["error", {
  "patterns": [
    {
      "group": ["@features/*/*", "!@features/*/index"],
      "message": "feature는 슬라이스의 index.ts를 통해서만 import하세요"
    }
  ]
}]
```
