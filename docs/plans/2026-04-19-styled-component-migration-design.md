# 스타일 응집도 리팩터링 설계 — `& .child` 네스팅을 styled 컴포넌트로

## 배경 (Why)

현재 프로젝트는 Panda CSS (`@pandacss/dev`) 를 사용하고 있지만, 부모 클래스의 스타일 정의 안에서 자식을 `"& .className"` 형태로 네스팅하는 SCSS 시대 패턴이 광범위하게 남아 있다.

- 12개 `*.style.ts` + `*.tsx` 인라인 `css()` 사용처를 합쳐 `"& .className"` 네스팅이 **194곳** 발견
- JSX 측은 `<div className="iconImgBox">` 처럼 **타입 검증되지 않는 문자열** 로 부모 스타일과 묶인다
- 한 부모(`TaskBar.style.ts` 37개, `FolderProgram.style.ts` 25개, `ProgramComponent.style.ts` 24개) 에 여러 사용 컴포넌트의 스타일이 몰려 있어 **부모가 자식 마크업의 내부 구조를 알아야** 스타일이 성립한다
- 결과적으로 자식 컴포넌트만 따로 보고는 어떤 스타일이 적용되는지 알 수 없고, 클래스명 오타도 컴파일 타임에 잡히지 않는다

본 작업의 **목표는 스타일 응집도** 다. 각 컴포넌트가 자기 스타일만 소유하도록 정리하면 타입 안전성은 부산물로 따라온다.

## 설계 결정 요약

| 결정 항목 | 채택안 |
|---|---|
| 스타일 작성 단위 | Panda CSS `styled()` 컴포넌트 (필요 시 `cva()` 와 결합) |
| 파일 위치 | 사용 컴포넌트 곁에 `*.style.ts` 1:1 배치. 단순 컴포넌트는 같은 `.tsx` 안 인라인 |
| 인라인 vs 분리 임계값 | styled 컴포넌트 **3개 이하면 인라인**, 4개 이상이면 별도 파일 |
| `!important` / CSS 변수 | 본 작업에서 **함께 정리** (variant 또는 `style` prop으로 전환) |
| `App.css` | 죽은 코드라 삭제 |
| `index.css` | 글로벌 리셋/스크롤바/font, Panda 레이어와 연동되어 있으므로 유지 |
| 진행 단위 | **시범 PR 1개 → 본 변환 PR 1개** (총 2 PR) |

## 설계 규칙

작업 중 항상 지킨다.

1. **`"& .className"` 셀렉터 0개를 목표** 로 한다. 자식 클래스 셀렉터는 모두 별도 `styled()` 컴포넌트로 분리한다.
2. **단일 자식 태그 셀렉터(`& img`, `& > div`) 는 허용** 한다. 그 컴포넌트의 마크업 형태에 대한 스타일이지 부모-자식 커플링이 아니다.
3. **JSX 의 `className="문자열"` 패턴 0개**. 모두 named styled 컴포넌트로 대체한다.
4. **명명 규칙**:
   - 최상위 컨테이너: `<ComponentName>Root` (예: `TaskBarRoot`, `IconBoxRoot`)
   - 하위 요소: 역할 기반 PascalCase (예: `ShortCutIcon`, `BottomLine`, `DateInfo`)
5. **`!important` 0개를 목표** 로 한다. 우선순위 다툼은 variant 분기나 컴포넌트 분리로 제거한다.
6. **CSS 변수(`var(--xxx)`) 사용은 의미 단위로 판단**:
   - 여러 자식이 공유하는 토큰성 변수면 유지
   - 단일 요소의 동적 값 (좌표/투명도 등) 이면 React state + `style` prop 으로 전환
7. **스타일 컴포넌트는 같은 feature 내부에서만 사용**. `index.ts` (feature public API) 에 노출하지 않는다.
   - 예외: `ProgramComponent` (window-shell) 처럼 다른 feature 가 의존하는 shell 은 그대로 공유 유지

