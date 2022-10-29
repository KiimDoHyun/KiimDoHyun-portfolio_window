import React, { useCallback, useEffect, useState } from "react";
import TaskBar from "../../Component/Main/TaskBar";
import { useRecoilState, useSetRecoilState } from "recoil";
import { rc_statusBar_active } from "../../store/statusBar";
import {
    rc_program_activeProgram,
    rc_program_programList,
} from "../../store/program";

const TaskBarContainer = () => {
    const setActiveStatusBar = useSetRecoilState(rc_statusBar_active);
    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );

    const [activeProgram, setActiveProgram] = useRecoilState(
        rc_program_activeProgram
    );
    const [activeItem, setActiveItem] = useState("");

    // 마우스 오버
    const onMouseEnter = useCallback(({ key }) => {
        // setActive(true);
        setActiveItem(key);
    }, []);

    // 마우스 아웃
    const onMouseLeave = useCallback((item) => {
        setActiveItem("");
        // setActive(false);
    }, []);

    // 아이템 클릭
    const onClickTaskIcon = useCallback((item) => {
        setActiveItem(item.key);
        setActiveProgram(item.key);

        if (item.status === "min") {
            setProgramList((prev) =>
                prev.map((prevItem) =>
                    prevItem.key === item.key
                        ? { ...prevItem, status: "active" }
                        : { ...prevItem }
                )
            );
        }

        setActiveItem(item.key);
        setActiveProgram(item.key);
    }, []);

    // 시작 아이콘 클릭
    const onClickStartIcon = useCallback(() => {
        setActiveStatusBar((prevState) => !prevState);
    }, [setActiveStatusBar]);

    const propDatas = {
        onClickStartIcon,
        onMouseEnter,
        onMouseLeave,
        onClickTaskIcon,
        activeItem,

        programList,
        activeProgram,
    };

    return <TaskBar {...propDatas} />;
};

export default TaskBarContainer;
