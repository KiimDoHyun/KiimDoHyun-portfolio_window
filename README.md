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

# 개선

한 컴포넌트에 유틸과 스타일이 모두 담겨있음
-> 분리한다

Recoil 을 최 상단 컴포넌트에서도 사용한다 + useState 처럼 사용하고 있다
-> 분리한다
-> 구조를 개선하면서 불필요한 Recoil 을 제거한다

Container 에서 기능을, Component 에서 화면을 그리고 있음
-> 기능단위로 분리한다
-> Container 가 너무 크다

1. 바탕화면
2. 작업 표시줄
    - 시작 버튼
    - 활성화중인 프로그램 리스트
    - 숨김 아이콘 표시
    - 시간
    - 알림
    - 모든 화면 닫기
      (나열된 순서대로 작업 표시줄에 표시)

구조를 개선하되 하나의 컴포넌트는 하나의 기능을 담당하는 방향으로 개선한다

리팩토링 브랜치에서 작업한다
리팩토링 브랜치에서 단계별로 브랜치를 생성해서 작업한다.

# 기능 파악

1. 배경화면 아이콘 클릭
2. 활성화 된 프로그램 클릭
3. 시작 버튼 클릭
4. 활성화된 프로그램 클릭
5. 비 활성화된 프로그램 클릭
6. 숨김 아이콘 클릭
7. 시간 클릭
8. 알림 클릭

목표
컴포넌트 추상화

-   공통화까지 (추후 테마변경, 색 변경시 일괄적용을 위함)

모듈 분리
타입스크립트 적용
코드스플리팅 적용

바탕화면

-   바탕화면 아이콘(프로그램) 표시
-   프로그램 정보 수정
-   위치, 이름, 아이콘 (특정 데이터 내부 값 변경)
-   추가 / 삭제 (데이터 구조 자체 변경)
-   배경화면 변경

작업 표시줄

-   시작
-   현재 프로그램들의 리스트 표시 (트리형태)
-   현재 실행중인(활성화된)프로그램 표시
-   시간 표시

프로그램

-   트리 구조
-   각 프로그램의 고유 아이디와 부모 아이디를 기준으로 트리구조를 생성한다.
-   최소화, 최대화, 위치 이동
-   폴더로 드래그시 위치 이동(데이터 구조 자체 변경)

프로그램 데이터를 누가 참조하는가
바탕화면

-   활성화되어있는 프로그램을 띄워야한다
-   바탕화면 위치에 있는 프로그램을 표시한다

작업표시줄

-   현재 활성화 중인 프로그램을 표시한다
-   기존 데이터에서 활성화된 데이터만 순서대로 추가한다

프로그램 데이터는 어떤 형태들이 필요한가

1. 전체 구조를 알고 있는 데이터 (원본)
2. 현재 실행중인 프로그램 리스트 데이터

-   실행중인 프로그램을 지울수 있는 경로
    1. 각 프로그램의 닫기 버튼
    2. 작업표시줄에서 닫기
    3. 프로그램 제거

프로그램 정보는 json 으로 관리한다

최초 프로그램 실행 시 json -> 트리구조 데이터화
프로그램 변경발생시 수정한다.
-> 어디서든 접근가능하게 한다
파일에서도 디렉터리 구조를 볼 수 있어야 한다.
시작 메뉴에서 볼 수 있어야 한다
'검색' 할 때 해당 데이터에서 찾아야 한다
