import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { rc_global_DisplayLight } from "../store/global";

const DisplayCover = () => {
    const displayLight = useRecoilValue(rc_global_DisplayLight);
    return <DisplayCoverBlock displayLight={displayLight}></DisplayCoverBlock>;
};

const DisplayCoverBlock = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background-color: black;
    z-index: 10000000000;
    pointer-events: none;
    opacity: ${(props) => {
        const { displayLight } = props;
        if (displayLight <= 30) return 0.7;
        else {
            return 1 - props.displayLight / 100;
        }
    }};
`;
export default DisplayCover;

/*
0
1

0   100
0.3 1



*/
