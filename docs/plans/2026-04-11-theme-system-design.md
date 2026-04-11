# 테마 시스템 도입 설계 (Panda semanticTokens 기반)

> **브랜치 (제안):** `refactor/theme-system`
> **선행 조건:** 없음 (panda codegen이 정상 동작하는 상태)
> **목적:** 하드코딩된 스타일 값을 semantic token으로 치환하고, `data-theme` 한 줄로 전체 UI 테마/버전을 교체할 수 있는 구조를 만든다.

---

## 배경 (Why)

현재 프로젝트는 Panda CSS를 쓰고 있으나 `panda.config.ts`의 `theme.extend`에는 **keyframes 3개만** 있고 커스텀 토큰이 전혀 없다. 스타일 값은 22개의 `.style.ts` 파일에 흩어져 있으며, 주요 문제점은:

- **색 35종 하드코딩** (79곳). Windows 파랑이 `#00adef`, `#0078d7`, `#0076ff` 3가지로 난립. 다크 섀시가 `#393a3b`와 `#20343b` 2가지 혼재
- **Transition duration/easing 분산** — 0.2s(12회), 0.4s(3회)에 cubic-bezier 2변종
- **Spacing 리듬 부재** — `5/10/15/20/25/30/40/50px`가 규칙 없이 등장
- **Panda 기본 토큰 미사용** — `token(colors.xxx)` 참조 0회
- **테마/버전 교체 메커니즘 부재** — 값이 직접 박혀 있어 Windows 10 / 11 등 다른 버전 스킨으로 전환 불가능

사용자의 최종 목표는 **"사용처에서는 테마를 전혀 모르고 semantic 값만 참조하며, 나중에 테마/버전을 손쉽게 바꾼다"** 이다. 이를 위해 **Panda `semanticTokens` + custom `conditions`** 조합으로 3계층 구조를 도입한다.

## 설계 규칙

1. **3계층 분리**
   - L1 **Raw palette** (`tokens.colors.*`): **색 그 자체**. 그룹 이름은 **색 이름**(`gray`, `slate`, `blue`, `skyblue`, `red` 등). 단계는 `100, 200, 300, ...` 100단위 증가(100=가장 옅음). 예: `blue.100`, `gray.900`. **raw에는 역할(role)을 표현하지 않는다** — `accent`, `danger` 같은 이름은 L2로 올린다. 사용처 직접 참조 **금지**
   - L2 **Semantic tokens** (`semanticTokens.colors.*`): **역할/의미**. 이름은 `shell.bg`, `accent.solid`, `windowChrome.closeHover` 등 — "어디에 쓰는가"를 표현. 값은 L1을 `{colors.색이름.단계}` 로 참조하고 **condition별로 다른 값** 가능
   - L3 **사용처**: 오직 L2만 참조. `css({ bg: 'shell.bg' })`. 파일 어디에도 `win11` 같은 테마명이 등장하지 않는다
2. **사용처에서 hex/rgb/rgba 리터럴 금지**. 예외는 JSX에서 CSS 변수 주입하는 경우(동적 배경이미지 URL 등)
3. **테마 전환은 `<html data-theme="...">` 속성 한 줄로**. Provider는 이 속성만 토글한다
4. **Base 테마 = 현재 외관**. 다크 섀시는 `#393a3b`로 수렴 (사용자 결정)
5. **Spacing은 panda 기본 spacing 스케일을 그대로 사용**. 이유: panda 기본은 이미 `1 = 4px` 4의 배수 리듬이고 `2.5 = 10px`, `5 = 20px` 처럼 현재 값과 정확히 매치되는 스텝이 많아 마이그레이션 손실이 적다. 4px 단위가 없는 값만 예외 처리
6. **Layout 치수(윈도우 크기, 태스크바 높이 등)는 spacing이 아닌 `sizes` 토큰으로** 분리한다. "태스크바가 50px" 같은 것은 여백이 아니라 고정 치수이므로
7. **Motion 토큰**(duration, easing, keyframes)도 semantic으로 노출한다. 사용처는 `animationDuration: 'fast'`, `transitionTimingFunction: 'standard'` 같은 시멘틱만 본다
8. **Raw → Semantic 매핑은 한곳에서만 변경**. 사용처 리팩터가 끝나면 팔레트 값을 바꿔도 파일 1개만 수정하면 된다
9. **마이그레이션은 feature 단위로 쪼갠다**. 한 번에 프로젝트 전체를 뒤집지 않는다 — 섀시 → taskbar → panels → programs 순서로

## 성공 기준 (Definition of Done)

- [x] `panda.config.ts`에 raw palette, semanticTokens(colors/durations/easings/radii/sizes/shadows), conditions가 등록된다
- [x] `.style.ts` 파일 22개 전부에서 hex 리터럴이 사라진다 (grep으로 `#[0-9a-fA-F]{3,8}` 0건) — Phase 6 종료 시점 재검증 0건
- [x] `.style.ts` 파일에서 하드코딩 `px` padding/margin/gap 값이 Panda spacing 토큰으로 치환된다
- [x] `panda.config.ts` keyframes는 유지하되, `transition`은 semantic duration/easing 토큰을 사용한다
- [x] `ThemeProvider` 컴포넌트가 `<html data-theme>`을 토글한다
- [x] 샘플 대체 테마("`win10-classic`")가 추가되어, 색상이 다르게 적용되는 것이 눈으로 확인된다 (사용자 확인 2026-04-11)
- [x] base 테마 상태에서 **기존 외관과 시각적 차이가 없다** (회귀 없음) — Phase 1~5 수동 검증에서 회귀 없음 확정
- [x] `pnpm exec tsc --noEmit` 0 errors
- [x] `pnpm build` 성공

---

## 아키텍처

### 3계층 토큰 구조

```
┌─────────────────────────────────────────────────────────────┐
│ L1. Raw Palette (panda.config.ts > tokens)                  │
│     colors: { gray: { 900: '#393a3b' },                     │
│               blue: { 100: '#0078d7' }, ... }               │
│     → 그룹명은 색 이름, 단계는 100,200... (100=가장 옅음)   │
│     → 역할(role) 이름 금지. 사용처 직접 참조 금지           │
└────────────────────┬────────────────────────────────────────┘
                     │ {colors.gray.900}
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ L2. Semantic Tokens (panda.config.ts > semanticTokens)      │
│     colors: {                                               │
│       shell: { bg: { value: { base: '{colors.gray.900}' },  │
│                              _win10Classic: '...' } }, │
│       accent: { solid: { value: '{colors.blue.100}' } }     │
│     }                                                       │
│     → 역할 기반 이름. Panda가 [data-theme=...]별 CSS var 생성│
└────────────────────┬────────────────────────────────────────┘
                     │ bg: 'shell.bg'
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ L3. 사용처 (.style.ts 파일들)                                │
│     css({ bg: 'shell.bg', color: 'shell.text' })            │
│     → 테마를 몰라야 함. hex 금지                             │
└─────────────────────────────────────────────────────────────┘
```

### 테마 스위칭 흐름

```
<ThemeProvider themeId="win11">
  <html data-theme="win11">
    ...
    <div className={css({ bg: 'shell.bg' })} />
      ↑ Panda가 생성한 CSS var(--colors-shell-bg) 해석
      ↑ [data-theme=win11] 스코프에서 base 값
      ↑ [data-theme=win10-classic] 스코프에서 오버라이드 값
```

Panda의 `semanticTokens` + `conditions` 조합은 **base 값이 항상 fallback**이므로 새 테마를 만들 때 바꿀 토큰만 덮어쓰면 된다. 예: "Win10 클래식"은 섀시 색만 회색으로 바꾸고, 나머지(spacing, typography, motion)는 건드리지 않아도 된다.

---

## 토큰 네이밍

### L1. Raw palette (`tokens.colors`)

**네이밍 규칙:**
- **그룹 이름은 색 이름**(`gray`, `slate`, `blue`, `skyblue`, `red` 등). 역할/의미 이름(`accent`, `danger`, `primary` 등)은 **L1에 쓰지 않는다** — 그건 L2의 일이다.
- 단계는 `100, 200, 300, ...` 100 단위 증가. **`100`이 가장 옅은 색**, 숫자가 커질수록 어두워진다.
- 한 그룹에 값이 1개뿐이어도 `100`으로 시작한다.

| 그룹 | 키 | 값 | 기존 사용처 메모 |
|---|---|---|---|
| white | 100 | `#ffffff` | 프로그램 창 프레임 배경 |
| black | 100 | `#000000` | 프로그램 창 테두리, 최소/최대/닫기 버튼 선 |
| gray | 100 | `#f3f3f3` | program-info 밝은 배경 |
| gray | 200 | `#ededed` | 섀시 밝은 텍스트 |
| gray | 300 | `#e8e8e8` | 상태바 제목 |
| gray | 400 | `#e7e7e7` | program-doc 콘텐츠 배경 |
| gray | 500 | `#c7c7c7` | 화살표 아이콘 |
| gray | 600 | `#a9a9a9` | 중간 회색 |
| gray | 700 | `#4d4d4d` | 테두리 |
| gray | 800 | `#4b4b4b` | 어두운 본문 텍스트 |
| gray | 900 | `#393a3b` | 섀시 다크 배경 (R/G/B 균형, 거의 중성) |
| slate | 100 | `#20343b` | program-doc / image 다크 배경 (푸른빛 slate) |
| skyblue | 100 | `#e5f3ff` | folder hover |
| skyblue | 200 | `#cce8ff` | folder 선택 |
| skyblue | 300 | `#99d1ff` | folder border |
| skyblue | 400 | `#00adef` | taskbar 아이콘 hover (강렬한 하늘) |
| blue | 100 | `#0078d7` | Windows accent 파랑 |
| red | 100 | `#ff1010` | 위험/닫기 버튼 |

**그룹 분류 근거:**
- `white` / `black` 도 단일 값이지만 raw에 등록한다. 사용처에서 `"white"` 문자열 리터럴을 semantic에 직접 박으면 테마 전환 시 이 값을 재배선할 수 없다. 원칙상 **모든 semantic은 raw 토큰을 가리킨다**.
- `#393a3b`는 RGB(57, 58, 59)로 사실상 중성 회색 → `slate`가 아닌 `gray.900`. `slate`에는 명확히 푸른빛이 도는 `#20343b`(RGB 32, 52, 59) 하나만 남긴다.
- `#ededed`(기존 `text.light`)는 별도 `text` 그룹을 만들기보다 `gray.200`에 흡수 — "밝은 텍스트"는 역할이므로 L2에서 부여한다.
- `skyblue`와 `blue`는 분리. `#0078d7`(blue)와 `#99d1ff`(skyblue) 사이의 간격이 커서 같은 그룹의 단계로 이어붙이면 단계 의미가 왜곡됨.
- `skyblue.400 = #00adef`는 Phase 1의 `accent.hover` 분리 결정("안B")을 선반영한 것. taskbar 아이콘 hover에서 기존 동작을 보존하려면 필요하다.

**팔레트 확장 원칙 (YAGNI):**
위 목록은 **현재 코드에 등장하는 값 + 구조적 공백(black/white) + 확정된 선등록(skyblue.400)** 까지만이다. 아직 사용되지 않는 shade(`red.200`, `blue.200` 등)나 미사용 색상군(`green`, `yellow`, `orange` 등)은 등록하지 않는다. 새 값이 필요해지면 그 시점에 해당 그룹에 100단위로 끼워 넣는다. 추상 팔레트를 미리 채워두면 `styled-system` 산출물이 커지고, 사용되지 않는 토큰이 노이즈가 된다.

