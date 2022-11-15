import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { rc_taskbar_statusBar_active } from "../../store/taskbar";

const StatusBar = () => {
    const active = useRecoilValue(rc_taskbar_statusBar_active);

    return <StatusBarBlock active={active}></StatusBarBlock>;
};

const StatusBarBlock = styled.div`
    position: absolute;
    left: 0;
    bottom: ${(props) => (props.active ? "50px" : "-150px")};
    opacity: ${(props) => (props.active ? "1" : "0")};
    pointer-events: ${(props) => (props.active ? "auto" : "none")};
    z-index: ${(props) => (props.active ? "999" : "0")};
    width: 648px;
    height: 650px;
    background-color: white;
    box-shadow: 0px -3px 20px 3px #00000061;

    transition: 0.4s;
    transition-timing-function: cubic-bezier(0, 0.5, 0, 1);
    background-color: #393a3b;
`;
export default React.memo(StatusBar);
