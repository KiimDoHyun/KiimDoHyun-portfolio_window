import React from "react";
import { css } from "@styled-system/css";
import type { ProgramId } from "@shared/types/program";

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
    parentId: ProgramId;
    img: string;
    name: string;
    onClick: (id: ProgramId) => void;
};

const RightAreaBox = ({ parentId, img, name, onClick }: RightAreaBoxProps) => {
    return (
        <div
            className={`statusBox ${rightAreaBoxBlockStyle}`}
            onClick={() => onClick(parentId)}
        >
            <img src={img} alt="name" />
            <div className="text">{name}</div>
        </div>
    );
};

export default React.memo(RightAreaBox);
