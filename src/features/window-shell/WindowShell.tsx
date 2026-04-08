import { useCallback, useRef } from "react";
import { ProgramComponent } from "./ProgramComponent.style";
import { useWindowDrag } from "./hooks/useWindowDrag";
import { useWindowResize } from "./hooks/useWindowResize";
import { useWindowLifecycle } from "./hooks/useWindowLifecycle";
import WindowHeader from "./ui/WindowHeader";
import WindowResizeHandles from "./ui/WindowResizeHandles";
import type { WindowShellProps } from "./WindowShell.types";

const WindowShell = ({
    node,
    running,
    title,
    iconSrc,
    activeId,
    children,
    subHeader,
    onActivate,
    onMinimize,
    onClose,
    onRequestZIndex,
}: WindowShellProps) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const isActive = activeId === node.id;

    const { isMaxSize, isClose, onClickMax, onClickNormalSize, triggerClose } =
        useWindowLifecycle({
            boxRef,
            id: node.id,
            status: running.status,
            isActive,
            onRequestZIndex,
        });

    const drag = useWindowDrag({ boxRef, id: node.id });
    const resize = useWindowResize({ boxRef, id: node.id });

    const handleClick = useCallback(() => {
        onActivate(node.id);
    }, [onActivate, node.id]);

    const handleClickMin = useCallback(() => {
        onMinimize(node.id);
    }, [onMinimize, node.id]);

    const handleClickClose = useCallback(() => {
        triggerClose(() => onClose(node.id));
    }, [triggerClose, onClose, node.id]);

    return (
        <ProgramComponent
            className="windowShell"
            ref={boxRef}
            isClose={isClose}
            onMouseDown={handleClick}
        >
            <WindowHeader
                title={title}
                iconSrc={iconSrc}
                isMaxSize={isMaxSize}
                onDragMouseDown={drag.onMouseDown}
                onDragMouseUp={drag.onMouseUp}
                onClickMin={handleClickMin}
                onClickMax={onClickMax}
                onClickNormalSize={onClickNormalSize}
                onClickClose={handleClickClose}
            />
            {subHeader}
            {children}
            <WindowResizeHandles
                onResizeMouseDown={resize.onMouseDown}
                onResizeMouseUp={resize.onMouseUp}
            />
        </ProgramComponent>
    );
};

export default WindowShell;
