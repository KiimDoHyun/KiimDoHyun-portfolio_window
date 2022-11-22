import React, { useCallback, useEffect, useRef } from "react";
import Window from "../Component/Main/Window";
import { useRecoilValue } from "recoil";
import { rc_program_programList } from "../store/program";
import { window_programList } from "../Common/data";
import { fileList } from "../Common/data";
import useActiveProgram from "../hooks/useActiveProgram";
import { rc_global_Directory_Tree } from "../store/global";

const WindowContainer = () => {
    const windowRef = useRef(null);

    const programList = useRecoilValue(rc_program_programList);
    const Directory_Tree = useRecoilValue(rc_global_Directory_Tree);

    // 아이콘 클릭
    const onClickIcon = useCallback((item) => {}, []);

    // 아이콘 더블클릭 (활성화)
    const onDoubleClickIcon = useActiveProgram();

    const propDatas = {
        windowRef,
        iconBoxArr: Directory_Tree.root || [],
        onClickIcon,
        onDoubleClickIcon,
    };
    return (
        <>
            <Window {...propDatas} />
            {programList.map((item) => {
                const Component = item.Component;

                return <Component key={`${item.name}`} item={item} />;
            })}
        </>
    );
};

export default React.memo(WindowContainer);
