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
            key: "battle_1",
            img: img,
            name: "Battle.net",
            type: "FOLDER",
        },
        {
            key: "battle_2",
            img: img,
            name: "Battle.net",
            type: "PROGRAM",
        },
        {
            key: "battle_3",
            img: img,
            name: "Battle.net",
            type: "PROGRAM",
        },
    ]);

    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );

    const setActiveProgram = useSetRecoilState(rc_program_activeProgram);
    const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);

    //
    const onClickIcon = useCallback((item) => {
        setActiveIton(item.key);
    }, []);

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
            {programList.map((item, idx) => {
                const Component = item.Component;

                return <Component key={`${item.key}`} componentID={item.key} />;
            })}
        </>
    );
};

export default React.memo(WindowContainer);
