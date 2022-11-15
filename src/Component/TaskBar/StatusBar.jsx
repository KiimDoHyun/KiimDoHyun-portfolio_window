import React from "react";
import styled, { keyframes } from "styled-components";
import { useRecoilValue } from "recoil";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";

import imgReact from "../../asset/images/icons/react.png";
import imgJS from "../../asset/images/icons/javascript.png";
import imgAraon from "../../asset/images/icons/araon_logo_noText.png";
import imgKit from "../../asset/images/icons/logo_kit.jpg";
import imgOne from "../../asset/images/icons/number_one.png";
import imgUser from "../../asset/images/icons/user.png";
import imgMenu from "../../asset/images/icons/hamburger_menu.png";
import LeftAreaBox from "./StatusBar/LeftAreaBox";

const StatusBar = ({
    active,
    activeLeftArea_Detail,
    statusBar_LeftArea_Items,

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
                        <LeftAreaBox src={imgMenu} text={"소개"} />
                    </div>
                    <div className="leftArea_contents">
                        {statusBar_LeftArea_Items.map((item, idx) => (
                            <LeftAreaBox
                                key={idx}
                                src={item.img}
                                text={item.text}
                            />
                        ))}
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
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>{" "}
                <div className="statusBox dummy">
                    <img src={imgReact} alt="imgReact" />
                    <div className="text">React</div>
                </div>
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
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
                    <div className="statusBox rightArea_box">
                        <img src={imgReact} alt="imgReact" />
                        <div className="text">React</div>
                    </div>
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
        width: 220px;
        z-index: 10;

        box-shadow: 0px 9px 20px 0px #181818;
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

        padding: 5px;
    }

    .rightArea_box {
        flex-basis: 32%;
        height: 100px;
        background-color: #ffffff14;

        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #9b9b9b00;

        box-sizing: border-box;
        padding: 10px;

        position: relative;
    }

    .rightArea_box:hover {
        border: 2px solid #9b9b9b;
    }

    .rightArea_box img {
        width: 50%;
        height: 50%;
    }

    .rightArea_box .text {
        position: absolute;
        bottom: 5px;
        left: 5px;
        font-size: 14px;
        font-weight: lighter;
        color: #e8e8e8;
        cursor: default;
    }

    .show_animation {
        animation-duration: 0.4s;
        animation-timing-function: cubic-bezier(0, 0.65, 0.35, 1);
        animation-name: ${show_from_bottom};
    }

    .dummy {
        width: 100%;
        height: 50px;

        display: flex;
        align-items: center;
        gap: 5px;
    }

    .dummy img {
        width: 30px;
        height: 30px;
    }
    .dummy .text {
        font-size: 14px;
        font-weight: lighter;
        color: #e8e8e8;
        cursor: default;
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
