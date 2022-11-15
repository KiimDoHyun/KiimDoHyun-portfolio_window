import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useRecoilValue } from "recoil";
import StatusBar from "../../Component/TaskBar/StatusBar";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";
import imgReact from "../../asset/images/icons/react.png";
import imgJS from "../../asset/images/icons/javascript.png";
import imgAraon from "../../asset/images/icons/araon_logo_noText.png";
import imgKit from "../../asset/images/icons/logo_kit.jpg";
import imgOne from "../../asset/images/icons/number_one.png";
import imgUser from "../../asset/images/icons/user.png";
const StatusBarContainer = () => {
    const active = useRecoilValue(rc_taskbar_statusBar_active);

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

    const propDatas = {
        active,
        activeLeftArea_Detail,
        statusBar_LeftArea_Items,

        onMouseEnter,
        onMouseLeave,
    };
    return <StatusBar {...propDatas} />;
};

export default StatusBarContainer;
