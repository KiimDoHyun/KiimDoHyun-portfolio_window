import React from "react";
import { css } from "@styled-system/css";

const leftAreaBoxBlockStyle = css({
    width: "100%",
    height: "50px",
    backgroundColor: "transparent",

    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",

    "& .icon": {
        width: "48px",
        height: "50px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    "& .icon img": {
        width: "55%",
        height: "55%",
        borderRadius: "100%",
    },

    "& .text": {
        color: "shell.text",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "13px",
        fontWeight: "lighter",
        cursor: "default",
    },
});

type LeftAreaBoxProps = {
    img: string;
    name: string;
    onClick: () => void;
};

const LeftAreaBox = ({ img, name, onClick }: LeftAreaBoxProps) => {
    return (
        <div
            className={`statusBox ${leftAreaBoxBlockStyle}`}
            onClick={onClick}
        >
            <div className="icon">
                <img src={img} alt={name} />
            </div>
            <div className="text">{name}</div>
        </div>
    );
};

export default React.memo(LeftAreaBox);
