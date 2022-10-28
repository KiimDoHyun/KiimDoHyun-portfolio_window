import React from "react";
import defaultImg from "../logo.svg";
import styled from "styled-components";

const IconBox = ({ item, onClick, onDoubleClick }) => {
    const { name, img } = item;
    return (
        <IconBoxBlock
            onClick={() => onClick(item)}
            onDoubleClick={onDoubleClick}
        >
            <img
                className="iconImg"
                src={img ? img : defaultImg}
                alt="iconImg"
            />
            <div className="name">{name ? name : "Icon"}</div>
            <div className="iconBox"></div>
        </IconBoxBlock>
    );
};

const IconBoxBlock = styled.div`
    width: 100px;
    height: 100px;

    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;

    display: grid;
    grid-template-rows: 8fr 2fr;
    border: 2px solid #ffffff00;

    :hover {
        background-color: #bbbbbb47;
        border: 2px solid #ffffff2e;
    }

    :active {
        backgrond-color: red;
    }

    .iconImg {
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
