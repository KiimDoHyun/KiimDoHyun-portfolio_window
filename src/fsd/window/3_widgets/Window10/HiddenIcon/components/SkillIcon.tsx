import React from "react";
import styled from "styled-components";

const SkillIcon = ({ src, text }) => {
    return (
        <SkillIconBlock title={text}>
            <img src={src} alt={text} />
        </SkillIconBlock>
    );
};

const SkillIconBlock = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.1s;

    :hover {
        background-color: #515151;
    }

    img {
        width: 60%;
        height: 60%;
    }
`;
export default SkillIcon;
