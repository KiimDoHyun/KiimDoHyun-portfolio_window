import imgReact from "../asset/images/icons/react.png";
import imgJS from "../asset/images/icons/javascript.png";
import imgRedux from "../asset/images/icons/redux.png";
import imgRecoil from "../asset/images/icons/recoil.png";
import imgNode from "../asset/images/icons/nodejs.png";
import imgHTML from "../asset/images/icons/html.png";
import imgCSS from "../asset/images/icons/css.png";
import imgStyledComponent from "../asset/images/icons/styledcomponent.png";
import imgGithub from "../asset/images/icons/github.png";
import imgVuetify from "../asset/images/icons/vuetify.png";

import imgVue from "../asset/images/icons/vue.png";
import imgPython from "../asset/images/icons/python.png";
import imgBootstrap from "../asset/images/icons/bootstrap.png";
import imgTailwind from "../asset/images/icons/tailwind-css.png";

import imgProjectList from "../asset/images/icons/projectList.png";
import imgTechStack from "../asset/images/icons/techStack.png";
import imgChrome from "../asset/images/icons/chrome.png";

import monitor from "../asset/images/icons/monitor.png";

import araonframe1 from "../asset/images/project/araonframework/araonframe1.png";
import araonframe2 from "../asset/images/project/araonframework/araonframe2.png";

import lhws1 from "../asset/images/project/lhws/lhws1.png";

import flea1 from "../asset/images/project/fleamarket/flea0.png";
import flea2 from "../asset/images/project/fleamarket/flea1.png";
import flea3 from "../asset/images/project/fleamarket/flea2.png";

import fems1 from "../asset/images/project/fems/fems1.png";
import fems2 from "../asset/images/project/fems/fems2.png";
import fems3 from "../asset/images/project/fems/fems3.png";
import fems4 from "../asset/images/project/fems/fems4.png";

