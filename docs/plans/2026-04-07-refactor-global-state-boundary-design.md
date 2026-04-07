# 전역 상태 경계 도입 및 Container/Component 패턴 제거 리팩토링

작성일: 2026-04-07
브랜치: chore/migrate-js-to-ts (이후 별도 브랜치)

## 1. 배경

현재 윈도우 OS 컨셉 포트폴리오는 다음 구조적 문제를 안고 있다.

- **전역 상태(Recoil) 과의존**: 하위 컴포넌트가 직접 atom을 구독하여 재사용성과 테스트 용이성이 낮다.
- **Container/Component 패턴의 한계**: 인위적 수직 분할로 파일 수가 늘고, 로직 재사용이 어렵다. Container에 상태/사이드이펙트/UI 조립이 모두 모여 비대해진다 (예: `ProgramContainer.tsx` 500줄).
- **불명확한 props**: 다수 컴포넌트가 props 타입을 정의하지 않아 implicit any 상태.
- **중복 UI**: 윈도우 헤더, 선택/호버 패턴 등이 feature별로 재구현됨.

## 2. 목표

1. **전역 상태 접근점을 단일 레이어(`pages/`)로 고정**한다.
2. **Container/Component 패턴을 폐지**하고 `Component + custom hook + ui/` 구조로 전환한다.
3. **모든 컴포넌트 props에 명시적 타입**을 부여한다.
4. 리팩토링 과정에서 **회귀를 막기 위한 characterization test**를 먼저 작성한다.
5. ESLint 룰로 경계를 **컴파일 타임에 강제**한다.

## 3. 비목표 (YAGNI)

- 디자인 시스템 전면 재설계
- Recoil → 다른 상태 라이브러리 마이그레이션 (별개 작업)
- 새로운 기능 추가
- 스타일/Panda CSS 구조 변경

## 4. 타깃 아키텍처

```
src/
├── pages/                          ← 전역 상태 유일 접근점
│   └── DesktopPage/
│       ├── DesktopPage.tsx         ← Recoil/URL 읽기, 핸들러 생성, feature 조립
│       └── index.ts
├── features/                       ← props만 받음 (Recoil import 금지)
│   ├── program-folder/
│   │   ├── FolderProgram.tsx       ← 단일 컴포넌트 (Container/Component 통합)
│   │   ├── hooks/
│   │   │   └── useFolderNavigation.ts
│   │   ├── ui/                     ← 잘게 쪼갠 presentational
│   │   │   ├── FolderHeader.tsx
│   │   │   ├── FolderItem.tsx
│   │   │   └── FolderGrid.tsx
│   │   └── __tests__/
│   ├── program-image/
│   ├── program-doc/
│   ├── taskbar/
│   └── window-shell/
└── shared/
    ├── ui/
    └── store/                      ← features에서 import 금지
```

### 레이어 책임

| 레이어 | 책임 | 허용 import |
|---|---|---|
| `pages/` | 전역 상태 read/write, page 조립 | Recoil, URL, fetch, features |
| `features/*/Xxx.tsx` | feature 단위 조립, hook 호출 | props, hooks, ui/ |
| `features/*/hooks/` | 로컬 상태 + 도메인 로직 | useState, useEffect, props |
| `features/*/ui/` | 순수 presentational | props만 |
| `shared/` | 공용 디자인 시스템/유틸 | props만 |

## 5. 핵심 패턴 예시

### Before
```tsx
// FolderProgramContainer.tsx
const FolderProgramContainer = ({ programKey }) => {
  const directoryList = useRecoilValue(rc_global_Directory_List);
  const directoryTree = useRecoilValue(rc_global_Directory_Tree);
  const [selectedItem, setSelectedItem] = useState(null);
  // ... 100줄
  return <FolderProgramComponent {...props} />;
};
```

### After
```tsx
// pages/DesktopPage.tsx
const DesktopPage = () => {
  const programList = useRecoilValue(rc_global_ProgramList);
  const directoryTree = useRecoilValue(rc_global_Directory_Tree);
  const setProgramList = useSetRecoilState(rc_global_ProgramList);
  const handleOpenProgram = (key: string) => { /* ... */ };

  return (
    <Desktop>
      {programList.map(p =>
        p.type === 'folder' && (
          <FolderProgram
            key={p.key}
            tree={directoryTree}
            currentPath={p.path}
            onOpenProgram={handleOpenProgram}
          />
        )
      )}
    </Desktop>
  );
};

// features/program-folder/FolderProgram.tsx
interface FolderProgramProps {
  tree: DirectoryTree;
  currentPath: string;
  onOpenProgram: (key: string) => void;
}
export const FolderProgram = (props: FolderProgramProps) => {
  const state = useFolderNavigation(props);
  return (
    <div>
      <FolderHeader {...state} />
      <FolderGrid {...state} />
    </div>
  );
};
```

