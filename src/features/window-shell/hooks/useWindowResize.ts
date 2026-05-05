import { useCallback, useEffect, useRef } from "react";
import { MIN_HEIGHT, MIN_WIDTH } from "../lib/geometry";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowResizeParams {
  boxRef: React.RefObject<HTMLDivElement | null>;
  id: string;
}

/**
 * 창 우측 하단(기타 코너/모서리) 핸들을 이용한 리사이즈 훅.
 * mouseup 시 1회 localStorage 에 저장한다.
 */
export function useWindowResize({ boxRef, id }: UseWindowResizeParams) {
  const isResizingRef = useRef(false);
  const prevPosRef = useRef<{ X: number; Y: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isResizingRef.current = true;
    prevPosRef.current = { X: e.clientX, Y: e.clientY };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !boxRef.current || !prevPosRef.current) {
        return;
      }
      const box = boxRef.current;
      const dx = e.clientX - prevPosRef.current.X;
      const dy = e.clientY - prevPosRef.current.Y;

      box.style.transition = "0s";

      const nextWidth = box.offsetWidth + dx;
      const nextHeight = box.offsetHeight + dy;

      if (nextWidth >= MIN_WIDTH) {
        box.style.width = `${nextWidth}px`;
      }
      if (nextHeight >= MIN_HEIGHT) {
        box.style.height = `${nextHeight}px`;
      }

      prevPosRef.current = { X: e.clientX, Y: e.clientY };
    };

    const handleMouseUp = () => {
      if (isResizingRef.current && boxRef.current) {
        const box = boxRef.current;
        const prev = loadGeometry(id);
        saveGeometry(id, {
          x: prev?.x ?? box.offsetLeft,
          y: prev?.y ?? box.offsetTop,
          w: box.offsetWidth,
          h: box.offsetHeight,
        });
      }
      isResizingRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [boxRef, id]);

  return { onMouseDown };
}
