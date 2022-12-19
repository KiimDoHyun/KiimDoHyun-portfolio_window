import React from "react";
import styled, { keyframes } from "styled-components";
import folderFull from "../../asset/images/icons/folder_full.png";
import folderEmpty from "../../asset/images/icons/folder_empty.png";
import defaultImage from "../../asset/images/icons/image_default.png";
import leftArrow from "../../asset/images/icons/left-arrow.png";

import reactIcon from "../../asset/images/icons/react.png";

const DEFAULT_SIZE = 80;

const FolderComponent = ({
    onClick,
    onClickClose,
    onClickMax,
    onClickNormalSize,
    onClickMin,
    onMouseDown,
    onMouseUp,
    onMouseDown_Resize,
    onMouseUp_Resize,
    onClickItem,
    onDoubleClickItem,
    onClickLeft,
    onClickRight,
    setDisplayType,

    boxRef,
    isClose,
    isMaxSize,
    item,
    selectedItem,
    folderContents,
    displayType,
    displayList,
    currentFolder,

    // IMAGE
    IMG_onClickLeft,
    IMG_onClickRight,
    imageArr,
    curImageIdx,

    // DOC
    DOCData,
}) => {
    return (
        <FolderComponentBlock
            className="folderComponent"
            ref={boxRef}
            isClose={isClose}
            onMouseDown={onClick}
            isMaxSize={isMaxSize}
        >
            <div
                className="headerArea"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
            >
                <div className="infoArea">
                    {/* 폴더, 브라우저는 프로그램명이 동적으로 변하지 않음. */}
                    {(item.type === "FOLDER" || item.type === "BROWSER") && (
                        <>
                            <img
                                src={item.icon || folderEmpty}
                                alt={item.name}
                            />
                            <div className="programTitle">{item.name}</div>
                        </>
                    )}
                    {/* 이미지는 프로그램명이 동적으로 변함. */}
                    {item.type === "IMAGE" && imageArr.length > 0 && (
                        <>
                            <img src={defaultImage} alt={"이미지"} />
                            <div className="programTitle">
                                {imageArr[curImageIdx].name}
                            </div>
                        </>
                    )}

                    {item.type === "DOC" && (
                        <>
                            <img src={defaultImage} alt={"이미지"} />
                            <div className="programTitle">{item.name}</div>
                        </>
                    )}
                </div>
                <div className="buttonArea">
                    <div className="min" onClick={onClickMin}>
                        <div />
                    </div>
                    {isMaxSize ? (
                        <div className="normalSize" onClick={onClickNormalSize}>
                            <div />
                        </div>
                    ) : (
                        <div className="max" onClick={onClickMax}>
                            <div />
                        </div>
                    )}
                    <div className="close" onClick={onClickClose}>
                        <div />
                        <div />
                    </div>
                </div>
            </div>

            <div className="headerArea2">
                {/* 폴더형 전용 헤더 */}
                {item.type === "FOLDER" && (
                    <>
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
                                {displayList.map((item, idx) => (
                                    <option key={idx} value={item.value}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
            </div>

            {/* 내부 데이터가 들어올 영역 */}
            <div className={`contentsArea_Cover`}>
                {/* 브라우저 */}
                {item.type === "BROWSER" && (
                    <iframe
                        src={"https://www.google.com/webhp?igu=1"}
                        width={"100%"}
                        height={"100%"}
                    />
                )}
                {/* 폴더 */}
                {item.type === "FOLDER" && (
                    <>
                        <div className="sideFolderArea"></div>
                        <div className={`${displayType} contentsArea_folder`}>
                            {folderContents && folderContents.length > 0 ? (
                                <>
                                    {displayType === "DETAIL" && (
                                        <div className="detailHeader">
                                            <div className="name">
                                                {"이미지"}
                                            </div>
                                            <div className="name">{"이름"}</div>
                                            <div className="name">{"유형"}</div>
                                        </div>
                                    )}
                                    {folderContents.map((item, idx) => (
                                        <div
                                            className={`${
                                                selectedItem === item.name
                                                    ? "folder folder_selected"
                                                    : "folder"
                                            }`}
                                            key={idx}
                                            onClick={() =>
                                                onClickItem(item.name)
                                            }
                                            onDoubleClick={() =>
                                                onDoubleClickItem(item)
                                            }
                                        >
                                            {/*  폴더 */}
                                            <div className="imgCover">
                                                {item.type === "FOLDER" ? (
                                                    <img
                                                        src={
                                                            item.folderCnt
                                                                ? folderFull
                                                                : folderEmpty
                                                        }
                                                        alt="folderEmpty"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            item.icon ||
                                                            defaultImage
                                                        }
                                                        alt={item.name}
                                                    />
                                                )}
                                            </div>

                                            <div className="name">
                                                {item.name}
                                            </div>

                                            {displayType === "DETAIL" && (
                                                <div className="name">
                                                    {item.type}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="noContents">비어있습니다.</div>
                            )}
                        </div>
                    </>
                )}
                {/* 이미지 */}
                {/* 좌우 이동 버튼 정중앙 이미지(원래 크기) */}
                {item.type === "IMAGE" && (
                    <div className="contentsArea_image">
                        <div
                            className="image_arrow image_arrowLeft"
                            title="이전"
                            onClick={IMG_onClickLeft}
                        >
                            {"<"}
                        </div>
                        <div
                            className="image_arrow image_arrowRight"
                            title="다음"
                            onClick={IMG_onClickRight}
                        >
                            {">"}
                        </div>

                        {imageArr.length > 0 && (
                            <img
                                className="imageContent"
                                // src={item.icon}
                                src={imageArr[curImageIdx].icon}
                                alt={imageArr[curImageIdx].name}
                            />
                        )}
                    </div>
                )}
                {/* 문서 */}
                {item.type === "DOC" && (
                    <div className="contentsArea_doc">
                        <div className="doc_imageArea">
                            {DOCData.data.projectImages &&
                            DOCData.data.projectImages.length > 0 ? (
                                <>
                                    {DOCData.data.projectImages.map(
                                        (imageItem, idx) => (
                                            <div
                                                key={idx}
                                                className="projectImageItem"
                                            >
                                                <img
                                                    src={imageItem}
                                                    alt={`${imageItem}${
                                                        idx + 1
                                                    }`}
                                                />
                                            </div>
                                        )
                                    )}
                                </>
                            ) : (
                                <div className="noProjectImage">
                                    프로젝트 이미지가 없습니다.
                                </div>
                            )}
                        </div>

                        <div className="doc_contentsArea">
                            <div className="doc_card">
                                <div className="cardTitle">프로젝트 명</div>
                                <div className="cardContent">
                                    {DOCData.data.projectName}
                                </div>
                            </div>

                            <div className="doc_card">
                                <div className="cardTitle">프로젝트 설명</div>
                                <div className="cardContent">
                                    {DOCData.data.projectDesc}
                                </div>
                            </div>
                            <div className="doc_card">
                                <div className="cardTitle">프로젝트 성과</div>
                                <div className="cardContent doc_reulst">
                                    {DOCData.data.projectReulst &&
                                        DOCData.data.projectReulst.map(
                                            (resultItem, idx) => (
                                                <div
                                                    key={idx}
                                                    className="cardResult"
                                                >
                                                    <div className="resultTitle">
                                                        {`${idx + 1}. `}{" "}
                                                        {resultItem.title}
                                                    </div>
                                                    <div className="resultContent">
                                                        {resultItem.content}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>

                            <div className="doc_card">
                                <div className="cardTitle">프로젝트 기간</div>
                                <div className="cardContent">
                                    {DOCData.data.projectTerm.map(
                                        (termItem, idx) => (
                                            <div key={idx}>{termItem}</div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="doc_card">
                                <div className="cardTitle">프로젝트 성격</div>
                                <div className="cardContent">
                                    {DOCData.data.projectType}
                                </div>
                            </div>
                            <div className="doc_card">
                                <div className="cardTitle">담당 역할</div>
                                <div className="cardContent">
                                    {DOCData.data.role.map((roleItem, idx) => (
                                        <div key={idx}>
                                            {`${idx + 1}. `}
                                            {roleItem}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="doc_card">
                                <div className="cardTitle">개발부서</div>
                                <div className="cardContent">
                                    {DOCData.data.department}
                                </div>
                            </div>
                            <div className="doc_card">
                                <div className="cardTitle">
                                    사용한 기술 스택
                                </div>
                                <div className="cardContent doc_stack">
                                    {DOCData.data.stack.map(
                                        (stackItem, idx) => (
                                            <div
                                                className="stackItem"
                                                key={idx}
                                            >
                                                <div className="stackItem_name">
                                                    {stackItem.name}
                                                </div>
                                                <div className="stackItem_Image">
                                                    <img
                                                        src={stackItem.img}
                                                        alt="stackImage"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="doc_card">
                                <div className="cardTitle">url</div>
                                <div className="cardContent">
                                    {DOCData.data.url}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 현재 폴더에 존재하는 프로그램 개수 (폴더일때만 출력) */}
            {item.type === "FOLDER" && (
                <div className="bottomArea">{folderContents.length} 개항목</div>
            )}
            {item.type === "IMAGE" && (
                <div className="bottomArea">
                    {curImageIdx + 1} / {imageArr.length}
                </div>
            )}

            <div className="modiSize top_left"></div>
            <div className="modiSize top_right"></div>
            <div className="modiSize right"></div>
            <div className="modiSize bottom_left"></div>
            <div
                className="modiSize bottom_right"
                onMouseDown={onMouseDown_Resize}
                onMouseUp={onMouseUp_Resize}
            ></div>
        </FolderComponentBlock>
    );
};
const open = keyframes`
from {
    opacity: 0;
    transform: scale(0.9);
}
to {
    opacity: 1;
    transform: scale(1);
}
`;

const FolderComponentBlock = styled.div`
    left: calc(50% - 250px);
    top: calc(50% - 250px);
    height: 500px;
    width: 500px;

    box-shadow: 0px 0px 20px 3px #00000061;
    position: absolute;

    background-color: white;

    z-index: ${(props) => props.zIndexCnt};

    display: grid;
    grid-template-rows: 32px 25px 1fr 20px;

    .modiSize {
        position: absolute;
        width: 4px;
        height: 4px;
        cursor: pointer;

        // background-color: red;
    }

    .top_left {
        top: 0;
        left: 0;
        cursor: nw-resize;
    }

    .top_right {
        top: 0;
        right: 0;
        cursor: ne-resize;
    }

    .bottom_left {
        bottom: 0;
        left: 0;
        cursor: ne-resize;
    }

    .bottom_right {
        bottom: 0;
        right: 0;
        cursor: nw-resize;
    }

    .infoArea {
        display: flex;
        align-items: center;
        gap: 5px;
        height: 100%;
        margin-left: 10px;
    }

    .infoArea img {
        width: 20px;
        height: 20px;
    }
    .infoArea div {
        font-size: 14px;
    }

    .headerArea {
        width: 100%;
        height: 32px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 1px 1px 0 1px;
        box-sizing: border-box;
    }

    .headerArea2 {
        gap: 10px;
        padding: 0 10px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .arrowBox {
        display: flex;
        gap: 10px;
    }
    .arrowBox img {
        width: 15px;
        height: 100%;
    }
    .programTitle {
    }

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

    .selectDisplayType {
        height: 100%;
    }

    .buttonArea {
        height: 100%;
        display: flex;
        gap: 1px;
    }

    .min div {
        width: 11px;
        height: 1px;
        background-color: black;
    }

    .max div {
        width: 8px;
        height: 8px;
        border: 1px solid black;
    }

    .close div {
        width: 14px;
        height: 1px;
        background-color: black;
    }

    .close div:nth-child(1) {
        position: absolute;
        rotate: 45deg;
    }

    .close div:nth-child(2) {
        rotate: 135deg;
    }

    .buttonArea > div {
        height: 100%;
        width: 45px;
        transition: 0.2s;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .buttonArea > div > img {
        width: 10px;
    }

    .buttonArea .min:hover,
    .buttonArea .normalSize:hover,
    .buttonArea .max:hover {
        background-color: #ddddddb3;
    }

    .buttonArea > .close:hover {
        background-color: #ff1010;
    }

    animation: ${open} 0.25s 0s;

    .contentsArea_Cover {
        width: 100%;
        height: 100%;
        overflow: scroll;
        position: relative;
    }

    // 문서 컨텐츠 영역
    // 850 px 이상인 경우  처리 필요함.
    .contentsArea_doc {
        width: 100%;
        height: 100%;

        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        align-content: flex-start;
        box-sizing: border-box;
        padding: 10px;

        // overflow: hidden;
    }

    .doc_imageArea {
        width: 100%;
        height: auto;
        min-height: 200px;
        background-color: #e7e7e7;
        display: inline-box;
        overflow: scroll;

        flex-grow: 1;
        flex-basis: 500px;
    }

    .noProjectImage {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        color: #a2a1a1;
        font-size: 14px;
    }

    .projectImageItem {
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .projectImageItem img {
        width: 100%;
        height: 100%;

        object-fit: contain;
    }

    .doc_contentsArea {
        flex: 1;

        overflow: scroll;
        height: 100%;
        width: 100%;
        flex-grow: 1;
        flex-basis: 500px;
    }

    .doc_card {
        text-align: left;

        box-sizing: border-box;
        padding: 20px 0;
        border-bottom: 1px solid gray;
    }

    .cardTitle {
        font-weight: bold;
        margin-bottom: 10px;
    }
    .cardContent {
        font-size: 12px;
        color: #4b4b4b;
    }

    .doc_stack {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    .stackItem {
        border: 1px solid gray;
        padding: 5px 10px;
        border-radius: 5px;
        width: fit-content;
        position: relative;
        cursor: pointer;
        transition: 0.2s;
    }

    .stackItem:hover {
        color: white;
        background-color: gray;
    }
    .stackItem:hover .stackItem_Image {
        bottom: -45px;
        opacity: 1;

        box-shadow: 0px 0px 10px 2px #a1a1a1;
        scale: 1;
    }

    .stackItem_Image {
        position: absolute;

        left: calc(50% - 20px);
        width: 40px;
        height: 40px;
        bottom: -35px;

        background-color: white;
        opacity: 0;
        transition: 0.2s;

        box-sizing: border-box;
        padding: 5px;

        scale: 0.4;
    }

    .doc_reulst {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .stackItem_Image img {
        width: 100%;
        height: 100%;

        object-fit: contain;
    }

    .resultTitle {
        margin-bottom: 5px;
        font-weight: bold;
    }

    // 이미지 컨텐츠 영역
    .contentsArea_image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: #20343b;
    }

    .image_arrow {
        position: absolute;
        height: 100%;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: gray;
        opacity: 0;
        transition: 0.2s;
    }
    .image_arrow:hover {
        opacity: 1;
    }

    .image_arrowLeft {
        left: 0;
    }

    .image_arrowRight {
        right: 0;
    }

    // 폴더형 컨텐츠 영역
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

    .bottomArea {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 12px;
        padding: 0 10px;
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

    ${(props) => props.isClose && ` opacity: 0; transform: scale(0.9)`}
`;
export default FolderComponent;

/*

*/
