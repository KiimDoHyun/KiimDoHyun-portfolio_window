import { useEffect, useState, useCallback } from "react";
import type { ProgramId } from "@shared/types/program";
import type { WindowStatus } from "../WindowShell.types";
import { TASKBAR_HEIGHT, type Geometry } from "../lib/geometry";
import { clearGeometry, loadGeometry, saveGeometry } from "../lib/persist";

const DEFAULT_W = 500;
const DEFAULT_H = 500;

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
        const geom = loadGeometry(id);
        if (geom) {
            box.style.left = `${geom.x}px`;
            box.style.top = `${geom.y}px`;
        } else {
            const cx = Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2));
            const cy = Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2));
            box.style.left = `${cx}px`;
            box.style.top = `${cy}px`;
        }
    }, [status, isMaxSize, boxRef, id]);

    // 크기/opacity/scale — status 전이
    useEffect(() => {
        if (!boxRef.current) return;
        const box = boxRef.current;
        if (status === "active") {
            box.style.transition = "0.25s";
            box.style.opacity = "1";
            const geom = loadGeometry(id);
            if (geom) {
                box.style.width = `${geom.w}px`;
                box.style.height = `${geom.h}px`;
            } else {
                box.style.width = `${DEFAULT_W}px`;
                box.style.height = `${DEFAULT_H}px`;
            }
            box.style.scale = "1";
        } else if (status === "min") {
            box.style.transition = "0.25s";
            box.style.opacity = "0";
            box.style.left = "80px";
            box.style.top = "60vh";
            box.style.scale = "0.6";
            box.style.width = `${DEFAULT_W}px`;
            box.style.height = `${DEFAULT_H}px`;
        }
    }, [status, id, boxRef]);

    // 언마운트 시 localStorage 정리
    useEffect(() => {
        return () => {
            clearGeometry(id);
        };
    }, [id]);

    const onClickMax = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(true);
        const box = boxRef.current;
        const w = window.innerWidth;
        const h = window.innerHeight - TASKBAR_HEIGHT;
        box.style.transition = "0.25s";
        box.style.left = "0px";
        box.style.top = "0px";
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        saveGeometry(id, { x: 0, y: 0, w, h });
    }, [boxRef, id]);

    const onClickNormalSize = useCallback(() => {
        if (!boxRef.current) return;
        setIsMaxSize(false);
        const box = boxRef.current;
        const prev = loadGeometry(id);
        const next: Geometry = {
            x: prev?.x ?? Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2)),
            y: prev?.y ?? Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2)),
            w: DEFAULT_W,
            h: DEFAULT_H,
        };
        box.style.transition = "0.25s";
        box.style.left = `${next.x}px`;
        box.style.top = `${next.y}px`;
        box.style.width = `${next.w}px`;
        box.style.height = `${next.h}px`;
        saveGeometry(id, next);
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
