import React from "react";
import styled from "styled-components";
import { rc_statusBar_active } from "../../store/statusBar";
import { useRecoilValue } from "recoil";

const StatusBar = () => {
    const active = useRecoilValue(rc_statusBar_active);

    return <StatusBarBlock active={active}>StatusBar</StatusBarBlock>;
};

const StatusBarBlock = styled.div`
    position: absolute;
    left: 0;
    bottom: ${(props) => (props.active ? "50px" : "-100px")};
    opacity: ${(props) => (props.active ? "1" : "0")};
    pointer-events: ${(props) => (props.active ? "auto" : "none")};
    z-index: ${(props) => (props.active ? "99999" : "0")};
    width: 648px;
    height: 650px;
    background-color: white;
    box-shadow: 0px 0px 20px 3px #00000061;

    transition: 0.25s;
`;
export default React.memo(StatusBar);
