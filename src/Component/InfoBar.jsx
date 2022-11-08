import React from "react";
import styled from "styled-components";
import CommitItem from "./InfoBar/CommitItem";
import ErrorBox from "./InfoBar/ErrorBox";

const InfoBar = (props) => {
    const { active, commit } = props;

    const { data, error } = commit;

    return (
        <InfoBarBlock active={active}>
            <h2>History</h2>
            <div className="commitArea">
                {error && <ErrorBox />}
                {data &&
                    data.map((item, idx) => (
                        <CommitItem item={item} key={idx} />
                    ))}
            </div>
            <div className="boxArea"></div>
            <div className="displayLightArea"></div>
        </InfoBarBlock>
    );
};

const InfoBarBlock = styled.div`
    h4,
    h2,
    p {
        margin: 0;
    }

    h2 {
        margin: 10px 0;
        color: white;
        cursor: default;
    }
    display: grid;
    grid-template-rows: auto 2fr 1fr 100px;
    border-left: 1px solid gray;

    position: absolute;
    right: ${(props) => (props.active ? "0px" : "-361px")};
    bottom: 50px;
    pointer-events: ${(props) => (props.active ? "auto" : "none")};
    z-index: ${(props) => (props.active ? "99999" : "0")};
    width: 360px;
    height: calc(100% - 50px);
    background-color: white;

    transition: 0.4s;
    transition-timing-function: cubic-bezier(0, 0.5, 0, 1);
    background-color: #393a3b;

    > div {
        box-sizing: border-box;
        padding: 20px;
    }

    .commitArea {
        overflow: scroll;
    }

    .errorBox {
    }
`;
export default InfoBar;
