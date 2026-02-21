import React from "react";
import styled, { keyframes } from "styled-components";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";

import close from "@images/icons/close.png";
import horizontalLine from "@images/icons/horizontal-line.png";
import maximize from "@images/icons/maximize.png";
import minimize from "@images/icons/minimize.png";

import defaultDocumentImage from "@images/icons/document_default.png";

import ImageProgramContainer from "./ImageProgramContainer";
import FolderProgramContainer from "./FolderProgramContainer";
import DOCProgramContainer from "./DOCProgramContainer";
import INFOProgramContainer from "./INFOProgramContainer";

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
    >
      {/* 공통 */}
      <div className="headerArea">
        <div
          className="infoArea"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          {/* 폴더, 브라우저는 프로그램명이 동적으로 변하지 않음. */}
          {(item.type === "FOLDER" || item.type === "BROWSER") && (
            // ||
            // item.type === "INFO"
            <>
              <img src={item.icon || folderEmpty} alt={item.name} />
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
        <div
          className="dragArea"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
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
          <div className={`headerArea2 headerArea2_${item.type}`}></div>
          <div className={`contentsArea_Cover`}>
            {item.type === "BROWSER" && (
              <iframe
                src={"https://www.google.com/webhp?igu=1"}
                title={"Google"}
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
      {item.type === "INFO" && <INFOProgramContainer type={item.type} />}
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

const ProgramComponent = styled.div<{ isClose: boolean }>`
  left: calc(50% - 250px);
  top: calc(50% - 250px);
  height: 500px;
  width: 500px;

  box-shadow: 0px 0px 20px 3px #00000061;
  position: absolute;

  border: 1px solid black;
  box-sizing: border-box;

  background-color: white;

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

  .programTitle {
  }

  .dragArea {
    flex: 1;
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

  .bottomArea {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 12px;
    padding: 0 10px;
  }

  ${(props) => props.isClose && ` opacity: 0; transform: scale(0.9)`}
`;
export default FolderComponent;

/*

*/