### L2. Semantic tokens

L2의 네임스페이스는 **역할/의미**다. `accent`, `shell`, `windowChrome`, `surface`, `overlay`는 모두 "무슨 색"이 아니라 "어디에 쓰는 색"을 뜻한다. 이 층의 값은 항상 L1 raw를 `{colors.<색이름>.<단계>}` 로 참조한다.

**colors:**
- `shell.bg` — 태스크바/시작메뉴/시계/정보바 배경 (base: `{colors.gray.900}`)
- `shell.bgAlt` — 프리뷰 등 반투명 변종 (base: `{colors.slate.100}/61`)
- `shell.text` — 섀시 텍스트 (base: `{colors.gray.200}`)
- `shell.border` — 섀시 구분선 (base: `{colors.gray.700}`)
- `windowChrome.bg` — 프로그램 창 프레임 배경 (base: `{colors.white.100}`)
- `windowChrome.border` — 프레임 테두리 (base: `{colors.black.100}`)
- `windowChrome.shadow` — 프레임 그림자 (shadow 토큰)
- `windowChrome.buttonHover` — 최소/최대 버튼 hover (base: `{colors.gray.500}/70`)
- `windowChrome.closeHover` — 닫기 버튼 hover (base: `{colors.red.100}`)
- `surface.light` — 라이트 테마 프로그램 콘텐츠 배경 (base: `{colors.gray.100}`)
- `surface.dark` — 다크 테마 프로그램 콘텐츠 배경 (base: `{colors.slate.100}`)
- `surface.textPrimary` — 본문 텍스트 (base: `{colors.gray.800}`)
- `surface.textMuted` — 보조 텍스트 (base: `{colors.gray.600}`)
- `accent.solid` — 포커스/선택 주요색 (base: `{colors.blue.100}`)
- `accent.hover` — taskbar 아이콘 hover 등 "강조 호버" (base: `{colors.skyblue.400}`)
- `accent.soft` — folder hover (base: `{colors.skyblue.100}`)
- `accent.select` — folder 선택 (base: `{colors.skyblue.200}`)
- `accent.line` — folder border (base: `{colors.skyblue.300}`)
- `overlay.hover` / `overlay.active` — 반투명 오버레이

> `accent`는 "색 이름"이 아니라 "강조 역할"을 뜻하는 네임스페이스다. 현재 base 테마에서는 Windows 파랑(`blue.100`)을 참조하지만, 다른 테마에서 강조색을 red나 green으로 바꾸면 `accent.solid`가 그쪽으로 재배선된다 — 사용처 코드는 그대로.
>
> ※ 기존 초안의 `accent.softer`(가장 옅음)는 `accent.soft`로 개명하고, `accent.soft`(folder 선택)는 `accent.select`로 개명했다. 이유: `soft` / `softer` 는 "정도"만 표현해 의도를 알 수 없다. 실제 용도(hover / select / line)로 이름 붙이는 게 사용처에서 읽기 좋다.

**sizes (layout 치수):**
- `sizes.taskbar` — `50px`
- `sizes.windowHeader` — `32px`
- `sizes.windowBottom` — `20px`
- `sizes.program.default` — `500px` (프로그램 창 기본 가로/세로)

**radii:**
- `radii.sm` — `4px`
- `radii.md` — `8px`
- `radii.full` — `9999px`

**shadows:**
- `shadows.windowFrame` — `0 0 20px 3px {colors.black/38}`
- `shadows.panelUp` — `0 -3px 20px 3px {colors.black/38}`

**durations (semanticTokens.durations):**
- `durations.fast` — `0.2s` (가장 흔함)
- `durations.medium` — `0.25s` (프로그램 창 open)
- `durations.slow` — `0.4s` (큰 패널 슬라이드)

**easings:**
- `easings.standard` — `cubic-bezier(0, 0.5, 0, 1)` (decelerate 계열로 수렴)

---

## Phase 분할

| Phase | 목적 | 산출물 |
|---|---|---|
| 0 | Panda config에 토큰 skeleton 등록 | `panda.config.ts` 갱신, codegen 성공 |
| 1 | 색상 semantic 전환 (shell/windowChrome부터) | `.style.ts` hex 제거 (섀시/태스크바/패널) |
| 2 | 색상 semantic 전환 (프로그램 콘텐츠) | 나머지 `.style.ts` hex 제거 |
| 3 | Motion (duration/easing) 토큰화 | transition 리터럴 제거 |
| 4 | Spacing 스케일 치환 | `px` 리터럴 → panda spacing 토큰 |
| 5 | Layout 치수 `sizes` 토큰화 | taskbar/header 등 고정 치수 토큰화 |
| 6 | ThemeProvider + 샘플 대체 테마 | `data-theme` 스위칭 동작 확인 |

각 Phase는 **독립 PR로 머지 가능**하다. 회귀 위험을 피하기 위해 Phase 1~5 동안은 **새 테마를 도입하지 않고** base 값만으로 돌아가게 한다. Phase 6에서 첫 번째 대체 테마를 붙인다.

---

## Phase 0: Panda config에 토큰 skeleton 등록

**목표:** panda codegen이 새 토큰을 인식하게 만든다. 사용처 수정은 없음.

**파일:**
- 수정: [panda.config.ts](panda.config.ts)

### Task 0-1: `tokens.colors` 추가

[panda.config.ts](panda.config.ts)의 `theme.extend`에 다음을 추가한다:

```ts
tokens: {
  colors: {
    // 그룹명 = 색 이름. 100 = 가장 옅음, 숫자가 커질수록 어두움.
    // 역할 이름(accent, danger 등)은 이 층에 쓰지 않는다.
    white: {
      100: { value: "#ffffff" }, // 프로그램 창 프레임 배경
    },
    black: {
      100: { value: "#000000" }, // 프로그램 창 테두리, 버튼 선
    },
    gray: {
      100: { value: "#f3f3f3" }, // program-info 밝은 배경
      200: { value: "#ededed" }, // 섀시 밝은 텍스트
      300: { value: "#e8e8e8" }, // 상태바 제목
      400: { value: "#e7e7e7" }, // program-doc 콘텐츠
      500: { value: "#c7c7c7" }, // 화살표 아이콘
      600: { value: "#a9a9a9" }, // 중간 회색
      700: { value: "#4d4d4d" }, // 테두리
      800: { value: "#4b4b4b" }, // 어두운 본문
      900: { value: "#393a3b" }, // 섀시 다크 배경 (거의 중성)
    },
    slate: {
      100: { value: "#20343b" }, // 푸른빛 도는 다크
    },
    skyblue: {
      100: { value: "#e5f3ff" }, // folder hover
      200: { value: "#cce8ff" }, // folder 선택
      300: { value: "#99d1ff" }, // folder border
      400: { value: "#00adef" }, // taskbar 아이콘 hover (강렬한 하늘)
    },
    blue: {
      100: { value: "#0078d7" }, // Windows 파랑 solid
    },
    red: {
      100: { value: "#ff1010" }, // 위험/닫기
    },
  },
},
```

### Task 0-2: `semanticTokens.colors` 추가 (base만, condition은 Phase 6에서)

```ts
semanticTokens: {
  colors: {
    shell: {
      bg: { value: { base: "{colors.gray.900}" } },
      bgAlt: { value: { base: "rgba(32, 52, 59, 0.61)" } }, // slate.100 기반 alpha
      text: { value: { base: "{colors.gray.200}" } },
      border: { value: { base: "{colors.gray.700}" } },
    },
    windowChrome: {
      bg: { value: { base: "{colors.white.100}" } },
      border: { value: { base: "{colors.black.100}" } },
      buttonHover: { value: { base: "rgba(221, 221, 221, 0.7)" } },
      closeHover: { value: { base: "{colors.red.100}" } },
    },
    surface: {
      light: { value: { base: "{colors.gray.100}" } },
      dark: { value: { base: "{colors.slate.100}" } },
      textPrimary: { value: { base: "{colors.gray.800}" } },
      textMuted: { value: { base: "{colors.gray.600}" } },
    },
    accent: {
      // "강조" 역할. base 테마에서는 blue/skyblue로 연결된다.
      solid: { value: { base: "{colors.blue.100}" } },     // active / 진한 강조
      hover: { value: { base: "{colors.skyblue.400}" } },  // taskbar 아이콘 hover 등
      soft: { value: { base: "{colors.skyblue.100}" } },   // folder hover
      select: { value: { base: "{colors.skyblue.200}" } }, // folder 선택
      line: { value: { base: "{colors.skyblue.300}" } },   // folder border
    },
    overlay: {
      hover: { value: { base: "rgba(223, 223, 223, 0.07)" } },
      active: { value: { base: "rgba(255, 255, 255, 0.14)" } },
    },
  },
},
```

> alpha 변종은 일단 `rgba()` 리터럴로 둔다. panda의 `{colors.gray.900/70}` syntax는 버전에 따라 동작이 다르므로 Phase 0 스모크 확인 후 선택적으로 전환.

### Task 0-3: `sizes`, `radii`, `shadows` 추가

```ts
tokens: {
  ...위,
  sizes: {
    taskbar: { value: "50px" },
    windowHeader: { value: "32px" },
    windowBottom: { value: "20px" },
  },
  radii: {
    sm: { value: "4px" },
    md: { value: "8px" },
    full: { value: "9999px" },
  },
  shadows: {
    windowFrame: { value: "0 0 20px 3px rgba(0, 0, 0, 0.38)" },
    panelUp: { value: "0 -3px 20px 3px rgba(0, 0, 0, 0.38)" },
  },
},
```

### Task 0-4: `durations`, `easings` 추가

Panda는 duration/easing을 `theme.tokens.durations`, `theme.tokens.easings`로 받는다.

```ts
tokens: {
  ...위,
  durations: {
    fast: { value: "0.2s" },
    medium: { value: "0.25s" },
    slow: { value: "0.4s" },
  },
  easings: {
    standard: { value: "cubic-bezier(0, 0.5, 0, 1)" },
  },
},
```

### Task 0-5: codegen 검증

```bash
pnpm panda
pnpm exec tsc --noEmit
```

**완료 조건:**
- [x] `pnpm panda` 에러 없이 완료
- [x] `src/styled-system/tokens/tokens.d.ts`에 새 토큰 키가 생성된 것을 확인
- [x] `tsc --noEmit` 0 errors (사용처 미변경 상태)
- [x] 앱 실행 → 외관 변화 없음 (사용자 확인)

### Task 0-6: Panda alpha syntax 검증 (A vs B 선택)

**배경:** 반투명 색(`bgAlt`, `overlay.hover`, `overlay.active`, `buttonHover`)을 두 가지 방식으로 표기할 수 있다.

- **방식 A:** `rgba(32, 52, 59, 0.61)` 리터럴
  - 동작 보장. panda 버전 무관
  - raw 토큰과 연결 없음 → `slate.100`을 바꿔도 자동 반영 안 됨 → 테마 교체 목적에 역행
