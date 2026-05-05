import { describe, it, expect, beforeEach } from "vitest";
import { loadGeometry, saveGeometry, clearGeometry } from "../persist";

beforeEach(() => {
    localStorage.clear();
});

describe("persist", () => {
    it("저장한 geometry 를 그대로 복원한다", () => {
        saveGeometry("node-1", { x: 100, y: 200, w: 500, h: 400 });
        expect(loadGeometry("node-1")).toEqual({ x: 100, y: 200, w: 500, h: 400 });
    });

    it("저장된 값이 없으면 null 을 반환한다", () => {
        expect(loadGeometry("missing")).toBeNull();
    });

    it("일부 키가 누락되면 null 을 반환한다", () => {
        localStorage.setItem("node-1x", "100");
        // y/w/h 없음
        expect(loadGeometry("node-1")).toBeNull();
    });

    it("숫자 파싱 실패 시 null 을 반환한다", () => {
        localStorage.setItem("node-1x", "not-a-number");
        localStorage.setItem("node-1y", "0");
        localStorage.setItem("node-1w", "500");
        localStorage.setItem("node-1h", "500");
        expect(loadGeometry("node-1")).toBeNull();
    });

    it("clearGeometry 는 4개 키를 모두 제거한다", () => {
        saveGeometry("node-1", { x: 1, y: 2, w: 3, h: 4 });
        clearGeometry("node-1");
        expect(localStorage.getItem("node-1x")).toBeNull();
        expect(localStorage.getItem("node-1y")).toBeNull();
        expect(localStorage.getItem("node-1w")).toBeNull();
        expect(localStorage.getItem("node-1h")).toBeNull();
    });
});
