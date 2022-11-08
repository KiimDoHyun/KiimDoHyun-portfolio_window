import React from "react";
import styled from "styled-components";
import CommitItem from "./InfoBar/CommitItem";
import ErrorBox from "./InfoBar/ErrorBox";
import sum from "../asset/images/icons/sun.png";

const InfoBar = (props) => {
    const { active, commit, displayLight, onChange } = props;
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
            <div className="displayLightArea">
                <div className="iconCover">
                    <img src={sum} alt="sum" />
                </div>
                <input
                    type={"range"}
                    min={1}
                    max={100}
                    value={displayLight}
                    onChange={onChange}
                />
            </div>
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
    grid-template-rows: auto 1fr 100px;
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

    .displayLightArea {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .displayLightArea .iconCover {
        width: 30px;
        height: 30px;
    }
    .displayLightArea .iconCover img {
        width: 100%;
        height: 100%;
    }

    .displayLightArea input {
        width: 70%;
    }
`;
export default InfoBar;
