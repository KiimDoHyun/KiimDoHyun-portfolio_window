import React from "react";
import styled from "styled-components";
import SimpleArrowUp from "../Program/Icon/SimpleArrowUp";
import message from "../../asset/images/icons/message.png";
import folderEmpty from "../../asset/images/icons/folder_empty.png";
import defaultImage from "../../asset/images/icons/image_default.png";
import monitor from "../../asset/images/icons/monitor.png";
import defaultDocumentImage from "../../asset/images/icons/document_default.png";

import arrowUp from "../../asset/images/icons/collapse-arrow-up-white.png";
import arrowDown from "../../asset/images/icons/collapse-arrow-down-white.png";

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
            <TaskBarBlock>
                {/* 시작 */}
                <div
                    className="box1 taskHoverEffect"
                    onClick={onClickStartIcon}
                >
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
                                onMouseLeave={() => onMouseLeave(idx)}
                                onClick={() => onClickTaskIcon(item, idx)}
                            >
                                <div className="shortCut_Img">
                                    {item.type === "IMAGE" && (
                                        <img
                                            src={defaultImage}
                                            alt={item.name}
                                        />
                                    )}
                                    {item.type === "FOLDER" && (
                                        <img
                                            src={folderEmpty}
                                            alt={item.name}
                                        />
                                    )}
                                    {item.type === "DOC" && (
                                        <img
                                            src={defaultDocumentImage}
                                            alt={item.name}
                                        />
                                    )}
                                    {item.type === "INFO" && (
                                        <img src={monitor} alt={item.name} />
                                    )}
                                    {item.type === "BROWSER" && (
                                        <img
                                            src={item.icon || folderEmpty}
                                            alt={item.name}
                                        />
                                    )}
                                </div>
                                <div className="shortCut_BottomLine" />
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
                    <div
                        className="dateInfo taskHoverEffect"
                        onClick={onClickTime}
                    >
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
            </TaskBarBlock>
        </>
    );
};

const TaskBarBlock = styled.div`
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
        gap: 10px;

        height: 100%;
        width: 50px;
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
        gap: 2px;
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

    .shortCut_Img {
        width: 25px;
        height: 25px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .shortCut_Img img {
        width: 100%;
        height: 100%;
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
