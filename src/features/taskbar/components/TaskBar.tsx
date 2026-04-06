import React from "react";
import message from "@images/icons/message.png";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";
import defaultDocumentImage from "@images/icons/document_default.png";

import arrowUp from "@images/icons/collapse-arrow-up-white.png";
import arrowDown from "@images/icons/collapse-arrow-down-white.png";
import close_white from "@images/icons/close_white.png";

import Windows from "@shared/ui/icons/Windows";
import { taskBarStyle } from "./TaskBar.style";

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

  // Compute dynamic CSS variable values from hoverTarget
  const shotcutHoverTop = hoverTarget.name ? "-225px" : "225px";
  const shotcutHoverLeft = hoverTarget.idx === 0 ? "-50px" : "-75px";
  const shotcutHoverPointerEvents = hoverTarget.name ? "all" : "none";

  const prevviewTop = hoverTarget.name ? "-225px" : "50px";
  const prevviewOpacity = hoverTarget.name ? "1" : "0";
  const prevviewLeft = hoverTarget.name
    ? hoverTarget.idx > 0
      ? `${(hoverTarget.idx - 1) * 50 + 25}px`
      : "0px"
    : "0px";
  const prevviewPointerEvents = hoverTarget.name ? "all" : "none";

  return (
    <>
      <div
        className={taskBarStyle}
        style={{
          "--shotcut-hover-top": shotcutHoverTop,
          "--shotcut-hover-left": shotcutHoverLeft,
          "--shotcut-hover-pointer-events": shotcutHoverPointerEvents,
          "--prevview-top": prevviewTop,
          "--prevview-opacity": prevviewOpacity,
          "--prevview-left": prevviewLeft,
          "--prevview-pointer-events": prevviewPointerEvents,
        } as React.CSSProperties}
      >
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
      </div>
    </>
  );
};

export default TaskBar;
