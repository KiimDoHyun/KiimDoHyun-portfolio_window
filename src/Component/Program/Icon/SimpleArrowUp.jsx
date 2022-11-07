import React from "react";
import styled from "styled-components";

const SimpleArrowUp = () => {
    return (
        <SimpleArrowUpBlock>
            <div className="arrow1" />
            <div className="arrow2" />
        </SimpleArrowUpBlock>
    );
};

const SimpleArrowUpBlock = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;

    div {
        width: 1px;
        height: 12px;
        background-color: #c7c7c7;
    }

    .arrow1 {
        rotate: 225deg;
    }

    .arrow2 {
        rotate: 135deg;
    }
`;
export default SimpleArrowUp;