/**************************************
                프로젝트 경력
***************************************/
export const projectDatas = [
    {
        projectName: "셈틀꾼 홈페이지 제작",
        projectDesc:
            "학과 학술동아리(컴퓨터공학과 학술 동아리) 셈틀꾼의 홈페이지 제작",
        projectImages: [],
        projectTerm: ["2020.07", "2020.08", "1개월"],
        projectType: "동아리 프로젝트",
        projectReulst: [
            {
                title: "웹 개발자 커리어 시작",
                content:
                    "처음으로 참여한 웹 프로젝트로 Vue.js 를 이용한 프론트엔드를 담당해서 개발함. 약 10명으로 구성된 프론트엔드, 백엔드 개발자와 협업을 진행한 프로젝트.",
            },
            {
                title: "웹 개발자 커리어 시작",
                content:
                    "처음으로 참여한 웹 프로젝트로 Vue.js 를 이용한 프론트엔드를 담당해서 개발함. 약 10명으로 구성된 프론트엔드, 백엔드 개발자와 협업을 진행한 프로젝트.",
            },
        ],
        role: ["프론트엔드 개발"],
        department: "금오공과대학교 셈틀꾼",
        stack: [
            { name: "Vue", img: imgVue },
            { name: "Vuetify", img: imgVuetify },
        ],
        url: "",
    },
    {
        projectName: "벼룩시장 프로젝트",
        projectDesc: "교내 중고 책 거래(벼룩시장)의 온라인 플랫폼 제작 및 운영",
        projectImages: [flea1, flea2, flea3],
        projectTerm: ["2021.02", "2021.09", "7개월"],
        projectType: "교내 활동",
        projectReulst: [
            {
                title: "첫 서비스 제작",
                content:
                    "학기 초 총학생회 주도로 실시하는 중고책 거래를 코로나로 인해 대면으로 진해할 수 없게 되어 비대면으로 진행하기 위한 플랫폼 제작을 의뢰받아 진행한 프로젝트. 컴퓨터 소프트웨어 공학과에서 백엔드, 컴퓨터공학과에서 프론트엔드를 담당해서 개발했고, 2개 학기동안 운영 및 유지보수를 진행함.",
            },
            {
                title: "비대면으로 진행된 의사소통",
                content:
                    "셈틀꾼 홈페이지 제작 프로젝트와 달리 모든 개발자들 끼리의 소통 및 회의는 모두 비대면으로 진행했음. 비대면으로 진행한 프로젝트였던 만큼 백엔드 개발자와 소통 부족문제가 발생했고, 이를 계기로 프로젝트 진행과정에서 소통을 중요하게 생각하게되었다.",
            },
        ],
        role: ["프론트엔드 개발"],
        department: "금오공과대학교 컴퓨터공학과 학생회",
        stack: [
            { name: "Vue", img: imgVue },
            { name: "Vuetify", img: imgVuetify },
        ],
        url: "https://kit-fleamarket.developerpsy.com/",
    },
    {
        projectName: "구알맛-구알맛 오너즈",
        projectDesc: "구미 맛집 활성화를 위한 프로젝트",
        projectImages: [],
        projectTerm: ["2021.09", "2021.12", "4개월"],
        projectType: "회사 프로젝트",
        projectReulst: [
            {
                title: "실무 디자이너, 기획자와의 첫 협업",
                content:
                    "(주) 아라온소프트에서 실습생 신분으로 참여한 프로젝트. 기획자, 디자이너, 개발자 각 입장에서 구현할 화면을 바라보는 시각이 달랐고, 개발자로서 의견을 제시해야할 회의가 많았기 때문에 적극적인 의견제시및 의사소통 능력을 향상시킬수 있는 계기가 되었다.",
            },
            {
                title: "코드관리의 필요성",
                content:
                    "비동기 작업에 대한 이해부족, 상태관리 개념희박, 디자인 패턴에 대한 개념이 부족한 상태로 완료했던 프로젝트였고, 앞으로 실무에서 진행할 프로젝트의 퀄리티를 향상시키기 위해 앞서 얘기한 부분들에 대한 공부와 리액트의 원리, 자바스크립트에 대한 공부의 필요성을 느낀 프로젝트였다.",
            },
        ],
        role: ["프론트엔드 개발"],
        department: "(주) 아라온소프트",
        stack: [{ name: "React", img: imgReact }],
        url: "",
    },
    {
        projectName: "LHWS (집클릭)",
        projectDesc: "LH 공공기관 전세임대 지원 솔루션",
        projectImages: [lhws1],
        projectTerm: ["2021.12", "2022.03", "4개월"],
        projectType: "회사 프로젝트",
        projectReulst: [
            {
                title: "코드관리 시작",
                content:
                    "구알맛 프로젝트에서 부족했던 비동기 작업, 상태관리, 디자인패턴이 적용된 첫 프로젝트. 프로젝트 종료 후 기존에 적용했던 방식에 대해 자체적으로 피드백을 진행하고 개선했다.",
            },
            {
                title: "상태관리",
                content:
                    "Redux는 dispatch를 통해서만 상태가 변경되기 때문에 상태를 추적하기 쉽고, 관심사의 분리가 명확하며, 하위 컴포넌트로 state를 계속 전달해야하는 번거로움을 해결할 수 있는 장점을 가지고있지만, action 정의, action 에 따라 실행될 reducer 정의, action 타입을 반환할 함수의 정의가 하나의 state에 대해 하나의 변경에 대해서 정의되어야 하는점이 번거롭다고 판단해서 동일한 기능을 수행할수 있고, 사용이 단순한 Recoil로 변경을 추진함.",
            },
            {
                title: "비동기 작업",
                content:
                    "Redux-saga를 이용한 비동기 통신은 하나의 페이지에서 발생하는 비동기 통신을 모아서 동기적으로 수행할 수 있고, 성공/실패 여부를 판단할 수 있어 기능이 강력하다고 생각했지만, 자바스크립트의 제네레이터 문법에 대해 이해해야 한다는점, Redux-saga의 사용법에 대해 이해해야 한다는점, Redux와 마찬가지로 기본 코드량이 많다는점 때문에 자바스크립트의 Promise로 관리하기로 변경을 추진하고, 비동기 작업에 대해 공부한 내용을 팀원들과 공유함.",
            },
            {
                title: "디자인 패턴",
                content:
                    "화면의 기능구현과 출력을 구분한 Presentation and Container 패턴 도입",
            },
        ],
        role: ["프론트엔드 개발", "시스템 설계", "디자인"],
        department: "(주) 아라온소프트",
        stack: [
            { name: "React", img: imgReact },
            { name: "Redux", img: imgRedux },
            { name: "Redux-saga", img: null },
            { name: "styled-components", img: imgStyledComponent },
        ],
        url: "https://www.ezip.co.kr/ ",
    },
    {
        projectName: "Araon React Framework",
        projectDesc:
            "React 베이스 + DevExpress 를 이용한 대시보드형 자체 웹 프레임워크 제작",
        projectImages: [araonframe1, araonframe2],
        projectTerm: ["2022.05", "2022.07", "3개월"],
        projectType: "회사 프로젝트",
        projectReulst: [
            {
                title: "최적화 고려",
                content:
                    "리액트 컴포넌트의 렌더링을 최소화 하기 위해서 렌더링 방식, 하위 컴포넌트로 props 를 전달했을 때 props의 비교 방식과 리렌더링을 방지하는 방법. 리액트에서 사용되는 자바스크립트 변수의 할당과 비교 방식에 대해 고민하고, 공부하는 계기가된 프로젝트.",
            },
        ],
        role: ["프론트엔드 개발", "시스템 설계", "디자인"],
        department: "(주) 아라온소프트",
        stack: [
            { name: "React", img: imgReact },
            { name: "Recoil", img: imgRecoil },
            { name: "styled-components", img: imgStyledComponent },
        ],
        url: "",
    },
    {
        projectName: "SBL FEMS",
        projectDesc:
            "삼성 바이오로직스의 공장 내부 데이터를 시각화 하기 위한 프로젝트",
        projectImages: [fems1, fems2, fems3, fems4],
        projectTerm: ["2022.07", "2022.09", "3개월"],
        projectType: "회사 프로젝트",
        projectReulst: [
            {
                title: "기존 디자인 패턴 수정",
                content:
                    "화면의 기능이 많아지는 경우, 혹은 복잡해지는 경우 하나의 컨테이너 하위에 여러 컴포넌트가 존재하게 되고 이는 컨테니어에서의 렌더링이 하위 모든 컴포넌트의 렌더링에 영향을 주게된다. 이를 개선하기 위해 React.memo를 모두 적용하는 대신, 하나의 페이지는 하나의 컨테이너만 가지는 구조에서 기능별로 구분된 여러 컨테이너를 가지도록 변경하고, 각 컨테이너는 하나의 컴포넌트만 가지도록 해서 컴포넌트끼리의 불필요한 리렌더링을 방지함. 구조 변경을 통해 React.memo를 사용했을때 와 동일한 효율을 기대할 수 있었음.",
            },
        ],
        role: ["프론트엔드 개발"],
        department: "(주) 아라온소프트",
        stack: [
            { name: "React", img: imgReact },
            { name: "Recoil", img: imgRecoil },
            { name: "styled-components", img: imgStyledComponent },
        ],
        url: "",
    },
    {
        projectName: "SNS 로그인 분석",
        projectDesc:
            "SNS 로그인에 대한 프론트와 백엔드의 기술 확보를 위한 연구 개발업무. 프론트엔드, 백엔드 개발 후 관련 기술 교육",
        projectImages: [],
        projectTerm: ["2022.09", "2022.09", "1주일"],
        projectType: "기술 연구/개발",
        projectReulst: [
            {
                title: "기술확보",
                content:
                    "자체 개발중인 서비스와 추후 진행될 프로젝트에 적용될 SNS 로그인기술 확보를 위해 React기반의 프론트엔드, Node.js 기반의 백엔드를 직접 구현.",
            },
        ],
        role: ["프론트엔드 개발", "백엔드 개발"],
        department: "(주) 아라온소프트",
        stack: [
            { name: "React", img: imgReact },
            { name: "Recoil", img: imgRecoil },
            { name: "styled-components", img: imgStyledComponent },
            { name: "Node.js", img: imgNode },
        ],
        url: "",
    },
    {
        projectName: "SBL EDM",
        projectDesc: "삼성바이오로직스 업무 지원 시스템 구축을 위한 프로젝트",
        projectImages: [],
        projectTerm: ["2022.10", "진행중", "진행중"],
        projectType: "회사 프로젝트",
        projectReulst: [
            {
                title: "",
                content: "",
            },
        ],
        role: ["프론트엔드 개발"],
        department: "(주) 아라온소프트",
        stack: [
            { name: "React", img: imgReact },
            { name: "Recoil", img: imgRecoil },
            { name: "styled-components", img: imgStyledComponent },
        ],
        url: "",
    },
];

