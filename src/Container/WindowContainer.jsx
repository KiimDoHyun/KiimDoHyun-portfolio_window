import React, { useCallback, useRef } from "react";
import Window from "../Component/Main/Window";
import { useRecoilValue } from "recoil";
import { rc_program_programList } from "../store/program";
import { window_programList } from "../Common/data";
import useActiveProgram from "../hooks/useActiveProgram";

const WindowContainer = () => {
    const windowRef = useRef(null);

    const programList = useRecoilValue(rc_program_programList);

    // 아이콘 클릭
    const onClickIcon = useCallback((item) => {}, []);

    // 아이콘 더블클릭 (활성화)
    const onDoubleClickIcon = useActiveProgram();

    const propDatas = {
        windowRef,
        iconBoxArr: window_programList,
        onClickIcon,
        onDoubleClickIcon,
    };
    return (
        <>
            <Window {...propDatas} />
            {programList.map((item) => {
                const Component = item.Component;

                return <Component key={`${item.key}`} item={item} />;
            })}
        </>
    );
};

export default React.memo(WindowContainer);
