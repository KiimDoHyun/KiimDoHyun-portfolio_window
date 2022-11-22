import React, { useMemo, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import StatusBar from "../../Component/TaskBar/StatusBar";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";
import imgReact from "../../asset/images/icons/react.png";
import imgJS from "../../asset/images/icons/javascript.png";
import imgAraon from "../../asset/images/icons/araon_logo_noText.png";
import imgKit from "../../asset/images/icons/logo_kit.jpg";
import imgOne from "../../asset/images/icons/number_one.png";
import imgUser from "../../asset/images/icons/user.png";
import useActiveProgram from "../../hooks/useActiveProgram";
import { rc_global_Directory_Tree } from "../../store/global";

const StatusBarContainer = () => {
    const [active, setActive] = useRecoilState(rc_taskbar_statusBar_active);
    const Directory_Tree = useRecoilValue(rc_global_Directory_Tree);

    const projectDatas = useMemo(() => {
        if (Object.keys(Directory_Tree).length < 1) {
            return [];
        }
        return [
            ...Directory_Tree["금오공과대학교 셈틀꾼"],
            ...Directory_Tree["금오공과대학교 컴퓨터공학과 학생회"],
            ...Directory_Tree["(주)아라온소프트"],
        ];
    }, [Directory_Tree]);

    const techStack_main = useMemo(() => {
        if (Object.keys(Directory_Tree).length < 1) {
            return [];
        }
        return [...Directory_Tree["MAIN_TECH"]];
    }, [Directory_Tree]);

    const techStack_sub = useMemo(() => {
        if (Object.keys(Directory_Tree).length < 1) {
            return [];
        }
        return [...Directory_Tree["SUB_TECH"]];
    }, [Directory_Tree]);

    const [activeLeftArea_Detail, setActiveLeftArea_Detail] = useState(false);
    const activeLeftArea_timer = useRef(null);
    const [statusBar_LeftArea_Items] = useState([
        {
            img: imgUser,
            text: "Front-End 김도현",
        },
        {
            img: imgReact,
            text: "리액트",
        },
        {
            img: imgJS,
            text: "자바스크립트",
        },
        {
            img: imgAraon,
            text: "아라온소프트 재직중",
        },
        {
            img: imgOne,
            text: "경력 1년차 주니어",
        },
        {
            img: imgKit,
            text: "금오공과대학교 졸업",
        },
    ]);

    // const [programList, setProgramList] = useRecoilState(
    //     rc_program_programList
    // );
    // const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);
    // const setActiveProgram = useSetRecoilState(rc_program_activeProgram);

    // 마우스 왼쪽 영역 hover in
    const onMouseEnter = useCallback(() => {
        activeLeftArea_timer.current = setTimeout(
            () => setActiveLeftArea_Detail(true),
            500
        );
    }, [activeLeftArea_timer]);

    // 마우스 왼쪽 영역 hover out
    const onMouseLeave = useCallback(() => {
        clearTimeout(activeLeftArea_timer.current);
        setActiveLeftArea_Detail(false);
    }, [activeLeftArea_timer]);

    // 소개 영역 아이템 클릭 (활성화)
    const activeProgram = useActiveProgram();

    const onClickBox = useCallback(
        (item) => {
            activeProgram(item);
            setActive(false);
        },
        [activeProgram, setActive]
    );

    const propDatas = {
        active,
        activeLeftArea_Detail,
        statusBar_LeftArea_Items,

        projectDatas,
        techStack_main,
        techStack_sub,

        onMouseEnter,
        onMouseLeave,
        onClickBox,
    };
    return <StatusBar {...propDatas} />;
};

export default StatusBarContainer;
