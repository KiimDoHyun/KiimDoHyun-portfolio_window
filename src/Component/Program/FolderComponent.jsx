import React from "react";
import styled, { keyframes } from "styled-components";

const FolderComponent = ({
    onClickClose,
    onMouseDown,
    onMouseMove,
    onMouseUp,

    boxRef,
    isClose,
}) => {
    return (
        <FolderComponentBlock ref={boxRef} isClose={isClose}>
            <div
                className="headerArea"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            ></div>
            <button onClick={onClickClose}>닫기</button>
            <div className="hi">FolderComponent</div>
        </FolderComponentBlock>
    );
};
const open = keyframes`
from {
    opacity: 0;
    transform: scale(0.9);
}
to {
    opacity: 1;
    transform: scale(1);
}
`;

const FolderComponentBlock = styled.div`
    position: absolute;
    left: calc(50% - 250px);
    top: calc(50% - 250px);
    width: 500px;
    height: 500px;
    background-color: white;
    transition: 0.25s;

    .headerArea {
        width: 100%;
        height: 40px;
        background-color: #c7c7c7;
    }

    animation: ${open} 0.25s 0s;

    ${(props) => props.isClose && `opacity: 0; transform: scale(0.9)`}
`;
export default FolderComponent;