/**************************************
                전체 파일 구조
***************************************/
//
/*
root
프로젝트, 기술스택, 구글, 소개(내컴퓨터)

파일 정보
name: 파일 이름
type: 파일 유형
icon: 파일 아이콘
parent: 부모

1. 배열에 파일 추가
2. 배열정보를 이용해 트리 구조 생성 (부모: [자식1, 자식2])
 -  마운트 될때 1회만 진행.
 - 생성된 트리구조는 recoil에 저장.
 
 ex) 바탕화면 컨텐츠를 보여줄땐 부모가 root 인 컨텐츠만

 바탕화면에서 특정 폴더 클릭 시

 해당 폴더의 위치까지 경로를 찾는다 (DFS)

 해당 폴더 내용을 보여준다. 내용? 해당 폴더를 부모로 하는 모든 컨텐츠

 폴더 내부에서 특정 폴더를 클릭하면? 클릭한 폴더를 부모로 하는 모든 컨텐츠
 -> 트리구조에서 타겟 폴더를 키로 가지는 컨텐츠를 찾으면 됨.

*/
export const directory = [
    {
        name: "root",
        type: "FOLDER",
        icon: "",
        parent: "KDH",
    },
    {
        name: "내컴퓨터",
        type: "FOLDER",
        icon: monitor,
        parent: "root",
    },
    {
        name: "프로젝트",
        type: "FOLDER",
        icon: imgProjectList,
        parent: "root",
    },
    {
        name: "기술스택",
        type: "FOLDER",
        icon: imgTechStack,
        parent: "root",
    },
    {
        name: "구글",
        type: "BROWSER",
        icon: imgChrome,
        parent: "root",
    },
    {
        name: "(주)아라온소프트",
        type: "FOLDER",
        icon: "",
        parent: "프로젝트",
    },
    {
        name: "금오공과대학교 셈틀꾼",
        type: "FOLDER",
        icon: "",
        parent: "프로젝트",
    },
    {
        name: "금오공과대학교 컴퓨터공학과 학생회",
        type: "FOLDER",
        icon: "",
        parent: "프로젝트",
    },
    {
        name: "MAIN_TECH",
        type: "FOLDER",
        icon: "",
        parent: "기술스택",
    },
    {
        name: "SUB_TECH",
        type: "FOLDER",
        icon: "",
        parent: "기술스택",
    },
    {
        name: "TEST_TECH",
        type: "FOLDER",
        icon: "",
        parent: "기술스택",
    },
    {
        name: "구알맛-구알맛 오너즈",
        type: "DOC",
        icon: "",
        parent: "(주)아라온소프트",
    },
    {
        name: "LHWS (집클릭)",
        type: "DOC",
        icon: "",
        parent: "(주)아라온소프트",
    },
    {
        name: "Araon React Framework",
        type: "DOC",
        icon: "",
        parent: "(주)아라온소프트",
    },
    {
        name: "SBL FEMS",
        type: "DOC",
        icon: "",
        parent: "(주)아라온소프트",
    },
    {
        name: "SNS 로그인 분석",
        type: "DOC",
        icon: "",
        parent: "(주)아라온소프트",
    },
    {
        name: "SBL EDM",
        type: "DOC",
        icon: "",
        parent: "(주)아라온소프트",
    },
    {
        name: "셈틀꾼 홈페이지 제작",
        type: "DOC",
        icon: "",
        parent: "금오공과대학교 셈틀꾼",
    },
    {
        name: "벼룩시장 프로젝트",
        type: "DOC",
        icon: "",
        parent: "금오공과대학교 컴퓨터공학과 학생회",
    },
    {
        icon: imgReact,
        name: "React.js",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgJS,
        name: "자바스크립트",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgRedux,
        name: "리덕스",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgRecoil,
        name: "리코일",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgNode,
        name: "노드js",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgHTML,
        name: "HTML",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgCSS,
        name: "CSS",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgStyledComponent,
        name: "styled-component",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgGithub,
        name: "Github",
        type: "IMAGE",
        parent: "MAIN_TECH",
    },
    {
        icon: imgVue,
        name: "Vue.js",
        type: "IMAGE",
        parent: "SUB_TECH",
    },
    {
        icon: imgPython,
        name: "파이썬",
        type: "IMAGE",
        parent: "SUB_TECH",
    },
    {
        icon: imgBootstrap,
        name: "부트스트랩",
        type: "IMAGE",
        parent: "SUB_TECH",
    },
    {
        icon: imgTailwind,
        name: "tailwind-css",
        type: "IMAGE",
        parent: "SUB_TECH",
    },
];
