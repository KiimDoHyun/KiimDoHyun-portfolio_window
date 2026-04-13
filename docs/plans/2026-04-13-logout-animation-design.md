# 로그아웃 애니메이션

## 배경

시작 메뉴 로그아웃 기능(feat/statusbar-logout)이 구현된 상태에서, 전원 아이콘 클릭 시 즉시 화면 전환되는 것이 어색하다. 실제 Windows OS처럼 화면이 어두워지면서 "로그아웃 중..." 텍스트가 잠깐 표시된 뒤 로그인 화면으로 전환되는 애니메이션을 추가한다.

## 설계 규칙

- Shell에 로직(타이머, 상태 전환)을 둔다. 오버레이 컴포넌트는 props만 받는다.
- 매직 넘버를 상수로 분리하여 튜닝 가능하게 한다.
- 오버레이는 DesktopPage 안에 위치하여, navigate 시 자연스럽게 unmount된다.

## 아키텍처

### 동작 흐름

```
[전원 아이콘 클릭]
  → setIsLoggingOut(true) → 오버레이 페이드인 (LOGOUT_FADE_DURATION_MS)
  → setTimeout(LOGOUT_DELAY_MS) 후
    → runningProgramsStore.reset()
    → closeAllMenus()
    → navigate("/window/login", { replace: true })
```

### 상수

```ts
const LOGOUT_DELAY_MS = 1000;         // 오버레이 체류 시간
const LOGOUT_FADE_DURATION_MS = 400;  // 페이드인 애니메이션 시간
```

### 컴포넌트 구조

- `LogoutOverlay` — 풀스크린 검정 오버레이 + 중앙 "로그아웃 중..." 텍스트
  - props: `visible: boolean`
  - visible=true일 때 opacity 0→1 페이드인 (CSS transition)
  - z-index: 모든 요소 위 (99999)

### 수정 대상 파일

| 파일 | 변경 |
|------|------|
| `src/pages/DesktopPage/components/LogoutOverlay.tsx` | 신규 — 풀스크린 오버레이 컴포넌트 |
| `src/pages/DesktopPage/components/LogoutOverlay.style.ts` | 신규 — 오버레이 스타일 |
| `src/pages/DesktopPage/shells/StatusBarShell.tsx` | 수정 — isLoggingOut 상태 + 타이머 로직, onLogout에서 즉시 navigate 대신 애니메이션 트리거 |
| `src/pages/DesktopPage/DesktopPage.tsx` | 수정 — LogoutOverlay 렌더링 추가 |

### 데이터 흐름

StatusBarShell이 `isLoggingOut` 상태와 `handleLogout`을 소유한다.
- `handleLogout`: `isLoggingOut = true` 설정 → `setTimeout`으로 지연 후 스토어 초기화 + navigate
- `isLoggingOut`을 DesktopPage까지 올려서 LogoutOverlay에 전달하거나, StatusBarShell이 직접 LogoutOverlay를 렌더링한다.

**선택: StatusBarShell → props로 DesktopPage에 전달**
- StatusBarShell은 이미 DesktopPage 안에서 렌더링되므로, isLoggingOut 상태를 위로 올리거나 콜백 패턴을 사용한다.
- 가장 단순한 방법: StatusBarShell 내부에서 LogoutOverlay를 직접 렌더링 (Portal 불필요 — fixed position이면 DOM 위치 무관)

## 성공 기준 (Definition of Done)

- [ ] 전원 아이콘 클릭 시 화면이 검정으로 페이드인된다
- [ ] 페이드인 완료 후 중앙에 "로그아웃 중..." 텍스트가 보인다
- [ ] ~1초 후 로그인 화면으로 전환된다
- [ ] 체류 시간/페이드 시간이 상수로 분리되어 있다
- [ ] 기존 로그아웃 기능(스토어 초기화, 메뉴 닫기)에 영향 없다

---

## Phase 1: LogoutOverlay 컴포넌트 생성

**입력**: 없음

**작업 내용**:
- [ ] `src/pages/DesktopPage/components/LogoutOverlay.style.ts` — 풀스크린 오버레이 스타일 (fixed, z-index 9999, 검정 배경, 페이드 transition)
- [ ] `src/pages/DesktopPage/components/LogoutOverlay.tsx` — visible prop에 따라 페이드인/아웃하는 오버레이 + 중앙 "로그아웃 중..." 텍스트

**완료 조건**: LogoutOverlay에 visible=true 전달 시 검정 오버레이가 페이드인되며 중앙 텍스트가 표시된다.

## Phase 2: StatusBarShell에 애니메이션 로직 연결

**입력**: Phase 1 완료

**작업 내용**:
- [ ] `src/pages/DesktopPage/shells/StatusBarShell.tsx` — handleLogout을 애니메이션 트리거 방식으로 변경 (isLoggingOut 상태 + setTimeout 후 스토어 초기화 + navigate), 상수 LOGOUT_DELAY_MS / LOGOUT_FADE_DURATION_MS 분리
- [ ] `src/pages/DesktopPage/shells/StatusBarShell.tsx` — LogoutOverlay 렌더링 추가

**완료 조건**: 전원 아이콘 클릭 → 오버레이 페이드인 → ~1초 후 로그인 화면 전환.

### 수동 검증
- [ ] 전원 아이콘 클릭 → 화면이 서서히 검정으로 변하는지 확인
- [ ] "로그아웃 중..." 텍스트가 중앙에 표시되는지 확인
- [ ] ~1초 후 로그인 화면(Lock Screen)으로 이동하는지 확인
- [ ] 로그인 → 데스크탑 재진입 후 프로그램 창이 깨끗한지 확인
- [ ] 기존 시작 메뉴 기능 정상 동작 확인
