import React, { useRef } from "react";
import Window from "./components/Window";
import type { ProgramNode } from "@shared/types/program";

interface DesktopWindowProps {
    iconBoxArr: Array<ProgramNode>;
    onDoubleClickIcon: (item: ProgramNode) => void;
}

const DesktopWindow = ({
    iconBoxArr,
    onDoubleClickIcon,
}: DesktopWindowProps) => {
    const windowRef = useRef<HTMLDivElement | null>(null);

    return (
        <Window
            windowRef={windowRef}
            iconBoxArr={iconBoxArr}
            onClickIcon={() => {}}
            onDoubleClickIcon={onDoubleClickIcon}
        />
    );
};

export default React.memo(DesktopWindow);
