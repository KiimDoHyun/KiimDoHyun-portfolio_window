import React from "react";
import { css } from "@styled-system/css";

const skillIconBlockStyle = css({
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // 원래 0.1s였으나 설계 문서 Task 3-2 예외 분석에서 fast(0.2s)로 통합
    transition: "fast",

    _hover: {
        backgroundColor: "shell.border",
    },

    "& img": {
        width: "60%",
        height: "60%",
    },
});

interface SkillIconProps {
    src: string;
    text: string;
}

const SkillIcon = ({ src, text }: SkillIconProps) => {
    return (
        <div className={skillIconBlockStyle} title={text}>
            <img src={src} alt={text} />
        </div>
    );
};

export default SkillIcon;
