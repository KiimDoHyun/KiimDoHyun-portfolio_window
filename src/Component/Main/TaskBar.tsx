import React from "react";
import styled, { keyframes } from "styled-components";
import message from "../../asset/images/icons/message.png";
import folderEmpty from "../../asset/images/icons/folder_empty.png";
import defaultImage from "../../asset/images/icons/image_default.png";
import monitor from "../../asset/images/icons/monitor.png";
import defaultDocumentImage from "../../asset/images/icons/document_default.png";

import arrowUp from "../../asset/images/icons/collapse-arrow-up-white.png";
import arrowDown from "../../asset/images/icons/collapse-arrow-down-white.png";
import close_white from "../../asset/images/icons/close_white.png";

import Windows from "../Program/Icon/Windows";
const TaskBar = (props) => {
  const {
    onClickStartIcon,
    onClickTime,
    onClickInfo,
    onClickHiddenIcon,

    hoverTarget,
    programList,
    activeProgram,
    hiddenIcon,

    onMouseEnter,
    onMouseLeave,
    onClickTaskIcon,
    onClickCloseAll,
    showPrev,
    onClick_Close_ShortCut,

    cur_year,
    cur_month,
    cur_date,
    cur_hour,
    cur_minute,
    cur_timeline,

    box2Ref,
  } = props;

  return (
    <>
      <TaskBarBlock hoverTarget={hoverTarget}>
        {/* 시작 */}
        <div className="box1 taskHoverEffect" onClick={onClickStartIcon}>
          <Windows />
        </div>

        {/* 작업표시줄 */}
        <div className="box2" ref={box2Ref}>
          {/* 프로그램 */}
          {programList.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`shortCutIcon ${
                  activeProgram === item.name && "activeIcon"
                }`}
                title={item.name}
                onMouseEnter={() => onMouseEnter(item, idx)}
                onMouseLeave={(e) => onMouseLeave(e, idx)}
              >
                <div
                  className="shortCut_Img"
                  onClick={() => onClickTaskIcon(item, idx)}
                >
                  {item.type === "IMAGE" && (
                    <img src={defaultImage} alt={item.name} />
                  )}
                  {item.type === "FOLDER" && (
                    <img src={folderEmpty} alt={item.name} />
                  )}
                  {item.type === "DOC" && (
                    <img src={defaultDocumentImage} alt={item.name} />
                  )}
                  {item.type === "INFO" && (
                    <img src={monitor} alt={item.name} />
                  )}
                  {item.type === "BROWSER" && (
                    <img src={item.icon || folderEmpty} alt={item.name} />
                  )}
                </div>
                <div className="shortCut_BottomLine" />
                <div className="shotCut_Hover">
                  <div
                    className="buttonCover"
                    onClick={onClick_Close_ShortCut}
                  />
                  <div
                    className="bodyCover"
                    onClick={() => onClickTaskIcon(item, idx)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="box3">
          {/* 숨겨진 아이콘 */}

          <div
            className="arrowUpIcon taskHoverEffect"
            title={
              hiddenIcon
                ? "숨기기"
                : "포트폴리오 제작에 사용된 기술\n숨겨진 아이콘 표시"
            }
            onClick={onClickHiddenIcon}
          >
            {hiddenIcon ? (
              <img src={arrowDown} alt="arrowDown" />
            ) : (
              <img src={arrowUp} alt="arrowUp" />
            )}
          </div>

          {/* 시간 */}
          <div className="dateInfo taskHoverEffect" onClick={onClickTime}>
            <div className="time">
              {cur_timeline} {cur_hour}:{cur_minute}
            </div>
            <div className="date">
              {cur_year}-{cur_month}-{`0${cur_date}`.slice(-2)}
            </div>
          </div>

          {/* 알림 */}
          <div
            className="info taskHoverEffect"
            onClick={onClickInfo}
            title="새 알림 없음"
          >
            <img src={message} alt={"message"} />
          </div>

          {/* 모두 닫기 */}
          <div
            className="closeAllButton taskHoverEffect"
            onClick={onClickCloseAll}
          ></div>
        </div>
        <div className="prevView">
          <div className="prevViewHeader">
            <div className="text">{hoverTarget.name}</div>
            <div
              className="button"
              // onClick={() => console.log("????????????????????")}
            >
              <img src={close_white} alt="close_white" />
            </div>
          </div>
          <div className="cover">{showPrev()}</div>
        </div>
      </TaskBarBlock>
    </>
  );
};

// 미리보기의 transform 이 늦게 적용되는 현상을 방지함.
// opacity 1로 변하는 딜레이를 주어서 크기가 변하는 현상을 안보이도록.
const prevView_coverTransform = keyframes`
from {
    opacity: 0;
}
to {
    opacity: 1;
}
`;

const TaskBarBlock = styled.div<{
  hoverTarget: { name?: string; idx: number };
}>`
    display: grid;
    grid-template-columns: 50px auto 200px;
    height: 100%;
    position: relative;

    .shortCutIcon {
        transition: 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;

        height: 100%;
        width: 50px;
        position: relative;
    }

    // 바로가기에 마우스가 올라가면 바로가기 외부에 존재하는 미리보기가 활성화된다.
    // 바로가기에서 마우스가 떨어지면 현재 아이템 정보를 잃어버리기 때문에(미리보기로 마우스를 옮기는 순간 바로가기에서 마우스가 벗어남)
    // 미리보기와 같은 크기를 가지는 div 를 같은 위치에 덮어 씌운다.
    // 닫기 버튼 활성화를 위해 닫기 버튼 위치에 닫기 버튼과 동일한 크기의 div를 만들고
    // 해당 div에 닫기 버튼 이벤트를 연결한다.
    .shotCut_Hover {
        position: absolute;
        width: 200px;
        height: 0px;
        background-color: #00000000;
        // top: -225px;
        top: ${(props) => {
          if (props.hoverTarget.name) {
            return "-225px;";
          } else {
            return "225px;";
          }
        }}
        left: ${(props) => {
          if (props.hoverTarget.idx === 0) {
            return "-50px;";
          } else {
            return "-75px;";
          }
        }}

        pointer-events:  ${(props) => {
          if (props.hoverTarget.name) {
            return "all;";
          } else {
            return "none;";
          }
        }}
    }

    .shortCutIcon:hover .shotCut_Hover {
        height: 225px !important;
    }

    .buttonCover {
        position: absolute;
        right: 0;
        width: 40px;
        height: 40px;
        background-color: #00000000;
    }

    .bodyCover {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
    }


    .box1 {
        width: 50px;
        height: 50px;
        padding: 15px;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: center;

        trainsition: 0.2s;
    }

    .box1:hover path {
        fill: #00adef;
    }
    .box1:active path {
        fill: #0076ff;
    }
    .box1 svg {
        width: 100%;
        height: 100%;
    }
    .box1 path {
        fill: white;
    }

    .box2 {
        display: flex;
        z-index: 2;
    }

    .activeIcon {
        background-color: #ffffff24;
    }
    .activeIcon .shortCut_BottomLine {
        width: 95%;
    }

    .activeShortCutIcon {
        background-color: #dfdfdf12;
    }

    .shortCutIcon:hover .shortCut_BottomLine {
        width: 95%;
    }
    .activeShortCutIcon .shortCut_BottomLine {
        width: 70%;
    }

    .prevView {
        position: absolute;
        width: 200px;
        height: 225px;
        background-color: #20343b9c;

        z-index: 1;
        
        top: ${(props) => (props.hoverTarget.name ? "-225px;" : "50px;")};
        opacity: ${(props) => (props.hoverTarget.name ? "1;" : "0;")};
        left: ${(props) => {
          if (props.hoverTarget.name) {
            if (props.hoverTarget.idx > 0) {
              return (props.hoverTarget.idx - 1) * 50 + 25 + "px;";
            } else {
              return "0px;";
            }
          } else {
            return "0px;";
          }
        }};
        pointer-events:  ${(props) => {
          if (props.hoverTarget.name) {
            return "all;";
          } else {
            return "none;";
          }
        }}

        // Test
        top: -225px;
        // opacity: 1;
        // left: 0px;

        padding: 10px 15px 15px 15px;
        box-sizing: border-box;
        transition: 0.2s;
    }

    .prevViewHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .prevViewHeader .text {
        color: white;
        font-size: 14px;
    }
    .prevViewHeader .button {
        width: 20px;
        height: 20px;
    }

    .prevViewHeader .button img {
        width: 100%;
        height: 100%;
    }

    .prevView .cover {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .prevView .cover > div {
        position: absolute;
        left: -165px !important;
        top: -150px !important;
        transform: scale(0.35) !important;

        animation: ${prevView_coverTransform} 0.2s;
    }

    .shortCut_Img {
        // width: 25px;
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .shortCut_Img img {
        width: 25px;
        height: 25px;
    }

    .shortCut_Test {
        width: 25px;
        height: 25px;
        background-color: yellow;
    }

    .shortCut_BottomLine {
        transition: 0.2s;
        width: 80%;
        height: 3px;
        background-color: #aac5ff;
    }

    .box3 {
        display: grid;
        grid-template-columns: 1fr 4fr 50px 5px;
        gap: 5px;
    }

    .taskHoverEffect {
        transition: 0.2s;
    }
    .taskHoverEffect:hover {
        background-color: #dfdfdf12;
    }

    .arrowUpIcon {
        padding: 5px;
        display: flex;
        align-items: center;
    }

    .arrowUpIcon img {
        width: 100%;
    }

    .dateInfo {
        padding: 3px;
        font-size: 13px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .dateInfo > div {
        cursor: default;
    }

    .closeAllButton {
        border-left: 1px solid gray;
    }

    .info {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info img {
        width: 50%;
        object-fit: cover;
    }
`;
export default TaskBar;
