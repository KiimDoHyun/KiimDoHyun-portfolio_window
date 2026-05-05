import { useCallback, useEffect, useRef } from "react";
import { loadGeometry, saveGeometry } from "../lib/persist";

interface UseWindowDragParams {
  boxRef: React.RefObject<HTMLDivElement | null>;
  id: string;
}

/**
 * 창 헤더 드래그로 위치를 이동시키는 훅.
 * 성능 이유로 DOM 을 직접 mutation 하고 mouseup 시 1회 localStorage 에 저장한다.
 */
export function useWindowDrag({ boxRef, id }: UseWindowDragParams) {
  const isMovableRef = useRef(false);
  const prevPosRef = useRef<{ X: number; Y: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isMovableRef.current = true;
    prevPosRef.current = { X: e.clientX, Y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    isMovableRef.current = false;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMovableRef.current || !boxRef.current || !prevPosRef.current) {
        return;
      }
      const box = boxRef.current;
      const dx = e.clientX - prevPosRef.current.X;
      const dy = e.clientY - prevPosRef.current.Y;
      prevPosRef.current = { X: e.clientX, Y: e.clientY };

      box.style.transition = "0s";
      const nextLeft = box.offsetLeft + dx;
      const nextTop = box.offsetTop + dy;
      box.style.left = `${nextLeft}px`;
      box.style.top = `${nextTop}px`;
    };

    const handleMouseUp = () => {
      if (isMovableRef.current && boxRef.current) {
        // mouseup 시 1회 저장
        const box = boxRef.current;
        const prev = loadGeometry(id);
        saveGeometry(id, {
          x: box.offsetLeft,
          y: box.offsetTop,
          w: prev?.w ?? box.offsetWidth,
          h: prev?.h ?? box.offsetHeight,
        });
      }
      isMovableRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [boxRef, id]);

  return { onMouseDown, onMouseUp };
}
