import { useState, useCallback } from "react";
import type {
    DirectoryItem,
    DirectoryTree,
} from "@pages/DesktopPage/DesktopDataContext";

export interface UseFolderNavigationParams {
    initialFolderName: string;
    directory: Array<DirectoryItem>;
    directoryTree: DirectoryTree;
    onOpenProgram: (item: DirectoryItem) => void;
}

export const useFolderNavigation = ({
    initialFolderName,
    directory,
    directoryTree,
    onOpenProgram,
}: UseFolderNavigationParams) => {
    const [selectedItem, setSelectedItem] = useState("");
    const [folderContents, setFolderContents] = useState<Array<DirectoryItem>>(
        directoryTree[initialFolderName] ?? []
    );
    const [currentFolder, setCurrentFolder] = useState<Partial<DirectoryItem>>(
        directory.find((item) => item.name === initialFolderName) ?? {}
    );

    const onClickItem = useCallback((name: string) => {
        setSelectedItem(name);
    }, []);

    const onClickLeft = useCallback(() => {
        if (!currentFolder.parent) return;
        setFolderContents(directoryTree[currentFolder.parent] ?? []);
        if (currentFolder.parent === "KDH") {
            setCurrentFolder({ route: "/ KDH" });
        } else {
            setCurrentFolder(
                directory.find(
                    (item) => item.name === currentFolder.parent
                ) ?? {}
            );
        }
    }, [currentFolder, directory, directoryTree]);

    const onDoubleClickItem = useCallback(
        (clickedItem: DirectoryItem) => {
            if (clickedItem.type === "FOLDER") {
                setCurrentFolder(
                    directory.find(
                        (item) => item.name === clickedItem.name
                    ) ?? {}
                );
                setFolderContents(directoryTree[clickedItem.name] ?? []);
            } else {
                onOpenProgram(clickedItem);
            }
        },
        [directory, directoryTree, onOpenProgram]
    );

    return {
        selectedItem,
        folderContents,
        currentFolder,
        onClickItem,
        onClickLeft,
        onDoubleClickItem,
    };
};
