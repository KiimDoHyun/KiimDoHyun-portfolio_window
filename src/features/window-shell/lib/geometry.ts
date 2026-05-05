export interface Geometry {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Area {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export type ResizeDirection =
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

// panda token sizes.taskbar
export const TASKBAR_HEIGHT = 50;
// panda token sizes.windowHeader
export const HEADER_HEIGHT = 32;
export const MIN_WIDTH = 300;
export const MIN_HEIGHT = 60;

export function getAvailableArea(): Area {
    return {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight - TASKBAR_HEIGHT,
    };
}

interface ClampDragOptions {
    headerHeight?: number;
}

export function clampDragPosition(
    pos: { x: number; y: number },
    size: { w: number; h: number },
    area: Area,
    options: ClampDragOptions = {}
): { x: number; y: number } {
    const headerHeight = options.headerHeight ?? HEADER_HEIGHT;
    const minTop = area.top;
    const maxTop = area.bottom - headerHeight;
    const y = Math.min(Math.max(pos.y, minTop), maxTop);

    const minLeft = area.left;
    const maxLeft = area.right - size.w;
    const x = Math.min(Math.max(pos.x, minLeft), maxLeft);

    return { x, y };
}

interface ResizeOptions {
    minW?: number;
    minH?: number;
}

const isLeftSide = (d: ResizeDirection): boolean =>
    d === "left" || d === "top-left" || d === "bottom-left";
const isRightSide = (d: ResizeDirection): boolean =>
    d === "right" || d === "top-right" || d === "bottom-right";
const isTopSide = (d: ResizeDirection): boolean =>
    d === "top" || d === "top-left" || d === "top-right";
const isBottomSide = (d: ResizeDirection): boolean =>
    d === "bottom" || d === "bottom-left" || d === "bottom-right";

export function computeResize(
    direction: ResizeDirection,
    start: Geometry,
    dx: number,
    dy: number,
    area: Area,
    options: ResizeOptions = {}
): Geometry {
    const minW = options.minW ?? MIN_WIDTH;
    const minH = options.minH ?? MIN_HEIGHT;
    let { x, y, w, h } = start;

    if (isRightSide(direction)) {
        w = start.w + dx;
        if (w < minW) w = minW;
        if (x + w > area.right) w = area.right - x;
    }

    if (isBottomSide(direction)) {
        h = start.h + dy;
        if (h < minH) h = minH;
        if (y + h > area.bottom) h = area.bottom - y;
    }

    if (isLeftSide(direction)) {
        x = start.x + dx;
        w = start.w - dx;
        if (w < minW) {
            // right edge (start.x + start.w) 고정, x 보정
            x = start.x + start.w - minW;
            w = minW;
        }
        if (x < area.left) {
            w -= area.left - x;
            x = area.left;
        }
    }

    if (isTopSide(direction)) {
        y = start.y + dy;
        h = start.h - dy;
        if (h < minH) {
            // bottom edge (start.y + start.h) 고정
            y = start.y + start.h - minH;
            h = minH;
        }
        if (y < area.top) {
            h -= area.top - y;
            y = area.top;
        }
    }

    return { x, y, w, h };
}
