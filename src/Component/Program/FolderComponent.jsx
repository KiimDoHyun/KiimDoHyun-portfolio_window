import React from "react";
import styled, { keyframes } from "styled-components";

const FolderComponent = ({
    onClick,
    onClickClose,
    onClickMax,
    onClickNormalSize,
    onClickMin,
    onMouseDown,
    onMouseUp,

    boxRef,
    isClose,
    isMaxSize,
    title,
}) => {
    return (
        <FolderComponentBlock
            ref={boxRef}
            isClose={isClose}
            onMouseDown={onClick}
            isMaxSize={isMaxSize}
        >
            <div
                className="headerArea"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
            >
                <div className="infoArea"></div>
                <div className="buttonArea">
                    <div className="min" onClick={onClickMin}>
                        <div />
                    </div>
                    {isMaxSize ? (
                        <div className="normalSize" onClick={onClickNormalSize}>
                            <div />
                        </div>
                    ) : (
                        <div className="max" onClick={onClickMax}>
                            <div />
                        </div>
                    )}
                    <div className="close" onClick={onClickClose}>
                        <div />
                        <div />
                    </div>
                </div>
            </div>
            <div className="headerArea2">
                <div></div>
                <div></div>
            </div>
            <div className="headerArea3"></div>

            {title === "구글" ? (
                <iframe
                    src={"https://www.google.com/search?igu=1"}
                    width={"100%"}
                    height={"100%"}
                />
            ) : (
                <>
                    <div className="hi">{title}</div>
                    <div className="bottomArea"></div>

                    <div className="modiSize top_left"></div>
                    <div className="modiSize top_right"></div>
                    <div className="modiSize bottom_left"></div>
                    <div className="modiSize bottom_right"></div>
                </>
            )}
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
    left: calc(50% - 250px);
    top: calc(50% - 250px);
    height: 500px;
    width: 500px;

    box-shadow: 0px 0px 20px 3px #00000061;
    position: absolute;

    background-color: white;

    z-index: ${(props) => props.zIndexCnt};

    display: grid;
    grid-template-rows: 32px 25px 32px 1fr 20px;

    .modiSize {
        position: absolute;
        width: 4px;
        height: 4px;
        cursor: pointer;

        // background-color: red;
    }

    .top_left {
        top: 0;
        left: 0;
        cursor: nw-resize;
    }

    .top_right {
        top: 0;
        right: 0;
        cursor: ne-resize;
    }

    .bottom_left {
        bottom: 0;
        left: 0;
        cursor: ne-resize;
    }

    .bottom_right {
        bottom: 0;
        right: 0;
        cursor: nw-resize;
    }

    .headerArea {
        width: 100%;
        height: 32px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 1px 1px 0 1px;
        box-sizing: border-box;
    }

    .headerArea2 {
        padding: 0 1px;
        border-bottom: 1px solid #e3e3e3;

        display: flex;
        justify-content: space-between;
        align-items: center;
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
    .buttonArea .normalSize:hover,
    .buttonArea .max:hover {
        background-color: #ddddddb3;
    }

    .buttonArea > .close:hover {
        background-color: #ff1010;
    }

    animation: ${open} 0.25s 0s;

    ${(props) => props.isClose && ` opacity: 0; transform: scale(0.9)`}
`;
export default FolderComponent;
