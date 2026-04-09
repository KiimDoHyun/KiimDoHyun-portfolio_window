import { renderHook, act } from "@testing-library/react";
import { useImageNavigation } from "../useImageNavigation";
import type { ProgramNode } from "@shared/types/program";

const makeImage = (id: string, name: string, src: string): ProgramNode => ({
    id,
    parentId: "parent",
    name,
    icon: "",
    type: "IMAGE",
    src,
});

const images: Array<ProgramNode> = [
    makeImage("img1", "사진1", "img1.png"),
    makeImage("img2", "사진2", "img2.png"),
    makeImage("img3", "사진3", "img3.png"),
];

describe("useImageNavigation", () => {
    it("currentId에 해당하는 인덱스를 초기값으로 설정한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img2" })
        );
        expect(result.current.curImageIdx).toBe(1);
        expect(result.current.imageArr).toBe(images);
    });

    it("onClickRight로 다음 이미지로 이동한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        act(() => result.current.onClickRight());
        expect(result.current.curImageIdx).toBe(1);
    });

    it("마지막 이미지에서 onClickRight는 인덱스를 유지한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img3" })
        );
        act(() => result.current.onClickRight());
        expect(result.current.curImageIdx).toBe(2);
    });

    it("onClickLeft로 이전 이미지로 이동한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img2" })
        );
        act(() => result.current.onClickLeft());
        expect(result.current.curImageIdx).toBe(0);
    });

    it("첫 이미지에서 onClickLeft는 인덱스를 유지한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        act(() => result.current.onClickLeft());
        expect(result.current.curImageIdx).toBe(0);
    });

    it("onClickScaleUp/Down으로 배율을 조절한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        expect(result.current.currentImage_sizeRate).toBe(1);

        act(() => result.current.onClickScaleUp());
        expect(result.current.currentImage_sizeRate).toBeCloseTo(1.2);

        act(() => result.current.onClickScaleDown());
        expect(result.current.currentImage_sizeRate).toBeCloseTo(1.0);
    });

    it("onClickScaleDown은 0 이하로 내려가지 않는다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        // 배율 1에서 5번 축소 → 0 도달
        act(() => {
            for (let i = 0; i < 6; i++) result.current.onClickScaleDown();
        });
        expect(result.current.currentImage_sizeRate).toBe(0);
    });

    it("onClickRotateLeft/Right로 회전한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        act(() => result.current.onClickRotateLeft());
        expect(result.current.currentImage_rotate).toBe(45);

        act(() => result.current.onClickRotateRight());
        expect(result.current.currentImage_rotate).toBe(0);
    });

    it("onClickDefault로 배율과 회전을 초기화한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        act(() => {
            result.current.onClickScaleUp();
            result.current.onClickRotateLeft();
        });
        act(() => result.current.onClickDefault());
        expect(result.current.currentImage_sizeRate).toBe(1);
        expect(result.current.currentImage_rotate).toBe(0);
    });

    it("이미지 이동 시 배율이 1로 리셋된다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images, currentId: "img1" })
        );
        act(() => result.current.onClickScaleUp());
        expect(result.current.currentImage_sizeRate).toBeCloseTo(1.2);

        act(() => result.current.onClickRight());
        expect(result.current.currentImage_sizeRate).toBe(1);
    });

    it("빈 이미지 배열에서도 에러 없이 동작한다", () => {
        const { result } = renderHook(() =>
            useImageNavigation({ images: [], currentId: "none" })
        );
        expect(result.current.curImageIdx).toBe(0);
        expect(result.current.imageArr).toHaveLength(0);
    });
});
