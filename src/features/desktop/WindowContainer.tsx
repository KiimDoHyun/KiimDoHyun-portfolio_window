import React, { useCallback, useRef } from "react";
import Window from "./components/Window";
import { useDesktopData } from "@pages/DesktopPage/useDesktopData";
import type { DirectoryItem } from "@pages/DesktopPage/DesktopDataContext";

const WindowContainer = () => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const { directoryTree, openProgram } = useDesktopData();

  const onClickIcon = useCallback((_item: DirectoryItem) => {}, []);

  const iconBoxArr =
    (directoryTree as unknown as { root?: Array<DirectoryItem> }).root || [];

  const propDatas = {
    windowRef,
    iconBoxArr,
    onClickIcon,
    onDoubleClickIcon: openProgram,
  };

  return <Window {...propDatas} />;
};

export default React.memo(WindowContainer);
