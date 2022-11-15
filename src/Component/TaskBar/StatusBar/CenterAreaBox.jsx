import React from "react";
import styled from "styled-components";
import defaultImg from "../../../asset/images/icons/project_default_1.png";
import icon from "../../../asset/images/icons/projectList.png";

const CenterAreaBox = ({ img, name, showImg = true, onClick }) => {
    return (
        <CenterAreaBoxBlock
            className="statusBox"
            onClick={() => onClick({ key: "프로젝트", icon: icon })}
        >
            {showImg && <img src={img ? img : defaultImg} alt="name" />}
            <div className="text">{name}</div>
        </CenterAreaBoxBlock>
    );
};

const CenterAreaBoxBlock = styled.div`
    width: 100%;
    height: 50px;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 5px;
    box-sizing: border-box;

    img {
        width: 25px;
        height: 25px;
    }
    .text {
        font-size: 14px;
        font-weight: lighter;
        color: #e8e8e8;
        cursor: default;
    }
`;
export default React.memo(CenterAreaBox);
