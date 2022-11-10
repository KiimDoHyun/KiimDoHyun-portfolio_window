import React, { useCallback, useRef, useState } from "react";
import Window from "../../Component/Main/Window";
import img from "../../logo.svg";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../../store/program";

const WindowContainer = () => {
    const windowRef = useRef(null);
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
        {
            key: "구글",
            img: img,
            name: "구글",
            type: "FOLDER",
        },
    ]);

    const [programList, setProgramList] = useRecoilState(
        rc_program_programList
    );

    const setActiveProgram = useSetRecoilState(rc_program_activeProgram);
    const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);

    // 아이콘 클릭
    const onClickIcon = useCallback((item) => {}, []);

    // 아이콘 더블클릭
    const onDoubleClickIcon = useCallback(
        (item) => {
            // 만약 이미 열었던 거라면 (지금 열려있는지, 최소화 상태인지)
            let target = programList.find(
                (listItem) => listItem.key === item.key
            );
            if (target) {
                // 열려있는데 최소화 상태라면
                if (target.status === "min") {
                    setProgramList((prev) =>
                        prev.map((prevItem) =>
                            prevItem.key === target.key
                                ? { ...prevItem, status: "active" }
                                : { ...prevItem }
                        )
                    );
                    // 다시 크기를 키우고 맨앞으로 이동시킨다.
                }
                // 열려 있는 상태라면
                else if (target.status === "min") {
                    // 맨앞으로 이동시킨다.
                }
                setActiveProgram(item.key);
                setZIndexCnt((prev) => prev + 1);
            }
            // 처음 여는거라면
            else {
                import("./Program/FolderContainer").then((obj) => {
                    const Component = obj.default;
                    setProgramList([
                        ...programList,
                        { Component, key: item.key, status: "active" },
                    ]);
                    setActiveProgram(item.key);
                    setZIndexCnt((prev) => prev + 1);
                });
            }
        },
        [programList, setProgramList, setZIndexCnt, setActiveProgram]
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

                return <Component key={`${item.key}`} item={item} />;
            })}
        </>
    );
};

export default React.memo(WindowContainer);
