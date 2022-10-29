import React, { useCallback, useEffect, useRef, useState } from "react";
import Window from "../../Component/Main/Window";
import img from "../../logo.svg";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../../store/program";

const WindowContainer = (props) => {
    const windowRef = useRef(null);
    const [activeIcon, setActiveIton] = useState(null);
    const [iconBoxArr] = useState([
        {
            key: "프로젝트",
            img: img,
            name: "프로젝트",
            type: "FOLDER",
        },
        {
            key: "기술스택",
            img: img,
            name: "기술스택",
            type: "FOLDER",
        },
    ]);

    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );

    const setActiveProgram = useSetRecoilState(rc_program_activeProgram);
    const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);

    // 아이콘 클릭
    const onClickIcon = useCallback((item) => {
        setActiveIton(item.key);
    }, []);

    // 아이콘 더블클릭
    const onDoubleClickIcon = useCallback(
        (item) => {
            setActiveIton(null);
            import("./Program/FolderContainer").then((obj) => {
                const Component = obj.default;
                setProgramList([...programList, { Component, key: item.key }]);
                setActiveProgram(item.key);
                setZIndexCnt((prev) => prev + 1);
            });
        },
        [programList, setProgramList]
    );

    const propDatas = {
        windowRef,
        iconBoxArr,
        onClickIcon,
        onDoubleClickIcon,
    };
    return (
        <>
            <Window {...propDatas} />
            {programList.map((item) => {
                const Component = item.Component;

                return <Component key={`${item.key}`} componentID={item.key} />;
            })}
        </>
    );
};

export default React.memo(WindowContainer);
