import React from "react";
import { css } from "@styled-system/css";

const skillIconBlockStyle = css({
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.1s",

    _hover: {
        backgroundColor: "#515151",
    },

    "& img": {
        width: "60%",
        height: "60%",
    },
});

const SkillIcon = ({ src, text }) => {
    return (
        <div className={skillIconBlockStyle} title={text}>
            <img src={src} alt={text} />
        </div>
    );
};

export default SkillIcon;
