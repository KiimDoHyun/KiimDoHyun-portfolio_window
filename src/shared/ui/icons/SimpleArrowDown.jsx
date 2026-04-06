import React from "react";
import { useState } from "react";
import { css } from "@styled-system/css";

const simpleArrowDownBlockStyle = css({
    rotate: "180deg",
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",

    "& div": {
        width: "1px",
        height: "12px",
        backgroundColor: "#c7c7c7",
    },

    "& .arrow1": {
        rotate: "225deg",
    },

    "& .arrow2": {
        rotate: "135deg",
    },

    "& .active": {
        backgroundColor: "white",
    },
});

const SimpleArrowDown = () => {
    const [active, setActive] = useState("");
    return (
        <div
            className={simpleArrowDownBlockStyle}
            onMouseEnter={() => setActive("active")}
            onMouseLeave={() => setActive("")}
        >
            <div className={`${active} arrow1`} />
            <div className={`${active} arrow2`} />
        </div>
    );
};

export default SimpleArrowDown;
