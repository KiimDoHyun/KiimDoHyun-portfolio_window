import React, { useCallback, useEffect, useState } from "react";
import TaskBar from "../../Component/Main/TaskBar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    rc_program_activeProgram,
    rc_program_programList,
} from "../../store/program";
import {
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

const TaskBarContainer = () => {
    const cur_timeline = useRecoilValue(rc_global_timeline);
    const cur_hour = useRecoilValue(rc_global_hour);
    const cur_minute = useRecoilValue(rc_global_min);
    const cur_year = useRecoilValue(rc_global_year);
    const cur_month = useRecoilValue(rc_global_month);
    const cur_date = useRecoilValue(rc_global_date);

    const setActiveStatusBar = useSetRecoilState(rc_taskbar_statusBar_active);
    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );
    const setActiveTimeBar = useSetRecoilState(rc_taskbar_timeBar_active);

    // const [activeProgram, setActiveProgram] = useRecoilState(
    //     rc_program_activeProgram
    // );

    const setActiveProgram = useSetRecoilState(rc_program_activeProgram);
    const [hoverTarget, setHoverTarget] = useState("");

    // 마우스 오버
    const onMouseEnter = useCallback(({ key }) => {
        // setActive(true);
        setHoverTarget(key);
    }, []);

    // 마우스 아웃
    const onMouseLeave = useCallback((item) => {
        setHoverTarget("");
        // setActive(false);
    }, []);

    // 아이템 클릭
    const onClickTaskIcon = useCallback(
        (item) => {
            setHoverTarget(item.key);
            setActiveProgram(item.key);

            if (item.status === "min") {
                setProgramList((prev) =>
                    prev.map((prevItem) =>
                        prevItem.key === item.key
                            ? { ...prevItem, status: "active_default" }
                            : { ...prevItem }
                    )
                );
            } else {
                setProgramList((prev) =>
                    prev.map((prevItem) =>
                        prevItem.key === item.key
                            ? { ...prevItem, status: "min" }
                            : { ...prevItem }
                    )
                );
            }

            setHoverTarget(item.key);
            setActiveProgram(item.key);
        },
        [setHoverTarget, setActiveProgram, setProgramList]
    );

    // 시작 아이콘 클릭
    const onClickStartIcon = useCallback(() => {
        setActiveStatusBar((prevState) => !prevState);
    }, [setActiveStatusBar]);

    const onClickTime = useCallback(() => {
        setActiveTimeBar((prevState) => !prevState);
    }, [setActiveTimeBar]);

    useEffect(() => {
        console.log("programList :", programList);
    }, [programList]);

    const propDatas = {
        onClickStartIcon,
        onMouseEnter,
        onMouseLeave,
        onClickTaskIcon,
        hoverTarget,

        programList,
        onClickTime,

        cur_year,
        cur_month,
        cur_date,
        cur_hour,
        cur_minute,
        cur_timeline,
    };

    return <TaskBar {...propDatas} />;
};

export default TaskBarContainer;
