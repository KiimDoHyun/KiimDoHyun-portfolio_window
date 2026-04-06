import React from "react";
import { css } from "@styled-system/css";

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
            <div
                className={`headerArea2 headerArea2_${type} ${headerStyle}`}
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
            </div>
            <div className={`contentsArea_Cover ${contentStyle}`}>
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

const headerStyle = css({
  "& .arrowBox": {
    display: "flex",
    gap: "10px",
  },
  "& .arrowBox img": {
    width: "15px",
    height: "100%",
  },

  "& .routeBox": {
    flex: 1,
    textAlign: "left",
    padding: "0 10px",
    fontSize: "12px",
    cursor: "default",
    display: "flex",
    alignItems: "center",
    border: "1px solid #e3e3e3",
    height: "100%",
  },
  "& .routeBox input": {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    outline: "none",
  },

  "& .selectDisplayType": {
    height: "100%",
  },
});

const contentStyle = css({
  "& .contentsArea_folder": {
    width: "100%",
    height: "100%",
    padding: "10px",
    boxSizing: "border-box",
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    alignContent: "flex-start",
  },

  "& .BIG_BIG_ICON .folder": {
    width: `${DEFAULT_SIZE * 2}px`,
  },
  "& .BIG_BIG_ICON img": {
    width: `${DEFAULT_SIZE * 2}px`,
    height: `${DEFAULT_SIZE * 2}px`,
  },

  "& .BIG_ICON .folder": {
    width: `${DEFAULT_SIZE * 1.5}px`,
  },
  "& .BIG_ICON img": {
    width: `${DEFAULT_SIZE * 1.5}px`,
    height: `${DEFAULT_SIZE * 1.5}px`,
  },

  "& .MEDIUM_ICON .folder": {
    width: `${DEFAULT_SIZE}px`,
  },
  "& .MEDIUM_ICON img": {
    width: `${DEFAULT_SIZE}px`,
    height: `${DEFAULT_SIZE}px`,
  },

  "& .SMALL_ICON .folder": {
    width: `${DEFAULT_SIZE * 0.5}px`,
  },
  "& .SMALL_ICON img": {
    width: `${DEFAULT_SIZE * 0.5}px`,
    height: `${DEFAULT_SIZE * 0.5}px`,
  },

  "& .DETAIL": {
    gap: "0px",
  },
  "& .DETAIL .folder": {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  "& .DETAIL .folder div": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .DETAIL img": {
    width: `${DEFAULT_SIZE * 0.25}px`,
    height: `${DEFAULT_SIZE * 0.25}px`,
  },

  "& .folder": {
    height: "auto",
    padding: "5px 10px",
    border: "1px solid #ffffff00",
  },
  "& .folder_selected": {
    backgroundColor: "#cce8ff !important",
    border: "1px solid #99d1ff",
  },
  "& .folder:hover": {
    backgroundColor: "#e5f3ff",
  },
  "& .folder .name": {
    wordBreak: "break-all",
    fontSize: "12px",
    cursor: "default",
  },

  "& .detailHeader": {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    width: "100%",
    padding: "5px 10px",
  },
  "& .detailHeader .name": {
    fontSize: "11px",
    cursor: "default",
  },

  "& .noContents": {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "gray",
    fontSize: "14px",
    cursor: "default",
  },
});

export default FolderProgramComponent;
