import React from "react";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";

import close from "@images/icons/close.png";
import horizontalLine from "@images/icons/horizontal-line.png";
import maximize from "@images/icons/maximize.png";
import minimize from "@images/icons/minimize.png";

import defaultDocumentImage from "@images/icons/document_default.png";

import ImageProgramContainer from "@features/program-image/ImageProgramContainer";
import { FolderProgram } from "@features/program-folder";
import { DOCProgram } from "@features/program-doc";
import INFOProgramContainer from "@features/program-info/INFOProgramContainer";

import { ProgramComponent } from "./ProgramComponent.style";

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
        <FolderProgram type={item.type} name={item.name} />
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
        <DOCProgram type={item.type} name={item.name} />
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

export default FolderComponent;
