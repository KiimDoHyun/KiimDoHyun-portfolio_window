import React from "react";
import { css } from "@styled-system/css";
import IconBox from "./IconBox";

const windowBlockStyle = css({
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 100px)",
    gridTemplateRows: "repeat(auto-fill, 100px)",
});

const Window = (props) => {
    const { windowRef, iconBoxArr, onClickIcon, onDoubleClickIcon } = props;
    return (
        <div className={windowBlockStyle} ref={windowRef}>
            {iconBoxArr.map((item) => (
                <IconBox
                    item={item}
                    onClick={onClickIcon}
                    onDoubleClick={onDoubleClickIcon}
                    key={`${item.name}`}
                />
            ))}
        </div>
    );
};

export default Window;
