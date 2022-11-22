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
            (item) => item.department === "금오공과대학교 컴퓨터공학과 학생회"
        ),
    },
    {
        name: "(주) 아라온소프트",
        type: "FOLDER",
        folderCnt: projectDatas.filter(
            (item) => item.department === "(주) 아라온소프트"
        ).length,
        contents: projectDatas.filter(
            (item) => item.department === "(주) 아라온소프트"
        ),
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
        name: "구글",
        type: "BROWSER",
        icon: imgChrome,
        parent: "내컴퓨터",
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
        name: "구알맛 / 구알맛 오너즈",
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

export const fileList = [
    {
        name: "root",
        type: "FOLDER",
        icon: "",
        route: "/root",
        contents: [
            {
                name: "프로젝트",
                type: "FOLDER",
                icon: imgProjectList,
                route: "/root/project",
                contents: [
                    {
                        name: "금오공과대학교 셈틀꾼",
                        type: "FOLDER",
                        contents: projectDatas.filter(
                            (item) =>
                                item.department === "금오공과대학교 셈틀꾼"
                        ),
                        route: "/root/project/semtle",
                    },
                    {
                        name: "금오공과대학교 컴퓨터공학과 학생회",
                        type: "FOLDER",
                        contents: projectDatas.filter(
                            (item) =>
                                item.department ===
                                "금오공과대학교 컴퓨터공학과 학생회"
                        ),
                        route: "/root/project/computer_science_group",
                    },
                    {
                        name: "(주) 아라온소프트",
                        type: "FOLDER",
                        contents: projectDatas.filter(
                            (item) => item.department === "(주) 아라온소프트"
                        ),
                        route: "/root/project/araonsoft",
                    },
                ],
            },
            {
                name: "기술스택",
                type: "FOLDER",
                icon: imgTechStack,
                route: "/root/techstack",
                contents: [
                    {
                        name: "MAIN_TECH",
                        type: "FOLDER",
                        contents: techStack,
                        route: "/root/techstack/main_tech",
                    },
                    {
                        name: "SUB_TECH",
                        type: "FOLDER",
                        contents: techStack_sub,
                        route: "/root/techstack/sub_tech",
                    },
                ],
            },
            {
                name: "구글",
                type: "BROWSER",
                icon: imgChrome,
            },
        ],
    },
];
