import React from "react";
import styled from "styled-components";

import leftArrow from "@images/icons/left-arrow.png";
import folderFull from "@images/icons/folder_full.png";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";

const DEFAULT_SIZE = 80;

const FolderProgramComponent = ({
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
}) => {
    return (
        <>
            <FolderProgramHeaderBlock
                className={`headerArea2 headerArea2_${type}`}
            >
                <div className="arrowBox">
                    <img
                        src={leftArrow}
                        alt="leftArrow"
                        onClick={onClickLeft}
                    />
                    {/*  뒤로 가기 임시 제거 */}
                    {/* <img
                        src={rightArrow}
                        alt="rightArrow"
                        onClick={onClickRight}
                    /> */}
                </div>
                <div className="routeBox">
                    <input
                        value={currentFolder.route || "/ [error]"}
                        readOnly
                    />
                </div>
                <div className="selectDisplayType">
                    <select
                        value={displayType}
                        onChange={(e) => setDisplayType(e.target.value)}
                    >
                        {displayList.map((mapItem, idx) => (
                            <option key={idx} value={mapItem.value}>
                                {mapItem.name}
                            </option>
                        ))}
                    </select>
                </div>
            </FolderProgramHeaderBlock>
            <FolderProgramContentBlock className={`contentsArea_Cover`}>
                <div className="sideFolderArea"></div>
                <div className={`${displayType} contentsArea_folder`}>
                    {folderContents && folderContents.length > 0 ? (
                        <>
                            {displayType === "DETAIL" && (
                                <div className="detailHeader">
                                    <div className="name">{"이미지"}</div>
                                    <div className="name">{"이름"}</div>
                                    <div className="name">{"유형"}</div>
                                </div>
                            )}
                            {folderContents.map((mapItem, idx) => (
                                <div
                                    className={`${
                                        selectedItem === mapItem.name
                                            ? "folder folder_selected"
                                            : "folder"
                                    }`}
                                    key={idx}
                                    onClick={() => onClickItem(mapItem.name)}
                                    onDoubleClick={() =>
                                        onDoubleClickItem(mapItem)
                                    }
                                >
                                    {/*  폴더 */}
                                    <div className="imgCover">
                                        {mapItem.type === "FOLDER" ? (
                                            <img
                                                src={
                                                    Directory_Tree[
                                                        mapItem.name
                                                    ] &&
                                                    Directory_Tree[mapItem.name]
                                                        .length > 0
                                                        ? // item.folderCnt
                                                          folderFull
                                                        : folderEmpty
                                                }
                                                alt="folderEmpty"
                                            />
                                        ) : (
                                            <img
                                                src={
                                                    mapItem.icon || defaultImage
                                                }
                                                alt={mapItem.name}
                                            />
                                        )}
                                    </div>

                                    <div className="name">{mapItem.name}</div>

                                    {displayType === "DETAIL" && (
                                        <div className="name">
                                            {mapItem.type}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="noContents">비어있습니다.</div>
                    )}
                </div>
            </FolderProgramContentBlock>
        </>
    );
};

const FolderProgramHeaderBlock = styled.div`
    // 폴더 이동
    .arrowBox {
        display: flex;
        gap: 10px;
    }
    .arrowBox img {
        width: 15px;
        height: 100%;
    }

    // 폴더 주소
    .routeBox {
        flex: 1;

        text-align: left;
        padding: 0 10px;
        font-size: 12px;
        cursor: default;

        display: flex;
        align-items: center;
        border: 1px solid #e3e3e3;
        height: 100%;
    }
    .routeBox input {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
    }

    // 폴더 보기 형식
    .selectDisplayType {
        height: 100%;
    }
`;

const FolderProgramContentBlock = styled.div`
    .contentsArea_folder {
        width: 100%;
        height: 100%;

        padding: 10px;
        box-sizing: border-box;

        display: flex;
        gap: 20px;
        flex-wrap: wrap;

        align-content: flex-start;
    }

    // 아주 큰 아이콘
    .BIG_BIG_ICON .folder {
        width: ${DEFAULT_SIZE * 2}px;
    }

    .BIG_BIG_ICON img {
        width: ${DEFAULT_SIZE * 2}px;
        height: ${DEFAULT_SIZE * 2}px;
    }

    // 큰 아이콘
    .BIG_ICON .folder {
        width: ${DEFAULT_SIZE * 1.5}px;
    }

    .BIG_ICON img {
        width: ${DEFAULT_SIZE * 1.5}px;
        height: ${DEFAULT_SIZE * 1.5}px;
    }

    // 보통 아이콘
    .MEDIUM_ICON .folder {
        width: ${DEFAULT_SIZE}px;
    }

    .MEDIUM_ICON img {
        width: ${DEFAULT_SIZE}px;
        height: ${DEFAULT_SIZE}px;
    }

    // 작은 아이콘
    .SMALL_ICON .folder {
        width: ${DEFAULT_SIZE * 0.5}px;
    }

    .SMALL_ICON img {
        width: ${DEFAULT_SIZE * 0.5}px;
        height: ${DEFAULT_SIZE * 0.5}px;
    }

    // 자세히
    .DETAIL {
        gap: 0px;
    }

    .DETAIL .folder {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    .DETAIL .folder div {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .DETAIL img {
        width: ${DEFAULT_SIZE * 0.25}px;
        height: ${DEFAULT_SIZE * 0.25}px;
    }

    .folder {
        height: auto;
        padding: 5px 10px;
        border: 1px solid #ffffff00;
    }

    .folder_selected {
        background-color: #cce8ff !important;
        border: 1px solid #99d1ff;
    }
    .folder:hover {
        background-color: #e5f3ff;
    }
    .folder .name {
        word-break: break-all;
        font-size: 12px;
        cursor: default;
    }

    .detailHeader {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;
        padding: 5px 10px;
    }

    .detailHeader .name {
        font-size: 11px;
        cursor: default;
    }

    .noContents {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: gray;
        font-size: 14px;
        cursor: default;
    }
`;
export default FolderProgramComponent;
