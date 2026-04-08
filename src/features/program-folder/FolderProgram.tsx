import { useState } from "react";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useFolderNavigation } from "./hooks/useFolderNavigation";
import { DISPLAY_LIST, DEFAULT_DISPLAY_TYPE } from "./FolderProgram.types";
import FolderHeader from "./ui/FolderHeader";
import FolderGrid from "./ui/FolderGrid";
import type { ProgramId } from "@shared/types/program";

interface FolderProgramProps {
    id: ProgramId;
}

const FolderProgram = ({ id }: FolderProgramProps) => {
    const node = useFileSystemStore((s) => s.nodes[id]);
    const [displayType, setDisplayType] = useState(DEFAULT_DISPLAY_TYPE);

    const {
        selectedId,
        folderContents,
        route,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    } = useFolderNavigation({ initialFolderId: id });

    return (
        <>
            <FolderHeader
                type={node?.type ?? "FOLDER"}
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
                onClickItem={onClickItem}
                onDoubleClickItem={onDoubleClickItem}
            />
        </>
    );
};

export default FolderProgram;
