import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import StatusBar from "../../Component/TaskBar/StatusBar";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";
import imgReact from "../../asset/images/icons/react.png";
import imgJS from "../../asset/images/icons/javascript.png";
import imgAraon from "../../asset/images/icons/araon_logo_noText.png";
import imgKit from "../../asset/images/icons/logo_kit.jpg";
import imgOne from "../../asset/images/icons/number_one.png";
import imgUser from "../../asset/images/icons/user.png";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../../store/program";
const StatusBarContainer = () => {
    const [active, setActive] = useRecoilState(rc_taskbar_statusBar_active);

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

    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );
    const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);
    const setActiveProgram = useSetRecoilState(rc_program_activeProgram);

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

    // 소개 영역 아이템 클릭
    // windowContainer 의 onDoubleClickIcon 함수와 정확히 동일한 함수 (공통화 필요)
    const onClickBox = useCallback(
        (item) => {
            // 만약 이미 열었던 거라면 (지금 열려있는지, 최소화 상태인지)
            let target = programList.find(
                (listItem) => listItem.key === item.key
            );
            if (target) {
                // 열려있는데 최소화 상태라면
                if (target.status === "min") {
                    setProgramList((prev) =>
                        prev.map((prevItem) =>
                            prevItem.key === target.key
                                ? { ...prevItem, status: "active" }
                                : { ...prevItem }
                        )
                    );
                    // 다시 크기를 키우고 맨앞으로 이동시킨다.
                }
                // 열려 있는 상태라면
                else if (target.status === "min") {
                    // 맨앞으로 이동시킨다.
                }
                setActiveProgram(item.key);
                setZIndexCnt((prev) => prev + 1);
            }
            // 처음 여는거라면
            else {
                import("../Program/FolderContainer").then((obj) => {
                    const Component = obj.default;
                    setProgramList([
                        ...programList,
                        { Component, key: item.key, status: "active", icon: item.icon },
                    ]);
                    setActiveProgram(item.key);
                    setZIndexCnt((prev) => prev + 1);
                });
            }

            setActive(false);
        },
        [programList, setProgramList, setZIndexCnt, setActiveProgram, setActive]
    );

    const propDatas = {
        active,
        activeLeftArea_Detail,
        statusBar_LeftArea_Items,

        onMouseEnter,
        onMouseLeave,
        onClickBox,
    };
    return <StatusBar {...propDatas} />;
};

export default StatusBarContainer;
