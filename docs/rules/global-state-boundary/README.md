# 전역 상태 접근 경계 컨벤션

## 1. 전역 상태는 `pages/`에서만 접근

Recoil atom, URL 쿼리, 라우터 등 **외부/전역 상태에 직접 접근**하는 코드는 **`pages/` 레이어에만** 둔다.

### 허용
```tsx
// pages/DesktopPage.tsx
const DesktopPage = () => {
  const programList = useRecoilValue(rc_global_ProgramList);
  const setProgramList = useSetRecoilState(rc_global_ProgramList);

  const handleOpenProgram = (key: string) => {
    setProgramList(prev => [...prev, { key, ... }]);
  };

  return (
    <Desktop>
      <FolderProgram
        programList={programList}
        onOpenProgram={handleOpenProgram}
      />
    </Desktop>
  );
};
```

### 금지
```tsx
// ❌ features 내부에서 직접 atom 구독
// features/program-folder/FolderProgram.tsx
const FolderProgram = () => {
  const programList = useRecoilValue(rc_global_ProgramList); // 금지!
  // ...
};
```

## 2. features는 props만 받는다

`features/` 하위의 모든 컴포넌트는 **props로 데이터와 콜백을 전달받는다**. 전역 상태를 직접 import하지 않는다.

이렇게 하면:
- features는 **재사용 가능**해진다 (다른 데이터 소스로 갈아끼우기 쉬움).
- features는 **테스트하기 쉽다** (props만 mock하면 됨, Recoil Provider 불필요).
- 향후 URL 쿼리, 외부 API 등으로 데이터 소스를 바꿀 때 **`pages/`만 수정**하면 된다.

## 3. 레이어 책임 정리

| 레이어 | 책임 | 허용 import |
|---|---|---|
| `pages/` | 전역 상태 read/write, page 조립 | Recoil, URL, fetch, features |
| `features/*/Xxx.tsx` | feature 단위 조립, hook 호출 | props, hooks, ui/ |
| `features/*/hooks/` | 로컬 상태 + 도메인 로직 | useState, useEffect, props |
| `features/*/ui/` | 순수 presentational | props만 |
| `shared/` | 공용 디자인 시스템/유틸 | props만 |

## 4. 예외: 정적 데이터

`@shared/lib/data` 같은 **정적 import 가능한 데이터**는 features에서 직접 import해도 된다. 이건 "전역 상태"가 아니라 빌드타임 상수다.

단, 향후 확장을 고려한다면 정적 데이터도 page에서 props로 내려주는 게 일관성 측면에서 더 좋다.

## 5. 향후 ESLint 강제 (예정)

```json
{
  "files": ["src/features/**", "src/shared/**"],
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        { "group": ["recoil"], "message": "전역 상태는 pages/에서만 접근하세요" },
        { "group": ["**/store/atoms/**"], "message": "atom은 pages/에서만 import" }
      ]
    }]
  }
}
```
