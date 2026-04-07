import { useCallback, useRef } from "react";
import { ProgramComponent } from "./ProgramComponent.style";
import { useWindowDrag } from "./hooks/useWindowDrag";
import { useWindowResize } from "./hooks/useWindowResize";
import { useWindowLifecycle } from "./hooks/useWindowLifecycle";
import WindowHeader from "./ui/WindowHeader";
import WindowResizeHandles from "./ui/WindowResizeHandles";
import type { WindowShellProps } from "./WindowShell.types";

const WindowShell = ({
  item,
  title,
  iconSrc,
  activeProgram,
  children,
  subHeader,
  onActivate,
  onMinimize,
  onClose,
  onRequestZIndex,
}: WindowShellProps) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const isActive = activeProgram === item.name;

  const { isMaxSize, isClose, onClickMax, onClickNormalSize, triggerClose } =
    useWindowLifecycle({
      boxRef,
      name: item.name,
      status: item.status,
      isActive,
      onRequestZIndex,
    });

  const drag = useWindowDrag({ boxRef, name: item.name });
  const resize = useWindowResize({ boxRef, name: item.name });

  const handleClick = useCallback(() => {
    onActivate(item.name);
  }, [onActivate, item.name]);

  const handleClickMin = useCallback(() => {
    onMinimize(item.name);
  }, [onMinimize, item.name]);

  const handleClickClose = useCallback(() => {
    triggerClose(() => onClose(item.name));
  }, [triggerClose, onClose, item.name]);

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
