import React from "react";
import styled from "styled-components";
import SimpleArrowUp from "../Program/Icon/SimpleArrowUp";
import message from "../../asset/images/icons/message.png";

import windows from "../../asset/images/icons/windows.svg";
import Windows from "../Program/Icon/Windows";
const TaskBar = (props) => {
    const {
        onClickStartIcon,
        onMouseEnter,
        onMouseLeave,
        onClickTaskIcon,
        hoverTarget,

        programList,
        onClickTime,
        onClickInfo,
        hiddenIcon,
        onClickHiddenIcon,
        onClickCloseAll,

        cur_year,
        cur_month,
        cur_date,
        cur_hour,
        cur_minute,
        cur_timeline,
    } = props;
    return (
        <>
            <TaskBarBlock>
                <div
                    className="box1 taskHoverEffect"
                    onClick={onClickStartIcon}
                >
                    <Windows />
                    {/* <img src={windows} alt="windows" /> */}
                </div>
                <div className="box2">
                    {/* 프로젝트 */}
                    {programList.map((item, idx) => {
                        return (
                            <div
                                key={idx}
                                className={
                                    hoverTarget === item.key
                                        ? "shortCutIcon taskHoverEffect"
                                        : "shortCutIcon"
                                }
                                title={item.key}
                                onMouseEnter={() => onMouseEnter(item)}
                                onMouseLeave={() => onMouseLeave(item)}
                                onClick={() => onClickTaskIcon(item)}
                            >
                                <div className="shortCut_Test" />
                                <div className="shortCut_BottomLine" />
                            </div>
                        );
                    })}
                </div>
                <div className="box3">
                    <div
                        className="arrowUpIcon taskHoverEffect"
                        title={hiddenIcon ? "숨기기" : "숨겨진 아이콘 표시"}
                        onClick={onClickHiddenIcon}
                    >
                        <SimpleArrowUp />
                    </div>
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
                    <div
                        className="info taskHoverEffect"
                        onClick={onClickInfo}
                        title="새 알림 없음"
                    >
                        <img src={message} alt={"message"} />
                    </div>
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
    }

    .activeShortCutIcon {
        background-color: #dfdfdf12;
    }

    .activeShortCutIcon .shortCut_BottomLine {
        width: 100%;
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
