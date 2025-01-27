import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import TimeBar from "../../Component/TaskBar/TimeBar";
import useGetCurrentTime from "../../hooks/useGetCurrentTime";
import { rc_taskbar_timeBar_active } from "../../store/taskbar";

const TimeBarContainer = () => {
    const [date] = useState(new Date());

    // 실제 달력 영역
    const active = useRecoilValue(rc_taskbar_timeBar_active); // 바 활성화 상태
    const [calendarData, setCalendarData] = useState([]); // 달력 데이터
    const [year, setYear] = useState(date.getFullYear()); // 년도 (가변)
    const [month, setMonth] = useState(date.getMonth()); // 월   (가변)

    // 현재 날짜 전용 데이터
    const {
        year: cur_year,
        month: cur_month,
        day: cur_day,
        date: cur_date,
        hour: cur_hour,
        min: cur_minute,
        sec: cur_second,
        timeLine: cur_timeline,
    } = useGetCurrentTime();

    const [calendarBodyClassName, setCalendarBodyClassName] = useState(""); // 이동모션

    useEffect(() => {
        const setDate = new Date(year, month, 1);
        const firstDayName = setDate.getDay(); // 0: 일 , 6: 토
        const lastDay = new Date(date.getFullYear(), month + 1, 0).getDate();
        const prevLastDay = new Date(date.getFullYear(), month, 0).getDate();
        const curDate = date.getDate();

        console.log("firstDayName", firstDayName);
        console.log("curDate", curDate);
        console.log("lastDay", lastDay);
        let data = 1;
        let tempData = [];
        for (let i = 0; i < 42; i++) {
            // 년도 월이 동일한 날의 날짜는 현재 날짜.
            if (
                year === date.getFullYear() &&
                month === date.getMonth() &&
                data === curDate
            ) {
                tempData.push({ type: "box_curDate", data: data });
                data += 1;
                continue;
            }
            // 첫째주
            if (i / 7 < 1) {
                // 달의 시작 요일 보다 작은 인덱스 === 이전달에 해당한다.
                if (i < firstDayName) {
                    tempData.push({
                        type: "box_prev",
                        data: prevLastDay - firstDayName + i + 1,
                    });
                }
                // 달의 시작 요일 보다 작은 인덱스 === 현재 달에 해당한다.
                else if (i >= firstDayName) {
                    tempData.push({ type: "box_curMonth", data: data });
                    data += 1;
                }
            }
            // 그 이후
            else {
                // 달의 마지막 일 보다 작은 인덱스 === 현재 달에 해당한다.
                if (data <= lastDay) {
                    tempData.push({ type: "box_curMonth", data: data });
                    data += 1;
                    // tempData.push(data);
                }
                // 달의 마지막 일 보다 작은 인덱스 === 다음 달에 해당한다.
                // 28일이 마지막인데 29번째 인덱스 -> 마지막 일을 뺀다.
                // 1 부터 다시 시작하게 된다.
                else {
                    tempData.push({
                        type: "box_next",
                        data: data - lastDay,
                    });
                    data += 1;
                }
            }
        }
        setCalendarData(tempData);
    }, [year, month, date]);

    useEffect(() => {
        if (!active) {
            setMonth(date.getMonth());
            setYear(date.getFullYear());
        }
    }, [date, active]);

    // 현재 날짜로
    const onClickDateText = useCallback(() => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
        setCalendarBodyClassName("active_calendarBody");

        setTimeout(() => {
            setCalendarBodyClassName("");
        }, [200]);
    }, [date]);

    // 현재 날짜로
    const onClickYear = useCallback(() => {
        //
    }, []);

    // month +
    const onClickUp = useCallback(() => {
        //
        if (month + 1 > 11) {
            setYear((prev) => prev + 1);
        }
        setMonth((prev) => (prev + 1) % 12);
        setCalendarBodyClassName("active_calendarBody");

        setTimeout(() => {
            setCalendarBodyClassName("");
        }, [200]);
    }, [month, setMonth]);

    // month -
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
    };
    return <TimeBar {...propDatas} />;
};

export default TimeBarContainer;
