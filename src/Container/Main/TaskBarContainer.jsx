import React, { useCallback, useEffect, useRef, useState } from "react";
import TaskBar from "../../Component/Main/TaskBar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    rc_program_activeProgram,
    rc_program_programList,
} from "../../store/program";
import {
    rc_taskbar_hiddenIcon_active,
    rc_taskbar_infoBar_active,
    rc_taskbar_statusBar_active,
    rc_taskbar_timeBar_active,
} from "../../store/taskbar";
import {
    rc_global_date,
    rc_global_hour,
    rc_global_min,
    rc_global_month,
    rc_global_timeline,
    rc_global_year,
} from "../../store/global";

const glowLevelArr = [
    "", // none
    "#ffffff0d", // 호버
    "#ffffff24", // active
    "#ffffff2b", //호버 + active:
];

const TaskBarContainer = () => {
    const cur_timeline = useRecoilValue(rc_global_timeline);
    const cur_hour = useRecoilValue(rc_global_hour);
    const cur_minute = useRecoilValue(rc_global_min);
    const cur_year = useRecoilValue(rc_global_year);
    const cur_month = useRecoilValue(rc_global_month);
    const cur_date = useRecoilValue(rc_global_date);

    const [hiddenIcon, setHiddenIcon] = useRecoilState(
        rc_taskbar_hiddenIcon_active
    );
    const setActiveStatusBar = useSetRecoilState(rc_taskbar_statusBar_active);
    const setActiveInfoBar = useSetRecoilState(rc_taskbar_infoBar_active);
    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );
    const setActiveTimeBar = useSetRecoilState(rc_taskbar_timeBar_active);

    const [activeProgram, setActiveProgram] = useRecoilState(
        rc_program_activeProgram
    );

    // const setActiveProgram = useSetRecoilState(rc_program_activeProgram);
    const [hoverTarget, setHoverTarget] = useState({ key: "", idx: -1 });

    const box2Ref = useRef(null);

    // 마우스 오버
    const onMouseEnter = useCallback(
        ({ key }, idx) => {
            // 현재 활성화된 아이템은 최대 밝기로
            if (box2Ref.current.children[idx].title === activeProgram) {
                box2Ref.current.children[idx].style.backgroundColor =
                    glowLevelArr[3];
            }
            // 일반 아이템은 기본 밝기로
            else {
                box2Ref.current.children[idx].style.backgroundColor =
                    glowLevelArr[1];
            }
            setHoverTarget({ key, idx });
        },
        [activeProgram]
    );

    // 마우스 아웃
    const onMouseLeave = useCallback((idx) => {
        // 밝기를 가장 낮춘다
        // 이미 활성화된 아이템은 기본 밝기를 가지고있기 때문에 사라지지 않는다
        box2Ref.current.children[idx].style.backgroundColor = glowLevelArr[0];
        setHoverTarget("");
    }, []);

    // 아이템 클릭
    const onClickTaskIcon = useCallback(
        (item, idx) => {
            // setHoverTarget(item.key);
            // setActiveProgram(item.key);

            // 최소화 되었던 아이템을 활성화 시킨다
            if (item.status === "min") {
                setProgramList((prev) =>
                    prev.map((prevItem) =>
                        prevItem.key === item.key
                            ? { ...prevItem, status: "active" }
                            : { ...prevItem }
                    )
                );
                box2Ref.current.children[idx].style.backgroundColor =
                    glowLevelArr[2];
                setActiveProgram(item.key);
            } else {
                // 현재 가장 앞에있는 아이템이면 최소화 시킨다.
                if (item.key === activeProgram) {
                    setProgramList((prev) =>
                        prev.map((prevItem) =>
                            prevItem.key === item.key
                                ? { ...prevItem, status: "min" }
                                : { ...prevItem }
                        )
                    );
                }
                // 현재 가장 앞에있는 아이템이 아니면 가장앞으로 이동만 시킨다.
                else {
                    box2Ref.current.children[idx].style.backgroundColor =
                        glowLevelArr[2];
                    setActiveProgram(item.key);
                }
            }

            // setHoverTarget(item.key);
        },
        [setHoverTarget, setActiveProgram, setProgramList, activeProgram]
    );

    // 시작 아이콘 클릭
    const onClickStartIcon = useCallback(() => {
        setActiveStatusBar((prev) => !prev);

        setActiveTimeBar(false);
        setActiveInfoBar(false);
        setHiddenIcon(false);
    }, [setActiveStatusBar]);

    // 시간 클릭
    const onClickTime = useCallback(() => {
        setActiveTimeBar((prev) => !prev);

        setActiveInfoBar(false);
        setActiveStatusBar(false);
        setHiddenIcon(false);
    }, [setActiveTimeBar]);

    // 정보 바 클릭
    const onClickInfo = useCallback(() => {
        setActiveInfoBar((prev) => !prev);

        setHiddenIcon(false);
        setActiveTimeBar(false);
        setActiveStatusBar(false);
    }, [setActiveInfoBar]);

    // 숨겨진 아이콘 클릭
    const onClickHiddenIcon = useCallback(() => {
        setHiddenIcon((prev) => !prev);

        setActiveStatusBar(false);
        setActiveTimeBar(false);
        setActiveInfoBar(false);
    }, [setHiddenIcon]);

    // 모두 닫기
    const onClickCloseAll = useCallback(() => {
        setActiveInfoBar(false);
        setActiveTimeBar(false);
        setHiddenIcon(false);
        setActiveStatusBar(false);
        setProgramList((prev) =>
            prev.map((prevItem) => ({ ...prevItem, status: "min" }))
        );
    }, []);

    // useEffect(() => {
    //     var userLang = navigator.language || navigator.userLanguage;
    //     console.log("The language is: " + userLang);
    //     const online = window.navigator.onLine;
    //     if (online) {
    //         console.log("Online :D");
    //     } else {
    //         console.log("Offline :(");
    //     }
    // }, []);

    const propDatas = {
        onClickStartIcon,
        onClickTime,
        onClickInfo,
        onClickHiddenIcon,

        hoverTarget,
        programList,
        activeProgram,
        hiddenIcon,

        onMouseEnter,
        onMouseLeave,
        onClickTaskIcon,
        onClickCloseAll,

        cur_year,
        cur_month,
        cur_date,
        cur_hour,
        cur_minute,
        cur_timeline,

        box2Ref,
    };

    return <TaskBar {...propDatas} />;
};

export default TaskBarContainer;
