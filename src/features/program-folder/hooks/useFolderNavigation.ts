import { useState, useCallback, useMemo } from "react";
import { selectFolderViewModel } from "@shared/lib/file-system/selectors/selectFolderViewModel";
import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";

export interface UseFolderNavigationParams {
    fsState: FileSystemState;
    initialFolderId: ProgramId;
    onOpenProgram: (id: ProgramId) => void;
}

export const useFolderNavigation = ({
    fsState,
    initialFolderId,
    onOpenProgram,
}: UseFolderNavigationParams) => {
    const [selectedId, setSelectedId] = useState<ProgramId | null>(null);
    const [currentFolderId, setCurrentFolderId] =
        useState<ProgramId>(initialFolderId);

    const viewModel = useMemo(
        () => selectFolderViewModel(fsState, currentFolderId),
        [fsState, currentFolderId],
    );

    const onClickItem = useCallback((id: ProgramId) => {
        setSelectedId(id);
    }, []);

    const onClickLeft = useCallback(() => {
        if (!viewModel.parentId) return;
        setCurrentFolderId(viewModel.parentId);
        setSelectedId(null);
    }, [viewModel.parentId]);

    const onDoubleClickItem = useCallback(
        (item: ProgramNode) => {
            if (item.type === "FOLDER") {
                setCurrentFolderId(item.id);
                setSelectedId(null);
            } else {
                onOpenProgram(item.id);
            }
        },
        [onOpenProgram],
    );

    return {
        selectedId,
        folderContents: viewModel.folderContents,
        route: viewModel.route,
        nodeType: viewModel.nodeType,
        hasChildren: viewModel.hasChildren,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    };
};
