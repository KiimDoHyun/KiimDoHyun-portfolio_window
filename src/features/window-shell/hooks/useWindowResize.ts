import { useCallback, useEffect, useRef } from "react";
import {
    computeResize,
    getAvailableArea,
    type Geometry,
    type ResizeDirection,
} from "../lib/geometry";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowResizeParams {
    boxRef: React.RefObject<HTMLDivElement | null>;
    id: string;
}

/**
 * 8방향 리사이즈 훅. direction 인자로 변/모서리를 분기하고 computeResize 가
 * min/area 클램핑을 일괄 처리한다.
 * - mousemove 마다 box read 없이 ref 캐시 + rAF 한 프레임당 1회 write
 * - mouseup 시 1회 localStorage 저장
 * - React onMouseUp 은 document mouseup 보다 먼저 fire 되어 ref 를 조기 해제하므로
 *   handle 에 바인딩하지 않고 document mouseup 으로만 종료를 감지한다 (drag 와 동일 패턴).
 */
export function useWindowResize({ boxRef, id }: UseWindowResizeParams) {
    const directionRef = useRef<ResizeDirection | null>(null);
    const startMouseRef = useRef<{ X: number; Y: number } | null>(null);
    const startGeomRef = useRef<Geometry | null>(null);
    const currentGeomRef = useRef<Geometry | null>(null);
    const rafIdRef = useRef<number>(0);
    const prevTransitionRef = useRef<string>("");

    const apply = useCallback(() => {
        rafIdRef.current = 0;
        const box = boxRef.current;
        const geom = currentGeomRef.current;
        if (!box || !geom) return;
        box.style.transform = `translate3d(${geom.x}px, ${geom.y}px, 0)`;
        box.style.width = `${geom.w}px`;
        box.style.height = `${geom.h}px`;
    }, [boxRef]);

    const onMouseDown = useCallback(
        (direction: ResizeDirection) => (e: React.MouseEvent) => {
            if (!boxRef.current) return;
            directionRef.current = direction;
            startMouseRef.current = { X: e.clientX, Y: e.clientY };

            const stored = loadGeometry(id);
            const start: Geometry = stored ?? {
                x: boxRef.current.offsetLeft,
                y: boxRef.current.offsetTop,
                w: boxRef.current.offsetWidth,
                h: boxRef.current.offsetHeight,
            };
            startGeomRef.current = start;
            currentGeomRef.current = start;

            prevTransitionRef.current = boxRef.current.style.transition;
            boxRef.current.style.transition = "0s";
        },
        [boxRef, id]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const direction = directionRef.current;
            const startMouse = startMouseRef.current;
            const startGeom = startGeomRef.current;
            if (!direction || !startMouse || !startGeom) return;

            const dx = e.clientX - startMouse.X;
            const dy = e.clientY - startMouse.Y;
            currentGeomRef.current = computeResize(
                direction,
                startGeom,
                dx,
                dy,
                getAvailableArea()
            );

            if (rafIdRef.current === 0) {
                rafIdRef.current = requestAnimationFrame(apply);
            }
        };

        const handleMouseUp = () => {
            if (
                directionRef.current &&
                boxRef.current &&
                currentGeomRef.current
            ) {
                boxRef.current.style.transition = prevTransitionRef.current;
                saveGeometry(id, currentGeomRef.current);
            }
            directionRef.current = null;
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
