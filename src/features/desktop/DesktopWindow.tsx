import React, { useCallback, useMemo, useRef } from "react";
import Window from "./components/Window";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import type { ProgramNode } from "@shared/types/program";

const DesktopWindow = () => {
    const windowRef = useRef<HTMLDivElement | null>(null);
    const rootId = useFileSystemStore((s) => s.rootId);
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);

    const iconBoxArr = useMemo<Array<ProgramNode>>(() => {
        if (!rootId) return [];
        return (childrenByParent[rootId] ?? [])
            .map((id) => nodes[id])
            .filter((n): n is ProgramNode => !!n);
    }, [rootId, nodes, childrenByParent]);

    const onClickIcon = useCallback((_item: ProgramNode) => {}, []);
    const onDoubleClickIcon = useCallback((item: ProgramNode) => {
        useRunningProgramsStore.getState().open(item.id);
    }, []);

    return (
        <Window
            windowRef={windowRef}
            iconBoxArr={iconBoxArr}
            onClickIcon={onClickIcon}
            onDoubleClickIcon={onDoubleClickIcon}
        />
    );
};

export default React.memo(DesktopWindow);
