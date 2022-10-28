import React from "react";
import styled from "styled-components";
import IconBox from "../IconBox";

const Window = (props) => {
    const { windowRef, iconBoxArr, onClickIcon, onDoubleClickIcon } = props;
    return (
        <WindowBlock ref={windowRef}>
            {iconBoxArr.map((item) => (
                <IconBox
                    item={item}
                    onClick={onClickIcon}
                    onDoubleClick={onDoubleClickIcon}
                    key={`${item.name}${item.key}`}
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
`;
export default Window;
