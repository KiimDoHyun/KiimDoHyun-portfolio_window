import { RefObject } from "react";
import { css } from "@styled-system/css";
import IconBox from "./IconBox";
import type { ProgramNode } from "@shared/types/program";

const windowBlockStyle = css({
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 100px)",
    gridTemplateRows: "repeat(auto-fill, 100px)",
});

interface WindowProps {
    windowRef: RefObject<HTMLDivElement | null>;
    iconBoxArr: Array<ProgramNode>;
    onClickIcon: (item: ProgramNode) => void;
    onDoubleClickIcon: (item: ProgramNode) => void;
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
                    key={item.id}
                />
            ))}
        </div>
    );
};

export default Window;
