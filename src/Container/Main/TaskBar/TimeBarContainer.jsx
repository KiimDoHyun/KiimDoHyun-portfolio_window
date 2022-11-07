import React from "react";
import { useCallback } from "react";
import TimeBar from "../../../Component/TaskBar/TimeBar";

const TimeBarContainer = () => {
    // 현재 날짜로
    const onClickDateText = useCallback(() => {
        //
    }, []);

    const propDatas = {
        onClickDateText,
    };
    return <TimeBar {...propDatas} />;
};

export default TimeBarContainer;
