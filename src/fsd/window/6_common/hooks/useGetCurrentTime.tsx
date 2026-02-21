import React, { useEffect, useRef, useState } from "react";
import { sliceDateString } from "@Common/date";

const dateArr = ["일", "월", "화", "수", "목", "금", "토"];

const useGetCurrentTime = () => {
    const [year, setYear] = useState("yyyy");
    const [month, setMonth] = useState("mm");
    const [day, setDay] = useState("dd");
    const [date, setDate] = useState("dd");
    const [hour, setHour] = useState("hh");
    const [min, setMin] = useState("mm");
    const [sec, setSec] = useState("ss");
    const [timeLine, setTimeLine] = useState("...");

    const interval = useRef(null);
    useEffect(() => {
        interval.current = setInterval(() => {
            const now = new Date(Date.now());
            const currentHour = now.getHours();

            setYear(String(now.getFullYear()));
            setMonth(sliceDateString({ date: now.getMonth() + 1 }));
            setDate(sliceDateString({ date: now.getDate() }));

            setDay(dateArr[now.getDay()]);

            if (currentHour > 12) {
                setTimeLine("오후");
                setHour(sliceDateString({ date: currentHour - 12 }));
            } else {
                setTimeLine("오전");
                setHour(sliceDateString({ date: currentHour }));
            }
            setMin(sliceDateString({ date: now.getMinutes() }));
            setSec(sliceDateString({ date: now.getSeconds() }));
        }, 1000);

        return () => clearInterval(interval.current);
    }, []);

    return {
        year,
        month,
        day,
        date,
        hour,
        min,
        sec,
        timeLine,
    };
};

export default useGetCurrentTime;
