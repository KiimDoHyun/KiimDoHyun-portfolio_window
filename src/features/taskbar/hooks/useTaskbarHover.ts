import { useCallback, useRef, useState } from "react";
import type { HoverTarget, TaskbarProgramItem } from "../TaskBar.types";

const glowLevelArr = [
    "", // none
    "#ffffff0d", // 호버
    "#ffffff24", // active
    "#ffffff2b", // 호버 + active
];

export interface UseTaskbarHoverParams {
    activeProgram: string;
    onPreviewChange: (active: boolean) => void;
}

export interface UseTaskbarHoverResult {
    hoverTarget: HoverTarget;
    iconContainerRef: React.MutableRefObject<HTMLDivElement | null>;
    onMouseEnter: (item: TaskbarProgramItem, idx: number) => void;
    onMouseLeave: (idx: number) => void;
    /** 클릭 직후 아이콘을 active glow 로 표시 */
    highlightActive: (idx: number) => void;
    /** hover 를 해제 */
    clearHover: () => void;
}

export const useTaskbarHover = ({
    activeProgram,
    onPreviewChange,
}: UseTaskbarHoverParams): UseTaskbarHoverResult => {
    const [hoverTarget, setHoverTarget] = useState<HoverTarget>({
        name: "",
        idx: -1,
    });
    const iconContainerRef = useRef<HTMLDivElement | null>(null);

    const setIconBg = useCallback((idx: number, color: string) => {
        const container = iconContainerRef.current;
        if (!container) return;
        const child = container.children[idx] as HTMLElement | undefined;
        if (!child) return;
        child.style.backgroundColor = color;
    }, []);

    const onMouseEnter = useCallback(
        (item: TaskbarProgramItem, idx: number) => {
            onPreviewChange(true);
            const container = iconContainerRef.current;
            const child = container?.children[idx] as HTMLElement | undefined;
            if (child) {
                child.style.backgroundColor =
                    child.title === activeProgram
                        ? glowLevelArr[3]
                        : glowLevelArr[1];
            }
            setHoverTarget({ name: item.name, idx });
        },
        [activeProgram, onPreviewChange]
    );

    const onMouseLeave = useCallback(
        (idx: number) => {
            onPreviewChange(false);
            setIconBg(idx, glowLevelArr[0]);
            setHoverTarget({ name: "", idx: -1 });
        },
        [onPreviewChange, setIconBg]
    );

    const highlightActive = useCallback(
        (idx: number) => {
            setIconBg(idx, glowLevelArr[2]);
        },
        [setIconBg]
    );

    const clearHover = useCallback(() => {
        setHoverTarget({ name: "", idx: -1 });
    }, []);

    return {
        hoverTarget,
        iconContainerRef,
        onMouseEnter,
        onMouseLeave,
        highlightActive,
        clearHover,
    };
};
