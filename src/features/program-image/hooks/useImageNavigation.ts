import { useCallback, useEffect, useMemo, useState } from "react";
import { useFileSystemStore } from "@store/fileSystemStore";
import type { ProgramId, ProgramNode } from "@shared/types/program";

export interface UseImageNavigationParams {
    id: ProgramId;
}

export interface UseImageNavigationResult {
    imageArr: Array<ProgramNode>;
    curImageIdx: number;
    currentImage_sizeRate: number;
    currentImage_rotate: number;
    onClickLeft: () => void;
    onClickRight: () => void;
    onClickScaleUp: () => void;
    onClickScaleDown: () => void;
    onClickRotateLeft: () => void;
    onClickRotateRight: () => void;
    onClickDefault: () => void;
}

export const useImageNavigation = ({
    id,
}: UseImageNavigationParams): UseImageNavigationResult => {
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const self = nodes[id];
    const parentId = self?.parentId ?? null;

    const imageArr = useMemo<Array<ProgramNode>>(() => {
        if (!parentId) return [];
        return (childrenByParent[parentId] ?? [])
            .map((cid) => nodes[cid])
            .filter((n): n is ProgramNode => !!n && n.type === "IMAGE");
    }, [childrenByParent, nodes, parentId]);

    const [curImageIdx, setCurImageIdx] = useState<number>(0);
    const [currentImage_sizeRate, setCurrentImage_sizeRate] =
        useState<number>(1);
    const [currentImage_rotate, setCurrentImage_rotate] = useState<number>(0);

    useEffect(() => {
        const idx = imageArr.findIndex((item) => item.id === id);
        setCurImageIdx(idx >= 0 ? idx : 0);
    }, [imageArr, id]);

    const onClickLeft = useCallback(() => {
        setCurImageIdx((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
        setCurrentImage_sizeRate(1);
    }, []);

    const onClickRight = useCallback(() => {
        setCurImageIdx((prev) =>
            prev + 1 < imageArr.length ? prev + 1 : imageArr.length - 1
        );
        setCurrentImage_sizeRate(1);
    }, [imageArr.length]);

    const onClickScaleUp = useCallback(() => {
        setCurrentImage_sizeRate((prev) => prev + 0.2);
    }, []);

    const onClickScaleDown = useCallback(() => {
        setCurrentImage_sizeRate((prev) => (prev - 0.2 > 0 ? prev - 0.2 : 0));
    }, []);

    const onClickRotateRight = useCallback(() => {
        setCurrentImage_rotate((prev) => (prev - 45) % 360);
    }, []);

    const onClickRotateLeft = useCallback(() => {
        setCurrentImage_rotate((prev) => (prev + 45) % 360);
    }, []);

    const onClickDefault = useCallback(() => {
        setCurrentImage_rotate(0);
        setCurrentImage_sizeRate(1);
    }, []);

    return {
        imageArr,
        curImageIdx,
        currentImage_sizeRate,
        currentImage_rotate,
        onClickLeft,
        onClickRight,
        onClickScaleUp,
        onClickScaleDown,
        onClickRotateLeft,
        onClickRotateRight,
        onClickDefault,
    };
};
