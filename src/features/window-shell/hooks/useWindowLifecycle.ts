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
 * 위치는 transform: translate3d 로, 크기는 width/height 로 표현한다.
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

    // 위치/크기/opacity/scale — status 전이
    useEffect(() => {
        if (!boxRef.current) return;
        const box = boxRef.current;
        if (status === "active") {
            box.style.transition = "0.25s";
            box.style.opacity = "1";
            box.style.scale = "1";

            if (isMaxSize) {
                box.style.transform = "translate3d(0, 0, 0)";
                return;
            }

            const stored = loadGeometry(id);
            if (stored) {
                box.style.transform = `translate3d(${stored.x}px, ${stored.y}px, 0)`;
                box.style.width = `${stored.w}px`;
                box.style.height = `${stored.h}px`;
            } else {
                const cx = Math.max(0, Math.floor(window.innerWidth / 2 - DEFAULT_W / 2));
                const cy = Math.max(0, Math.floor(window.innerHeight / 2 - DEFAULT_H / 2));
                box.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
                box.style.width = `${DEFAULT_W}px`;
                box.style.height = `${DEFAULT_H}px`;
                // drag/resize 가 mousedown 에서 stored 를 안전하게 읽도록 default 도 영속화
                saveGeometry(id, { x: cx, y: cy, w: DEFAULT_W, h: DEFAULT_H });
            }
        } else if (status === "min") {
            box.style.transition = "0.25s";
            box.style.opacity = "0";
            box.style.scale = "0.6";
            const minY = Math.floor(window.innerHeight * 0.6);
            box.style.transform = `translate3d(80px, ${minY}px, 0)`;
            box.style.width = `${DEFAULT_W}px`;
            box.style.height = `${DEFAULT_H}px`;
        }
    }, [status, isMaxSize, boxRef, id]);

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
        box.style.transform = "translate3d(0, 0, 0)";
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        // 최대화 시에는 localStorage 를 덮어쓰지 않는다.
        // 복원 시 마지막에 저장된 (드래그/리사이즈) 위치로 돌아가도록 두기 위함.
    }, [boxRef]);

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
        box.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
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
