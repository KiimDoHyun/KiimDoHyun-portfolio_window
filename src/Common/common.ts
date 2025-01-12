export const dateToStr = (date, format = "d", isHyphen = true) => {
    const d = date instanceof Date ? date : new Date(date);
    const _year = d.getFullYear();
    const _month = ("0" + (d.getMonth() + 1)).slice(-2);
    const _date = ("0" + d.getDate()).slice(-2);
    const _hour = ("0" + d.getHours()).slice(-2);
    const _minutes = ("0" + d.getMinutes()).slice(-2);
    const _seconds = ("0" + d.getSeconds()).slice(-2);

    switch (format) {
        case "y":
            if (isHyphen) {
                return `${_year}`;
            } else {
                return `${_year}년`;
            }
        case "m":
            if (isHyphen) {
                return `${_year}-${_month}`;
            } else {
                return `${_year}년 ${_month}월`;
            }
        case "d":
            if (isHyphen) {
                return `${_year}-${_month}-${_date}`;
            } else {
                return `${_year}년 ${_month}월 ${_date}일`;
            }
        case "h":
            if (isHyphen) {
                return `${_year}-${_month}-${_date} ${_hour}`;
            } else {
                return `${_year}년 ${_month}월 ${_date}일 ${_hour}시`;
            }
        case "min":
            if (isHyphen) {
                return `${_year}-${_month}-${_date} ${_hour}:${_minutes}`;
            } else {
                return `${_year}년 ${_month}월 ${_date}일 ${_hour}시 ${_minutes}분`;
            }
        case "sec":
            if (isHyphen) {
                return `${_year}-${_month}-${_date} ${_hour}:${_minutes}:${_seconds}`;
            } else {
                return `${_year}년 ${_month}월 ${_date}일 ${_hour}시 ${_minutes}분 ${_seconds}초`;
            }
        case "time":
            if (isHyphen) {
                return `${_hour}:${_minutes}`;
            } else {
                return `${_hour}시 ${_minutes}분`;
            }
        default:
            return d;
    }
};
