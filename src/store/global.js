import { atom } from "recoil";
import { directory } from "../Common/data";

// 시간정보
export const rc_global_year = atom({
    key: "rc_global_year",
    default: null,
});

export const rc_global_month = atom({
    key: "rc_global_month",
    default: null,
});

export const rc_global_day = atom({
    key: "rc_global_day",
    default: null,
});

export const rc_global_date = atom({
    key: "rc_global_date",
    default: null,
});

export const rc_global_hour = atom({
    key: "rc_global_hour",
    default: null,
});

export const rc_global_min = atom({
    key: "rc_global_min",
    default: null,
});

export const rc_global_sec = atom({
    key: "rc_global_sec",
    default: null,
});

export const rc_global_timeline = atom({
    key: "rc_global_timeline",
    default: null,
});

// 화면 밝기
export const rc_global_DisplayLight = atom({
    key: "rc_global_DisplayLight",
    default: 100,
});

/*
data에 있는 directory 정보는 추가,제거 용.

data의 directory를 이용해서 트리형, route가 추가된 데이터 를 만든다.
*/

// 전체 파일 구조 (부모/자식 관계를 가지는 데이터로 변경)
export const rc_global_Directory_Tree = atom({
    key: "rc_global_Directory_Tree",
    default: {},
});

// 전체 파일 구조(원본 정보에 경로 정보가 추가된 데이터)
// recoil의 데이터를 실제로 사용한다.
export const rc_global_Directory_List = atom({
    key: "rc_global_Directory_List",
    default: directory,
});
