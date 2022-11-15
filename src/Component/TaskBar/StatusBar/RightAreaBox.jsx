import React from "react";
import styled from "styled-components";

const RightAreaBox = ({ img, name }) => {
    return (
        <RightAreaBoxBlock className="statusBox">
            <img src={img} alt="name" />
            <div className="text">{name}</div>
            {/* <div className="text">{name.slice(0, 10)}</div> */}
        </RightAreaBoxBlock>
    );
};

const RightAreaBoxBlock = styled.div`
    flex-basis: 32%;
    height: 100px;
    background-color: #ffffff14;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #9b9b9b00;

    box-sizing: border-box;
    padding: 10px;

    position: relative;

    :hover {
        border: 2px solid #9b9b9b;
    }

    img {
        width: 50%;
        height: 50%;
    }

    .text {
        position: absolute;
        bottom: 5px;
        left: 2px;
        font-size: 11px;
        font-weight: lighter;
        color: #e8e8e8;
        cursor: default;
    }
`;
export default RightAreaBox;
