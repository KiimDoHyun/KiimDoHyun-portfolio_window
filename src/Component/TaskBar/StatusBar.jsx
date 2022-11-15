import React from "react";
import styled, { keyframes } from "styled-components";
import { useRecoilValue } from "recoil";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";

const StatusBar = () => {
    const active = useRecoilValue(rc_taskbar_statusBar_active);

    return (
        <StatusBarBlock active={active}>
            {/* 소개 */}
            <div className="statusBarBoxArea leftArea">
                <div className="leftArea_top">
                    <div className="leftArea_box"></div>
                </div>
                <div className="leftArea_contents">
                    <div className="leftArea_box"></div>
                    <div className="leftArea_box"></div>
                    <div className="leftArea_box"></div>
                    <div className="leftArea_box"></div>
                    <div className="leftArea_box"></div>
                </div>
            </div>

            {/* 프로젝트 */}
            <div
                className={
                    active
                        ? "statusBarBoxArea centerArea show_animation"
                        : "statusBarBoxArea centerArea"
                }
            ></div>

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
                    <div className="rightArea_box"></div>
                    <div className="rightArea_box"></div>
                    <div className="rightArea_box"></div>
                    <div className="rightArea_box"></div>
                    <div className="rightArea_box"></div>
                    <div className="rightArea_box"></div>
                    <div className="rightArea_box"></div>
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
    background-color: white;
    box-shadow: 0px -3px 20px 3px #00000061;

    transition: 0.4s;
    transition-timing-function: cubic-bezier(0, 0.5, 0, 1);
    background-color: #393a3b;

    display: flex;
    gap: 5px;

    .statusBarBoxArea {
        height: 100%;
    }

    .leftArea {
        background-color: red;
        width: 50px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .leftArea_box {
        width: 50px;
        height: 50px;
        background-color: gray;
    }

    .centerArea {
        background-color: blue;
        width: 270px;
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
        // width: 100px;
        flex-basis: 32%;
        height: 100px;
        background-color: gray;
    }

    .show_animation {
        animation-duration: 0.5s;
        animation-timing-function: cubic-bezier(0, 0.65, 0.35, 1);
        animation-name: ${show_from_bottom};
    }
`;
export default React.memo(StatusBar);
