import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import TimeBar from "../../../Component/TaskBar/TimeBar";
import {
    rc_global_date,
    rc_global_day,
    rc_global_hour,
    rc_global_min,
    rc_global_month,
    rc_global_sec,
    rc_global_timeline,
    rc_global_year,
} from "../../../store/global";
import { rc_taskbar_timeBar_active } from "../../../store/taskbar";

const TimeBarContainer = () => {
    const date = new Date();

    const active = useRecoilValue(rc_taskbar_timeBar_active); // 바 활성화 상태
    const [calendarData, setCalendarData] = useState([]); // 달력 데이터
    const [year, setYear] = useState(date.getFullYear()); // 년도 (가변)
    const [month, setMonth] = useState(date.getMonth()); // 월   (가변)

    // 현재 날짜 전용 데이터
    const cur_year = useRecoilValue(rc_global_year);
    const cur_month = useRecoilValue(rc_global_month);
    const cur_day = useRecoilValue(rc_global_day);
    const cur_date = useRecoilValue(rc_global_date);
    const cur_hour = useRecoilValue(rc_global_hour);
    const cur_minute = useRecoilValue(rc_global_min);
    const cur_second = useRecoilValue(rc_global_sec);
    const cur_timeline = useRecoilValue(rc_global_timeline);

    const [calendarBodyClassName, setCalendarBodyClassName] = useState(""); // 이동모션

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