## 핵심 변환 패턴

### Before

```tsx
// IconBox.tsx
<div className={iconBoxStyle}>
  <div className="iconImgBox">
    <img src={icon} />
  </div>
  <div className="name">{name}</div>
</div>;

const iconBoxStyle = css({
  width: "100px",
  height: "100px",
  _hover: { backgroundColor: "overlay.weak" },

  "& .iconImgBox": { width: "50px", height: "50px" },
  "& .iconImgBox img": { width: "100%", height: "100%" },
  "& .name": { color: "white", fontSize: "14px" },
});
```

### After (3개 이하 — 인라인)

```tsx
// IconBox.tsx
import { styled } from "@styled-system/jsx";
import { cva } from "@styled-system/css";

const IconBoxRoot = styled("div", cva({
  base: {
    width: "100px",
    height: "100px",
    _hover: { backgroundColor: "overlay.weak" },
  },
}));

const IconImgBox = styled("div", cva({
  base: {
    width: "50px",
    height: "50px",
    "& img": { width: "100%", height: "100%" }, // 단일 자식 태그 셀렉터는 허용
  },
}));

const IconName = styled("div", cva({
  base: { color: "white", fontSize: "14px" },
}));

const IconBox = ({ item }: Props) => (
  <IconBoxRoot>
    <IconImgBox>
      <img src={item.icon} />
    </IconImgBox>
    <IconName>{item.name}</IconName>
  </IconBoxRoot>
);
```

### After (4개 이상 — 별도 `.style.ts`)

```tsx
// TaskBar.style.ts
export const TaskBarRoot = styled("div", cva({ base: { ... } }));
export const TaskBarBox1 = styled("div", cva({ base: { ... } }));
// ...

// TaskBar.tsx
import { TaskBarRoot, TaskBarBox1 } from "./TaskBar.style";
```

## variant 사용 기준

`cva` variants 로 표현해야 하는 것과 별도 컴포넌트로 분리해야 하는 것을 구분한다.

| 케이스 | 처리 |
|---|---|
| 같은 마크업의 **상태 변화** (active, hover, selected) | `variants` |
| 여러 variant 의 **조합 효과** (active + hover) | `compoundVariants` |
| **마크업 구조가 다른** 요소 (MinButton vs CloseButton) | 별도 styled 컴포넌트 |
| variant 조합이 **3개 이상으로 폭발** | 별도 styled 컴포넌트로 쪼갠다 |

### 현재 발견된 variant 후보

| 현재 클래스 | variant 전환 |
|---|---|
| `.folder_selected` | `<Folder selected>` |
| `.activeIcon`, `.activeShortCutIcon` | `<ShortCutIcon active>` |
| `.BIG_BIG_ICON`, `.BIG_ICON`, `.MEDIUM_ICON`, `.SMALL_ICON`, `.DETAIL` | `<FolderGrid displayType="big" \| ...>` |

## 동적 스타일링 정리

### `!important` 제거

```tsx
// Before — TaskBar.style.ts
"& .prevView .cover > div": {
  left: "-165px !important",
  top: "-150px !important",
  transform: "scale(0.35) !important",
},
```

→ 인라인 `style` 주입 지점을 정상 props 또는 styled 컴포넌트 base 로 흡수해서 specificity 다툼 자체를 제거한다.

### CSS 변수 → React state

```tsx
// Before
"& .shotCut_Hover": {
  top: "var(--shotcut-hover-top)",
  pointerEvents: "var(--shotcut-hover-pointer-events)",
},

// After
const [hoverPos, setHoverPos] = useState<{ top: number; left: number } | null>(null);

<ShotCutHover
  style={{
    top: hoverPos?.top,
    left: hoverPos?.left,
    pointerEvents: hoverPos ? "auto" : "none",
  }}
/>;
```

