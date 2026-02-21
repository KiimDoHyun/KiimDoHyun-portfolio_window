# 잠금(Lock) 기능 설계

## 목표

시작 메뉴(StatusBar) 왼쪽 영역 하단에 잠금 버튼을 추가하여, 클릭 시 페이드아웃 후 로그인 화면으로 이동하는 기능 구현.

## UI 배치

- StatusBar 왼쪽 영역(`LeftArea`) 바닥에 고정 배치
- 접힌 상태: 전원 아이콘만 표시
- 펼친 상태: 전원 아이콘 + "잠금" 텍스트

## 동작 흐름

1. 사용자가 잠금 버튼 클릭
2. StatusBar 닫기 (`rc_taskbar_statusBar_active = false`)
3. DesktopPage 전체 페이드아웃 (opacity 1→0, 400ms)
4. 페이드아웃 완료 후 `/window/login`으로 navigate (`replace: true`)
5. LoginPage 잠금화면(`isUnlocked=false`) 표시

## 상태 관리

- `StatusBarContainer`에 `onLock` 콜백 → DesktopPage로 전달
- DesktopPage에 `isLocking` 로컬 상태 추가 (페이드아웃 트리거)

## 영향 파일

- **수정**: `StatusBarContainer.tsx`, `StatusBar.tsx` (컴포넌트), `DesktopPage.tsx`
- **신규**: 전원 아이콘 (`6_common/components/icons/Power.tsx`)
