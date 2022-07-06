import React from "react";
import styled from "styled-components";

const TaskBar = () => {
    return (
        <TaskBarBlock>
            <div className="taskBar">
                <div className="box1" />
                <div className="box2" />
                <div className="box3">
                    <div className="icon" />
                    <div className="dateInfo">
                        <div className="time">오후 10:31</div>
                        <div className="date">2022-06-22</div>
                    </div>
                </div>
            </div>
        </TaskBarBlock>
    );
};

const TaskBarBlock = styled.div`
    .taskBarCover {
        position: relative;
        background-color: #211e3bdb;
    }
    .taskBar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        display: flex;
        flex: 1 0 auto;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 5px;

        // width: 100%;
        // display: grid;
        // grid-template-columns: 140px 1fr 120px;
    }

    .taskBar {
        width: 100%;
        display: grid;
        grid-template-columns: 140px 1fr 120px;
    }

    .taskBar .box1 {
        background-color: red;
    }

    .taskBar .box2 {
        background-color: green;
    }

    .taskBar .box3 {
        display: grid;
        grid-template-columns: 3fr 7fr;
    }
    .taskBar .box3 .icon {
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
`;
export default TaskBar;
