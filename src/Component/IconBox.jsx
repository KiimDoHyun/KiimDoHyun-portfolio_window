import React from "react";
import defaultImg from "../logo.svg";
import styled from "styled-components";

const IconBox = ({ item, onClick, onDoubleClick }) => {
    const { name, icon } = item;
    return (
        <IconBoxBlock
            onClick={() => onClick(item)}
            onDoubleClick={() => onDoubleClick(item)}
        >
            <div className="iconImgBox">
                <img src={icon ? icon : defaultImg} alt="iconImg" />
            </div>
            <div className="name">{name ? name : "Icon"}</div>
        </IconBoxBlock>
    );
};

const IconBoxBlock = styled.div`
    width: 100px;
    height: 100px;

    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: 2px solid #ffffff00;

    :hover {
        background-color: #bbbbbb47;
        border: 2px solid #ffffff2e;
    }

    :active {
        backgrond-color: red;
    }

    .iconImgBox {
        width: 50px;
        height: 50px;
    }
    .iconImgBox img {
        width: 100%;
        height: 100%;
    }

    .name {
        color: white;
        font-size: 14px;
        text-shadow: 2px 2px 3px black;
    }
`;
export default React.memo(IconBox);
