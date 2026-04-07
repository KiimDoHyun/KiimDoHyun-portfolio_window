import { useCallback, useEffect, useRef } from "react";

interface UseWindowDragParams {
  boxRef: React.RefObject<HTMLDivElement | null>;
  name: string;
}

/**
 * 창 헤더 드래그로 위치를 이동시키는 훅.
 * 성능 이유로 DOM 을 직접 mutation 하고 localStorage 에 마지막 위치를 저장한다.
 */
export function useWindowDrag({ boxRef, name }: UseWindowDragParams) {
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
      const posX = prevPosRef.current.X - e.clientX;
      const posY = prevPosRef.current.Y - e.clientY;

      prevPosRef.current = { X: e.clientX, Y: e.clientY };

      box.style.transition = "0s";
      const nextLeft = box.offsetLeft - posX;
      const nextTop = box.offsetTop - posY;

      localStorage.setItem(`${name}Left`, String(nextLeft));
      localStorage.setItem(`${name}Top`, String(nextTop));

      box.style.left = `${nextLeft}px`;
      box.style.top = `${nextTop}px`;
    };

    const handleMouseUp = () => {
      isMovableRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [boxRef, name]);

  return { onMouseDown, onMouseUp };
}
