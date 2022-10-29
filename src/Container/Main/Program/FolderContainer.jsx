import React, { useCallback, useEffect, useRef } from "react";
import FolderComponent from "../../../Component/Program/FolderComponent";
import {
    rc_program_activeProgram,
    rc_program_programList,
    rc_program_zIndexCnt,
} from "../../../store/program";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useState } from "react";

const FolderContainer = ({ componentID }) => {
    const setProgramList = useSetRecoilState(rc_program_programList);
    const [zIndexCnt, setZIndexCnt] = useRecoilState(rc_program_zIndexCnt);
    const [activeProgram, setActiveProgram] = useRecoilState(
        rc_program_activeProgram
    );
    const [isMovable, setIsMovable] = useState(false);
    const [isClose, setIsClose] = useState(false);

    const prevPos = useRef();
    const boxRef = useRef();

    const onClick = useCallback(() => {
        setActiveProgram(componentID);
    }, []);

    const onClickClose = useCallback(() => {
        setIsClose(true);

        setTimeout(() => {
            setProgramList((prev) =>
                prev.filter((item) => item.key !== componentID)
            );
        }, [300]);
    }, [setProgramList]);

    const onMouseDown = useCallback((e) => {
        setIsMovable(true);
        prevPos.current = {
            X: e.clientX,
            Y: e.clientY,
        };
    }, []);

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
            boxRef.current.style.left = boxRef.current.offsetLeft - posX + "px";
            boxRef.current.style.top = boxRef.current.offsetTop - posY + "px";
        },
        [isMovable]
    );

    const onMouseUp = useCallback(() => {
        setIsMovable(false);
    }, []);

    useEffect(() => {
        if (activeProgram === componentID) {
            boxRef.current.style.zIndex = zIndexCnt + 1;
            setZIndexCnt((prev) => prev + 1);
        }
    }, [activeProgram, componentID, setZIndexCnt]);

    useEffect(() => {
        document.addEventListener("mousemove", onMouseMove);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [onMouseMove]);

    const propDatas = {
        onClick,
        onClickClose,
        onMouseDown,
        onMouseUp,

        boxRef,
        isClose,
    };
    return <FolderComponent {...propDatas} />;
};

export default React.memo(FolderContainer);
