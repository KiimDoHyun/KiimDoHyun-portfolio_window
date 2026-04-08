import { useCallback, useMemo, useRef } from "react";
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
  rc_global_DisplayLight,
} from "@store/global";
import {
  rc_program_activeProgram,
  rc_program_programList,
  rc_program_zIndexCnt,
} from "@store/program";
import DisplayCover from "@features/display-cover/DisplayCover";
import HiddenIcon from "@features/hidden-icon/HiddenIcon";
import { TaskBar } from "@features/taskbar";
import type { TaskbarProgramItem } from "@features/taskbar";
import type { WindowShellItem } from "@features/window-shell";
import InfoBar from "@features/infobar/InfoBar";
import DesktopWindow from "@features/desktop/DesktopWindow";
import StatusBar from "@features/statusbar/StatusBar";
import TimeBar from "@features/timebar/TimeBar";
import { DesktopDataContext } from "./DesktopDataContext";
import type {
  DesktopDataValue,
  DirectoryItem,
  DirectoryTree,
} from "./DesktopDataContext";
import ProgramWindow from "./ProgramWindow";
import { renderProgramContent } from "./renderProgramContent";

export default function DesktopPage() {
  const [activeStatus, setActive_status] = useRecoilState(
    rc_taskbar_statusBar_active
  ) as [boolean, (updater: boolean | ((prev: boolean) => boolean)) => void];
  const [activeTime, setActive_time] = useRecoilState(
    rc_taskbar_timeBar_active
  ) as [boolean, (updater: boolean | ((prev: boolean) => boolean)) => void];
  const [activeInfoBar, setActiveInfoBar] = useRecoilState(
    rc_taskbar_infoBar_active
  ) as [boolean, (updater: boolean | ((prev: boolean) => boolean)) => void];
  const [hiddenIcon, setHiddenIcon] = useRecoilState(
    rc_taskbar_hiddenIcon_active
  );
  const setPreview = useSetRecoilState(rc_taskbar_preview_active);
  const [displayLight, setDisplayLight] = useRecoilState(
    rc_global_DisplayLight
  ) as [number, (next: number) => void];

  const [programList, setProgramList] = useRecoilState(
    rc_program_programList
  ) as [
    Array<WindowShellItem>,
    (
      updater: (prev: Array<WindowShellItem>) => Array<WindowShellItem>
    ) => void,
  ];
  const [activeProgram, setActiveProgram] = useRecoilState(
    rc_program_activeProgram
  ) as [string, (next: string) => void];
  const setZIndexCnt = useSetRecoilState(rc_program_zIndexCnt);
  const zIndexCntRef = useRef(1);

  const directory = useRecoilValue(
    rc_global_Directory_List
  ) as Array<DirectoryItem>;
  const directoryTree = useRecoilValue(
    rc_global_Directory_Tree
  ) as DirectoryTree;

  const openProgram = useCallback(
    (item: DirectoryItem) => {
      setProgramList((prev) => {
        const existing = prev.find((p) => p.name === item.name);
        if (existing) {
          if (existing.status === "min") {
            return prev.map((p) =>
              p.name === item.name ? { ...p, status: "active" } : p
            );
          }
          return prev;
        }
        return [
          ...prev,
          {
            name: item.name,
            type: item.type,
            icon: item.icon,
            parent: item.parent,
            status: "active",
          },
        ];
      });
      setActiveProgram(item.name);
      zIndexCntRef.current += 1;
      setZIndexCnt(zIndexCntRef.current);
    },
    [setProgramList, setActiveProgram, setZIndexCnt]
  );

  const handleActivateWindow = useCallback(
    (name: string) => {
      setActiveProgram(name);
    },
    [setActiveProgram]
  );

  const handleMinimizeWindow = useCallback(
    (name: string) => {
      setProgramList((prev) =>
        prev.map((p) => (p.name === name ? { ...p, status: "min" } : p))
      );
    },
    [setProgramList]
  );

  const handleCloseWindow = useCallback(
    (name: string) => {
      setProgramList((prev) => prev.filter((p) => p.name !== name));
    },
    [setProgramList]
  );

  const handleRequestZIndex = useCallback(() => {
    zIndexCntRef.current += 1;
    setZIndexCnt(zIndexCntRef.current);
    return zIndexCntRef.current;
  }, [setZIndexCnt]);

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

  const handleCloseStatusBar = useCallback(() => {
    setActive_status(false);
  }, [setActive_status]);

  const handleChangeDisplayLight = useCallback(
    (next: number) => {
      setDisplayLight(next);
    },
    [setDisplayLight]
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
        <DisplayCover displayLight={displayLight} />
        <div
          className="windowCover"
          onMouseDown={() => {
            setActive_status(false);
            setActive_time(false);
            setActiveInfoBar(false);
            setHiddenIcon(false);
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
            hiddenIcon={hiddenIcon}
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
        <StatusBar
          active={activeStatus}
          onClose={handleCloseStatusBar}
        />

        {/* 시간 */}
        <TimeBar active={activeTime} />

        {/* 정보 */}
        <InfoBar
          active={activeInfoBar}
          displayLight={displayLight}
          onChangeDisplayLight={handleChangeDisplayLight}
        />

        {/* 숨겨진 아이콘 */}
        <HiddenIcon active={hiddenIcon} />
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
