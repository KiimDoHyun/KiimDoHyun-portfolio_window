import React from "react";
import styled from "styled-components";

const FolderComponent = ({
    onClickClose,
    onMouseDown,
    onMouseMove,
    onMouseUp,

    boxRef,
}) => {
    return (
        <FolderComponentBlock ref={boxRef}>
            <div
                className="headerArea"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            ></div>
            <button onClick={onClickClose}>닫기</button>
            FolderComponent
        </FolderComponentBlock>
    );
};

const FolderComponentBlock = styled.div`
    position: absolute;
    left: calc(50% - 250px);
    top: calc(50% - 250px);
    width: 500px;
    height: 500px;
    background-color: white;

    .headerArea {
        width: 100%;
        height: 40px;
        background-color: #c7c7c7;
    }
`;
export default FolderComponent;
