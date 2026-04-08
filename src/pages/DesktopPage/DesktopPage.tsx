import { useCallback, useMemo } from "react";
import { css } from "@styled-system/css";
import wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import DisplayCover from "@features/display-cover/DisplayCover";
import HiddenIcon from "@features/hidden-icon/HiddenIcon";
import { TaskBar } from "@features/taskbar";
import type { TaskbarProgramItem } from "@features/taskbar";
import type { WindowShellItem } from "@features/window-shell";
import InfoBar from "@features/infobar/InfoBar";
import DesktopWindow from "@features/desktop/DesktopWindow";
import StatusBar from "@features/statusbar/StatusBar";
import TimeBar from "@features/timebar/TimeBar";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { useUiStore } from "@store/uiStore";
import type { ProgramNode, ProgramId } from "@shared/types/program";
import ProgramWindow from "./ProgramWindow";
import { renderProgramContent } from "./renderProgramContent";

function nodeIcon(node: ProgramNode): string {
  return (node as unknown as { icon?: string }).icon ?? "";
}

export default function DesktopPage() {
  // === File system (for id/name/type/parent resolution) ===
  const nodes = useFileSystemStore((s) => s.nodes);

  // === Running programs ===
  const byId = useRunningProgramsStore((s) => s.byId);
  const order = useRunningProgramsStore((s) => s.order);
  const activeId = useRunningProgramsStore((s) => s.activeId);

  // === UI toggles (menu bars + display light) ===
  const statusBarOpen = useUiStore((s) => s.statusBarOpen);
  const timeBarOpen = useUiStore((s) => s.timeBarOpen);
  const infoBarOpen = useUiStore((s) => s.infoBarOpen);
  const hiddenIconOpen = useUiStore((s) => s.hiddenIconOpen);
  const displayLight = useUiStore((s) => s.displayLight);

  // activeProgram: name string (legacy shim for TaskBar/WindowShell)
  const activeProgram = activeId && nodes[activeId] ? nodes[activeId].name : "";

  // programList: legacy WindowShellItem shim built from order+byId+nodes
  const programList = useMemo<Array<WindowShellItem>>(() => {
    return order
      .map((id) => {
        const node = nodes[id];
        const running = byId[id];
        if (!node || !running) return null;
        const parentNode = node.parentId ? nodes[node.parentId] : null;
        return {
          name: node.name,
          type: node.type,
          icon: nodeIcon(node),
          parent: parentNode ? parentNode.name : "",
          status: running.status,
        } as WindowShellItem;
      })
      .filter((x): x is WindowShellItem => x !== null);
  }, [order, byId, nodes]);

  // name → id resolver (legacy features pass name; stores want id)
  const findIdByName = useCallback(
    (name: string): ProgramId | null => {
      for (const id of Object.keys(nodes)) {
        if (nodes[id].name === name) return id;
      }
      return null;
    },
    [nodes]
  );

  // === Window handlers ===
  const handleActivateWindow = useCallback(
    (name: string) => {
      const id = findIdByName(name);
      if (id) useRunningProgramsStore.getState().activate(id);
    },
    [findIdByName]
  );

  const handleMinimizeWindow = useCallback(
    (name: string) => {
      const id = findIdByName(name);
      if (id) useRunningProgramsStore.getState().minimize(id);
    },
    [findIdByName]
  );

  const handleCloseWindow = useCallback(
    (name: string) => {
      const id = findIdByName(name);
      if (id) useRunningProgramsStore.getState().close(id);
    },
    [findIdByName]
  );

  const handleRequestZIndex = useCallback(() => {
    return useRunningProgramsStore.getState().requestZIndex();
  }, []);

  // === Menu handlers (uiStore encapsulates mutual exclusion) ===
  const handleClickStartIcon = useCallback(() => {
    useUiStore.getState().toggleStatusBar();
  }, []);
  const handleClickTime = useCallback(() => {
    useUiStore.getState().toggleTimeBar();
  }, []);
  const handleClickInfo = useCallback(() => {
    useUiStore.getState().toggleInfoBar();
  }, []);
  const handleClickHiddenIcon = useCallback(() => {
    useUiStore.getState().toggleHiddenIcon();
  }, []);

  const handleClickCloseAll = useCallback(() => {
    useUiStore.getState().closeAllMenus();
    useRunningProgramsStore.getState().closeAll();
  }, []);

  const handleClickTaskIcon = useCallback(
    (item: TaskbarProgramItem) => {
      const id = findIdByName(item.name);
      if (id) useRunningProgramsStore.getState().toggleFromTaskbar(id);
    },
    [findIdByName]
  );

  const handleCloseProgram = useCallback(
    (name: string) => {
      const id = findIdByName(name);
      if (id) useRunningProgramsStore.getState().close(id);
    },
    [findIdByName]
  );

  const handleCloseStatusBar = useCallback(() => {
    useUiStore.setState({ statusBarOpen: false });
  }, []);

  const handleChangeDisplayLight = useCallback((next: number) => {
    useUiStore.getState().setDisplayLight(next);
  }, []);

  const handlePreviewChange = useCallback((active: boolean) => {
    useUiStore.getState().setPreviewActive(active);
  }, []);

  return (
    <div
      className={mainPageStyle}
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <DisplayCover displayLight={displayLight} />
      <div
        className="windowCover"
        onMouseDown={() => {
          useUiStore.getState().closeAllMenus();
        }}
      >
        <DesktopWindow />
        {programList.map((item) => (
          <ProgramWindow
            key={item.name}
            item={item}
            activeProgram={activeProgram}
            onActivate={handleActivateWindow}
            onMinimize={handleMinimizeWindow}
            onClose={handleCloseWindow}
            onRequestZIndex={handleRequestZIndex}
          />
        ))}
      </div>
      <div className="taskBarCover">
        <TaskBar
          programList={programList as Array<TaskbarProgramItem>}
          activeProgram={activeProgram}
          hiddenIcon={hiddenIconOpen}
          onClickStartIcon={handleClickStartIcon}
          onClickTime={handleClickTime}
          onClickInfo={handleClickInfo}
          onClickHiddenIcon={handleClickHiddenIcon}
          onClickCloseAll={handleClickCloseAll}
          onClickTaskIcon={handleClickTaskIcon}
          onCloseProgram={handleCloseProgram}
          onPreviewChange={handlePreviewChange}
          renderPreviewContent={renderProgramContent}
        />
      </div>

      {/* 시작 */}
      <StatusBar active={statusBarOpen} onClose={handleCloseStatusBar} />

      {/* 시간 */}
      <TimeBar active={timeBarOpen} />

      {/* 정보 */}
      <InfoBar
        active={infoBarOpen}
        displayLight={displayLight}
        onChangeDisplayLight={handleChangeDisplayLight}
      />

      {/* 숨겨진 아이콘 */}
      <HiddenIcon active={hiddenIconOpen} />
    </div>
  );
}

const mainPageStyle = css({
  width: "100vw",
  height: "100vh",
  position: "relative",
  display: "grid",
  gridTemplateRows: "1fr 50px",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",

  "& .windowCover": {
    position: "relative",
    padding: "10px",
  },

  "& .taskBarCover": {
    position: "relative",
    backgroundColor: "#20343b",
    zIndex: 10000,
  },
});
