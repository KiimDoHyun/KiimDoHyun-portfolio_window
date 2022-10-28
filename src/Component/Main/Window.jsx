import React from "react";
import styled from "styled-components";
import IconBox from "../IconBox";

const Window = (props) => {
    const { iconBoxArr, windowRef } = props;
    return (
        <WindowBlock ref={windowRef}>
            {iconBoxArr.map((item, idx) => (
                <IconBox
                    img={item.img}
                    name={item.name}
                    key={`${item.name}${idx}`}
                />
            ))}
        </WindowBlock>
    );
};

const WindowBlock = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-template-rows: repeat(auto-fill, 100px);
    // position: absolute;
    // top: 0;
    // left: 0;
    // height: 100%;

    // display: flex;
    // flex: 1 0 auto;
    // flex-wrap: wrap;
    // flex-direction: column;
    // gap: 5px;
`;
export default Window;
