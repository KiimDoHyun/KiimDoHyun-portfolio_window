import { useEffect, useState, useCallback } from "react";
import type { ProgramId } from "@shared/types/program";
import type { WindowStatus } from "../WindowShell.types";

interface UseWindowLifecycleParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: ProgramId;
    status?: WindowStatus;
    isActive: boolean;
    onRequestZIndex: () => number;
}

/**
 * 창의 생명주기(초기 위치/크기 복원, min/active 상태 효과, 최대화/복원/닫기, z-index) 담당.
 */
export function useWindowLifecycle({
    boxRef,
    id,
    status,
    isActive,
    onRequestZIndex,
}: UseWindowLifecycleParams) {
    const [isMaxSize, setIsMaxSize] = useState(false);
    const [isClose, setIsClose] = useState(false);

    // 활성창이 되면 z-index 를 최상단으로
    useEffect(() => {
        if (isActive && boxRef.current) {
            const next = onRequestZIndex();
            boxRef.current.style.zIndex = String(next);
        }
    }, [isActive, boxRef, onRequestZIndex]);

    // 위치 복원
    useEffect(() => {
        if (status !== "active" || !boxRef.current) return;
        const box = boxRef.current;
        if (isMaxSize) {
            box.style.left = "0px";
            box.style.top = "0px";
            return;
        }
        const left = localStorage.getItem(`${id}Left`);
        const top = localStorage.getItem(`${id}Top`);
        if (left && top) {
            box.style.left = `${left}px`;
            box.style.top = `${top}px`;
        } else {
            box.style.left = "calc(50vw - 250px)";
            box.style.top = "calc(50vh - 250px)";
        }
    }, [status, isMaxSize, boxRef, id]);

    // 크기/opacity/scale — status 전이
    useEffect(() => {
        if (!boxRef.current) return;
        const box = boxRef.current;
        if (status === "active") {
            box.style.transition = "0.25s";
            box.style.opacity = "1";
            const height = localStorage.getItem(`${id}height`);
            const width = localStorage.getItem(`${id}width`);
            if (height && width) {
                box.style.height = height;
                box.style.width = width;
            } else {
                box.style.width = "500px";
                box.style.height = "500px";
            }
            box.style.scale = "1";
        } else if (status === "min") {
            box.style.transition = "0.25s";
            box.style.opacity = "0";
            box.style.left = "80px";
            box.style.top = "60vh";
            box.style.scale = "0.6";
            box.style.width = "500px";
            box.style.height = "500px";
        }
    }, [status, id, boxRef]);

    // 언마운트 시 localStorage 정리
    useEffect(() => {
        return () => {
            localStorage.removeItem(`${id}Left`);
            localStorage.removeItem(`${id}Top`);
            localStorage.removeItem(`${id}width`);
            localStorage.removeItem(`${id}height`);
        };
    }, [id]);

    const onClickMax = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(true);
        const box = boxRef.current;
        box.style.transition = "0.25s";
        box.style.left = "0";
        box.style.top = "0";
        localStorage.setItem(`${id}width`, "100vw");
        localStorage.setItem(`${id}height`, "calc(100vh - 50px)");
        box.style.width = "100vw";
        box.style.height = "calc(100vh - 50px)";
    }, [boxRef, id]);

    const onClickNormalSize = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(false);
        const box = boxRef.current;
        const left = localStorage.getItem(`${id}Left`);
        const top = localStorage.getItem(`${id}Top`);
        box.style.transition = "0.25s";
        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        localStorage.setItem(`${id}width`, "500px");
        localStorage.setItem(`${id}height`, "500px");
        box.style.width = "500px";
        box.style.height = "500px";
    }, [boxRef, id]);

    const triggerClose = useCallback(
        (onFinish: () => void) => {
            if (!boxRef.current) {
                onFinish();
                return;
            }
            setIsClose(true);
            boxRef.current.style.transition = "0.25s";
            boxRef.current.style.opacity = "0";
            setTimeout(onFinish, 300);
        },
        [boxRef]
    );

    return {
        isMaxSize,
        isClose,
        onClickMax,
        onClickNormalSize,
        triggerClose,
    };
}
