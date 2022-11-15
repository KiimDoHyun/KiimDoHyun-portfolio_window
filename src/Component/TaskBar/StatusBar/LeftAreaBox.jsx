import React from "react";
import styled from "styled-components";
import icon from "../../../asset/images/icons/monitor.png";
const LeftAreaBox = ({ img, name, onClick }) => {
    return (
        <LeftAreaBoxBlock
            className="statusBox"
            onClick={() => onClick({ key: "내컴퓨터", icon: icon })}
        >
            <div className="icon">
                <img src={img} alt={name} />
            </div>
            <div className="text">{name}</div>
        </LeftAreaBoxBlock>
    );
};

const LeftAreaBoxBlock = styled.div`
    width: 100%;
    height: 50px;
    background-color: transparent;

    overflow: hidden;
    display: flex;
    flex-wrap: wrap;

    .icon {
        width: 48px;
        height: 50px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon img {
        width: 55%;
        height: 55%;
        border-radius: 100%;
    }

    .text {
        color: #e8e8e8;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 13px;
        font-weight: lighter;
        cursor: default;
    }
`;
export default React.memo(LeftAreaBox);
