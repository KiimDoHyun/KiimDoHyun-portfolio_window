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
    // raw 에 대응 없는 어두운 회색 반투명. Phase 6 에서 전용 semantic 정비 시 재처리
    backgroundColor: "rgba(41, 41, 41, 0.68)",
    // 원래 0.15s였으나 설계 문서 Task 3-2 예외 분석에서 fast(0.2s)로 통합
    transition: "fast",
    scale: 1,
    marginBottom: "20px",

    _hover: {
        backgroundColor: "surface.raised",
    },
    _active: {
        scale: 0.9,
    },

    "& h4, & p": {
        textAlign: "left",
        cursor: "default",
    },

    "& h4": {
        color: "shell.text",
    },

    "& p": {
        color: "surface.textMuted",
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
