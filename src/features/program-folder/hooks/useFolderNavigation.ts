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
    const [selectedIds, setSelectedIds] = useState<ProgramId[]>([]);
    const [currentFolderId, setCurrentFolderId] =
        useState<ProgramId>(initialFolderId);

    const viewModel = useMemo(
        () => selectFolderViewModel(fsState, currentFolderId),
        [fsState, currentFolderId],
    );

    const onClickItem = useCallback((id: ProgramId) => {
        setSelectedIds([id]);
    }, []);

    const onClickLeft = useCallback(() => {
        if (!viewModel.parentId) return;
        setCurrentFolderId(viewModel.parentId);
        setSelectedIds([]);
    }, [viewModel.parentId]);

    const onDoubleClickItem = useCallback(
        (item: ProgramNode) => {
            if (item.type === "FOLDER") {
                setCurrentFolderId(item.id);
                setSelectedIds([]);
            } else {
                onOpenProgram(item.id);
            }
        },
        [onOpenProgram],
    );

    return {
        selectedIds,
        folderContents: viewModel.folderContents,
        route: viewModel.route,
        nodeType: viewModel.nodeType,
        hasChildren: viewModel.hasChildren,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    };
};
