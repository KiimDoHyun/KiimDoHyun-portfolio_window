import React from "react";
import { useState } from "react";
import styled from "styled-components";

const SimpleArrowDown = () => {
    const [active, setActive] = useState("");
    return (
        <SimpleArrowDownBlock
            onMouseEnter={() => setActive("active")}
            onMouseLeave={() => setActive("")}
        >
            <div className={`${active} arrow1`} />
            <div className={`${active} arrow2`} />
        </SimpleArrowDownBlock>
    );
};

const SimpleArrowDownBlock = styled.div`
    rotate: 180deg;
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

    .active {
        background-color: white;
    }
`;
export default SimpleArrowDown;
