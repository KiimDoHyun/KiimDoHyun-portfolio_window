import React from "react";
import { css } from "@styled-system/css";

const rightAreaBoxBlockStyle = css({
    flexBasis: "32%",
    height: "100px",
    backgroundColor: "#ffffff14",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #9b9b9b00",

    boxSizing: "border-box",
    padding: "10px",

    position: "relative",

    _hover: {
        border: "2px solid #9b9b9b",
    },

    "& img": {
        width: "50%",
        height: "50%",
    },

    "& .text": {
        position: "absolute",
        bottom: "5px",
        left: "2px",
        fontSize: "11px",
        fontWeight: "lighter",
        color: "#e8e8e8",
        cursor: "default",
    },
});

type RightAreaBoxProps = {
    item?: { parent: string };
    img: string;
    name: string;
    onClick: (parentName: string) => void;
};

const RightAreaBox = ({ item, img, name, onClick }: RightAreaBoxProps) => {
    return (
        <div
            className={`statusBox ${rightAreaBoxBlockStyle}`}
            onClick={() => {
                if (item) {
                    onClick(item.parent);
                }
            }}
        >
            <img src={img} alt="name" />
            <div className="text">{name}</div>
        </div>
    );
};

export default React.memo(RightAreaBox);
