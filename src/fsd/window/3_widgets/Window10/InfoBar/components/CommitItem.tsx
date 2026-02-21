import React from "react";
import styled from "styled-components";
import { dateToStr } from "@Common/common";

const CommitItem = ({ item }) => {
    return (
        <CommitItemBlock>
            <h4>{item.commit.author.name}</h4>
            <p className="message">{item.commit.message}</p>
            <p className="time">{dateToStr(item.commit.author.date, "min")}</p>
        </CommitItemBlock>
    );
};

const CommitItemBlock = styled.div`
    box-sizing: border-box;
    padding: 10px;
    background-color: #292929ad;
    transition: 0.15s;
    scale: 1;
    margin-bottom: 20px;

    :hover {
        background-color: #484848;
    }
    :active {
        scale: 0.9;
    }

    h4,
    p {
        text-align: left;
        cursor: default;
    }

    h4 {
        color: white;
    }

    p {
        color: #a9a9a9;
    }
    .message {
        margin-top: 2px;
        word-break: break-word;
    }

    .time {
        margin-top: 10px;
        font-size: 14px;
    }
`;
export default React.memo(CommitItem);
