import React, { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import useActiveProgram from "../../hooks/useActiveProgram";
import {
    rc_global_Directory_List,
    rc_global_Directory_Tree,
} from "../../store/global";
import FolderProgramComponent from "../../Component/Program/FolderProgramComponent";

const displayList = [
    { value: "BIG_BIG_ICON", name: "아주 큰 아이콘" },
    { value: "BIG_ICON", name: "큰 아이콘" },
    { value: "MEDIUM_ICON", name: "보통 아이콘" },
    { value: "SMALL_ICON", name: "작은 아이콘" },
    { value: "DETAIL", name: "자세히" },
];

const FolderProgramContainer = ({ name, type }) => {
    const directory = useRecoilValue(rc_global_Directory_List);
    const Directory_Tree = useRecoilValue(rc_global_Directory_Tree);
    const [selectedItem, setSelectedItem] = useState(""); // 클릭한 아이템

    // 아이콘 더블클릭 (활성화)
    const onDoubleClickIcon = useActiveProgram();

    // 현재 폴더에서 보여줄 컨텐츠 (초기엔 바탕화면에서 클릭한 아이템의 컨텐츠)
    const [folderContents, setFolderContents] = useState(
        Directory_Tree[name] || []
    );

    // 현재 폴더 정보 (초기엔 바탕화면에서 클릭한 아이템.)
    const [currentFolder, setCurrentFolder] = useState(
        directory.find((findItem) => name === findItem.name)
    );

    const [displayType, setDisplayType] = useState(displayList[2].value);

    // 특정 아이템 클릭
    const onClickItem = useCallback((name) => {
        setSelectedItem(name);
    }, []);

    // 뒤로 가기
    /*
    현재 위치를 현재 아이템의 부모로 변경한다.
    */
    const onClickLeft = useCallback(() => {
        if (!currentFolder.parent) return;

        setFolderContents(Directory_Tree[currentFolder.parent]);
        if (currentFolder.parent === "KDH") {
            setCurrentFolder({
                route: "/ KDH",
            });
        } else {
            setCurrentFolder(
                directory.find((item) => item.name === currentFolder.parent)
            );
        }
    }, [setFolderContents, directory, currentFolder, Directory_Tree]);

    // 특정 아이템 더블 클릭
    const onDoubleClickItem = useCallback(
        (clickedItem) => {
            // 폴더인 경우 현재 위치를 해당 폴더 위치로 변경한다.
            if (clickedItem.type === "FOLDER") {
                setCurrentFolder(
                    directory.find(
                        (findItem) => clickedItem.name === findItem.name
                    )
                );
                setFolderContents(Directory_Tree[clickedItem.name] || []);
            }
            // DOC, IMAGE 인 경우
            // 해당하는 창을 띄운다
            else {
                onDoubleClickIcon(clickedItem);
            }
        },
        [onDoubleClickIcon, Directory_Tree, directory]
    );

    const propDatas = {
        type,
        displayList,
        currentFolder,
        displayType,
        folderContents,
        Directory_Tree,
        selectedItem,

        onClickLeft,
        setDisplayType,
        onClickItem,
        onDoubleClickItem,
    };

    return <FolderProgramComponent {...propDatas} />;
};

export default FolderProgramContainer;
