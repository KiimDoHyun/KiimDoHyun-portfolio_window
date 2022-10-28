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
    bottom: ${(props) => (props.active ? "0px" : "-100px")};
    opacity: ${(props) => (props.active ? "1" : "0")};
    width: 648px;
    height: 650px;
    background-color: white;

    transition: 0.14s;
`;
export default React.memo(StatusBar);
