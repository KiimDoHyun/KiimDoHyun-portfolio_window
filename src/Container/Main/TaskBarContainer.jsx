import React, { useCallback, useState } from "react";
import TaskBar from "../../Component/Main/TaskBar";
import { useSetRecoilState } from "recoil";
import { rc_statusBar_active } from "../../store/statusBar";

const TaskBarContainer = () => {
    const setActiveStatusBar = useSetRecoilState(rc_statusBar_active);

    const onClickStartIcon = useCallback(() => {
        setActiveStatusBar((prevState) => !prevState);
    }, [setActiveStatusBar]);

    const propDatas = {
        onClickStartIcon,
    };

    return <TaskBar {...propDatas} />;
};

export default TaskBarContainer;