- **방식 B:** `{colors.slate.100/61}` panda alpha syntax
  - raw 토큰 참조. `slate.100`이 테마별로 재배선되면 `bgAlt`도 자동 따라감
  - panda `^0.40.0`에서의 동작은 확인 필요 (버전에 따라 지원 여부 / 컴파일 결과 다름)
  - 브라우저 호환성: `color-mix()` 기반이면 Chrome 111+, Safari 16.2+ 필요

**이 Task의 목적:** panda 0.40.0에서 방식 B가 실제로 동작하는지 확인하고, 동작하면 기존 `rgba()` 리터럴을 방식 B로 전환한다. 동작하지 않으면 A로 유지한다.

**절차:**

1. `panda.config.ts` 의 `semanticTokens.colors` 아래에 실험 토큰을 임시로 추가:
   ```ts
   _debug: {
     alphaTest: { value: { base: "{colors.slate.100/50}" } },
     alphaTest2: { value: { base: "{colors.gray.900/30}" } },
   },
   ```
2. `pnpm panda` 실행 → 에러가 없어야 함
3. 생성된 CSS 확인:
   ```bash
   grep -r "colors-_debug-alpha" src/styled-system
   ```
   또는 `src/styled-system/styles.css`(존재 시) / `src/styled-system/tokens/tokens.d.ts` 에서 CSS 변수 정의를 육안 확인
4. 컴파일 결과가 다음 중 하나의 형태이면 **B 동작 OK**:
   - `color-mix(in srgb, var(--colors-slate-100) 50%, transparent)`
   - `rgb(from var(--colors-slate-100) r g b / 0.5)`
   - 또는 Panda가 미리 계산해서 `rgba(32, 52, 59, 0.5)` 로 박아넣는 형태 (이 경우 테마 스위칭과 궁합은 나쁘지만 최소한 syntax는 통과)
5. 컴파일 결과가 에러거나 `{colors.slate.100/50}` 문자열이 그대로 남아있으면 **B 미지원** → 방식 A 유지
6. 실험 토큰 `_debug` 제거
7. 결정을 이 문서에 기록:
   ```markdown
   > **결정 (YYYY-MM-DD):** Panda alpha syntax [동작함 / 동작 안 함]. 반투명 토큰은 [방식 B / 방식 A]로 진행.
   ```
8. 방식 B로 결정되면 아래 semantic 토큰들의 `rgba()` 리터럴을 alpha syntax로 치환:
   - `shell.bgAlt`: `rgba(32, 52, 59, 0.61)` → `{colors.slate.100/61}`
   - `windowChrome.buttonHover`: `rgba(221, 221, 221, 0.7)` → 현재 gray 팔레트에 `#dddddd`가 없으므로 `gray.500` (`#c7c7c7`) 로 근사 후 `{colors.gray.500/70}`
   - `overlay.hover`: `rgba(223, 223, 223, 0.07)` → 마찬가지로 `gray.500` 근사 후 `{colors.gray.500/7}`
   - `overlay.active`: `rgba(255, 255, 255, 0.14)` → `{colors.white.100/14}`
   - `shadows.windowFrame`, `shadows.panelUp`: `rgba(0, 0, 0, 0.38)` → `{colors.black.100/38}`

> **근사 처리 경고:** buttonHover(`#dddddd`)와 overlay.hover(`#dfdfdf`)는 현재 raw에 정확히 대응되는 색이 없다. "gray.500 근사"는 실제로는 `#c7c7c7`(2단계 어두움)로 이동하므로 버튼 hover 톤이 미세하게 어두워진다. 이게 수용 불가면:
> - 선택지 A: 방식 A(rgba 리터럴) 유지 — 테마 시스템 이득 일부 포기
> - 선택지 B: raw에 `gray.250 = #dddddd` 와 `gray.350 = #dfdfdf` 을 추가 — "100단위 증가" 규칙에 예외(50단위) 도입 필요. 규칙을 깨므로 비추
> - 선택지 C: 기존 값을 `gray.300 = #e8e8e8`로 1단계만 이동 — 미세한 색 이동 허용. 가장 실용적
> 이 선택도 Task 0-6에서 함께 결정한다.

**완료 조건:**
- [x] 실험 토큰으로 panda alpha syntax 동작 여부 확인
- [x] 방식 결정을 문서 본문에 기록
- [x] B로 결정되면 `Task 0-2` 코드 블록과 `Task 0-3` shadows 토큰을 alpha syntax로 업데이트
- [x] 실험용 `_debug` 토큰 제거

> **결정 (2026-04-11):** Panda 0.40.0 에서 alpha syntax 정상 동작. `_debug.alphaTest`가 `color-mix(in srgb, var(--colors-slate-100) 50%, transparent)` 로 컴파일됨. **방식 B 채택.** 단, raw palette에 정확히 대응되는 값만 전환한다:
> - ✅ `shell.bgAlt`: `{colors.slate.100/61}`
> - ✅ `overlay.active`: `{colors.white.100/14}`
> - ✅ `shadows.windowFrame` / `shadows.panelUp`: `{colors.black.100/38}`
> - ❌ `windowChrome.buttonHover` (`#dddddd`): rgba 리터럴 유지 — 근사 이동 리스크 회피
> - ❌ `overlay.hover` (`#dfdfdf`): rgba 리터럴 유지 — 같은 이유
>
> 근사 허용 대신 rgba 유지를 택한 이유: Phase 1의 최우선 조건이 "기존 외관과 시각적 차이 없음"이라, 이 두 반투명 오버레이는 테마 전환 이득보다 외관 보존을 우선한다. 필요 시 이후 Phase 에서 raw palette 에 정확한 값을 추가해 전환한다.

---

## Phase 1: Shell/WindowChrome 색상 semantic 전환

**목표:** 섀시/태스크바/패널 4종의 hex를 semantic token으로 치환한다.

**대상 파일:**
- [src/features/window-shell/ProgramComponent.style.ts](src/features/window-shell/ProgramComponent.style.ts)
- [src/features/taskbar/TaskBar.style.ts](src/features/taskbar/TaskBar.style.ts)
- [src/features/statusbar/components/StatusBar.style.ts](src/features/statusbar/components/StatusBar.style.ts)
- [src/features/timebar/components/TimeBar.style.ts](src/features/timebar/components/TimeBar.style.ts)
- [src/features/infobar/components/InfoBar.style.ts](src/features/infobar/components/InfoBar.style.ts)
- [src/features/hidden-icon/HiddenIcon.style.ts](src/features/hidden-icon/HiddenIcon.style.ts)
- [src/pages/DesktopPage/DesktopPage.tsx](src/pages/DesktopPage/DesktopPage.tsx)

### Task 1-1: `ProgramComponent.style.ts` 치환

```ts
// Before
boxShadow: "0px 0px 20px 3px #00000061",
border: "1px solid black",
backgroundColor: "white",
...
"& .min div": { backgroundColor: "black" },
"& .buttonArea .buttonIcon:hover": { backgroundColor: "#ddddddb3" },
"& .buttonArea > .close:hover": { backgroundColor: "#ff1010" },

// After
boxShadow: "windowFrame",
border: "1px solid token(colors.windowChrome.border)",
backgroundColor: "windowChrome.bg",
...
"& .min div": { backgroundColor: "windowChrome.border" },
"& .buttonArea .buttonIcon:hover": { backgroundColor: "windowChrome.buttonHover" },
"& .buttonArea > .close:hover": { backgroundColor: "windowChrome.closeHover" },
```

> Panda에서 `boxShadow: "windowFrame"` 은 `shadows` 토큰을 참조한다. border 색만 인라인 CSS로 쓸 때는 `token(colors.xxx)` 함수가 필요하다.

### Task 1-2: `TaskBar.style.ts` 치환

```ts
// hex → semantic 매핑
"#00adef" → accent.hover    // taskbar 아이콘 hover (안B 채택 시)
"#0076ff" → accent.solid    // taskbar 아이콘 active
"#aac5ff" → accent.underline // taskbar 선택 밑줄
"#ffffff24" → overlay.active
"#dfdfdf12" → overlay.hover
"#00000000" → transparent
"#20343b9c" → shell.bgAlt
"white" (svg fill) → shell.text
```

**결정 필요 (Phase 1 진행 중):**
1. taskbar `.box1:hover path` 의 `#00adef`(하늘 파랑)는 `.box1:active path` 의 `#0076ff`(진파랑)와 다르다. 이걸 시멘틱으로 어떻게 표현할지:
   - 안A: `accent.solid` 하나로 통일 (hover=active 동작이 됨)
   - 안B: `accent.hover`(raw: `skyblue.400` 신설 필요), `accent.solid`(raw: `blue.100`) 두 토큰으로 분리
   - **Phase 1에서는 안B로 간다** — 기존 동작 보존이 최우선
   - 안B 채택 시 raw에 `skyblue.400 = #00adef`를 추가하고 `accent.hover`의 base를 `{colors.skyblue.400}`으로 설정한다.

### Task 1-3: 패널 3종(`StatusBar`, `TimeBar`, `InfoBar`) 치환

공통 패턴:
```ts
backgroundColor: "#393a3b" → "shell.bg"
color: "#ededed" → "shell.text"
boxShadow: "0px -3px 20px 3px #00000061" → "panelUp"
borderLeft: "1px solid #4d4d4d" → "1px solid token(colors.shell.border)"
```

달력의 선택 상태 `#0078d7` → `accent.solid`.

### Task 1-4: 섀시 색 `#20343b` 처리 결정

[src/pages/DesktopPage/DesktopPage.tsx](src/pages/DesktopPage/DesktopPage.tsx)에서 바탕화면/태스크바 container 배경으로 `#20343b`가 쓰이고 있다. 사용자 결정("섀시 다크 = `#393a3b`로 수렴")에 따라 **이 파일의 `#20343b`는 `shell.bg`로 치환**한다.

단, program-doc / program-image의 `#20343b`는 섀시가 아니라 프로그램 콘텐츠 다크 배경이므로 `surface.dark`로 치환 (Phase 2에서 처리).

### Task 1-5: 검증

```bash
# hex 리터럴 0건인지 확인 (대상 파일들만)
grep -rE "#[0-9a-fA-F]{3,8}" src/features/window-shell src/features/taskbar \
     src/features/statusbar src/features/timebar src/features/infobar \
     src/features/hidden-icon
```

**완료 조건:**
- [x] 대상 파일에서 hex 리터럴 0건
- [x] `pnpm exec tsc --noEmit` 0 errors
- [x] `pnpm build` 성공

**수동 검증:**
- [x] 바탕화면 + 태스크바 + 시작메뉴 + 시계 + 정보바 + 프로그램 창의 색이 **기존과 동일** (사용자 확인)
- [x] 태스크바 아이콘 hover 시 Windows 파랑으로 변한다
- [x] 시작메뉴가 `shell.bg` 색으로 보인다
- [x] 프로그램 창 닫기 버튼 hover 시 빨강으로 변한다

### Task 1-6 ~ 1-8: Phase 1 보완 (2026-04-11 추가)

**배경:** Task 1-1~1-4 에서 대상 7개 파일의 hex 를 모두 치환했으나, 같은 feature 폴더 안의 `.tsx` / hook 파일에 inline hex 가 남아있음이 후속 검증에서 드러남. Phase 2(프로그램 콘텐츠) 로 넘어가기 전에 shell/chrome 영역의 hex 0 건을 완전히 달성하기 위해 보완 작업을 추가한다.

