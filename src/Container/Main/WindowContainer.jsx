import React, { useCallback, useEffect, useRef, useState } from "react";
import Window from "../../Component/Main/Window";
import img from "../../logo.svg";
import { useRecoilState } from "recoil";
import { rc_program_programList } from "../../store/program";

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

    useEffect(() => {
        console.log("윈도우 컨테이너 렌더링 발생");
    });

    useEffect(() => {
        console.log("windowRef :", windowRef);
    }, [windowRef]);

    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );

    //
    const onClickIcon = useCallback((item) => {
        setActiveIton(item.key);
        console.log("아이템 클릭", item);
    }, []);

    const onDoubleClickIcon = useCallback(
        (item) => {
            setActiveIton(null);
            console.log("아이템 더블 클릭", item);
            import("./Program/FolderContainer").then((obj) => {
                const Component = obj.default;
                setProgramList([
                    ...programList,
                    { Component, key: new Date() },
                ]);
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

                return (
                    <Component
                        key={`${idx}${item.key}`}
                        componentID={item.key}
                    />
                );
            })}
        </>
    );
};

export default React.memo(WindowContainer);
