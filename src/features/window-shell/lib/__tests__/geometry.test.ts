import { describe, it, expect } from "vitest";
import {
    clampDragPosition,
    computeResize,
    HEADER_HEIGHT,
    MIN_HEIGHT,
    MIN_WIDTH,
    TASKBAR_HEIGHT,
    type Area,
    type Geometry,
} from "../geometry";

const area: Area = { left: 0, top: 0, right: 1000, bottom: 600 };
const size = { w: 500, h: 400 };

describe("clampDragPosition", () => {
    it("top 은 0 이상으로 강제된다", () => {
        expect(clampDragPosition({ x: 50, y: -30 }, size, area).y).toBe(0);
    });

    it("top 은 area.bottom - headerHeight 이하로 강제된다", () => {
        const result = clampDragPosition({ x: 50, y: 1000 }, size, area);
        expect(result.y).toBe(area.bottom - HEADER_HEIGHT);
    });

    it("left 는 area.left 이상으로 강제된다", () => {
        expect(clampDragPosition({ x: -500, y: 100 }, size, area).x).toBe(area.left);
    });

    it("right (x + w) 는 area.right 이하로 강제된다 — x 는 area.right - w", () => {
        expect(clampDragPosition({ x: 9999, y: 100 }, size, area).x).toBe(area.right - size.w);
    });

    it("정상 범위 안의 값은 그대로 반환한다", () => {
        expect(clampDragPosition({ x: 100, y: 100 }, size, area)).toEqual({ x: 100, y: 100 });
    });
});

describe("computeResize", () => {
    const start: Geometry = { x: 100, y: 100, w: 500, h: 400 };

    it("right 핸들: width 만 변경된다", () => {
        expect(computeResize("right", start, 50, 999, area)).toEqual({
            x: 100, y: 100, w: 550, h: 400,
        });
    });

    it("bottom 핸들: height 만 변경된다", () => {
        expect(computeResize("bottom", start, 999, 80, area)).toEqual({
            x: 100, y: 100, w: 500, h: 480,
        });
    });

    it("left 핸들: x 와 width 가 동시에 변경된다 (right edge 고정)", () => {
        // dx = -30 → 좌측으로 30 만큼 키움
        expect(computeResize("left", start, -30, 0, area)).toEqual({
            x: 70, y: 100, w: 530, h: 400,
        });
    });

    it("top 핸들: y 와 height 가 동시에 변경된다 (bottom edge 고정)", () => {
        expect(computeResize("top", start, 0, -40, area)).toEqual({
            x: 100, y: 60, w: 500, h: 440,
        });
    });

    it("top-left 모서리: 위치/크기 모두 동시 변경", () => {
        expect(computeResize("top-left", start, -20, -10, area)).toEqual({
            x: 80, y: 90, w: 520, h: 410,
        });
    });

    it("우/하 max 클램핑: x + w 가 area.right 를 넘지 않는다", () => {
        const r = computeResize("right", start, 9999, 0, area);
        expect(r.x + r.w).toBeLessThanOrEqual(area.right);
    });

    it("좌/상 음수 클램핑: x 가 area.left 미만이면 보정되고 width 도 줄어든다", () => {
        // start.x = 100, dx = -300 → x = -200, w = 800 → 클램핑 후 x = 0, w = 600
        const r = computeResize("left", start, -300, 0, area);
        expect(r.x).toBe(0);
        expect(r.w).toBe(600);
    });

    it("min size: width 가 MIN_WIDTH 미만으로 못 내려가고, left 핸들이면 x 가 right edge 기준으로 보정된다", () => {
        // start.x = 100, start.w = 500. dx = +500 → w 를 0 으로 만들려 함
        const r = computeResize("left", start, 500, 0, area);
        expect(r.w).toBe(MIN_WIDTH);
        // right edge (start.x + start.w = 600) 가 고정되므로 x = 600 - MIN_WIDTH
        expect(r.x).toBe(600 - MIN_WIDTH);
    });

    it("min size: height 가 MIN_HEIGHT 미만으로 못 내려간다", () => {
        const r = computeResize("bottom", start, 0, -9999, area);
        expect(r.h).toBe(MIN_HEIGHT);
    });
});

describe("상수", () => {
    it("panda token 과 일치하는 픽셀 값", () => {
        expect(TASKBAR_HEIGHT).toBe(50);
        expect(HEADER_HEIGHT).toBe(32);
        expect(MIN_WIDTH).toBe(300);
        expect(MIN_HEIGHT).toBe(60);
    });
});
