import React from "react";
import styled, { keyframes } from "styled-components";
import folderEmpty from "../../asset/images/icons/folder_empty.png";
import defaultImage from "../../asset/images/icons/image_default.png";
import monitor from "../../asset/images/icons/monitor.png";

import close from "../../asset/images/icons/close.png";
import horizontalLine from "../../asset/images/icons/horizontal-line.png";
import maximize from "../../asset/images/icons/maximize.png";
import minimize from "../../asset/images/icons/minimize.png";

import defaultDocumentImage from "../../asset/images/icons/document_default.png";

import ImageProgramContainer from "../../Container/Program/ImageProgramContainer";
import FolderProgramContainer from "./FolderProgramContainer";
import DOCProgramContainer from "../../Container/Program/DOCProgramContainer";
import INFOProgramContainer from "../../Container/Program/INFOProgramContainer";

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

    boxRef,
    isClose,
    isMaxSize,
    item,
}) => {
    return (
        <ProgramComponent
            className="folderComponent"
            ref={boxRef}
            isClose={isClose}
            onMouseDown={onClick}
            isMaxSize={isMaxSize}
        >
            {/* 공통 */}
            <div
                className="headerArea"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
            >
                <div className="infoArea">
                    {/* 폴더, 브라우저는 프로그램명이 동적으로 변하지 않음. */}
                    {(item.type === "FOLDER" || item.type === "BROWSER") && (
                        // ||
                        // item.type === "INFO"
                        <>
                            <img
                                src={item.icon || folderEmpty}
                                alt={item.name}
                            />
                            <div className="programTitle">{item.name}</div>
                        </>
                    )}
                    {/* 이미지는 프로그램명이 동적으로 변함. */}
                    {item.type === "IMAGE" && (
                        // {item.type === "IMAGE" && imageArr.length > 0 && (
                        <>
                            <img src={defaultImage} alt={"이미지"} />
                            <div className="programTitle">
                                {"이미지"}
                                {/* {imageArr[curImageIdx].name} */}
                            </div>
                        </>
                    )}

                    {item.type === "DOC" && (
                        <>
                            <img src={defaultDocumentImage} alt={"이미지"} />
                            <div className="programTitle">{item.name}</div>
                        </>
                    )}

                    {item.type === "INFO" && (
                        <>
                            <img src={monitor} alt={"이미지"} />
                            <div className="programTitle">{item.name}</div>
                        </>
                    )}
                </div>
                <div className="buttonArea">
                    <div className="buttonIcon" onClick={onClickMin}>
                        <img src={horizontalLine} alt="horizontalLine" />
                    </div>
                    {isMaxSize ? (
                        <div className="buttonIcon" onClick={onClickNormalSize}>
                            <img src={minimize} alt="horizontalLine" />
                        </div>
                    ) : (
                        <div className="buttonIcon" onClick={onClickMax}>
                            <img src={maximize} alt="horizontalLine" />
                        </div>
                    )}
                    <div className="buttonIcon close" onClick={onClickClose}>
                        <img src={close} alt="horizontalLine" />
                    </div>
                </div>
            </div>

            {/* 브라우저 */}
            {item.type === "BROWSER" && (
                <>
                    <div
                        className={`headerArea2 headerArea2_${item.type}`}
                    ></div>
                    <div className={`contentsArea_Cover`}>
                        {item.type === "BROWSER" && (
                            <iframe
                                src={"https://www.google.com/webhp?igu=1"}
                                width={"100%"}
                                height={"100%"}
                            />
                        )}
                    </div>
                </>
            )}

            {/* 폴더 */}
            {item.type === "FOLDER" && (
                <FolderProgramContainer type={item.type} name={item.name} />
            )}

            {/* 이미지 */}
            {item.type === "IMAGE" && (
                <ImageProgramContainer
                    type={item.type}
                    parent={item.parent}
                    name={item.name}
                />
            )}

            {/* 문서 */}
            {item.type === "DOC" && (
                <DOCProgramContainer type={item.type} name={item.name} />
            )}

            {/* 내정보 */}
            {item.type === "INFO" && (
                <INFOProgramContainer type={item.type} name={item.name} />
            )}
            {/* 설정 */}
            {item.type === "SETTING" && <></>}
            {/* 공통 */}
            <div className="modiSize top_left"></div>
            <div className="modiSize top_right"></div>
            <div className="modiSize right"></div>
            <div className="modiSize bottom_left"></div>
            <div
                className="modiSize bottom_right"
                onMouseDown={onMouseDown_Resize}
                onMouseUp={onMouseUp_Resize}
            ></div>
        </ProgramComponent>
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

const ProgramComponent = styled.div`
    left: calc(50% - 250px);
    top: calc(50% - 250px);
    height: 500px;
    width: 500px;

    box-shadow: 0px 0px 20px 3px #00000061;
    position: absolute;

    border: 1px solid black;
    box-sizing: border-box;

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
        width: 14px;
    }

    .buttonArea .buttonIcon:hover {
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

    // 내정보
    .contentsArea_info {
        width: 100%;
        height: 100%;
    }

    .contentsArea_info .top {
        min-height: 200px;
        background-color: #f3f3f3;

        display: flex;
        flex-wrap: wrap;

        padding: 50px 10px;
        box-sizing: border-box;

        row-gap: 50px;
    }
    .contentsArea_info .body {
        display: flex;
        flex-wrap: wrap;
        gap: 50px;

        padding: 20px 10px;
        box-sizing: border-box;
    }

    .info1 {
        display: flex;
        align-items: center;
        gap: 50px;

        flex-grow: 1;
        flex-basis: 500px;

        justify-content: center;
    }

    .info1 .myImageArea {
        width: 180px;
        height: 180px;

        padding: 10px;
        box-sizing: border-box;
    }

    .info1 .myImageArea img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        object-fit: cover;
    }

    .info1 .myInfoArea {
        text-align: left;
    }

    .info1 .myInfoArea h1 {
        margin: 0 0 10px 0;
    }

    .info1 .myInfoArea p {
        color: gray;
        margin: 0 0 5px 0;
    }

    .info2 {
        display: flex;
        flex-wrap: wrap;

        column-gap: 100px;
        row-gap: 30px;

        flex-grow: 1;
        flex-basis: 500px;
    }
    .info2 .infoItem {
        width: 180px;
    }

    .infoItem {
        display: flex;
        align-items: center;
        gap: 30px;
    }

    .infoItem .myImageArea {
        width: 75px;
        height: 75px;

        box-sizing: border-box;
        padding: 10px;
    }

    .infoItem .myImageArea img {
        width: 100%;
        height: 100%;
    }

    .body .myInfoArea,
    .info2 .myInfoArea {
        text-align: left;
    }

    .myInfoArea .desc {
        margin: 0;
        font-size: 14px;
        color: #202020;
    }

    .body .infoItem {
        box-sizing: border-box;
        padding: 0 10px;
        width: 230px;
        border: 2px solid #ffffff00;
        transition: 0.2s;

        gap: 20px;
    }
    .body .infoItem:hover {
        border-color: #dfdfdf;
    }

    .body .infoItem .title,
    .info2 .myInfoArea p {
        margin: 5px 0;
        font-weight: bold;
    }
    .body .myInfoArea a,
    .info2 .myInfoArea a {
        text-decoration: none;
        color: #76b3e4;

        font-size: 14px;
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
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: 0.2s;
    }

    .image_arrow img {
        width: 15px;
        height: 15px;
    }

    .image_arrow:hover {
        opacity: 1;
    }

    .image_arrowLeft {
        background: linear-gradient(to right, #00000029, #ffffff00);
        left: 0;
    }

    .image_arrowRight {
        background: linear-gradient(to right, #ffffff00, #00000029);
        right: 0;
    }

    .imageContent {
        width: 96px;
        height: 96px;
    }

    .image_header_controller_btn {
        width: 20px;
        height: 20px;

        padding: 1px;
        box-sizing: border-box;

        transition: 0.2s;
    }

    .headerArea2_IMAGE {
        justify-content: flex-start;
    }
    .image_header_controller_btn:hover {
        background-color: #e6e6e6;
    }

    .image_header_controller_btn img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
