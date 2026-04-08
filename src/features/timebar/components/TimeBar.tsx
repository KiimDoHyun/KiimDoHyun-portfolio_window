import React from "react";
import SimpleArrowDown from "@shared/ui/icons/SimpleArrowDown";
import SimpleArrowUp from "@shared/ui/icons/SimpleArrowUp";
import { TimeBarBlock } from "./TimeBar.style";

const dateArr = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarCell {
  type: string;
  data: number;
}

interface TimeBarViewProps {
  calendarData: Array<CalendarCell>;
  month: number;
  year: number;
  calendarBodyClassName: string;
  active: boolean;

  cur_year: number | string;
  cur_month: number | string;
  cur_day: number | string;
  cur_date: number | string;
  cur_hour: number | string;
  cur_minute: number | string;
  cur_second: number | string;
  cur_timeline: string;

  onClickDateText: () => void;
  onClickYear: () => void;
  onClickUp: () => void;
  onClickDown: () => void;
}

const TimeBar = ({
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
}: TimeBarViewProps) => {

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

export default TimeBar;
