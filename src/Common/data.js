import imgReact from "../asset/images/icons/react.png";
import imgJS from "../asset/images/icons/javascript.png";
import imgRedux from "../asset/images/icons/redux.png";
import imgRecoil from "../asset/images/icons/recoil.png";
import imgNode from "../asset/images/icons/nodejs.png";
import imgHTML from "../asset/images/icons/html.png";
import imgCSS from "../asset/images/icons/css.png";
import imgStyledComponent from "../asset/images/icons/styledcomponent.png";
import imgGithub from "../asset/images/icons/github.png";

import imgVue from "../asset/images/icons/vue.png";
import imgPython from "../asset/images/icons/python.png";
import imgBootstrap from "../asset/images/icons/bootstrap.png";
import imgTailwind from "../asset/images/icons/tailwind-css.png";

import imgProjectList from "../asset/images/icons/projectList.png";
import imgTechStack from "../asset/images/icons/techStack.png";
import imgChrome from "../asset/images/icons/chrome.png";

import monitor from "../asset/images/icons/monitor.png";

/**************************************
                프로젝트 경력
***************************************/
export const projectDatas = [
    {
        "프로젝트 명": "셈틀꾼 홈페이지 제작",
        "프로젝트 설명":
            "학과 학술동아리(컴퓨터공학과 학술 동아리) 셈틀꾼의 홈페이지 제작",
        icon: null,
        "프로젝트 기간": ["2020.07", "2020.08", "1개월"],
        "프로젝트 유형": "동아리 프로젝트",
        projectImages: [],
        역할: ["프론트엔드 개발"],
        "개발 부서": "금오공과대학교 셈틀꾼",
        "개발 스택": ["Vue", "Vuetify"],
        url: "",
        // memo: [
        //     {
        //         title: "제목1",
        //         content:
        //             "동아리의 모든 활동을 홈페이지에서 진행하고, 기록을 남기기 위한 프로젝트. (2020/10/1 부로 폐쇄.)",
        //     },
        // ],
    },
    {
        "프로젝트 명": "벼룩시장 프로젝트",
        "프로젝트 설명":
            "교내 중고 책 거래(벼룩시장)의 온라인 플랫폼 제작 및 운영",
        icon: null,
        "프로젝트 기간": ["2021.02", "2021.09", "7개월"],
        "프로젝트 유형": "교내 활동",
        역할: ["프론트엔드 개발"],
        "개발 부서": "금오공과대학교 컴퓨터공학과 학생회",
        "개발 스택": ["Vue", "Vuetify"],
        url: "https://kit-fleamarket.developerpsy.com/",
    },
    {
        "프로젝트 명": "구알맛-구알맛 오너즈",
        "프로젝트 설명": "구미 맛집 활성화를 위한 프로젝트",
        icon: null,
        "프로젝트 기간": ["2021.09", "2021.12", "4개월"],
        "프로젝트 유형": "회사 프로젝트",
        역할: ["프론트엔드 개발"],
        "개발 부서": "(주) 아라온소프트",
        "개발 스택": ["React"],
        url: "",
    },
    {
        "프로젝트 명": "LHWS (집클릭)",
        "프로젝트 설명": "LH 공공기관 전세임대 지원 솔루션",
        icon: null,
        "프로젝트 기간": ["2021.12", "2022.03", "4개월"],
        "프로젝트 유형": "회사 프로젝트",
        역할: ["프론트엔드 개발", "시스템 설계", "디자인"],
        "개발 부서": "(주) 아라온소프트",
        "개발 스택": ["React", "Redux", "Redux-saga", "styled-components"],
        url: "https://www.ezip.co.kr/ ",
    },
    {
        "프로젝트 명": "Araon React Framework",
        "프로젝트 설명":
            "React 베이스 + DevExpress 를 이용한 대시보드형 자체 웹 프레임워크 제작",
        icon: null,
        "프로젝트 기간": ["2022.05", "2022.07", "3개월"],
        "프로젝트 유형": "회사 프로젝트",
        역할: ["프론트엔드 개발", "시스템 설계", "디자인"],
        "개발 부서": "(주) 아라온소프트",
        "개발 스택": ["React", "Recoil", "styled-components"],
        url: "",
    },
    {
        "프로젝트 명": "SBL FEMS",
        "프로젝트 설명":
            "삼성 바이오로직스의 공장 내부 데이터를 시각화 하기 위한 프로젝트",
        icon: null,
        "프로젝트 기간": ["2022.07", "2022.09", "3개월"],
        "프로젝트 유형": "회사 프로젝트",
        역할: ["프론트엔드 개발"],
        "개발 부서": "(주) 아라온소프트",
        "개발 스택": ["React", "Recoil", "styled-components"],
        url: "",
    },
    {
        "프로젝트 명": "SNS 로그인 분석",
        "프로젝트 설명":
            "SNS 로그인에 대한 프론트와 백엔드의 기술 확보를 위한 연구 개발업무. 프론트엔드, 백엔드 개발 후 관련 기술 교육",
        icon: null,
        "프로젝트 기간": ["2022.09", "2022.09", "1주일"],
        "프로젝트 유형": "기술 연구/개발",
        역할: ["프론트엔드 개발", "백엔드 개발"],
        "개발 부서": "(주) 아라온소프트",
        "개발 스택": [
            "React",
            "Recoil",
            "styled-components",
            "Node.js",
            "JWT",
            "OAuth2.0",
        ],
        url: "",
    },
    {
        "프로젝트 명": "SBL EDM",
        "프로젝트 설명":
            "삼성바이오로직스 업무 지원 시스템 구축을 위한 프로젝트",
        icon: null,
        "프로젝트 기간": ["2022.10", "진행중", "진행중"],
        "프로젝트 유형": "회사 프로젝트",
        역할: ["프론트엔드 개발"],
        "개발 부서": "(주) 아라온소프트",
        "개발 스택": ["React", "Recoil", "styled-components"],
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
