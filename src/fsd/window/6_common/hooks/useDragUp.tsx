import { useRef, useState } from "react";

interface UseDragUpOptions {
  throttleTime?: number;
  onDragUp: (dragDistance: number) => void;
  onClick?: () => void;
  onDragEnd?: (dragDistance: number, deltaX: number, deltaY: number) => void;
}

interface UseDragUpReturn {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export default function useDragUp({
  throttleTime = 100,
  onDragUp,
  onClick,
  onDragEnd,
}: UseDragUpOptions): UseDragUpReturn {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastEventTimeRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
    lastEventTimeRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;

    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    const dragDistance = Math.abs(deltaY); // 위로 드래그한 거리 (픽셀)

    // 위로 드래그하고 있고, 수평 이동이 크지 않은 경우
    if (deltaY < -10 && deltaX < 50) {
      setIsDragging(true);

      // 드래그 중에도 이벤트 발생 (throttle 적용)
      const now = Date.now();
      if (now - lastEventTimeRef.current > throttleTime) {
        onDragUp(dragDistance);
        lastEventTimeRef.current = now;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;

    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaXAbs = Math.abs(deltaX);
    const dragDistance = Math.abs(deltaY); // 위로 드래그한 거리 (픽셀)

    // 드래그가 발생한 경우 (클릭이 아닌 경우)
    const hasDragged = Math.abs(deltaY) >= 5 || deltaXAbs >= 5;

    if (hasDragged && isDragging) {
      // 마우스 클릭 후 드래그하고 클릭이 떼진 경우
      onDragEnd?.(dragDistance, deltaX, deltaY);
    }

    // 위로 드래그한 경우 특정 이벤트 발생
    if (deltaY < -30 && deltaXAbs < 50) {
      onDragUp(dragDistance);
    }

    // 클릭만 한 경우 (드래그가 아닌 경우)
    if (!hasDragged && !isDragging) {
      onClick?.();
    }

    dragStartRef.current = null;
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    // 마우스가 요소를 벗어나면 드래그 상태 초기화
    dragStartRef.current = null;
    setIsDragging(false);
  };

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
}
