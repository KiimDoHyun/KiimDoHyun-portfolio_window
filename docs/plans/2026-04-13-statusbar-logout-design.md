# 시작 메뉴 로그아웃 기능

## 배경

로그인 화면에서 메인(데스크탑)으로 이동은 가능하지만, 메인에서 로그인 화면으로 돌아갈 방법이 없다.
Windows OS를 모방한 UI에서 로그아웃/잠금 경로가 없는 것은 UX 결함이다.

실제 Windows 시작 메뉴 좌측 하단에 전원 아이콘이 있는 것처럼,
StatusBar(시작 메뉴) leftArea 최하단에 전원 아이콘을 배치하고,
클릭 시 로그인 초기 화면(`/window/login`)으로 돌아가도록 한다.

## 설계 규칙

- Shell에는 로직(네비게이션, 스토어 초기화)을 둔다. View 컴포넌트는 콜백만 받는다.
- 기존 `LeftAreaBox` 컴포넌트를 재사용한다.
- 전원 아이콘은 SVG 파일로 직접 제작하여 `src/asset/images/icons/`에 추가한다.

## 아키텍처

### UI 구조 변경

```
StatusBar leftArea (기존: leftArea_top + leftArea_contents)
→ 변경 후: leftArea_top + leftArea_contents + leftArea_bottom

┌──────────────┐
│ ☰ 소개        │  leftArea_top (기존)
├──────────────┤
│ 👤 김도현     │
│ ⚛ 리액트     │  leftArea_contents (기존)
│ ...          │
├──────────────┤
│ ⏻ 로그아웃    │  leftArea_bottom (신규)
└──────────────┘
```

leftArea_Contents 컨테이너가 이미 `flex-direction: column; justify-content: space-between`으로 되어 있어,
`leftArea_bottom`을 추가하면 자연스럽게 하단에 붙는다.

### 데이터 흐름

```
[전원 아이콘 클릭]
  → StatusBarView.onLogout()
  → StatusBar(컨테이너).onLogout()
  → StatusBarShell.handleLogout()
    → runningProgramsStore 초기화 (열린 프로그램 전부 제거)
    → uiStore.closeAllMenus()
    → navigate("/window/login", { replace: true })
```

### 수정 대상 파일

| 파일 | 변경 |
|------|------|
| `src/asset/images/icons/power.svg` | 전원 아이콘 SVG 파일 신규 생성 |
| `src/features/statusbar/components/StatusBar.tsx` | leftArea 하단에 `leftArea_bottom` 영역 + 전원 아이콘 렌더링, `onLogout` prop 추가 |
| `src/features/statusbar/components/StatusBar.style.ts` | `leftArea_bottom` 스타일 (구분선 상단 border) |
| `src/features/statusbar/StatusBar.tsx` | `onLogout` prop 수신 및 View에 전달 |
| `src/pages/DesktopPage/shells/StatusBarShell.tsx` | `useNavigate` + `handleLogout` 핸들러 (스토어 초기화 + 네비게이션) |

### 스토어 초기화

로그아웃 시 깨끗한 상태로 돌아가야 하므로:

- `runningProgramsStore`: 열린 프로그램 전부 제거 (기존 `closeAll`은 최소화만 하므로, byId/order/activeId를 초기값으로 리셋하는 `reset` 액션 추가)
- `uiStore`: `closeAllMenus()` 호출 (기존 함수 재사용)

## 성공 기준 (Definition of Done)

- [ ] 시작 메뉴 leftArea 최하단에 전원 아이콘이 표시된다
- [ ] 호버 시 leftArea가 넓어지면 "로그아웃" 텍스트가 함께 보인다
- [ ] 전원 아이콘 클릭 → 로그인 초기 화면(Lock Screen)으로 이동한다
- [ ] 로그아웃 후 열려있던 프로그램/메뉴 상태가 모두 초기화된다
- [ ] 로그인 화면에서 다시 데스크탑으로 진입 가능하다
- [ ] 기존 시작 메뉴 기능(소개, 프로젝트, 기술스택)에 영향 없다

---

## Phase 1: 전원 아이콘 SVG 생성 및 스토어 reset 액션 추가

**입력**: 없음 (선행 조건 없음)

**작업 내용**:
- [ ] `src/asset/images/icons/power.svg` — 전원 아이콘 SVG 파일 생성
- [ ] `src/store/runningProgramsStore.ts` — `reset` 액션 추가 (byId, order, activeId, zIndexCounter 초기화)

**완료 조건**: power.svg 파일이 존재하고, `runningProgramsStore.getState().reset()`이 스토어를 초기 상태로 되돌린다.

## Phase 2: StatusBar UI에 전원 아이콘 배치

**입력**: Phase 1 완료 (power.svg 존재, reset 액션 사용 가능)

**작업 내용**:
- [ ] `src/features/statusbar/components/StatusBar.style.ts` — `leftArea_bottom` 스타일 추가 (상단 구분선 border)
- [ ] `src/features/statusbar/components/StatusBar.tsx` — leftArea 하단에 `leftArea_bottom` div + LeftAreaBox(전원 아이콘) 렌더링, `onLogout` prop 추가
- [ ] `src/features/statusbar/StatusBar.tsx` — `onLogout` prop 수신 및 View에 전달

**완료 조건**: 시작 메뉴 열었을 때 leftArea 최하단에 전원 아이콘이 보이고, 호버 시 "로그아웃" 텍스트가 표시된다.

## Phase 3: 로그아웃 핸들러 연결

**입력**: Phase 2 완료 (UI에 전원 아이콘 배치됨, onLogout prop 체인 완성)

**작업 내용**:
- [ ] `src/pages/DesktopPage/shells/StatusBarShell.tsx` — `handleLogout` 구현 (runningProgramsStore.reset + uiStore.closeAllMenus + navigate) 및 StatusBar에 전달

**완료 조건**: 전원 아이콘 클릭 → 로그인 초기 화면 이동, 재진입 시 프로그램/메뉴 상태 깨끗함.

### 수동 검증
- [ ] 시작 메뉴 열기 → leftArea 최하단에 전원 아이콘 확인
- [ ] leftArea 호버 → 넓어지면서 "로그아웃" 텍스트 표시 확인
- [ ] 전원 아이콘 클릭 → Lock Screen(드래그 화면)으로 이동 확인
- [ ] Lock Screen → 언락 → 로그인 → 데스크탑 재진입 확인
- [ ] 재진입 후 이전에 열었던 프로그램 창이 없는지 확인
- [ ] 시작 메뉴의 기존 기능(소개 클릭, 프로젝트 클릭, 기술스택 클릭) 정상 동작 확인
