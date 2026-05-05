import { useCallback, useEffect, useRef } from "react";
import { clampDragPosition, getAvailableArea } from "../lib/geometry";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowDragParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: string;
}

/**
 * 창 헤더 드래그로 위치를 transform 기반으로 이동시키는 훅.
 * - 위치는 translate3d 로 표현 (composite-only)
 * - mousemove 는 ref 캐시 + rAF 한 프레임당 1회 transform write
 * - mouseup 시 1회 localStorage 저장
 * - 상/하 클램핑: 헤더가 viewport 위로 사라지지 않고 taskbar 뒤로 가려지지 않음
 */
export function useWindowDrag({ boxRef, id }: UseWindowDragParams) {
    const isMovableRef = useRef(false);
    const prevMouseRef = useRef<{ X: number; Y: number } | null>(null);
    const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const rafIdRef = useRef<number>(0);
    const prevTransitionRef = useRef<string>("");

    const apply = useCallback(() => {
        rafIdRef.current = 0;
        if (!boxRef.current) return;
        boxRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }, [boxRef]);

    const onMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (!boxRef.current) return;
            isMovableRef.current = true;
            prevMouseRef.current = { X: e.clientX, Y: e.clientY };

            const stored = loadGeometry(id);
            if (stored) {
                posRef.current = { x: stored.x, y: stored.y };
                sizeRef.current = { w: stored.w, h: stored.h };
            }

            prevTransitionRef.current = boxRef.current.style.transition;
            boxRef.current.style.transition = "0s";
        },
        [boxRef, id]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isMovableRef.current || !prevMouseRef.current) return;

            const dx = e.clientX - prevMouseRef.current.X;
            const dy = e.clientY - prevMouseRef.current.Y;
            prevMouseRef.current = { X: e.clientX, Y: e.clientY };

            const next = clampDragPosition(
                { x: posRef.current.x + dx, y: posRef.current.y + dy },
                getAvailableArea()
            );
            posRef.current = next;

            if (rafIdRef.current === 0) {
                rafIdRef.current = requestAnimationFrame(apply);
            }
        };

        const handleMouseUp = () => {
            if (isMovableRef.current && boxRef.current) {
                boxRef.current.style.transition = prevTransitionRef.current;
                saveGeometry(id, {
                    x: posRef.current.x,
                    y: posRef.current.y,
                    w: sizeRef.current.w,
                    h: sizeRef.current.h,
                });
            }
            isMovableRef.current = false;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (rafIdRef.current !== 0) cancelAnimationFrame(rafIdRef.current);
        };
    }, [boxRef, id, apply]);

    return { onMouseDown };
}
