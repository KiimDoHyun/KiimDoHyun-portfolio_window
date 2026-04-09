import { useState } from "react";
import { useFolderNavigation } from "./hooks/useFolderNavigation";
import { DISPLAY_LIST, DEFAULT_DISPLAY_TYPE } from "./FolderProgram.types";
import FolderHeader from "./ui/FolderHeader";
import FolderGrid from "./ui/FolderGrid";
import type { FileSystemState, ProgramId } from "@shared/types/program";

interface FolderProgramProps {
    fsState: FileSystemState;
    initialFolderId: ProgramId;
    onOpenProgram: (id: ProgramId) => void;
}

const FolderProgram = ({
    fsState,
    initialFolderId,
    onOpenProgram,
}: FolderProgramProps) => {
    const [displayType, setDisplayType] = useState(DEFAULT_DISPLAY_TYPE);

    const {
        selectedId,
        folderContents,
        route,
        nodeType,
        hasChildren,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    } = useFolderNavigation({ fsState, initialFolderId, onOpenProgram });

    return (
        <>
            <FolderHeader
                type={nodeType}
                route={route || "/ [error]"}
                displayType={displayType}
                displayList={DISPLAY_LIST}
                onClickLeft={onClickLeft}
                onChangeDisplayType={setDisplayType}
            />
            <FolderGrid
                items={folderContents}
                displayType={displayType}
                selectedId={selectedId}
                hasChildren={hasChildren}
                onClickItem={onClickItem}
                onDoubleClickItem={onDoubleClickItem}
            />
        </>
    );
};

export default FolderProgram;
