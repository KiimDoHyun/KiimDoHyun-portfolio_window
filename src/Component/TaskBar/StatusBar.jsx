import React from "react";
import styled, { keyframes } from "styled-components";
import { useRecoilValue } from "recoil";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";

const StatusBar = ({
    active,
    activeLeftArea_Detail,

    onMouseEnter,
    onMouseLeave,
}) => {
    return (
        <StatusBarBlock active={active}>
            {/* 소개 */}
            <div
                className="statusBarBoxArea leftArea"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* 마우스 호버에 따른 너비 변경을 위해 한단계 추가 */}
                <div
                    className={
                        activeLeftArea_Detail
                            ? "leftArea_Contents leftArea_Contents_Wide"
                            : "leftArea_Contents"
                    }
                >
                    <div className="leftArea_top">
                        <div className="statusBox leftArea_box">
                            <div className="icon">
                                <div />
                            </div>
                            <div className="text">리액트</div>
                        </div>
                    </div>
                    <div className="leftArea_contents">
                        <div className="statusBox leftArea_box">
                            <div className="icon">
                                <div />
                            </div>
                            <div className="text">리액트</div>
                        </div>
                        <div className="statusBox leftArea_box">
                            <div className="icon">
                                <div />
                            </div>
                            <div className="text">리액트</div>
                        </div>
                        <div className="statusBox leftArea_box">
                            <div className="icon">
                                <div />
                            </div>
                            <div className="text">리액트</div>
                        </div>
                        <div className="statusBox leftArea_box">
                            <div className="icon">
                                <div />
                            </div>
                            <div className="text">리액트</div>
                        </div>
                        <div className="statusBox leftArea_box">
                            <div className="icon">
                                <div />
                            </div>
                            <div className="text">리액트</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 프로젝트 */}
            <div
                className={
                    active
                        ? "statusBarBoxArea centerArea show_animation"
                        : "statusBarBoxArea centerArea"
                }
            >
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
                <div className="statusBox dummy" />
            </div>

            {/* 기술 스택 */}
            <div
                className={
                    active
                        ? "statusBarBoxArea rightArea show_animation"
                        : "statusBarBoxArea rightArea"
                }
            >
                <div className="rightArea_title">
                    <p>기술 스택</p>
                </div>
                <div className="rightArea_boxArea">
                    <div className="statusBox rightArea_box"></div>
                    <div className="statusBox rightArea_box"></div>
                    <div className="statusBox rightArea_box"></div>
                    <div className="statusBox rightArea_box"></div>
                    <div className="statusBox rightArea_box"></div>
                    <div className="statusBox rightArea_box"></div>
                    <div className="statusBox rightArea_box"></div>
                </div>
            </div>
        </StatusBarBlock>
    );
};
const show_from_bottom = keyframes`
from {
    scale: 1 1.5;
    translate: 0 200px;
}
to {
    translate: 0 0px;
    scale: 1 1.0;
}
`;
// 내부 공간 크기는 최대 화면 크기 기준 기본 시작 메뉴바와 완전 동일한 px(모바일 고려 X, 2px 차이 존재)
const StatusBarBlock = styled.div`
    p {
        margin: 0;
    }

    position: absolute;
    left: 0;
    bottom: ${(props) => (props.active ? "50px" : "-150px")};
    opacity: ${(props) => (props.active ? "1" : "0")};
    pointer-events: ${(props) => (props.active ? "auto" : "none")};
    z-index: ${(props) => (props.active ? "999" : "0")};
    width: 650px;
    height: 650px;
    box-shadow: 0px -3px 20px 3px #00000061;

    transition: 0.4s;
    transition-timing-function: cubic-bezier(0, 0.5, 0, 1);
    background-color: #393a3b;

    display: flex;
    gap: 10px;

    .statusBarBoxArea {
        height: 100%;
    }

    .statusBox {
        box-sizing: border-box;
    }

    .statusBox:hover {
        background-color: #ffffff24;
    }

    .test {
        position: absolute;
        width: 0px;
        height: 100%;
        background-color: blue;
        left: 50px;

        transition: 0.1s;
    }

    .testActive {
        width: 200px;
    }

    .leftArea {
        position: relative;
        width: 50px;
    }

    .leftArea_Contents {
        position: absolute;
        background-color: #393a3b;
        width: 100%;
        height: 100%;

        transition: 0.1s;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .leftArea_Contents_Wide {
        width: 200px;
        z-index: 10;

        box-shadow: 0px 9px 20px 0px #181818;
    }

    .leftArea_box {
        width: 100%;
        height: 50px;
        background-color: transparent;

        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
    }

    .leftArea_box .icon {
        width: 48px;
        height: 50px;
        // background-color: #ffffff3b;
    }

    .leftArea_box .text {
        color: #e8e8e8;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: lighter;
    }

    .centerArea {
        background-color: transparent;
        width: 270px;

        overflow-y: scroll;
    }

    .rightArea {
        // background-color: pink;
        width: 330px;

        display: flex;
        flex-direction: column;
    }

    .rightArea_title {
        flex-basis: 5%;
    }

    .rightArea_boxArea {
        flex-basis: 95%;

        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: 5px;
    }

    .rightArea_box {
        flex-basis: 32%;
        height: 100px;
        background-color: #ffffff14;
    }

    .rightArea_box:hover {
        border: 2px solid #9b9b9b;
    }

    .show_animation {
        animation-duration: 0.4s;
        animation-timing-function: cubic-bezier(0, 0.65, 0.35, 1);
        animation-name: ${show_from_bottom};
    }

    .dummy {
        width: 100%;
        height: 50px;
    }

    // 스크롤바

    .centerArea:hover::-webkit-scrollbar {
        width: 2px;
    }
    .centerArea::-webkit-scrollbar {
        width: 0px;
    }
    .centerArea::-webkit-scrollbar-thumb {
        background-color: #acacac;
    }

    .centerArea::-webkit-scrollbar-track {
    }
`;
export default React.memo(StatusBar);