**선행 작업 — panda.config.ts 에 신규 semantic token 추가:**
- `overlay.weak`: `{colors.white.100/8}` — 약한 반투명 배경
- `overlay.activeHover`: `{colors.white.100/17}` — active + hover 중첩 glow
- `surface.border`: `{colors.gray.400}` — 프로그램 콘텐츠 영역의 옅은 border
- `surface.raised`: `{colors.gray.800}` — 다크 배경 위 떠있는 블록 (CommitItem hover 등)

### Task 1-6: taskbar 영역 보강

**대상 파일:**
- [src/features/taskbar/hooks/useTaskbarHover.ts](src/features/taskbar/hooks/useTaskbarHover.ts)
- [src/features/taskbar/ui/PreviewWindowFrame.tsx](src/features/taskbar/ui/PreviewWindowFrame.tsx)

**매핑:**
- `useTaskbarHover.ts`: `#ffffff0d` → `token('colors.overlay.hover')`, `#ffffff24` → `token('colors.overlay.active')`, `#ffffff2b` → `token('colors.overlay.activeHover')`. Panda `token()` runtime helper 를 `@styled-system/tokens` 에서 import. DOM `.style.backgroundColor` 에 runtime 주입되는 값이라 `css()` 대신 `var(--colors-*)` 문자열 반환이 필요하기 때문.
- `PreviewWindowFrame.tsx`: inline `style={{}}` 을 `css()` 로 리팩터하여 `windowChrome.bg`, `windowChrome.border`, `surface.border`(신규) 참조.

### Task 1-7: statusbar 영역 보강

**대상 파일:**
- [src/features/statusbar/components/LeftAreaBox.tsx](src/features/statusbar/components/LeftAreaBox.tsx)
- [src/features/statusbar/components/CenterAreaBox.tsx](src/features/statusbar/components/CenterAreaBox.tsx)
- [src/features/statusbar/components/RightAreaBox.tsx](src/features/statusbar/components/RightAreaBox.tsx)

**매핑:**
- `LeftAreaBox` / `CenterAreaBox`: `#e8e8e8` (text) → `shell.text` (gray.200 근사)
- `RightAreaBox`:
  - `#ffffff14` (bg) → `overlay.weak` (신규)
  - `#9b9b9b00` (border, alpha 0) → `transparent`
  - `#9b9b9b` (hover border) → `token(colors.shell.border)` (gray.700, 색 이동: 더 어두워짐)
  - `#e8e8e8` (text) → `shell.text`

### Task 1-8: infobar / hidden-icon 영역 보강

**대상 파일:**
- [src/features/infobar/components/ErrorBox.tsx](src/features/infobar/components/ErrorBox.tsx)
- [src/features/infobar/components/CommitItem.tsx](src/features/infobar/components/CommitItem.tsx)
- [src/features/hidden-icon/components/SkillIcon.tsx](src/features/hidden-icon/components/SkillIcon.tsx)

