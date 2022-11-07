import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { rc_taskbar_timeBar_active } from "../../store/taskbar";

const TimeBar = () => {
    const active = useRecoilValue(rc_taskbar_timeBar_active);
    return (
        <TimeBarBlock active={active}>
            <div className="timeArea">
                <div className="time">오후 2:24:34</div>
                <div className="date">2022년 11월 7일 월요일</div>
            </div>
            <div className="calendarArea"></div>
            <div className="functionArea"></div>
        </TimeBarBlock>
    );
};

const TimeBarBlock = styled.div`
    display: grid;
    grid-template-rows: 130px 1fr 250px;

    position: absolute;
    right: 0;
    bottom: ${(props) => (props.active ? "50px" : "-100px")};
    opacity: ${(props) => (props.active ? "1" : "0")};
    pointer-events: ${(props) => (props.active ? "auto" : "none")};
    z-index: ${(props) => (props.active ? "99999" : "0")};
    width: 360px;
    height: 720px;
    background-color: white;
    box-shadow: 0px -3px 20px 3px #00000061;

    transition: 0.25s;

    background-color: #393a3b;

    .timeArea,
    .calendarArea,
    .functionArea {
        padding: 20px;
        box-sizing: border-box;
    }

    .timeArea {
        color: white;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }

    .time {
        flex: 2;
        font-size: 3rem;
    }

    .date {
        flex: 1;
        font-size: 1rem;
        color: #90b8da;
    }
    .time,
    .date {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: lighter;
    }

    .calendarArea {
        border-top: 1px solid #707070;
        border-bottom: 1px solid #707070;
    }
`;
export default TimeBar;
