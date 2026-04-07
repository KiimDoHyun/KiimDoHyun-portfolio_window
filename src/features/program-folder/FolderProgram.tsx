import { useState } from "react";
import { useDesktopData } from "@pages/DesktopPage/useDesktopData";
import { useFolderNavigation } from "./hooks/useFolderNavigation";
import { DISPLAY_LIST, DEFAULT_DISPLAY_TYPE } from "./FolderProgram.types";
import FolderHeader from "./ui/FolderHeader";
import FolderGrid from "./ui/FolderGrid";

interface FolderProgramProps {
    type: string;
    name: string;
}

const FolderProgram = ({ type, name }: FolderProgramProps) => {
    const { directory, directoryTree, openProgram } = useDesktopData();
    const [displayType, setDisplayType] = useState(DEFAULT_DISPLAY_TYPE);

    const {
        selectedItem,
        folderContents,
        currentFolder,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    } = useFolderNavigation({
        initialFolderName: name,
        directory,
        directoryTree,
        onOpenProgram: openProgram,
    });

    return (
        <>
            <FolderHeader
                type={type}
                route={currentFolder.route || "/ [error]"}
                displayType={displayType}
                displayList={DISPLAY_LIST}
                onClickLeft={onClickLeft}
                onChangeDisplayType={setDisplayType}
            />
            <FolderGrid
                items={folderContents}
                directoryTree={directoryTree}
                displayType={displayType}
                selectedItem={selectedItem}
                onClickItem={onClickItem}
                onDoubleClickItem={onDoubleClickItem}
            />
        </>
    );
};

export default FolderProgram;
