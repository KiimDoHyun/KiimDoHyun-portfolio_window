import React from "react";
import styled from "styled-components";

import leftArrow from "../../asset/images/icons/left-arrow.png";
import folderFull from "../../asset/images/icons/folder_full.png";
import folderEmpty from "../../asset/images/icons/folder_empty.png";
import defaultImage from "../../asset/images/icons/image_default.png";
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
            <div className={`headerArea2 headerArea2_${type}`}>
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
            </div>
            <div className={`contentsArea_Cover`}>
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
            </div>
        </>
    );
};

const FolderProgramComponentBlock = styled.div``;
export default FolderProgramComponent;
