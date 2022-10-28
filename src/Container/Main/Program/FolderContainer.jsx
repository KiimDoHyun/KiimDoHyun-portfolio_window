import React, { useCallback, useRef } from "react";
import FolderComponent from "../../../Component/Program/FolderComponent";
import { rc_program_programList } from "../../../store/program";
import { useSetRecoilState } from "recoil";
import { useState } from "react";

const FolderContainer = ({ componentID }) => {
    const setProgramList = useSetRecoilState(rc_program_programList);
    const [isMovable, setIsMovable] = useState(false);
    const [isClose, setIsClose] = useState(false);

    const prevPos = useRef();
    const boxRef = useRef();

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

    const propDatas = {
        onClickClose,
        onMouseDown,
        onMouseMove,
        onMouseUp,

        boxRef,
        isClose,
    };
    return <FolderComponent {...propDatas} />;
};

export default FolderContainer;
