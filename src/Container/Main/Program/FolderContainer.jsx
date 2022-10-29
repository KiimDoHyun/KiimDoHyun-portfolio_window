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
    }, []);

    // 최대화
    const onClickMax = useCallback(() => {
        setIsMaxSize(true);
        // 좌우 크기를 100vw로
        // 상하를 100vh 로 하면 안되고 하단 바 크기만큼 빼서 조정.
    }, []);

    // 기본 크기
    const onClickNormalSize = useCallback(() => {
        setIsMaxSize(false);
    }, []);

    // 최소화
    const onClickMin = useCallback(() => {
        boxRef.current.style.transition = "0.25s";
        boxRef.current.style.opacity = "0";
        boxRef.current.style.left = "80px";
        boxRef.current.style.top = "60vh";
        boxRef.current.style.scale = "0.6";
        boxRef.current.style.width = "500px";
        boxRef.current.style.height = "500px";

        setProgramList((prev) =>
            prev.map((prevItem) =>
                prevItem.key === key
                    ? { ...prevItem, status: "min" }
                    : { ...prevItem }
            )
        );
        // 최소화
    }, []);

    // 닫기
    const onClickClose = useCallback(() => {
        setIsClose(true);
        boxRef.current.style.transition = "0.25s";
        boxRef.current.style.opacity = "0";

        setTimeout(() => {
            setProgramList((prev) => prev.filter((item) => item.key !== key));
        }, [300]);
    }, [setProgramList]);

    // 이동 활성화
    const onMouseDown = useCallback((e) => {
        setIsMovable(true);
        prevPos.current = {
            X: e.clientX,
            Y: e.clientY,
        };
    }, []);

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

            // 조건1 0 이하로 움직이지 못한다.
            if (boxRef.current.offsetLeft - posX > 0) {
            }
            boxRef.current.style.transition = "0s";
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
            boxRef.current.style.zIndex = zIndexCnt + 1;
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

    // 최대화, 기본 크기 토글
    useEffect(() => {
        if (isMaxSize) {
            boxRef.current.style.transition =
                "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s";
            boxRef.current.style.width = "100vw";
            boxRef.current.style.height = "calc(100vh - 50px)";

            boxRef.current.style.left = "0";
            boxRef.current.style.top = "0";
        } else {
            boxRef.current.style.transition =
                "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s";
            boxRef.current.style.width = "500px";
            boxRef.current.style.height = "500px";

            boxRef.current.style.left = "calc(50vw - 250px)";
            boxRef.current.style.top = "calc(50vh - 250px)";
        }
    }, [isMaxSize]);

    useEffect(() => {
        if (status === "active") {
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "1";
            boxRef.current.style.left = "calc(50vw - 250px)";
            boxRef.current.style.top = "calc(50vh - 250px)";
            boxRef.current.style.width = "500px";
            boxRef.current.style.height = "500px";
            boxRef.current.style.scale = "1";
        }
    }, [status]);

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