**매핑:**
- `ErrorBox`: `#a9a9a9` → `surface.textMuted` (gray.600 정확 매칭)
- `CommitItem`:
  - `#292929ad` (bg) → **rgba 리터럴로 형태만 변환** `rgba(41, 41, 41, 0.68)`. raw 에 대응 없음. Phase 6 에서 재처리.
  - `#484848` (hover bg) → `surface.raised` (신규, gray.800=#4b4b4b 거의 정확)
  - `"white"` (h4) → `shell.text`
  - `#a9a9a9` (p) → `surface.textMuted`
- `SkillIcon`: `#515151` (hover bg) → `token(colors.shell.border)` (gray.700=#4d4d4d 근사)

### Task 1-6~1-8 완료 조건:

- [x] 위 8 개 파일에서 hex 리터럴 0 건
- [x] `pnpm exec tsc --noEmit` 0 errors
- [x] `pnpm build` 성공
- [ ] Panda `token.var()` runtime helper 가 useTaskbarHover 에서 정상 동작 (하나 이상의 태스크바 아이콘 hover 시 glow 색 변화) — 사용자 수동 검증 필요

**수동 검증:**
- [ ] 태스크바 아이콘 hover 시 5% 흰색 glow, active 시 14%, active 상태에서 hover 시 17% — 기존과 동일
- [ ] 태스크바 프리뷰 창 (box1 hover 프리뷰) 의 프레임/헤더 구분선이 기존과 같은 톤
- [ ] 시작메뉴 좌/중/우 박스의 텍스트 색이 기존과 동일
- [ ] 시작메뉴 우측 박스 hover 시 옅은 회색 border 가 나타남
- [ ] 정보바의 Commit 항목 hover 시 조금 더 밝은 회색 배경
- [ ] 숨김 아이콘 hover 시 어두운 회색 배경

### Phase 0+1 회고 (2026-04-11)

- Panda 0.40.0 에서 alpha syntax 방식 B 동작 확인. `_debug.alphaTest` 가 `color-mix(in srgb, var(--colors-slate-100) 50%, transparent)` 로 컴파일됨.
- Phase 1 대상 파일 7개 (`.style.ts` 6개 + `DesktopPage.tsx`) 에서 hex 리터럴 0건 달성. Task 1-6~1-8 보완으로 8개 .tsx/hook 파일 추가 치환 후 shell/chrome 영역(taskbar/statusbar/timebar/infobar/hidden-icon/window-shell) 전체 hex 0건 달성.
- 신규 semantic token 5 종 추가: `accent.underline` (Task 1-2), `overlay.weak`, `overlay.activeHover`, `surface.border`, `surface.raised` (Task 1-6~1-8). 사용하며 네이밍이 맞는지 Phase 2+ 에서 재평가.
- Panda runtime `token.var()` 를 처음으로 사용함 (useTaskbarHover). DOM `.style.backgroundColor` 에 runtime 주입되는 값을 CSS variable 문자열로 변환하여 테마 전환 반응성 확보. 빌드 성공.
- 설계 문서 Task 1-1~1-4 매핑 표가 파일 내 모든 hex 를 커버하지 못함. 현장에서 11개 값을 추가 매핑함. 주요 사례:
  - taskbar 선택 밑줄 `#aac5ff` → 문서에 없던 `accent.underline` semantic 신규 등록 (raw: `skyblue.300` 근사)
  - TimeBar date `#90b8da` → `shell.text` 로 흡수 (옅은 청색 → 흰색, 사용자 수용)
  - StatusBar `0px 9px 20px 0px #181818` shadow → rgba 리터럴로 형태만 변환, 후속 Phase 에서 shadow 토큰 정비 시 재처리 예정
  - HiddenIcon `#393a3be0` → rgba 유지 (gray.900 반투명 변형, 전용 semantic 필요 시 Phase 6)
- Phase 1 범위 밖으로 남겨둔 `.tsx` inline hex: `taskbar/hooks/useTaskbarHover.ts`, `taskbar/ui/PreviewWindowFrame.tsx`, `statusbar/components/{Left,Center,Right}AreaBox.tsx`, `infobar/components/{ErrorBox,CommitItem}.tsx`, `hidden-icon/components/SkillIcon.tsx`. 후속 Phase 에서 범위 보완 필요.
- `pnpm test` 는 34/34 실패하지만 master 에서도 동일하게 재현되는 기존 인프라 문제 (jest/babel `import type` 처리 + `.claude/worktrees/` 경로 포함). Phase 0+1 변경과 무관.

---

## Phase 2: 프로그램 콘텐츠 색상 semantic 전환

**대상 파일:**
- [src/features/program-doc/DOCProgram.style.ts](src/features/program-doc/DOCProgram.style.ts)
- [src/features/program-folder/FolderProgram.style.ts](src/features/program-folder/FolderProgram.style.ts)
- [src/features/program-image/ImageProgram.style.ts](src/features/program-image/ImageProgram.style.ts)
- [src/features/program-info/InfoProgram.view.tsx](src/features/program-info/InfoProgram.view.tsx)
- [src/features/login/Login.style.ts](src/features/login/Login.style.ts)
- [src/features/login/components/LoginInput/LoginInput.style.ts](src/features/login/components/LoginInput/LoginInput.style.ts)
- [src/features/display-cover/DisplayCover.tsx](src/features/display-cover/DisplayCover.tsx)
- [src/shared/ui/WallPaper/WallPaper.styles.ts](src/shared/ui/WallPaper/WallPaper.styles.ts)

### Task 2-1: program-doc 치환

```
#20343b → surface.dark
#e7e7e7 → surface.light (또는 새 토큰 surface.content)
#4b4b4b → surface.textPrimary
#a2a1a1 → surface.textMuted
```

### Task 2-2: program-folder 치환

folder는 **윈도우 스타일 고유의 선택 UI**를 가진다. 이미 정의한 semantic으로 매핑:

```
#cce8ff → accent.select   // raw: skyblue.200
#e5f3ff → accent.soft     // raw: skyblue.100 (hover)
#99d1ff → accent.line     // raw: skyblue.300
```

### Task 2-3: program-image / info / login / wallpaper 치환

각 파일에서 등장하는 hex를 1:1로 semantic에 매핑. 매핑표는 Phase 1에서 쓴 raw palette 표를 재활용한다.

**새로 등장하는 hex**가 있으면 그 자리에서 결정:
- 가까운 raw palette 값에 흡수 (대부분 이 방향)
- 유니크한 의미면 raw palette + semantic 토큰 둘 다 추가

### Task 2-4: 전체 hex 0건 검증

```bash
grep -rnE "#[0-9a-fA-F]{3,8}" src --include="*.style.ts" --include="*.tsx"
```

**예외 허용:** SVG 파일 내부 fill / mask 속성, 아이콘 asset — 이건 별도 처리(Phase Out of scope).

### Task 2-5: IconBox desktop shell 보완 (2026-04-11 추가)

**배경:** Phase 1/2 타겟 리스트에 누락됐던 `src/features/desktop/components/IconBox.tsx` 에 hex 3건 + `backgroundColor: "red"` 하드코딩이 남아 있었다. desktop 아이콘 클릭 시 배경이 빨간색으로 나와 사용자 피드백으로 발견.

**치환:**

```
border "2px solid #ffffff00"  → "2px solid transparent"
_hover.backgroundColor #bbbbbb47 → overlay.weak (white 8% alpha)
_hover.border "2px solid #ffffff2e" → "2px solid token(colors.overlay.active)" (white 14% alpha)
_active.backgroundColor "red" → overlay.activeHover (white 17% alpha)
```

### Task 2-6: Login 버튼 hover 복원 (2026-04-11 추가)

**배경:** Phase 2 초기 치환에서 `#d0d0d0 → surface.border(gray.400 #e7e7e7)` 로 근사했더니 흰 배경과의 명도 차이가 47 → 24 로 줄어 hover 체감이 사라짐.

**치환:**
- semantic `surface.borderDim: {colors.gray.500}` 신규 추가 (#c7c7c7, 명도 차 56 — 원본보다 살짝 더 진함)
- `LoginInput.style.ts` hover borderColor → `surface.borderDim`

**완료 조건:**
- [x] `.style.ts` / `.tsx` 에서 Phase 2 타겟 파일(program-doc/folder/image/info, login) + IconBox 인라인 hex 0건
- [x] `src/features/` 전역 hex 0건 (예외: `src/shared/ui/icons/` 의 SVG fill / 아이콘 asset)
- [x] `pnpm build` 성공
- [x] `pnpm exec tsc --noEmit` 0 errors

**수동 검증:**
- [ ] 각 프로그램(DOC/FOLDER/IMAGE/INFO) 창이 기존과 동일한 배경/텍스트 색으로 렌더
- [ ] folder에서 항목 hover/선택 시 기존과 동일한 파랑 계열 강조
- [ ] image viewer 좌우 엣지 그라데이션이 기존과 동일하게 보임
- [ ] login 버튼 hover 시 테두리 dim이 체감될 것
- [ ] 바탕화면 아이콘 hover/클릭 시 빨간 배경 없이 Windows 스타일 반투명 피드백

### Phase 2 회고 (2026-04-11)

- `surface.content` 신규 semantic 추가 — `surface.border`와 raw(gray.400)는 같지만 의미가 "배경"과 "테두리"로 나뉘므로 AI 수정 지점 분리를 위해 둘 다 유지
- `gray.950(#202020)`, `skyblue.500(#76b3e4)` 2개 raw 신규 — InfoProgram desc 텍스트/링크용. 기존 팔레트로는 시각 차이가 커서 근사 이동 불가
- `shadows.stackItem` 토큰 추가 — boxShadow 내 색상 리터럴(`#a1a1a1`) 제거 방법으로 semantic shadow 토큰이 깔끔 (string 내부 `token()` 보다 전용 토큰이 향후 테마 전환 시 유리)
- gradient 내 반투명 색은 `overlay.fadeEdge` semantic + `token(colors.overlay.fadeEdge)` 형태로 해결. panda codegen이 gradient string 내 `token()` 함수를 CSS 변수로 치환해 줌 (Phase 1의 `token(colors.shell.border)` 패턴 재활용)
- `!important` 를 가진 folder_selected 배경색은 `"token(colors.accent.select) !important"` 형태로 치환 — panda의 semantic 프로퍼티 값에 `!important` 직접 붙이는 대신 `token()` 함수로 안전 우회
- **근사 치환의 회귀 리스크** — `#d0d0d0 → surface.border(gray.400)` 로 "팔레트에 흡수" 했는데 hover 체감이 사라지는 회귀 발생. 사용자 피드백으로 발견. 교훈: 근사 이동 시 "raw와 몇 단계 차이인지" 만 보지 말고 **사용처 주변 배경과의 명도 차**를 함께 고려해야 한다. Phase 3~5에서도 근사 이동 시 동일 리스크 체크 필요
- **설계 문서 타겟 리스트의 빈틈** — `IconBox.tsx`(desktop shell) 는 Phase 1 shell 타겟, Phase 2 program 콘텐츠 타겟 어디에도 안 들어 있어 누락. `_active: "red"` 같은 하드코딩 오류까지 섞여 있었다. 교훈: Phase 분할 시 **"feature/ 전역 hex grep = 0" 을 DoD로 걸어 두는** 게 누락 방지에 효과적. Phase 2에서 `src/features/` 전역 DoD로 강화
- 테스트는 jest 설정 이슈로 전체 실패(known issue, commit 4f6d60e). `pnpm build` 와 `tsc --noEmit` 으로 품질 게이트 대체

---

## Phase 3: Motion 토큰화 (duration / easing)

**목표:** `transition: "0.2s"`, `transition: "0.4s cubic-bezier(...)"` 같은 리터럴을 semantic token으로 치환한다.

### Task 3-1: `transition` 리터럴 목록화

```bash
grep -rnE "transition[^A-Za-z]" src --include="*.style.ts"
```

등장하는 값 (조사 기준):
- `"0.2s"` × 12
- `"0.4s"` × 3
- `"0.1s"` × 2
- `"0.25s"` × 1
- `"0.15s"` × 1
- `"1s"` × 1
- `"var(--duration, 0.2s)"` × 1

### Task 3-2: Panda transition property 활용

Panda는 `transitionDuration`, `transitionTimingFunction`을 개별 property로 받으며 durations/easings 토큰에 매핑된다:

```ts
// Before
transition: "0.2s",

// After
transitionProperty: "all",
transitionDuration: "fast",
transitionTimingFunction: "standard",
```

또는 shorthand가 필요하면 utility로 확장:

```ts
// panda.config.ts utilities
utilities: {
  extend: {
    transition: {
      values: {
        fast: { transitionProperty: "all", transitionDuration: "0.2s", transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)" },
        medium: { transitionProperty: "all", transitionDuration: "0.25s", transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)" },
        slow: { transitionProperty: "all", transitionDuration: "0.4s", transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)" },
      },
    },
  },
},
```

이러면 사용처에서 `transition: "fast"` 한 줄로 끝난다. **이 방식을 채택.**

> `0.1s`, `0.15s`, `1s` 같은 예외값 3건은 개별 검토:
> - `0.1s` — 미세 상태변화. `fast`(0.2s)로 통합 OK
> - `0.15s` — commit item hover. `fast`로 통합 OK
> - `1s` — 배경 이미지 blur. 특수 케이스이므로 별도 `slowest` 토큰 추가 또는 그대로 둠

### Task 3-3: 사용처 치환

```ts
// Before
transition: "0.2s",
transitionProperty: "all",
transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
transitionDuration: "0.4s",

// After
transition: "fast",
// 또는 큰 패널
transition: "slow",
```

### Task 3-4: keyframes 네이밍 재검토 (선택적)

panda.config.ts의 3개 keyframe 중 `prevView_coverTransform`은 사실상 fadeIn이다. 이름을 `fadeIn`으로 바꿀지 검토한다.
- **찬성:** 시멘틱. 재사용 가능
- **반대:** 1곳만 쓰므로 rename 이득 적음. 이 Phase의 Out of scope로 연기 가능

**결정: Phase 3에서는 그대로 둔다.** motion 토큰화 본질과 거리가 있음.

### Task 3-5: 검증

```bash
grep -rnE "\"(0\.[0-9]+|[0-9])s\"" src --include="*.style.ts"
```

**완료 조건:**
- [x] `.style.ts`의 transition 리터럴 0건 (예외 `1s` blur 제외 — 해당 `.style.ts` 내에 1s 리터럴은 애초에 없었고 grep 확인)
- [x] `pnpm build` 성공
- [x] `pnpm exec tsc --noEmit` 0 errors

**수동 검증:**
- [ ] 태스크바 아이콘 hover 시 fade-in 속도가 기존과 체감상 동일 (fast 0.2s)
- [ ] 시작메뉴/시계/정보바 슬라이드 업 애니메이션이 기존과 동일 (slow 0.4s / medium 0.25s)
- [ ] 프로그램 창 내 버튼 hover 전환이 기존과 동일
- [ ] 달력 `.calendarBody` opacity/scale 전환이 기존과 동일 (fast)
- [ ] login 화면 페이드/transform 전환이 기존과 동일 (LoginInput fast/slow, LoginBox transform 전용 fast)

### Phase 3 회고 (2026-04-11)

- Panda `utilities.extend.transition` 를 단순 `values: {...}` 객체 형태로 시도했으나 타입 에러(`PropertyValues`). Panda는 `values: Array<string>` + `transform(value)` 함수 형태만 지원. `transform` 함수 내부에서 value → CSS object 로 확장하는 방식으로 해결. codegen 결과 `prop-type.d.ts` 에 `transition: "fast" | "medium" | "slow" | ...` 가 자동 주입되어 사용처에서 타입 자동완성 동작.
- 대상 파일 `.style.ts` 9 개 + 보완 `.tsx` 3 개 (`SkillIcon`, `CommitItem`, `InfoProgram.view`) 에서 transition 리터럴 0 건 달성.
- 예외값(`0.1s`/`0.15s`) 2 건을 설계 문서 Task 3-2 분석 그대로 `fast`(0.2s) 로 통합. 코드에 주석으로 원래 값 기록.
- **특수 케이스 1: `Login.style.ts` variant `animated: true`** — 원본이 `transform var(--duration, 0.2s)` 로 **transform 속성만** 전환하는 구조였다. `fast` 유틸은 `transitionProperty: all` 이므로 의미가 달라짐. → `transitionProperty: "transform"` + `transitionDuration: "fast"` + `transitionTimingFunction: "standard"` 로 명시 전개하여 기존 동작 보존. `--duration` CSS var 는 실사용 없음을 grep 으로 확인.
- **특수 케이스 2: `LoginInput.style.ts` login 버튼** — 원본이 `all 0.2s ease` (ease easing). `standard`(cubic-bezier(0, 0.5, 0, 1)) 로 수렴. border hover 전환이라 체감 차이 미미 예상, 수동 검증 포인트로 기록.
- **Phase 3 범위 밖으로 남긴 케이스: `LoginPage.tsx`** — `` `opacity ${FADE_OUT_DURATION}ms ease` `` 인라인 style. `FADE_OUT_DURATION=400` 상수가 transition duration 과 setTimeout 양쪽에 쓰여 JS/CSS 결합도가 높음. 이 상수를 토큰으로 옮기려면 Panda runtime `token.var()` + 상수 통합 리팩터가 필요해 Phase 3 scope 밖. Phase 6 ThemeProvider 작업 시 함께 정리 대상.
- `pnpm build` 결과 CSS `+29B`, JS `+8B` 로 변화 미미. utility 함수가 3개 condition 만 생성하므로 비용 거의 없음.
- `pnpm test` 는 여전히 51 suites 실패 (기존 jest 설정 이슈, 커밋 4f6d60e). Phase 3 변경과 무관.
- 빌드 경고 2 건(`ANIMATION_DURATION unused`, `React unused`) 은 사전 존재. Phase 3 scope 밖으로 유지. `Login.style.ts` 의 `ANIMATION_DURATION` 은 이 파일 내에서 사용되지 않지만 scope creep 회피 차원에서 건드리지 않음.

---

## Phase 4: Spacing 스케일 치환

**목표:** `.style.ts` 의 `padding/margin/gap` px 리터럴을 Panda 기본 spacing 토큰으로 치환한다.

### Task 4-1: 매핑표 확정

Panda 기본 spacing (rem 기반, `1 = 0.25rem = 4px`):

| px 값 | panda 토큰 | 비고 |
|---|---|---|
| 4 | `1` | |
| 5 | `1` (=4px) | 5px는 4의 배수 아님 → 4px로 수렴 |
| 6 | `1.5` | |
| 8 | `2` | |
| 10 | `2.5` | 정확 매치 |
| 12 | `3` | |
| 15 | `4` (=16px) | 15→16으로 1px 이동 |
| 16 | `4` | |
| 20 | `5` | 정확 매치 |
| 24 | `6` | |
| 25 | `6` (=24px) | 25→24로 1px 이동 |
| 30 | `7` (=28px) 또는 `8` (=32px) | 문맥 판단 |
| 32 | `8` | |
| 40 | `10` | 정확 매치 |

**주의:** "1px 이동"이 누적되면 레이아웃이 미세하게 변한다. 문제가 되는 곳은 Phase 4 종료 전 수동 검증으로 찾는다.

### Task 4-2: 파일별 치환

22개 `.style.ts` 파일을 5그룹으로 나눠 순차 진행:
- **그룹 A:** window-shell, taskbar (섀시 핵심)
- **그룹 B:** statusbar, timebar, infobar (패널)
- **그룹 C:** program-doc, program-folder, program-image (프로그램 콘텐츠)
- **그룹 D:** program-info, login, hidden-icon (잔여)
- **그룹 E:** shared/ui (WallPaper 등)

그룹 단위로 커밋하면 회귀가 어디서 발생했는지 빠르게 특정 가능.

### Task 4-3: Layout 치수는 건드리지 말 것

다음은 spacing이 아니라 **고정 layout 치수**이므로 이 Phase에서 치환하지 않는다 (Phase 5에서 `sizes` 토큰으로 처리):

- 윈도우 크기 `500px * 500px`
- 태스크바 높이 `50px`
- 윈도우 헤더 `32px`
- 시작메뉴 크기 `650px * 500px`
- 시계 패널 `360px * 720px`
- 정보바 `400px`
- 태스크바 아이콘 박스 `50px * 50px` (단, `padding: 15px`는 spacing)

### Task 4-4: 검증

```bash
grep -rnE "(padding|margin|gap)[^A-Za-z]*['\"]?[0-9]+px" src --include="*.style.ts"
```

**완료 조건:**
- [x] 대상 그룹의 padding/margin/gap px 리터럴 **0건** (`grep` 결과 0 매치)
- [x] `pnpm build` 성공

**수동 검증:**
- [ ] 각 화면에서 간격이 육안으로 기존과 동일/거의 동일
- [ ] 특히 태스크바 아이콘 간격, folder 파일 목록 줄간격 확인

### Phase 4 회고 (2026-04-11)

#### 커스텀 spacing 스케일 도입

Panda default 스케일(`1=4px, 2.5=10px, 5=20px`)은 "키에 4를 곱해야 px가 보임" 구조라 가독성이 떨어진다는 피드백을 반영, `panda.config.ts` 에 **key 자체가 px 값**인 커스텀 스케일을 정의:

```ts
spacing: {
  "0":  { value: "0" },
  "4":  { value: "0.25rem" },  // 4px
  "8":  { value: "0.5rem" },   // 8px
  "12": { value: "0.75rem" },  // 12px
  "16": { value: "1rem" },     // 16px
  "20": { value: "1.25rem" },  // 20px
  "24": { value: "1.5rem" },   // 24px
  "32": { value: "2rem" },     // 32px
  "40": { value: "2.5rem" },   // 40px
},
```

- 사용처: `padding: "16"` → 16px (가독성 ↑)
- `value` 는 rem 유지 → 브라우저 글자 크기 확대 시 spacing 도 같이 커짐 (접근성 유지)
- `extend` 모드이지만 같은 key는 커스텀 값이 덮어씀 (`src/styled-system/tokens/index.mjs` 에서 `spacing.16 = 1rem` 확인됨)
- **제거된 값**: `10px` 은 스케일에 포함하지 않음. 기존 10px 사용처는 8px 로 수렴 (`5→4` 드리프트와 동일 정책).

#### 매핑 정책 (4px 배수 엄격 적용)

| 원본 | 토큰 | 실제 | 드리프트 |
|---|---|---|---|
| `0px` | `"0"` | 0px | 0 |
| `2px` | `"4"` | 4px | +2px |
| `4px` | `"4"` | 4px | 0 |
| `5px` | `"4"` | 4px | −1px |
| `10px` | `"8"` | 8px | −2px |
| `12px` | `"12"` | 12px | 0 |
| `15px` | `"16"` | 16px | +1px |
| `16px` | `"16"` | 16px | 0 |
| `20px` | `"20"` | 20px | 0 |
| `24px` | `"24"` | 24px | 0 |
| `30px` | `"32"` | 32px | +2px |
| `32px` | `"32"` | 32px | 0 |
| `40px` | `"40"` | 40px | 0 |

1px / 3px 은 토큰화하지 않고 **구조적으로 제거 또는 border 로 치환** (아래 참고).

#### 1px 제거 / border 치환 (예외 0건)

| 파일 | 위치 | 변경 |
|---|---|---|
| `ProgramComponent.style.ts` | `.headerArea` padding | **제거** (창 테두리와 버튼 영역이 직접 닿음, 1px 여유 사라짐) |
| `ProgramComponent.style.ts` | `.buttonArea` gap | **제거** (최소/최대/닫기 버튼이 서로 붙음, 토글 그룹 인상) |
| `ImageProgram.style.ts` | `.image_header_controller_btn` padding | **`border: "1px solid transparent"` 로 치환** (20x20 박스 안에 18x18 이미지 영역 예약은 동일) |

#### 2px 제거

| 파일 | 위치 | 변경 |
|---|---|---|
| `HiddenIcon.style.ts` | padding (원본 2px) | `"4"` (+2px 드리프트) |
| `TimeBar.style.ts` | `.calendarBody` gap (원본 2px) | `"0"` (각 셀이 내부 2px transparent border 를 예약하고 있어 시각적 구분 유지) |

#### 주요 드리프트 지점 (수동 검증 대상)

- `5→4` (−1px): taskbar box3 gap, arrowUpIcon padding, StatusBar rightArea_title/boxArea 등
- `10→8` (−2px): ProgramComponent infoArea marginLeft / headerArea2 gap·px / bottomArea px, TaskBar prevView pt, StatusBar gap·rightArea_title my·rightArea_boxArea, TimeBar calendarArea gap, DOCProgram 여러 곳, FolderProgram arrowBox gap·routeBox px·folder py·detailHeader
- `15→16` (+1px): taskbar .box1 padding, .prevView 좌/우/하 padding
- `30→32` (+2px): image gallery header gap (`token(spacing.32) !important`)

#### 기타 결정

- **compound 값 분해**: `padding: "5px 10px"` 같은 축 혼합은 `py`/`px` shortcut 으로 분리
- `!important` 값은 `gap: "token(spacing.32) !important"` 형태로 명시 — shorthand key + !important 조합은 panda 가 raw CSS로 흘려보낼 위험이 있음
- `margin: 0` / `padding: 0` (숫자 리터럴)은 `spacing.0` 으로 resolve 되므로 그대로 유지

#### 검증

- `tsc --noEmit` 0 error
- `pnpm build` 성공 (CSS −84B, JS −17B — 1px/gap 제거로 오히려 감소)
- 생성된 `tokens/index.mjs` 에서 `spacing.16 = 1rem` 등 커스텀 스케일 반영 확인
- 테스트 실행은 [`docs/known-issues/jest-setup.md`](../known-issues/jest-setup.md) 의 기존 이슈로 0건 실행

---

## Phase 5: Layout `sizes` 토큰화

**목표:** 고정 layout 치수를 `sizes` semantic token으로 분리한다. 나중에 "Windows 11 테마는 태스크바가 48px" 같은 변화를 토큰 1줄로 처리할 수 있다.

### Task 5-1: `tokens.sizes` 확장

Phase 0에서 이미 3개(`taskbar`, `windowHeader`, `windowBottom`)를 넣었다. 여기서 확장:

```ts
sizes: {
  taskbar: { value: "50px" },
  windowHeader: { value: "32px" },
  windowBottom: { value: "20px" },
  program: {
    default: { value: "500px" },
    headerSub: { value: "25px" },
  },
  statusbar: {
    width: { value: "650px" },
    height: { value: "500px" },
  },
  timebar: {
    width: { value: "360px" },
    height: { value: "720px" },
  },
  infobar: {
    width: { value: "400px" },
  },
},
```

### Task 5-2: 사용처 치환

`css({ height: "50px" })` → `css({ height: "taskbar" })`

Panda는 `sizes` 토큰을 height/width/minHeight/maxHeight/minWidth/maxWidth 등에 자동 매핑한다.

예:
```ts
// DesktopPage.tsx grid
"gridTemplateRows: '1fr 50px'" → "1fr token(sizes.taskbar)"

// ProgramComponent.style.ts
"gridTemplateRows: '32px 25px 1fr 20px'" → 
  "token(sizes.windowHeader) token(sizes.program.headerSub) 1fr token(sizes.windowBottom)"
```

### Task 5-3: 검증

```bash
pnpm build
```

**수동 검증:**
- [x] 모든 고정 치수 UI가 기존과 동일 크기
- [x] 태스크바 높이 / 프로그램 창 크기 / 시계 패널 크기 확인

### Phase 5 회고 (2026-04-11)

**진행한 작업:**
- `tokens.sizes` 에 7개 키 추가: `program.default/headerSub`, `statusbar.width/height`, `timebar.width/height`, `infobar.width`
- 치환 파일 9개:
  - [DesktopPage.tsx](../../src/pages/DesktopPage/DesktopPage.tsx) — `gridTemplateRows` taskbar row
  - [TaskBar.style.ts](../../src/features/taskbar/TaskBar.style.ts) — `gridTemplateColumns` 1열 + `.shortCutIcon`/`.box1` width/height
  - [HiddenIcon.style.ts](../../src/features/hidden-icon/HiddenIcon.style.ts) — active bottom
  - [InfoBar.style.ts](../../src/features/infobar/components/InfoBar.style.ts) — bottom/width/height(calc)
  - [TimeBar.style.ts](../../src/features/timebar/components/TimeBar.style.ts) — width/height + active bottom
  - [StatusBar.style.ts](../../src/features/statusbar/components/StatusBar.style.ts) — width/height + active bottom
  - [ProgramComponent.style.ts](../../src/features/window-shell/ProgramComponent.style.ts) — width/height/left/top calc + gridTemplateRows + `.headerArea` height
  - [DOCProgram.style.ts](../../src/features/program-doc/DOCProgram.style.ts) — `.doc_imageArea`/`.doc_contentsArea` flexBasis
  - [InfoProgram.view.tsx](../../src/features/program-info/InfoProgram.view.tsx) — `.info1`/`.info2` flexBasis
  - [PreviewWindowFrame.tsx](../../src/features/taskbar/ui/PreviewWindowFrame.tsx) — width/height + gridTemplateRows

**판정 기준:**
- **치환 대상 = "같은 의미로 같은 값"**. 숫자가 우연히 일치한다고 다 치환하지 않음. 예) `TaskBar.style.ts:175` 의 box3 `gridTemplateColumns: "1fr 4fr 50px 5px"` 에서 `50px` 는 .closeAllButton 너비라 "taskbar 높이" 의미가 아님 → 제외.
- **layout 치수 vs 아이콘 크기 vs offset/animation**. `IconBox.tsx` 50x50 (데스크탑 아이콘), `TaskBar.style.ts` 의 `-150px`/`225px` (hover offset/preview 크기), `HiddenIcon.style.ts` 의 `-500px` (슬라이드 out 위치) → 모두 sizes 토큰 아님.
- **spacing scale 바깥 숫자는 유지**. `InfoProgram.view.tsx` 의 `padding: "50px 10px"`, `gap: "50px"` 는 spacing 개념. Phase 4 스케일(40까지) 바깥이라 "spacing token 증설" 결정 전까지는 리터럴 유지.

**Panda 동작 확인:**
- `width/height/flexBasis` 에 `"taskbar"`, `"program.default"` 처럼 sizes 토큰 이름만 써도 auto-map 정상 동작 (panda가 `var(--sizes-*)` 로 치환).
- `gridTemplateColumns/Rows` 는 string property라 auto-map 안 됨 → `"token(sizes.taskbar) auto 200px"` 형태로 명시적 주입 필요. 이것도 panda codegen이 CSS 변수로 잘 치환함 (Phase 3의 gradient 내 `token()` 패턴과 동일 동작).
- **calc 안에 token 주입 가능**. `calc(50% - token(sizes.program.default) / 2)` → 빌드 CSS 검증: `calc(50% - var(--sizes-program-default)/2)` 로 정확히 치환. `ProgramComponent.style.ts` 의 `left/top` 가 기존 `calc(50% - 250px)` 와 수식상 동치.
- `bottom` property 에 sizes 토큰 사용 시 `bottom: "taskbar"` 는 불가 (panda가 bottom 에는 spacing scale 을 매핑). `bottom: "token(sizes.taskbar)"` 형태로 우회.

**검증 결과:**
- `pnpm panda`, `pnpm exec tsc --noEmit` 에러 0건
- `pnpm build` 성공 (eslint 경고 2건은 Phase 3 회고와 동일한 기존 경고)
- 생성된 `main.*.css` 에서 신규 sizes 변수 사용 횟수 확인:
  - `var(--sizes-taskbar)` 7회, `var(--sizes-program-default)` 4회 (width+height 2곳, calc 2곳), `var(--sizes-window-header)` 3회 (ProgramComponent grid, headerArea height, PreviewFrame grid)
  - `var(--sizes-program-header-sub)` / `window-bottom` / `statusbar-*` / `timebar-*` / `infobar-width` 각 1회
- **수동 확인 포인트**: 태스크바 높이 50px, 프로그램 창 500x500 중앙 정렬, 시계/상태/정보 패널 크기 모두 기존과 동일.

**Phase 5 범위 밖으로 남긴 것:**
- [useWindowLifecycle.ts](../../src/features/window-shell/hooks/useWindowLifecycle.ts) — JS 에서 `box.style.width = "500px"` 및 `localStorage` 에 `"500px"` 문자열 저장. CSS 변수로 바꾸려면 런타임에서 `getComputedStyle(document.documentElement).getPropertyValue('--sizes-program-default')` 를 조회하거나, 상수로 뽑아 panda 토큰과 동기화해야 함. localStorage persistence 까지 얽혀 있어 Phase 5 scope 초과. **Phase 6** ThemeProvider 도입 시 "JS에서 토큰값 읽는 유틸" 함께 정리 예정.
- [ProgramComponent.style.ts:20](../../src/features/window-shell/ProgramComponent.style.ts#L20) 유사 케이스로 `windowBottom` 과 값이 같은 20px 이 `.infoArea img` (line 64,65) 에 또 있지만 "아이콘 크기" 라 의미가 다름 → 유지.
- `TaskBar.style.ts:175` box3 grid, `.buttonCover` 40px, `.bodyCover` 200px, `.prevView` 200x225 등 taskbar 내부 구성 요소 크기는 "taskbar 자체 치수"가 아니라 내부 layout 이라 별도 토큰 필요. 현재 설계 문서엔 없으므로 유지.
- `TimeBar.style.ts:7` `gridTemplateRows: "130px 1fr 250px"` (timeArea/calendarArea/functionArea 높이) 는 timebar 내부 3분할. Phase 5 토큰 리스트엔 없음. 향후 필요 시 `sizes.timebar.timeArea` / `functionArea` 등으로 확장 가능.

**Phase 5 ~ Phase 6 브리지:**
- `useWindowLifecycle.ts` 의 JS 문자열 "500px" 은 `sizes.program.default` 와 강결합이므로, Phase 6 ThemeProvider 에서 테마별로 프로그램 기본 크기를 다르게 하고 싶다면 이 hook 의 localStorage/box.style 부분을 CSS 변수 기반으로 재작성해야 한다.

---

## Phase 6: ThemeProvider + 샘플 대체 테마

**목표:** `data-theme` 스위칭을 실제로 동작시키고, 색만 다른 샘플 테마 1개를 추가해 **테마 교체가 실제로 된다는 것을 증명**한다.

### Task 6-1: `conditions` 등록

[panda.config.ts](panda.config.ts):

```ts
conditions: {
  extend: {
    win10Classic: "[data-theme=win10-classic] &",
  },
},
```

> **주의 — Panda `_theme*` 예약 네임스페이스:** condition 이름을 `themeXxx` 로 짓지 말 것. Panda 내부(`@pandacss/core` 의 `getThemeName`)가 `_theme` prefix 를 top-level `themes` config 전용으로 예약해 두었고, token CSS 생성 단계(`@pandacss/generator` token-css.ts 의 `isThemeSkipped` 가드)에서 `_theme*` condition 은 `themes` 설정이 없으면 **조용히 드롭**된다. 즉 override 블록이 CSS 에 나오지 않아 시각적으로 테마가 바뀌지 않는 증상이 생긴다. custom 테마 condition 은 `_win10Classic` 같은 형태로 짓는다.

### Task 6-2: semanticTokens에 대체 값 추가

색만 건드린다. 예시 (클래식 Windows 회색 스킨):

```ts
semanticTokens: {
  colors: {
    shell: {
      bg: {
        value: {
          base: "{colors.gray.900}",
          _win10Classic: "#c0c0c0",
        },
      },
      text: {
        value: {
          base: "{colors.gray.200}",
          _win10Classic: "#000000",
        },
      },
      border: {
        value: {
          base: "{colors.gray.700}",
          _win10Classic: "#808080",
        },
      },
    },
    windowChrome: {
      bg: {
        value: {
          base: "{colors.white.100}",
          _win10Classic: "#c0c0c0",
        },
      },
      // border, buttonHover 등
    },
    accent: {
      solid: {
        value: {
          // base는 blue, 클래식은 네이비로 재배선
          base: "{colors.blue.100}",
          _win10Classic: "#000080",
        },
      },
    },
  },
},
```

> 이 Phase에서 모든 semantic 토큰을 win10-classic으로 다 채우지 않아도 된다. **shell/windowChrome/accent** 3그룹만 해도 테마가 달라졌다는 게 눈에 보인다. 나머지는 base fallback.

### Task 6-3: `ThemeProvider` 컴포넌트 작성

**파일:**
- 신규: `src/app/theme/ThemeProvider.tsx`
- 신규: `src/app/theme/themeTypes.ts`

```ts
// src/app/theme/themeTypes.ts
export type ThemeId = "base" | "win10-classic";
```

```tsx
// src/app/theme/ThemeProvider.tsx
import { ReactNode, useEffect } from "react";
import { ThemeId } from "./themeTypes";

export const ThemeProvider = ({
  themeId,
  children,
}: {
  themeId: ThemeId;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (themeId === "base") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
    }
  }, [themeId]);

  return <>{children}</>;
};
```

> **주의:** Provider는 DOM attribute만 건드린다. Provider context를 쓰지 않는 이유는 **사용처에서 themeId를 알 필요가 전혀 없기** 때문이다(요구사항 3). 테마 토글 UI만 themeId를 알면 된다.

### Task 6-4: 토글 UI (최소 구현)

[src/app/App.tsx](src/App.tsx) 또는 적당한 위치에 임시 버튼을 넣어 토글 동작을 확인한다. 정식 UI는 Out of scope.

```tsx
const [themeId, setThemeId] = useState<ThemeId>("base");

<ThemeProvider themeId={themeId}>
  <button
    style={{ position: "fixed", right: 10, top: 10, zIndex: 9999 }}
    onClick={() => setThemeId(themeId === "base" ? "win10-classic" : "base")}
  >
    Theme: {themeId}
  </button>
  ...
</ThemeProvider>
```

### Task 6-5: 검증

**자동:**
```bash
pnpm build
pnpm exec tsc --noEmit
```

**수동:**
- [ ] base 상태: 기존 외관과 동일
- [ ] 버튼 클릭 → `data-theme="win10-classic"` 이 html에 부여됨 (DevTools에서 확인)
- [ ] 태스크바/시작메뉴/프로그램 창 프레임의 **색만** 회색 계열로 변한다
- [x] 토글 왕복해도 정상 복귀한다
- [x] 폰트/레이아웃/애니메이션은 변화 없음 (의도된 동작)

### Phase 6 회고 (2026-04-11)

**구현 결과:**
- `conditions.extend` 에 `win10Classic: "[data-theme=win10-classic] &"` 등록
- `semanticTokens` 에 샘플 오버라이드 5개 토큰: `shell.bg/text/border`, `windowChrome.bg`, `accent.solid`
- 신규 파일 2개: [src/app/theme/themeTypes.ts](../../src/app/theme/themeTypes.ts) (`ThemeId` 유니온), [src/app/theme/ThemeProvider.tsx](../../src/app/theme/ThemeProvider.tsx) (DOM attribute 토글 훅)
- [src/App.tsx](../../src/App.tsx) 에 `ThemeProvider` 감싸기 + 우상단 임시 토글 버튼 (설계 문서 Task 6-4 샘플 코드 그대로)

**발견한 함정 — Panda `_theme*` 예약어 네임스페이스:**
- 최초 시도에서 condition 이름을 `themeWin10Classic` 으로 지었다가 "DevTools 에서 `data-theme` attribute 는 보이는데 색이 안 바뀐다" 증상 발생
- 근본 원인: `@pandacss/core` 의 `getThemeName` 이 `"_theme" + capitalize(name)` 을 반환하고, `@pandacss/generator` token-css.ts 의 `generateTokenCss` 가 `isThemeSkipped` 가드(`key.startsWith("_theme") && !themeConds.some(...)`)로 **top-level `themes` config 옵션용으로 예약된 `_theme*` 조건을 건너뜀**. 내 condition 은 `_themeWin10Classic` 로 해석되어 이 조건에 걸려 override CSS 블록이 **조용히 드롭**됨 — compiled CSS 에 `[data-theme=win10-classic]{...}` 자체가 없었음
- 해결: condition 이름을 `win10Classic` 으로 rename → semanticTokens 에서는 `_win10Classic` 으로 참조 → compiled CSS 에 `[data-theme=win10-classic]{--colors-shell-bg:silver;--colors-shell-text:#000;--colors-shell-border:grey;--colors-window-chrome-bg:silver;--colors-accent-solid:navy}` 정상 출력 확인
- 후속 반영: [panda.config.ts](../../panda.config.ts) 에 이유 주석 + 설계 문서 Task 6-1 하단에 gotcha 경고 주석 추가

**검증 결과:**
- `pnpm exec panda codegen`, `pnpm exec tsc --noEmit` 에러 0건
- `pnpm build` 성공, CSS 사이즈 +52B (override 블록 1개)
- compiled CSS 검증: `[data-theme=win10-classic]` 블록에 5개 CSS 변수 재정의 확인 (Panda 가 `#c0c0c0→silver`, `#808080→grey`, `#000080→navy` 단축 이름 최적화 적용)
- 수동 확인: 토글 버튼 클릭 시 태스크바/시작메뉴/창 프레임 색이 회색 계열로 교체되고 base 복귀 왕복 정상 (사용자 확인 2026-04-11)
- 사용처(`.style.ts` 22개) 수정 0건 — 설계 요구사항 3번("사용처는 테마를 전혀 모르고 semantic 값만 참조") 증명

**Phase 6 범위 밖으로 남긴 것:**
- 나머지 semantic 토큰(`accent.hover/soft/select/line/underline/link`, `shell.bgAlt`, `surface.*`, `overlay.*`, `windowChrome.border/buttonHover/closeHover`)은 `_win10Classic` 오버라이드 미등록 → 토글 시 base fallback 으로 남음. "테마 교체 메커니즘 증명" 목적에 5개로 충분하다고 판단 (설계 문서 Task 6-2 주석과 일치)
- 정식 테마 스위처 UI, localStorage persist, `prefers-color-scheme` 대응 모두 "Out of scope" 섹션에 명시된 대로 미구현
- [useWindowLifecycle.ts](../../src/features/window-shell/hooks/useWindowLifecycle.ts) 의 JS 상수("500px" 문자열)와 sizes 토큰 동기화도 미루어 둠 (Phase 5 회고에서 예고했던 항목). ThemeProvider 가 DOM attribute 만 건드리는 구조라 JS 토큰 조회 유틸이 꼭 필요하지는 않아서 이번에 손대지 않음

---

## 새 테마/버전 추가 가이드 (시스템 도입 후)

예시: "macOS Big Sur" 테마 추가

> **이름 짓기 주의:** condition 이름에 `theme` prefix 를 넣지 말 것. Panda 내부가 `_theme*` 를 top-level `themes` config 전용으로 예약해 두어, 해당 prefix 의 condition 은 token CSS 생성 단계에서 조용히 드롭된다 (Phase 6 회고 참조). `macos`, `win10Classic` 처럼 테마 이름만 쓴다.

### 1. condition 등록

```ts
// panda.config.ts
conditions: {
  extend: {
    macos: "[data-theme=macos] &",
  },
},
```

### 2. semanticTokens에 오버라이드 값 추가

```ts
shell: {
  bg: {
    value: {
      base: "...",
      _win10Classic: "...",
      _themeMacos: "rgba(246, 246, 246, 0.6)", // frosted glass
    },
  },
},
```

### 3. `ThemeId` 타입에 추가

```ts
export type ThemeId = "base" | "win10-classic" | "macos";
```

### 수정 불필요한 파일들

- `.style.ts` 전부 — semantic token만 참조하므로 수정 불필요
- `ThemeProvider.tsx` — data attribute 토글 로직 그대로
- 개별 컴포넌트 — 변화 없음

**수정 지점: panda.config.ts 1곳 + themeTypes.ts 1곳 = 2곳.**

---

## 트레이드오프

### 얻는 것
- 사용처에서 테마 무지성 — 파일 어디에도 `win11` 같은 단어 없음
- 테마 추가 비용 **파일 2곳**
- `panda.config.ts` 하나만 보면 프로젝트 전체 디자인 토큰이 한눈에 보인다
- Panda codegen 기반이므로 타입 안전성 유지
- 기존 panda CSS 작성 스타일(`css()`, `cva()`)과 완전 호환 — 문법 변화 없음

### 잃는 것
- `panda.config.ts`가 커짐 (토큰 100개+ 가능)
- 1:1 색 치환 과정에서 **근소한 시각 차이** 발생 가능 (투명도 변종 축소 등)
- Phase 전체 진행 동안 여러 PR이 쌓이며 일시적으로 hex와 semantic이 공존하는 구간 존재
- alpha variant 처리 방식(`/38` vs `rgba`)을 정해야 함
- spacing 1px 이동이 누적되면 레이아웃 미세 틀어짐 — 수동 검증 부담

### 판단
현재 5개 타입 / 22개 스타일 파일 규모에서 테마 시스템 도입은 **선투자 성격**이다. 당장 테마 1개만 쓴다면 과한 작업량이지만, 사용자가 "나중에 테마/버전 교체"를 명시적으로 목표로 잡았으므로, **지금 정리하지 않으면 치환 대상이 계속 늘어난다**. 현 시점 투자가 최소 비용.

---

## Out of scope (별도 Phase 또는 미래 작업)

- **SVG/이미지 asset의 테마 대응** — 아이콘 자체가 테마마다 다른 경우. asset manifest 확장 필요 (별도 설계 문서)
- **타이포그래피 토큰** — 폰트 패밀리/사이즈 토큰화. 현재 `맑은 고딕` 단일이므로 이득 낮음
- **키프레임 재명명** (`prevView_coverTransform` → `fadeIn` 등)
- **정식 테마 스위처 UI** — 설정 패널 내 드롭다운 등
- **테마 선택 persist** — localStorage 저장, 시스템 색 감지
- **라이트/다크 모드 prefers-color-scheme 대응**
- **Panda recipe 도입** — 버튼 같은 재사용 컴포넌트 variant. semantic 토큰 작업이 끝나면 도입 고려

---

## 진행 상태

- [x] Phase 0: 토큰 skeleton 등록
- [x] Phase 1: 색상 (shell / windowChrome)
- [x] Phase 2: 색상 (프로그램 콘텐츠)
- [x] Phase 3: Motion 토큰화
- [x] Phase 4: Spacing 치환
- [x] Phase 5: Layout sizes 토큰화
- [x] Phase 6: ThemeProvider + 샘플 대체 테마

---

## 프로젝트 회고 (2026-04-11)

### 잘된 점 (다음에도 유지할 패턴)

- **3계층 분리가 Phase 6 에서 실제로 검증됨.** 사용처(`.style.ts` 22개) 는 Phase 1~2 에서 semantic 토큰 이름만 참조하도록 치환했고, Phase 6 에서 `_win10Classic` 오버라이드를 추가하자 **사용처 수정 0건** 으로 색이 교체됐다. 설계 규칙 3번("사용처는 테마를 전혀 모른다") 이 실증됨
- **Phase 단위 PR 금지 + 단일 PR 머지 전략.** 6개 Phase 를 하나의 작업 브랜치 `refactor/theme-system` 에서 순차 진행하고, Phase 별 commit 은 분리하되 중간 PR 을 만들지 않았다. 덕분에 hex/semantic 공존 구간이 외부에 노출되지 않았고, "설계 규칙 9번(feature 단위로 쪼갠다)" 이 리팩터 안정성에도 기여
- **Phase 0 선행 등록.** 토큰 skeleton 을 먼저 박아두고 Phase 1~5 에서 참조로 전환한 구조 덕분에, 각 Phase 는 "이름만 아는 토큰으로 치환" 하는 단순한 작업으로 축소됨. 매 Phase 에서 panda codegen/tsc/build 를 독립 검증 가능
- **Phase 회고에 "사실 기반 관찰" 규칙.** `grep 결과 N건`, `CSS 변수 사용 횟수`, `calc 안 token 주입 동작 확인` 같은 검증 가능한 관찰을 남긴 덕분에, Phase 6 에서 발생한 `_theme*` 드롭 증상도 "컴파일된 CSS 에 블록이 없다" 는 동일한 방식으로 5분 내에 근본 원인 식별 가능했음
- **설계 문서에 "Phase 범위 밖으로 남긴 것" 섹션 유지.** 각 Phase 회고마다 "의도적으로 안 한 것" 을 적어둔 덕분에, 전체 프로젝트 종료 시점에 "남은 기술 부채 리스트" 를 다시 모으지 않아도 됨

### 개선할 점 (다음에 보완할 사항)

- **툴 내부 예약어 네임스페이스를 사전 조사하지 않았음.** Phase 6 설계 시점에 `_themeWin10Classic` 이름을 그대로 채택했고, 이것이 Panda 의 `_theme*` 예약어와 충돌한다는 사실은 **compiled CSS 에 override 블록이 없다는 증상을 본 후에야** 발견했다. 다음 프로젝트에서는 설계 단계에서 해당 툴 소스(`@pandacss/core` 의 `getThemeName`, `@pandacss/generator` 의 `isThemeSkipped` 같은 가드) 를 최소 1회 grep 하고 가는 것이 안전
- **설계 문서의 "예시 코드" 가 툴의 함정을 검증하지 않은 채 들어갔음.** Task 6-1 예시와 "새 테마 추가 가이드" 의 `_themeMacos` 예시 모두 실제 실행 전까지 동일 버그를 품고 있었고, Phase 6 발견 후 2번 모두 수정해야 했음. 설계 문서 작성 단계에서도 "가장 작은 실행 예제를 일단 돌려본다" 는 검증을 한 번 거치는 것이 좋겠음 (plan-writing-guide.md 보완 대상)
- **Spacing 마이그레이션의 1px 드리프트 리스크가 사전 예고만 되고 측정은 사후였음.** Phase 4 회고에 드리프트 지점을 나열해뒀지만, 사전에는 "1px 이동 가능" 이라는 경고만 있었고 스냅샷/픽셀 diff 같은 객관적 측정 수단이 없었음. 다음 번 대규모 스케일 마이그레이션에서는 Playwright screenshot diff 같은 회귀 측정을 Phase 입력 조건으로 걸어두는 편이 좋겠음
- **`useWindowLifecycle.ts` 의 JS 상수 하드코딩이 결국 남음.** Phase 5 회고에서 "Phase 6 ThemeProvider 도입 시 JS 토큰 읽기 유틸 함께 정리" 라고 예고했는데, 실제로 ThemeProvider 가 DOM attribute 만 건드리는 구조라 필요성이 약해져 미뤘음. 즉 "Phase N 에서 미루고 Phase M 에서 처리" 약속이 실제로 Phase M 의 범위와 맞지 않을 수 있다는 교훈. 다음부터 Phase 이월 약속은 "범위가 정말 맞는지" 를 이월 시점이 아닌 처리 Phase 시작 시점에 재검토

### 향후 과제 (이 작업에서 파생된 후속 작업)

- **SVG/이미지 asset 의 테마 대응** — 배경/아이콘이 테마마다 다를 경우. asset-manifest 와 엮여야 하므로 별도 설계 문서 필요
- **타이포그래피 토큰화** — 현재 `맑은 고딕` 단일이라 이득이 낮다고 판단했으나, 테마가 2개 이상 실제로 붙는 시점에 재검토
- **Panda recipe 도입** — 버튼/아이콘 같은 재사용 컴포넌트를 `cva` 대신 recipe 로 승격. semantic 토큰이 안정화된 지금이 적기
- **정식 테마 스위처 UI + persist** — localStorage 저장, `prefers-color-scheme` 대응. 현재는 우상단 임시 디버그 버튼만 존재
- **`useWindowLifecycle.ts` JS/토큰 동기화** — Phase 5 에서 미뤘던 `"500px"` 문자열 상수와 `sizes.program.default` 동기화. 별도 소규모 작업
- **keyframes 네이밍 재검토** — `prevView_coverTransform` → `fadeIn` 같은 역할 기반 이름. Phase 3 에서 선택적으로 미뤘음

### plan-writing-guide 반영 후보

다음 규칙을 `docs/rules/plan-writing-guide.md` 에 추가할 가치가 있음:

1. **외부 툴의 예약어/네임스페이스를 설계 단계에서 1회 확인.** 새 기능을 툴의 config 로 선언하기 전, 해당 config 키가 다른 용도로 예약돼 있지 않은지 툴 소스/문서를 grep 한다. (Phase 6 의 `_theme*` 교훈)
2. **설계 문서의 예제 코드도 실행 검증 대상.** Task 섹션에 넣은 코드 블록은 "최소 실행 가능한 단위" 로 한 번은 돌려본 결과여야 한다. 돌려보지 않은 예제는 그대로 함정을 복사하는 경로가 된다.
3. **Phase 간 "이월 약속" 은 이월 시점이 아니라 처리 Phase 시작 시점에 재검토.** Phase N 회고에 "Phase M 에서 처리 예정" 이라고 적어둔 항목이 실제로 Phase M 의 범위와 맞지 않을 수 있다.
