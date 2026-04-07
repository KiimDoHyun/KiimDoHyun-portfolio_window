import { useCallback, useEffect, useRef } from "react";

interface UseWindowResizeParams {
  boxRef: React.RefObject<HTMLDivElement | null>;
  name: string;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 60;

/**
 * 창 우측 하단(기타 코너/모서리) 핸들을 이용한 리사이즈 훅.
 * 기존 ProgramContainer 의 9방향 분기 로직을 단일 핸들러로 정리해 옮긴 버전.
 * 보존 목적상 동작은 bottom-right 확장/축소 중심이며, 최소 크기 제약을 적용한다.
 */
export function useWindowResize({ boxRef, name }: UseWindowResizeParams) {
  const isResizingRef = useRef(false);
  const prevPosRef = useRef<{ X: number; Y: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isResizingRef.current = true;
    prevPosRef.current = { X: e.clientX, Y: e.clientY };
  }, []);

  const onMouseUp = useCallback(() => {
    isResizingRef.current = false;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !boxRef.current || !prevPosRef.current) {
        return;
      }
      const box = boxRef.current;
      const deltaX = e.clientX - prevPosRef.current.X;
      const deltaY = e.clientY - prevPosRef.current.Y;

      box.style.transition = "0s";

      const nextWidth = box.offsetWidth + deltaX;
      const nextHeight = box.offsetHeight + deltaY;

      if (nextWidth >= MIN_WIDTH) {
        localStorage.setItem(`${name}width`, `${nextWidth}px`);
        box.style.width = `${nextWidth}px`;
      }
      if (nextHeight >= MIN_HEIGHT) {
        localStorage.setItem(`${name}height`, `${nextHeight}px`);
        box.style.height = `${nextHeight}px`;
      }

      prevPosRef.current = { X: e.clientX, Y: e.clientY };
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
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
