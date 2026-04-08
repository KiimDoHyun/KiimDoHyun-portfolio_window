import React, { useMemo, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import StatusBarView from "./components/StatusBar";
import imgReact from "@images/icons/react.png";
import imgJS from "@images/icons/javascript.png";
import imgKit from "@images/icons/logo_kit.jpg";
import imgOne from "@images/icons/number_one.png";
import imgUser from "@images/icons/user.png";
import imgWhaTap from "@images/icons/WhaTap_vertical_logo.png";
import { useDesktopData } from "@pages/DesktopPage/useDesktopData";

type StatusBarProps = {
    active: boolean;
    onClose: () => void;
};

const StatusBar = ({ active, onClose }: StatusBarProps) => {
    const { directory, directoryTree: Directory_Tree } = useDesktopData();

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
            img: imgWhaTap,
            text: "와탭랩스 재직중",
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
    const { openProgram: activeProgram } = useDesktopData();

    const onClickBox = useCallback(
        (parentName: string) => {
            const found = directory.find(
                (findItem) => findItem.name === parentName
            );
            if (!found) return;
            activeProgram(found);
            onClose();
        },
        [directory, activeProgram, onClose]
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
    return <StatusBarView {...propDatas} />;
};

export default StatusBar;
