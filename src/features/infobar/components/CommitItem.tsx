import React from "react";
import { css } from "@styled-system/css";
import { dateToStr } from "@shared/lib/common";

interface CommitItemProps {
    item: {
        commit: {
            author: { name: string; date: string };
            message: string;
        };
    };
}

const CommitItem = ({ item }: CommitItemProps) => {
    return (
        <div className={commitItemStyle}>
            <h4>{item.commit.author.name}</h4>
            <p className="message">{item.commit.message}</p>
            <p className="time">{dateToStr(item.commit.author.date, "min")}</p>
        </div>
    );
};

const commitItemStyle = css({
    boxSizing: "border-box",
    padding: "10px",
    backgroundColor: "#292929ad",
    transition: "0.15s",
    scale: 1,
    marginBottom: "20px",

    _hover: {
        backgroundColor: "#484848",
    },
    _active: {
        scale: 0.9,
    },

    "& h4, & p": {
        textAlign: "left",
        cursor: "default",
    },

    "& h4": {
        color: "white",
    },

    "& p": {
        color: "#a9a9a9",
    },
    "& .message": {
        marginTop: "2px",
        wordBreak: "break-word",
    },

    "& .time": {
        marginTop: "10px",
        fontSize: "14px",
    },
});
export default React.memo(CommitItem);
