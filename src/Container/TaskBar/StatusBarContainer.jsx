import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useRecoilValue } from "recoil";
import StatusBar from "../../Component/TaskBar/StatusBar";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";

const StatusBarContainer = () => {
    const active = useRecoilValue(rc_taskbar_statusBar_active);

    const [activeLeftArea_Detail, setActiveLeftArea_Detail] = useState(false);
    const activeLeftArea_timer = useRef(null);

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

        onMouseEnter,
        onMouseLeave,
    };
    return <StatusBar {...propDatas} />;
};

export default StatusBarContainer;
