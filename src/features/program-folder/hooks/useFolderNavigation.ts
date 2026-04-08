import { useState, useCallback, useMemo } from "react";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { getRoute } from "@shared/lib/file-system/getRoute";
import type { ProgramId, ProgramNode } from "@shared/types/program";

export interface UseFolderNavigationParams {
    initialFolderId: ProgramId;
}

export const useFolderNavigation = ({
    initialFolderId,
}: UseFolderNavigationParams) => {
    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const rootId = useFileSystemStore((s) => s.rootId);

    const [selectedId, setSelectedId] = useState<ProgramId | null>(null);
    const [currentFolderId, setCurrentFolderId] =
        useState<ProgramId>(initialFolderId);

    const currentFolder = useMemo<ProgramNode | null>(
        () => nodes[currentFolderId] ?? null,
        [nodes, currentFolderId]
    );

    const folderContents = useMemo<Array<ProgramNode>>(() => {
        const ids = childrenByParent[currentFolderId] ?? [];
        return ids
            .map((id) => nodes[id])
            .filter((n): n is ProgramNode => !!n);
    }, [childrenByParent, nodes, currentFolderId]);

    const route = useMemo(
        () => getRoute({ rootId, nodes, childrenByParent }, currentFolderId),
        [rootId, nodes, childrenByParent, currentFolderId]
    );

    const onClickItem = useCallback((id: ProgramId) => {
        setSelectedId(id);
    }, []);

    const onClickLeft = useCallback(() => {
        const self = nodes[currentFolderId];
        if (!self || !self.parentId) return;
        setCurrentFolderId(self.parentId);
        setSelectedId(null);
    }, [nodes, currentFolderId]);

    const onDoubleClickItem = useCallback(
        (item: ProgramNode) => {
            if (item.type === "FOLDER") {
                setCurrentFolderId(item.id);
                setSelectedId(null);
            } else {
                useRunningProgramsStore.getState().open(item.id);
            }
        },
        []
    );

    return {
        selectedId,
        folderContents,
        currentFolder,
        route,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    };
};