사전에 모든 케이스를 식별하기 어렵다. 변환 작업 도중 발견되는 즉시 같이 정리한다.

## Phase 분할

### Phase 1: 시범 변환 (TaskBar)

**범위**: [TaskBar.style.ts](../../src/features/taskbar/TaskBar.style.ts) 와 사용처 (`TaskBar.tsx`, `ui/ProgramIcons.tsx`, `ui/PreviewPopup.tsx`, `ui/SystemTray.tsx`).

가장 복잡한 (37개 네스팅) 케이스 1개를 먼저 변환한다. 목적은 패턴 검증:

- 파일 분리 단위가 적절한지
- 명명 규칙이 실제 사용에서 어색하지 않은지
- variant 기준이 현실에 맞는지
- 동적 스타일 처리 방침이 통하는지

**완료 후 PR 을 만들고 리뷰** 한다. 리뷰에서 합의된 수정사항이 Phase 2 의 가이드가 된다.

### Phase 2: 본 변환

Phase 1 에서 검증된 패턴을 나머지 11 개 `.style.ts` + 인라인 `css()` 사용처에 일괄 적용한다.

리스크 낮은 순서로 진행:

1. 단일 사용 + 적은 네스팅: `LogoutOverlay`, `ImageProgram`, `LoginInput`, `HiddenIcon`, `Login`, `StatusBar`
2. 중간: `InfoBar`, `TimeBar`, `DOCProgram`
3. 복잡 / 다중 사용: `FolderProgram`, `ProgramComponent` (window-shell), 인라인 `css()` (IconBox 등)

같이 처리:

- `App.css` 삭제 (CRA 보일러플레이트 잔재, 사용처 0)
- 발견되는 `!important` / CSS 변수 정리

## 성공 기준 (Definition of Done)

전체 작업이 끝났다고 판단하는 기준.

- [ ] `src/**/*.{ts,tsx}` 에서 `& \.\w+` grep 결과 **0건**
- [ ] `src/**/*.tsx` 에서 `className="..."` 형태로 클래스명을 직접 적는 패턴 **0건** (단, `styled()` 컴포넌트의 `className` prop 전달은 예외)
- [ ] `src/**/*.{ts,tsx}` 에서 `!important` **0건** (불가피한 경우 주석으로 사유 명시)
- [ ] `src/App.css` 가 삭제되어 있다
- [ ] 시각적 회귀 없음 (Phase 1·Phase 2 각각 수동 검증 통과)
- [ ] `pnpm typecheck` / `pnpm build` 통과
- [ ] 기존 테스트가 새 구조에 맞게 통과 (className 셀렉터 사용처가 있다면 수정)

## 영향 범위 / 리스크

| 영역 | 영향 |
|---|---|
| 동작 | 없음 (스타일 동일성 유지가 목표) |
| 빌드 | Panda CSS 코드젠 결과 변동, 번들 크기 미세 변화 가능 |
| 테스트 | className 기반 셀렉터로 테스트하는 곳이 있다면 수정 필요 |

### 리스크

- **시각적 회귀**: 네스팅 제거 시 CSS specificity 변화로 의도치 않은 차이 발생 가능. → Phase 1 시범에서 시각 비교 검증.
- **`!important` 제거 시 우선순위 다툼 재발견**: variant 누락 케이스 발생 가능. → 발견 즉시 보강.
- **CSS 변수 → React state 전환 시 로직 변경**: hover 위치 등 인라인 `style` 주입 지점이 자체 로직을 가질 수 있음. → 케이스마다 확인.

## 후속 작업

- 본 작업이 끝난 뒤 [docs/rules/component-structure/](../rules/component-structure/) 또는 별도 styling 규칙 문서에 "스타일은 styled 컴포넌트 단위, `& .class` 셀렉터 금지" 를 정식 규칙으로 추가
- 향후 새 컴포넌트는 본 패턴을 기본값으로 작성
