import React, { useCallback, useMemo } from "react";
import { css } from "@styled-system/css";
import wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  rc_taskbar_hiddenIcon_active,
  rc_taskbar_infoBar_active,
  rc_taskbar_preview_active,
  rc_taskbar_statusBar_active,
  rc_taskbar_timeBar_active,
} from "@store/taskbar";
import {
  rc_global_Directory_List,
  rc_global_Directory_Tree,
} from "@store/global";
import {
  rc_program_activeProgram,
  rc_program_programList,
} from "@store/program";
import useActiveProgram from "@features/window-shell/useActiveProgram";
import DisplayCover from "@features/display-cover/DisplayCover";
import HiddenIcon from "@features/hidden-icon/HiddenIcon";
import { TaskBar } from "@features/taskbar";
import type { TaskbarProgramItem } from "@features/taskbar";
import InfoBarContainer from "@features/infobar/InfoBarContainer";
import WindowContainer from "@features/desktop/WindowContainer";
import StatusBarContainer from "@features/statusbar/StatusBarContainer";
import TimeBarContainer from "@features/timebar/TimeBarContainer";
import { DesktopDataContext } from "./DesktopDataContext";
import type {
  DesktopDataValue,
  DirectoryItem,
  DirectoryTree,
} from "./DesktopDataContext";

export default function DesktopPage() {
  const setActive_status = useSetRecoilState(rc_taskbar_statusBar_active);
  const setActive_time = useSetRecoilState(rc_taskbar_timeBar_active);
  const setActiveInfoBar = useSetRecoilState(rc_taskbar_infoBar_active);
  const [hiddenIcon, setHiddenIcon] = useRecoilState(
    rc_taskbar_hiddenIcon_active
  );
  const setPreview = useSetRecoilState(rc_taskbar_preview_active);

  const [programList, setProgramList] = useRecoilState(
    rc_program_programList
  ) as [Array<TaskbarProgramItem>, (updater: (prev: Array<TaskbarProgramItem>) => Array<TaskbarProgramItem>) => void];
  const [activeProgram, setActiveProgram] = useRecoilState(
    rc_program_activeProgram
  ) as [string, (next: string) => void];

  const directory = useRecoilValue(
    rc_global_Directory_List
  ) as Array<DirectoryItem>;
  const directoryTree = useRecoilValue(
    rc_global_Directory_Tree
  ) as DirectoryTree;
  const openProgram = useActiveProgram();

  const handleClickStartIcon = useCallback(() => {
    setActive_status((prev) => !prev);
    setActive_time(false);
    setActiveInfoBar(false);
    setHiddenIcon(false);
  }, [setActive_status, setActive_time, setActiveInfoBar, setHiddenIcon]);

  const handleClickTime = useCallback(() => {
    setActive_time((prev) => !prev);
    setActiveInfoBar(false);
    setActive_status(false);
    setHiddenIcon(false);
  }, [setActive_time, setActiveInfoBar, setActive_status, setHiddenIcon]);

  const handleClickInfo = useCallback(() => {
    setActiveInfoBar((prev) => !prev);
    setHiddenIcon(false);
    setActive_time(false);
    setActive_status(false);
  }, [setActiveInfoBar, setHiddenIcon, setActive_time, setActive_status]);

  const handleClickHiddenIcon = useCallback(() => {
    setHiddenIcon((prev) => !prev);
    setActive_status(false);
    setActive_time(false);
    setActiveInfoBar(false);
  }, [setHiddenIcon, setActive_status, setActive_time, setActiveInfoBar]);

  const handleClickCloseAll = useCallback(() => {
    setActiveInfoBar(false);
    setActive_time(false);
    setHiddenIcon(false);
    setActive_status(false);
    setProgramList((prev) =>
      prev.map((item) => ({ ...item, status: "min" }))
    );
  }, [
    setActiveInfoBar,
    setActive_time,
    setHiddenIcon,
    setActive_status,
    setProgramList,
  ]);

  const handleClickTaskIcon = useCallback(
    (item: TaskbarProgramItem) => {
      if (item.status === "min") {
        setProgramList((prev) =>
          prev.map((p) =>
            p.name === item.name ? { ...p, status: "active" } : p
          )
        );
        setActiveProgram(item.name);
        return;
      }
      // 이미 활성화된 것이 다시 클릭되면 최소화
      if (item.name === activeProgram) {
        setProgramList((prev) =>
          prev.map((p) =>
            p.name === item.name ? { ...p, status: "min" } : p
          )
        );
        setActiveProgram("");
      } else {
        setActiveProgram(item.name);
      }
    },
    [activeProgram, setProgramList, setActiveProgram]
  );

  const handleCloseProgram = useCallback(
    (name: string) => {
      setProgramList((prev) => prev.filter((p) => p.name !== name));
    },
    [setProgramList]
  );

  const handlePreviewChange = useCallback(
    (active: boolean) => {
      setPreview(active);
    },
    [setPreview]
  );

  const desktopData = useMemo<DesktopDataValue>(
    () => ({ directory, directoryTree, openProgram }),
    [directory, directoryTree, openProgram]
  );

  return (
    <DesktopDataContext.Provider value={desktopData}>
      <div
        className={mainPageStyle}
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <DisplayCover />
        <div
          className="windowCover"
          onMouseDown={() => {
            setActive_status(false);
            setActive_time(false);
            setActiveInfoBar(false);
            setHiddenIcon(false);
          }}
        >
          <WindowContainer />
        </div>
        <div className="taskBarCover">
          <TaskBar
            programList={programList}
            activeProgram={activeProgram}
            hiddenIcon={hiddenIcon}
            onClickStartIcon={handleClickStartIcon}
            onClickTime={handleClickTime}
            onClickInfo={handleClickInfo}
            onClickHiddenIcon={handleClickHiddenIcon}
            onClickCloseAll={handleClickCloseAll}
            onClickTaskIcon={handleClickTaskIcon}
            onCloseProgram={handleCloseProgram}
            onPreviewChange={handlePreviewChange}
          />
        </div>

        {/* 시작 */}
        <StatusBarContainer />

        {/* 시간 */}
        <TimeBarContainer />

        {/* 정보 */}
        <InfoBarContainer />

        {/* 숨겨진 아이콘 */}
        <HiddenIcon />
      </div>
    </DesktopDataContext.Provider>
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
