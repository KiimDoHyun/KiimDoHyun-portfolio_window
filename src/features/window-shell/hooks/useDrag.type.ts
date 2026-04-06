import { DRAG_DIRECTION } from "./useDrag.meta";

export type DragDirection = {
  [DRAG_DIRECTION.UP]: boolean;
  [DRAG_DIRECTION.DOWN]: boolean;
  [DRAG_DIRECTION.LEFT]: boolean;
  [DRAG_DIRECTION.RIGHT]: boolean;
};

export interface DragEventParams {
  e: React.MouseEvent;
  deltaX: number;
  deltaY: number;
  dragDistance: number;
  dragDirection: DragDirection;
}

export type OnDragEnd = (params: DragEventParams) => void;
export type OnDrag = (params: DragEventParams) => void;
