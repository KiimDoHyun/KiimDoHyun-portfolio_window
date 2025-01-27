import React from "react";
import styled from "styled-components";
import SimpleArrowDown from "../Program/Icon/SimpleArrowDown";
import SimpleArrowUp from "../Program/Icon/SimpleArrowUp";

const dateArr = ["일", "월", "화", "수", "목", "금", "토"];

const TimeBar = (props) => {
  const {
    calendarData,
    month,
    year,
    calendarBodyClassName,
    active,

    cur_year,
    cur_month,
    cur_day,
    cur_date,
    cur_hour,
    cur_minute,
    cur_second,
    cur_timeline,

    onClickDateText,
    onClickYear,
    onClickUp,
    onClickDown,
  } = props;

  return (
    <TimeBarBlock active={active}>
      {/* 상단 실시간 영역 */}
      <div className="timeArea">
        <div className="time">
          {cur_timeline} {cur_hour}:{cur_minute}:{cur_second}
        </div>
        <div className="date" onClick={onClickDateText}>
          {cur_year}년 {cur_month}월 {cur_date}일 {cur_day}요일
        </div>
      </div>

      {/* 달력 영역 */}
      <div className="calendarArea">
        {/* 달력 상단 */}
        <div className="calendarHeader">
          <div className="year_month" onClick={onClickYear}>
            {year}년 {month + 1}월
          </div>
          <div className="calendarArrowArea">
            <div className="up" onClick={onClickDown}>
              <SimpleArrowUp />
            </div>
            <div className="down" onClick={onClickUp}>
              <SimpleArrowDown />
            </div>
          </div>
        </div>

        {/* 달력 */}
        <div className={`${calendarBodyClassName} calendarBody`}>
          {dateArr.map((dateItem) => (
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

      {/* 빈 공간 */}
      <div className="functionArea"></div>
    </TimeBarBlock>
  );
};

const TimeBarBlock = styled.div<{ active: boolean }>`
  display: grid;
  grid-template-rows: 130px 1fr 250px;

  position: absolute;
  right: 0;
  bottom: ${(props) => (props.active ? "50px" : "-150px")};
  opacity: ${(props) => (props.active ? "1" : "0")};
  pointer-events: ${(props) => (props.active ? "auto" : "none")};
  z-index: ${(props) => (props.active ? "999" : "0")};
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
    transition: 0.2s;
    scale: 1;
    opacity: 1;

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 2px;
  }

  .active_calendarBody {
    scale: 0.97;
    opacity: 0.1;
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
    color: #ededed;
    position: relative;
    background-color: #0078d7;
  }

  .box_curDate:after {
    content: "";
    width: 100%;
    height: 100%;
    border: 2px solid black;
    position: absolute;
    box-sizing: border-box;
  }

  .box_content:hover {
    border-color: #797979;
  }
`;
export default TimeBar;
