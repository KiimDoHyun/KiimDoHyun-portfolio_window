import React, { useCallback, useState } from "react";
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
                            ? { ...prevItem, status: "active" }
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

    const propDatas = {
        onClickStartIcon,
        onMouseEnter,
        onMouseLeave,
        onClickTaskIcon,
        hoverTarget,

        programList,
    };

    return <TaskBar {...propDatas} />;
};

export default TaskBarContainer;
