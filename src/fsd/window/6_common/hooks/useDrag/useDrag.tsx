import { useRef } from "react";
import { DragDirection, OnDrag, OnDragEnd } from "./useDrag.type";
import { DRAG_DIRECTION } from "./useDrag.meta";

export interface Props {
  /** 드래그 시작 시 발생할 이벤트트 */
  onDragStart?: VoidFunction;
  /** 드래그 종료 시 발생할 이벤트 */
  onDragEnd?: OnDragEnd;
  /** 드래그 중 발생할 이벤트 */
  onDrag?: OnDrag;
  /** 마우스가 요소를 벗어날 때 발생할 이벤트 */
  onMouseLeave?: VoidFunction;
}

export default function useDrag({
  onDragStart,
  onDragEnd,
  onDrag,
  onMouseLeave,
}: Props) {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastEventTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragDirectionRef = useRef<DragDirection>({
    [DRAG_DIRECTION.UP]: false,
    [DRAG_DIRECTION.DOWN]: false,
    [DRAG_DIRECTION.LEFT]: false,
    [DRAG_DIRECTION.RIGHT]: false,
  });

  const setDragDirection = (direction: keyof DragDirection, value: boolean) => {
    dragDirectionRef.current[direction] = value;
  };

  const setIsDragStart = () => (isDraggingRef.current = true);
  const setIsDragEnd = () => (isDraggingRef.current = false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragStart();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastEventTimeRef.current = 0;
    onDragStart?.();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) {
      return;
    }
    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    const dragDistance = Math.abs(deltaY);

    setDragDirection(DRAG_DIRECTION.UP, deltaY < 0);
    setDragDirection(DRAG_DIRECTION.DOWN, deltaY > 0);
    setDragDirection(DRAG_DIRECTION.LEFT, deltaX < 0);
    setDragDirection(DRAG_DIRECTION.RIGHT, deltaX > 0);

    onDrag?.({
      e,
      deltaX,
      deltaY,
      dragDistance,
      dragDirection: dragDirectionRef.current,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragEnd();
    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaX = e.clientX - dragStartRef.current.x;
    const dragDistance = Math.abs(deltaY);

    onDragEnd({
      e,
      deltaX,
      deltaY,
      dragDistance,
      dragDirection: dragDirectionRef.current,
    });

    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    onMouseLeave();
  };

  return {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
}
