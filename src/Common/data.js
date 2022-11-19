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

/**************************************
                프로젝트 경력
***************************************/
export const projectDatas = [
    {
        name: "셈틀꾼 홈페이지 제작",
        desc: "학과 학술동아리(컴퓨터공학과 학술 동아리) 셈틀꾼의 홈페이지 제작",
        icon: null,
        projectStart: "2020.07",
        projectEnd: "2020.08",
        projectPeriod: "1개월",
        projectType: "동아리 프로젝트",
        position: ["프론트엔드 개발"],
        department: "금오공과대학교 셈틀꾼",
        stack: ["Vue", "Vuetify"],
        url: "",
    },
    {
        name: "벼룩시장 프로젝트",
        desc: "교내 중고 책 거래(벼룩시장)의 온라인 플랫폼 제작 및 운영",
        icon: null,
        projectStart: "2021.02",
        projectEnd: "2021.09",
        projectPeriod: "7개월",
        projectType: "교내 활동",
        position: ["프론트엔드 개발"],
        department: "금오공과대학교 컴퓨터공학과 학생회",
        stack: ["Vue", "Vuetify"],
        url: "https://kit-fleamarket.developerpsy.com/",
    },
    {
        name: "구알맛 / 구알맛 오너즈",
        desc: "구미 맛집 활성화를 위한 프로젝트",
        icon: null,
        projectStart: "2021.09",
        projectEnd: "2021.12",
        projectPeriod: "4개월",
        projectType: "회사 프로젝트",
        position: ["프론트엔드 개발"],
        department: "(주) 아라온소프트",
        stack: ["React"],
        url: "",
    },
    {
        name: "LHWS (집클릭)",
        desc: "LH 공공기관 전세임대 지원 솔루션",
        icon: null,
        projectStart: "2021.12",
        projectEnd: "2022.03",
        projectPeriod: "4개월",
        projectType: "회사 프로젝트",
        position: ["프론트엔드 개발", "시스템 설계", "디자인"],
        department: "(주) 아라온소프트",
        stack: ["React", "Redux", "Redux-saga", "styled-components"],
        url: "https://www.ezip.co.kr/ ",
    },
    {
        name: "Araon React Framework",
        desc: "React 베이스 + DevExpress 를 이용한 대시보드형 자체 웹 프레임워크 제작",
        icon: null,
        projectStart: "2022.05",
        projectEnd: "2022.07",
        projectPeriod: "3개월",
        projectType: "회사 프로젝트",
        position: ["프론트엔드 개발", "시스템 설계", "디자인"],
        department: "(주) 아라온소프트",
        stack: ["React", "Recoil", "styled-components"],
        url: "",
    },
    {
        name: "SBL FEMS",
        desc: "삼성 바이오로직스의 공장 내부 데이터를 시각화 하기 위한 프로젝트",
        icon: null,
        projectStart: "2022.07",
        projectEnd: "2022.09",
        projectPeriod: "3개월",
        projectType: "회사 프로젝트",
        position: ["프론트엔드 개발"],
        department: "(주) 아라온소프트",
        stack: ["React", "Recoil", "styled-components"],
        url: "",
    },
    {
        name: "SNS 로그인 분석",
        desc: "SNS 로그인에 대한 프론트와 백엔드의 기술 확보를 위한 연구 개발업무. 프론트엔드, 백엔드 개발 후 관련 기술 교육",
        icon: null,
        projectStart: "2022.09",
        projectEnd: "2022.09",
        projectPeriod: "1주일",
        projectType: "기술 연구/개발",
        position: ["프론트엔드 개발", "백엔드 개발"],
        department: "(주) 아라온소프트",
        stack: [
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
        name: "SBL EDM",
        desc: "삼성바이오로직스 업무 지원 시스템 구축을 위한 프로젝트",
        icon: null,
        projectStart: "2022.10",
        projectEnd: "진행중",
        projectPeriod: "진행중",
        projectType: "회사 프로젝트",
        position: ["프론트엔드 개발"],
        department: "(주) 아라온소프트",
        stack: ["React", "Recoil", "styled-components"],
        url: "",
    },
];

/**************************************
                사용 기술 스택
***************************************/
export const techStack = [
    {
        icon: imgReact,
        name: "React.js",
        type: "IMAGE",
    },
    {
        icon: imgJS,
        name: "자바스크립트",
        type: "IMAGE",
    },
    {
        icon: imgRedux,
        name: "리덕스",
        type: "IMAGE",
    },
    {
        icon: imgRecoil,
        name: "리코일",
        type: "IMAGE",
    },
    {
        icon: imgNode,
        name: "노드js",
        type: "IMAGE",
    },
    {
        icon: imgHTML,
        name: "HTML",
        type: "IMAGE",
    },
    {
        icon: imgCSS,
        name: "CSS",
        type: "IMAGE",
    },
    {
        icon: imgStyledComponent,
        name: "styled-component",
        type: "IMAGE",
    },
    {
        icon: imgGithub,
        name: "Github",
        type: "IMAGE",
    },
];

export const techStack_sub = [
    {
        icon: imgVue,
        name: "Vue.js",
        type: "IMAGE",
    },
    {
        icon: imgPython,
        name: "파이썬",
        type: "IMAGE",
    },
    {
        icon: imgBootstrap,
        name: "부트스트랩",
        type: "IMAGE",
    },
    {
        icon: imgTailwind,
        name: "tailwind-css",
        type: "IMAGE",
    },
];

/*
파일 유형
1. 폴더
2. 이미지
3. 텍스트와 이미지가 같이있는 pdf 형식
4. 내컴퓨터
*/

// 폴더
export const techFolderList = [
    {
        name: "MAIN_TECH",
        type: "FOLDER",
        folderCnt: techStack.length,
        contents: techStack,
    },
    {
        name: "SUB_TECH",
        type: "FOLDER",
        folderCnt: techStack_sub.length,
        contents: techStack_sub,
    },
];

/**************************************
                경력 (프로젝트 폴더의 폴더)
***************************************/
export const careerList = [
    {
        name: "금오공과대학교 셈틀꾼",
        type: "FOLDER",
        folderCnt: projectDatas.filter(
            (item) => item.department === "금오공과대학교 셈틀꾼"
        ).length,
        contents: projectDatas.filter(
            (item) => item.department === "금오공과대학교 셈틀꾼"
        ),
    },
    {
        name: "금오공과대학교 컴퓨터공학과 학생회",
        type: "FOLDER",
        folderCnt: projectDatas.filter(
            (item) => item.department === "금오공과대학교 컴퓨터공학과 학생회"
        ).length,
        contents: projectDatas.filter(
            (item) => item.department === "금오공과대학교 셈틀꾼"
        ),
    },
    {
        name: "(주) 아라온소프트",
        type: "FOLDER",
        folderCnt: projectDatas.filter(
            (item) => item.department === "(주) 아라온소프트"
        ).length,
        contents: projectDatas.filter(
            (item) => item.department === "금오공과대학교 셈틀꾼"
        ),
    },
];

/**************************************
                바탕화면 폴더 리스트
***************************************/
export const window_programList = [
    {
        key: "프로젝트",
        icon: imgProjectList,
        name: "프로젝트",
        type: "FOLDER",
        contents: careerList,
    },
    {
        key: "기술스택",
        icon: imgTechStack,
        name: "기술스택",
        type: "FOLDER",
        contents: techFolderList,
    },
    {
        key: "구글",
        icon: imgChrome,
        name: "구글",
        type: "BROWSER",
    },
];
