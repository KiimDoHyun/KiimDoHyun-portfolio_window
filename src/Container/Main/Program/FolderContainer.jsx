import React, { useCallback, useEffect, useRef } from "react";
import FolderComponent from "../../../Component/Program/FolderComponent";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../../../store/program";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useState } from "react";

const FolderContainer = ({ item }) => {
    const { key, status } = item;
    const setProgramList = useSetRecoilState(rc_program_programList);
    const [zIndexCnt, setZIndexCnt] = useRecoilState(rc_program_zIndexCnt);
    const temp_zIndexCnt = zIndexCnt;
    const [activeProgram, setActiveProgram] = useRecoilState(
        rc_program_activeProgram
    );
    const [isMovable, setIsMovable] = useState(false);
    const [isClose, setIsClose] = useState(false);
    const [isMaxSize, setIsMaxSize] = useState(false);

    const prevPos = useRef();
    const boxRef = useRef();

    // 현재 창 클릭
    const onClick = useCallback(() => {
        setActiveProgram(key);
    }, [setActiveProgram, key]);

    // 최대화
    const onClickMax = useCallback(() => {
        setProgramList((prev) =>
            prev.map((prevItem) =>
                prevItem.key === key
                    ? { ...prevItem, status: "active_max" }
                    : { ...prevItem }
            )
        );

        setIsMaxSize(true);
    }, [setIsMaxSize, setProgramList]);

    // 기본 크기
    const onClickNormalSize = useCallback(() => {
        setIsMaxSize(false);
        setProgramList((prev) =>
            prev.map((prevItem) =>
                prevItem.key === key
                    ? { ...prevItem, status: "active_default" }
                    : { ...prevItem }
            )
        );
    }, [setIsMaxSize, setProgramList]);

    // 최소화
    const onClickMin = useCallback(() => {
        setProgramList((prev) =>
            prev.map((prevItem) =>
                prevItem.key === key
                    ? { ...prevItem, status: "min" }
                    : { ...prevItem }
            )
        );
    }, [key, setProgramList]);

    // 닫기
    const onClickClose = useCallback(() => {
        setIsClose(true);
        boxRef.current.style.transition = "0.25s";
        boxRef.current.style.opacity = "0";

        setTimeout(() => {
            setProgramList((prev) => prev.filter((item) => item.key !== key));
        }, [300]);
    }, [key, setProgramList]);

    // 이동 활성화
    const onMouseDown = useCallback(
        (e) => {
            setIsMovable(true);
            prevPos.current = {
                X: e.clientX,
                Y: e.clientY,
            };
        },
        [setIsMovable]
    );

    // 이동
    const onMouseMove = useCallback(
        (e) => {
            if (!isMovable) return;

            // 이전 좌표와 현재 좌표 차이값
            const posX = prevPos.current.X - e.clientX;
            const posY = prevPos.current.Y - e.clientY;

            // 현재 좌표가 이전 좌표로 바뀜
            prevPos.current = {
                X: e.clientX,
                Y: e.clientY,
            };

            // left, top으로 이동

            boxRef.current.style.transition = "0s";

            localStorage.setItem(
                `${key}Left`,
                boxRef.current.offsetLeft - posX
            );
            localStorage.setItem(`${key}Top`, boxRef.current.offsetTop - posY);

            boxRef.current.style.left = boxRef.current.offsetLeft - posX + "px";
            boxRef.current.style.top = boxRef.current.offsetTop - posY + "px";
        },
        [isMovable]
    );

    // 이동 종료
    const onMouseUp = useCallback(() => {
        setIsMovable(false);
    }, []);

    // 현재 창 맨 앞으로
    useEffect(() => {
        if (activeProgram === key) {
            boxRef.current.style.zIndex = temp_zIndexCnt + 1;
            setZIndexCnt((prev) => prev + 1);
        }
    }, [activeProgram, key, setZIndexCnt]);

    // 이동 활성화
    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [onMouseMove]);

    useEffect(() => {
        /*
        min
        active_defult
        active_max
        */
        if (status === "active_default") {
            console.log("활성화");
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "1";
            const left = localStorage.getItem(`${key}Left`);
            const top = localStorage.getItem(`${key}Top`);

            if (left && top) {
                boxRef.current.style.left = left + "px";
                boxRef.current.style.top = top + "px";
            } else {
                boxRef.current.style.left = "calc(50vw - 250px)";
                boxRef.current.style.top = "calc(50vh - 250px)";
            }
            boxRef.current.style.width = "500px";
            boxRef.current.style.height = "500px";
            boxRef.current.style.scale = "1";
        } else if (status === "active_max") {
            console.log("최대화");
            boxRef.current.style.transition =
                "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s";
            boxRef.current.style.width = "100vw";
            boxRef.current.style.height = "calc(100vh - 50px)";

            boxRef.current.style.left = "0";
            boxRef.current.style.top = "0";
        } else if (status === "min") {
            console.log("최소화");
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "0";
            boxRef.current.style.left = "80px";
            boxRef.current.style.top = "60vh";
            boxRef.current.style.scale = "0.6";
            boxRef.current.style.width = "500px";
            boxRef.current.style.height = "500px";
        }
    }, [status]);

    useEffect(() => {
        return () => {
            localStorage.removeItem(`${key}Left`);
            localStorage.removeItem(`${key}Top`);
        };
    }, []);

    const propDatas = {
        onClick,
        onClickClose,
        onClickMax,
        onClickNormalSize,
        onClickMin,
        onMouseDown,
        onMouseUp,

        boxRef,
        isClose,
        isMaxSize,
        title: key,
    };
    return <FolderComponent {...propDatas} />;
};

export default React.memo(FolderContainer);
