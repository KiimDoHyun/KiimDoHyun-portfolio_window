import React from "react";
import defaultImg from "../logo.svg";
import styled from "styled-components";

const IconBox = ({ img, name }) => {
    return (
        <IconBoxBlock>
            <div className="iconBox">
                <img
                    className="iconImg"
                    src={img ? img : defaultImg}
                    alt="iconImg"
                />
                <div className="name">{name ? name : "Icon"}</div>
            </div>
        </IconBoxBlock>
    );
};

const IconBoxBlock = styled.div`
    .iconBox {
        width: 100px;
        height: 100px;

        padding: 10px;
        box-sizing: border-box;
        cursor: pointer;

        display: grid;
        grid-template-rows: 8fr 2fr;
        border: 2px solid #ffffff00;
    }

    .iconBox:hover {
        background-color: #bbbbbb47;
        border: 2px solid #ffffff2e;
    }

    .iconBox .iconImg {
        width: 100%;
        height: 100%;
    }

    .iconBox .name {
        color: white;
        font-size: 14px;
        text-shadow: 2px 2px 3px black;
    }
`;
export default React.memo(IconBox);
