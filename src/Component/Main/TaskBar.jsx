import React from "react";
import styled from "styled-components";
import StatusBar from "../TaskBar/StatusBar";

const TaskBar = (props) => {
    const { activeStatusBar, onClickStartIcon } = props;
    return (
        <>
            <TaskBarBlock>
                <div
                    className="box1 taskHoverEffect"
                    onClick={onClickStartIcon}
                />
                <div className="box2" />
                <div className="box3">
                    <div className="arrowUpIcon taskHoverEffect"></div>
                    <div className="icon" />
                    <div className="dateInfo taskHoverEffect">
                        <div className="time">오후 10:31</div>
                        <div className="date">2022-06-22</div>
                    </div>
                    <div className="info taskHoverEffect"></div>
                    <div className="closeAllButton taskHoverEffect"></div>
                </div>
            </TaskBarBlock>
        </>
    );
};

const TaskBarBlock = styled.div`
    display: grid;
    grid-template-columns: 50px auto 280px;
    height: 100%;
    position: relative;

    .box3 {
        display: grid;
        grid-template-columns: 1fr 5fr 4fr 2fr 5px;
    }

    .taskHoverEffect {
        transition: 0.2s;
    }
    .taskHoverEffect:hover {
        background-color: #dfdfdf12;
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

    .closeAllButton {
        border-left: 1px solid gray;
    }
`;
export default TaskBar;
