import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import TimeBar from "../../../Component/TaskBar/TimeBar";
import { rc_taskbar_timeBar_active } from "../../../store/taskbar";

const TimeBarContainer = () => {
    const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth(); // 0 ~ 11

    const active = useRecoilValue(rc_taskbar_timeBar_active);
    const [calendarData, setCalendarData] = useState([]);
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth());

    const [calendarBodyClassName, setCalendarBodyClassName] = useState("");
    // const [day, setDay] = useState(date.getDate());

    useEffect(() => {
        const setDate = new Date(year, month, 1);
        const firstDayName = setDate.getDay(); // 0: 일 , 6: 토
        const lastDay = new Date(date.getFullYear(), month + 1, 0).getDate();
        const prevLastDay = new Date(date.getFullYear(), month, 0).getDate();
        const curDate = date.getDate();
        let data = 1;
        let tempData = [];
        for (let i = 0; i < 42; i++) {
            if (
                year === date.getFullYear() &&
                month === date.getMonth() &&
                data === curDate
            ) {
                tempData.push({ type: "box_curDate", data: data });
                data += 1;
                continue;
            }
            if (i / 7 < 1) {
                if (i < firstDayName) {
                    tempData.push({
                        type: "box_prev",
                        data: prevLastDay - firstDayName + i + 1,
                    });
                } else if (i >= firstDayName) {
                    tempData.push({ type: "box_curMonth", data: data });
                    data += 1;
                }
            } else {
                if (data <= lastDay) {
                    tempData.push({ type: "box_curMonth", data: data });
                    data += 1;
                    // tempData.push(data);
                } else {
                    tempData.push({
                        type: "box_next",
                        data: data - lastDay,
                    });
                    data += 1;
                }
            }
        }
        setCalendarData(tempData);
    }, [year, month]);

    useEffect(() => {
        if (!active) {
            setMonth(date.getMonth());
            setYear(date.getFullYear());
        }
    }, [active]);

    // console.log("year: ", year);
    // console.log("이번달: ", month + 1);
    // console.log("firstDayName: ", firstDayName);
    // console.log("이번달 말일: ", lastDay);
    // console.log("저번달 말일: ", prevLastDay);
    // console.log("curDate: ", curDate);
    /*
    이번달의 시작일이 무슨 요일인지
    끝나는 날짜가 몇일인지 (30, 31)

    날짜 구성은 일요일을 기준으로 한다
    "일", "월", "화", "수", "목", "금", "토"
      0    1     2    3      4    5     6

    화요일이 1일이면 0, 1은 빈값, 그다음부터 채우기 시작한다

    말일까지 채우고 남는 값은 비운다. 

    */
    // const lastDate = date();

    // 현재 날짜로
    const onClickDateText = useCallback(() => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
        setCalendarBodyClassName("active_calendarBody");

        setTimeout(() => {
            setCalendarBodyClassName("");
        }, [200]);
    }, []);

    // 현재 날짜로
    const onClickYear = useCallback(() => {
        //
    }, []);

    // month -
    const onClickUp = useCallback(() => {
        //
        setMonth((prev) => (prev + 1) % 12);
        setCalendarBodyClassName("active_calendarBody");

        setTimeout(() => {
            setCalendarBodyClassName("");
        }, [200]);
    }, [setMonth]);

    // month +
    const onClickDown = useCallback(() => {
        if (month - 1 < 0) {
            setMonth(11);
            setYear((prev) => prev - 1);
        } else {
            setMonth(month - 1);
        }

        setCalendarBodyClassName("active_calendarBody");

        setTimeout(() => {
            setCalendarBodyClassName("");
        }, [200]);
    }, [month, setMonth]);

    const propDatas = {
        calendarData,
        month,
        year,
        calendarBodyClassName,
        active,

        onClickDateText,
        onClickYear,
        onClickUp,
        onClickDown,
    };
    return <TimeBar {...propDatas} />;
};

export default TimeBarContainer;
