import React from "react";
import styled from "styled-components";
import IconBox from "../IconBox";

const Window = (props) => {
    const { iconBoxArr, windowRef } = props;
    return (
        <WindowBlock ref={windowRef}>
            <div className="window">
                {iconBoxArr.map((item) => (
                    <IconBox img={item.img} name={item.name} key={item.key} />
                ))}
            </div>
        </WindowBlock>
    );
};

const WindowBlock = styled.div`
    .window {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        display: flex;
        flex: 1 0 auto;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 5px;
    }
`;
export default Window;
