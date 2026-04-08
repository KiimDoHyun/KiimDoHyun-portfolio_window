import React, { RefObject } from "react";
import { css } from "@styled-system/css";
import IconBox from "./IconBox";
import type { DirectoryItem } from "@pages/DesktopPage/DesktopDataContext";

const windowBlockStyle = css({
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 100px)",
    gridTemplateRows: "repeat(auto-fill, 100px)",
});

interface WindowProps {
    windowRef: RefObject<HTMLDivElement | null>;
    iconBoxArr: Array<DirectoryItem>;
    onClickIcon: (item: DirectoryItem) => void;
    onDoubleClickIcon: (item: DirectoryItem) => void;
}

const Window = ({
    windowRef,
    iconBoxArr,
    onClickIcon,
    onDoubleClickIcon,
}: WindowProps) => {
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
