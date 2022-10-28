import React from "react";
import styled, { keyframes } from "styled-components";

const FolderComponent = ({
    onClick,
    onClickClose,
    onMouseDown,
    onMouseMove,
    onMouseUp,

    boxRef,
    isClose,
}) => {
    return (
        <FolderComponentBlock
            ref={boxRef}
            isClose={isClose}
            onMouseDown={onClick}
        >
            <div
                className="headerArea"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                <div className="infoArea"></div>
                <div className="buttonArea">
                    <div className="min" onClick={onClickClose}>
                        <div />
                    </div>
                    <div className="max" onClick={onClickClose}>
                        <div />
                    </div>
                    <div className="close" onClick={onClickClose}>
                        <div />
                        <div />
                    </div>
                </div>
            </div>
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
    box-shadow: 0px 0px 20px 3px #00000061;
    position: absolute;
    left: calc(50% - 250px);
    top: calc(50% - 250px);
    width: 500px;
    height: 500px;
    background-color: white;

    z-index: ${(props) => props.zIndexCnt};

    .headerArea {
        width: 100%;
        height: 32px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 2px;
        box-sizing: border-box;
    }

    .buttonArea {
        height: 100%;
        display: flex;
        gap: 1px;
    }

    .min div {
        width: 11px;
        height: 1px;
        background-color: black;
    }

    .max div {
        width: 8px;
        height: 8px;
        border: 1px solid black;
    }

    .close div {
        width: 14px;
        height: 1px;
        background-color: black;
    }

    .close div:nth-child(1) {
        position: absolute;
        rotate: 45deg;
    }

    .close div:nth-child(2) {
        rotate: 135deg;
    }

    .buttonArea > div {
        height: 100%;
        width: 45px;
        transition: 0.2s;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .buttonArea > div > img {
        width: 10px;
    }

    .buttonArea .min:hover,
    .buttonArea .max:hover {
        background-color: #ddddddb3;
    }

    .buttonArea > .close:hover {
        background-color: #ff1010;
    }

    animation: ${open} 0.25s 0s;

    ${(props) =>
        props.isClose && `transition: 0.25s; opacity: 0; transform: scale(0.9)`}
`;
export default FolderComponent;
