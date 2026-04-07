# 컴포넌트 파일 구조 컨벤션

## 1. `.tsx` 파일은 컴포넌트 로직만

`.tsx` 파일을 열면 **"이 컴포넌트가 무엇을 하는가"**가 한눈에 들어와야 한다. 부수적인 선언(타입/스타일/헬퍼)은 모두 옆 파일로 분리한다.

### 분리 규칙

| 분리 대상 | 파일명 | 예시 |
|---|---|---|
| 컴포넌트가 사용하는 타입 | `Component.types.ts` 또는 `types.ts` | `DOCProgram.types.ts` |
| 스타일 (Panda CSS `css(...)`) | `Component.style.ts` | `DOCProgram.style.ts` |
| 작은 서브 컴포넌트 | `ui/SubComponent.tsx` | `ui/DocCard.tsx` |
| 커스텀 훅 | `hooks/useXxx.ts` | `hooks/useFolderNavigation.ts` |

### 예외

- prop 타입(`XxxProps`)은 컴포넌트와 결합도가 매우 높으므로 **컴포넌트 파일 안에 둬도 OK**. 단, 다른 파일에서 참조될 가능성이 있으면 `types.ts`로 분리.
- 한 번만 쓰이는 trivial한 헬퍼 함수(2~3줄)는 파일 안에 둬도 OK.

## 2. Container/Component 패턴 금지

기존 `XxxContainer.tsx` + `XxxComponent.tsx` 분할 구조는 사용하지 않는다.

대신:
- **단일 컴포넌트** + **custom hook** + **`ui/` 서브 컴포넌트** 조합으로 책임을 분리.
- 비즈니스 로직/상태는 `hooks/`로 추출.
- 순수 presentational은 `ui/`로 추출.

## 3. 디렉토리 구조 예시

```
features/program-folder/
├── FolderProgram.tsx           # 메인 (얇은 조립자)
├── FolderProgram.style.ts      # 스타일
├── FolderProgram.types.ts      # 타입 (또는 types.ts)
├── hooks/
│   └── useFolderNavigation.ts  # 로컬 상태 + 도메인 로직
├── ui/
│   ├── FolderHeader.tsx        # 순수 UI
│   ├── FolderItem.tsx
│   └── FolderGrid.tsx
├── __tests__/
│   └── FolderProgram.test.tsx
└── index.ts                    # Public API (아래 항목 참조)
```
