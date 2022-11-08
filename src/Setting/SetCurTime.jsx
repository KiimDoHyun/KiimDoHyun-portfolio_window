import React from "react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import {
    rc_global_date,
    rc_global_day,
    rc_global_hour,
    rc_global_min,
    rc_global_month,
    rc_global_sec,
    rc_global_timeline,
    rc_global_year,
} from "../store/global";

const dateArr = ["일", "월", "화", "수", "목", "금", "토"];

const SetCurTime = () => {
    const setYear = useSetRecoilState(rc_global_year);
    const setMonth = useSetRecoilState(rc_global_month);
    const setDay = useSetRecoilState(rc_global_day);
    const setDate = useSetRecoilState(rc_global_date);
    const setHour = useSetRecoilState(rc_global_hour);
    const setMin = useSetRecoilState(rc_global_min);
    const setSec = useSetRecoilState(rc_global_sec);
    const setTimeLine = useSetRecoilState(rc_global_timeline);

    useEffect(() => {
        setInterval(() => {
            const date = new Date();
            setYear(date.getFullYear());
            setMonth(date.getMonth() + 1);
            setDate(date.getDate());

            setDay(dateArr[date.getDay()]);

            let h = date.getHours();
            if (h > 12) {
                h -= 12;
                setTimeLine("오후");
                setHour(h);
            } else {
                setTimeLine("오전");
                setHour(h);
            }
            // setHour(date.getHours());
            setMin(`0${date.getMinutes()}`.slice(-2));
            setSec(`0${date.getSeconds()}`.slice(-2));
            // setSec(date.getSeconds());
        }, 1000);
    }, [
        setYear,
        setMonth,
        setDate,
        setDay,
        setTimeLine,
        setHour,
        setMin,
        setSec,
    ]);
    return <></>;
};

export default SetCurTime;
