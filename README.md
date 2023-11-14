# !수정중

# 김도현 (프론트엔드 개발자) 포트폴리오 홈페이지

https://kiimdohyun.github.io/KiimDoHyun-portfolio_window/

# 기존 구조

MainPage

-   WindowContainer
    -   Window
    -   programList
-   TaskBarContainer
-   StatusBarContainer
-   TimebarContainer
-   InfoBarContainer
-   HiddenIcon

WindowContainer

-   바탕화면, 실행중인 프로그램을 띄울 화면
    -   Window
        -   배경화면, 아이콘을 띄우는 화면 담당
    -   programList
        -   현재 실행중인 프로그램이 담긴 배열 데이터

TaskBarContainer

-   하단 작업 표시 줄

StatusBarContainer

-하단 작업표시줄의 시작 버튼을 누르면 나타나는 시작 컴포넌트

TimebarContainer

-하단 작업표시줄의 시계를 누르면 나타나는 달력 컴포넌트

InfoBarContainer

-하단 작업표시줄의 알림버튼을 누르면(가장 우측 메세지 모양) 나타나는 컴포넌트 (커밋 이력)

HiddenIcon

-하단 작업표시줄의 숨겨진 아이콘 버튼을 누르면(화살표 모양) 나타나는 컴포넌트
