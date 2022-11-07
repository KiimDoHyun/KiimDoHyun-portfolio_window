import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { rc_taskbar_timeBar_active } from "../../store/taskbar";
import SimpleArrowDown from "../Program/Icon/SimpleArrowDown";
import SimpleArrowUp from "../Program/Icon/SimpleArrowUp";

const TimeBar = (props) => {
    const active = useRecoilValue(rc_taskbar_timeBar_active);
    const { calendarData, onClickDateText } = props;
    // const temp = [];
    // for (let i = 0; i < 42; i++) {
    //     temp.push(i);
    // }

    const date = ["일", "월", "화", "수", "목", "금", "토"];
    console.log("calendarData: ", calendarData);
    return (
        <TimeBarBlock active={active}>
            <div className="timeArea">
                <div className="time">오후 2:24:34</div>
                <div className="date" onClick={onClickDateText}>
                    2022년 11월 7일 월요일
                </div>
            </div>
            <div className="calendarArea">
                <div className="calendarHeader">
                    <div className="year_month">2022년 11월</div>
                    <div className="calendarArrowArea">
                        <div className="up">
                            <SimpleArrowUp />
                        </div>
                        <div className="down">
                            <SimpleArrowDown />
                        </div>
                    </div>
                </div>
                <div className="calendarBody">
                    {date.map((dateItem) => (
                        <div key={dateItem} className="box box_title">
                            {dateItem}
                        </div>
                    ))}
                    {calendarData.map((item, idx) => (
                        <div
                            className={`${item.type} box box_content`}
                            key={`${item.type}${item.data}${idx}`}
                        >
                            {item.data}
                        </div>
                    ))}
                </div>
            </div>
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
        cursor: default;
    }

    .date {
        flex: 1;
        font-size: 1rem;
        color: #90b8da;
        cursor: pointer;
    }

    .date:hover {
        color: #aaaaaa;
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

        display: grid;
        grid-template-rows: 20px 1fr;
        gap: 10px;
    }

    .calendarHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .year_month {
        color: #c7c7c7;
        cursor: default;
    }

    .year_month:hover {
        color: #ededed;
    }

    .calendarArrowArea {
        width: 87px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .calendarArrowArea > div {
        width: 40px;
        height: 100%;
    }

    .calendarBody {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 2px;
    }

    .box {
        border: 2px solid #ffffff00;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: center;
        cursor: default;
    }

    .box_prev,
    .box_next {
        color: gray;
    }
    .box_title,
    .box_cur,
    .box_curMonth {
        color: #ededed;
    }
    .box_curDate {
        background-color: blue;
    }

    .box_content:hover {
        border-color: #797979;
    }
`;
export default TimeBar;
