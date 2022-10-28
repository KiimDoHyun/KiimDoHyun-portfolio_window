import React from "react";
import styled from "styled-components";

const Close = () => {
    return (
        <CloseBlock>
            <div />
            <div />
        </CloseBlock>
    );
};

const CloseBlock = styled.div`
    div {
        height: 1px;
        width: 10px;
        background-color: black;
    }
`;
export default Close;