## 6. 마이그레이션 전략

**점진적, feature 1개씩 PR.** 빅뱅 금지.

### 단계 순서 (작은 것 → 큰 것)

| # | 대상 | 이유 |
|---|---|---|
| 0 | 셋업: `pages/DesktopPage` 신설, user-event v14 업그레이드 | 후속 단계 전제 |
| 1 | `program-doc` | 가장 단순. 패턴 검증용. |
| 2 | `program-folder` | 중간 복잡도. 내비게이션 로직 hook화 연습. |
| 3 | `program-image` | useEffect 다수. hook 추출 효과 큼. |
| 4 | `taskbar` | atom 5개 구독 중. |
| 5 | `window-shell` / `ProgramContainer` | 500줄. drag/resize hook 분리. |
| 6 | ESLint 룰 추가, 정리 | 경계 강제. |

### 각 단계 워크플로우

1. **기능 파악**: 대상 feature를 읽고 동작 명세화 (간단한 메모).
2. **Characterization test 작성**: 현재 동작을 RTL로 캡처. 통과 확인.
3. **전역 상태 끌어올리기**: 해당 feature가 쓰는 atom을 `DesktopPage`로 이동, props로 주입.
4. **Container/Component 통합**: 단일 `Xxx.tsx`로 합치고 로직을 `hooks/`로 추출.
5. **UI 조각 분할**: `ui/` 하위에 작은 presentational 컴포넌트로 쪼갬.
6. **Props 타입 명시**: 모든 props에 interface 부여.
7. **테스트 그린 확인**: 1단계 테스트가 그대로 통과해야 함.
8. **커밋 / PR**.

## 7. 테스트 전략

- **도구**: Jest + @testing-library/react (이미 설치됨), user-event v14로 업그레이드.
- **유형**:
  - **Characterization test** (리팩토링 전): 사용자 시나리오 기준. "폴더 더블클릭하면 하위 폴더 표시" 같은 동작 단위.
  - **Hook test**: 추출한 custom hook에 대해 `renderHook`으로 단위 테스트.
  - **UI 스냅샷**: 잘게 쪼갠 `ui/` 컴포넌트에 한해 가벼운 스냅샷.
- **커버리지 목표**: 각 feature의 주요 사용자 시나리오 80%.
- **Recoil 의존 테스트**: `pages/` 테스트에서만 `RecoilRoot` 사용. features 테스트는 props만 mock.

## 8. ESLint 강제 (마지막 단계)

```json
{
  "overrides": [{
    "files": ["src/features/**", "src/shared/**"],
    "rules": {
      "no-restricted-imports": ["error", {
        "patterns": [
          { "group": ["recoil"], "message": "전역 상태는 pages/에서만 접근하세요" },
          { "group": ["**/store/atoms/**"], "message": "atom은 pages/에서만 import" }
        ]
      }]
    }
  }]
}
```

마이그레이션 완료된 폴더부터 점진 적용. 6단계에서 일괄 정리.

## 9. 위험 요소 & 완화

| 위험 | 완화 |
|---|---|
| 동작 회귀 | 단계마다 characterization test 선행 |
| 동적으로 열리는 윈도우의 props 주입 복잡성 | `DesktopPage`가 `programList.map` 후 type별 분기로 조립 |
| `ProgramContainer` 500줄 분해 난이도 | 마지막 단계로 미루고, 앞 단계에서 hook 추출 패턴 충분히 연습 |
| Recoil + React 19 호환성 이슈 발견 시 | 본 리팩토링과 분리하여 별도 이슈로 처리 |
| PR이 길어짐 | feature 1개당 PR 1개 원칙 |

## 10. 완료 기준

- [ ] 모든 feature가 Recoil을 직접 import하지 않음
- [ ] `*Container.tsx` / `*Component.tsx` 파일 패턴 소멸
- [ ] 모든 컴포넌트 props가 interface로 타입 정의됨
- [ ] 각 feature에 주요 사용자 시나리오 테스트 존재
- [ ] ESLint 룰로 경계 강제 동작
- [ ] `pnpm build` 통과, 기존 동작 회귀 없음
