import { useCallback, useEffect, useMemo, useState } from "react";
import { css } from "@styled-system/css";
import wallpaper from "@images/wallpaper/Samsung_wallpaper.jpg";
import DisplayCover from "@features/display-cover/DisplayCover";
import HiddenIcon from "@features/hidden-icon/HiddenIcon";
import { TaskBar } from "@features/taskbar";
import type { TaskbarEntry } from "@features/taskbar";
import InfoBar from "@features/infobar/InfoBar";
import DesktopWindowShell from "./shells/DesktopWindowShell";
import StatusBarShell from "./shells/StatusBarShell";
import TimeBar from "@features/timebar/TimeBar";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { useUiStore } from "@store/uiStore";
import type { ProgramId } from "@shared/types/program";
import ProgramWindow from "./ProgramWindow";
import { renderProgramContent } from "./renderProgramContent";

const FADE_IN_DURATION_MS = 400;

export default function DesktopPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    // === File system ===
    const nodes = useFileSystemStore((s) => s.nodes);

    // === Running programs ===
    const byId = useRunningProgramsStore((s) => s.byId);
    const order = useRunningProgramsStore((s) => s.order);
    const activeId = useRunningProgramsStore((s) => s.activeId);

    // === UI toggles ===
    const timeBarOpen = useUiStore((s) => s.timeBarOpen);
    const infoBarOpen = useUiStore((s) => s.infoBarOpen);
    const hiddenIconOpen = useUiStore((s) => s.hiddenIconOpen);
    const displayLight = useUiStore((s) => s.displayLight);

    // entries: ProgramNode/RunningProgram pairs
    const entries = useMemo<Array<TaskbarEntry>>(() => {
        return order
            .map((id) => {
                const node = nodes[id];
                const running = byId[id];
                if (!node || !running) return null;
                return { node, running };
            })
            .filter((x): x is TaskbarEntry => x !== null);
    }, [order, byId, nodes]);

    // === Window handlers (id-based) ===
    const handleActivateWindow = useCallback((id: ProgramId) => {
        useRunningProgramsStore.getState().activate(id);
    }, []);

    const handleMinimizeWindow = useCallback((id: ProgramId) => {
        useRunningProgramsStore.getState().minimize(id);
    }, []);

    const handleCloseWindow = useCallback((id: ProgramId) => {
        useRunningProgramsStore.getState().close(id);
    }, []);

    const handleRequestZIndex = useCallback(() => {
        return useRunningProgramsStore.getState().requestZIndex();
    }, []);

    // === Menu handlers ===
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

    const handleClickTaskIcon = useCallback((entry: TaskbarEntry) => {
        useRunningProgramsStore.getState().toggleFromTaskbar(entry.node.id);
    }, []);

    const handleCloseProgram = useCallback((id: ProgramId) => {
        useRunningProgramsStore.getState().close(id);
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
            style={{
                backgroundImage: `url(${wallpaper})`,
                opacity: isMounted ? 1 : 0,
                transition: `opacity ${FADE_IN_DURATION_MS}ms ease`,
            }}
        >
            <DisplayCover displayLight={displayLight} />
            <div
                className="windowCover"
                onMouseDown={() => {
                    useUiStore.getState().closeAllMenus();
                }}
            >
                <DesktopWindowShell />
                {entries.map((entry) => (
                    <ProgramWindow
                        key={entry.node.id}
                        node={entry.node}
                        running={entry.running}
                        activeId={activeId}
                        onActivate={handleActivateWindow}
                        onMinimize={handleMinimizeWindow}
                        onClose={handleCloseWindow}
                        onRequestZIndex={handleRequestZIndex}
                    />
                ))}
            </div>
            <div className="taskBarCover">
                <TaskBar
                    entries={entries}
                    activeId={activeId}
                    hiddenIcon={hiddenIconOpen}
                    onClickStartIcon={handleClickStartIcon}
                    onClickTime={handleClickTime}
                    onClickInfo={handleClickInfo}
                    onClickHiddenIcon={handleClickHiddenIcon}
                    onClickCloseAll={handleClickCloseAll}
                    onClickTaskIcon={handleClickTaskIcon}
                    onCloseProgram={handleCloseProgram}
                    onPreviewChange={handlePreviewChange}
                    renderPreviewContent={(entry) =>
                        renderProgramContent(entry.node)
                    }
                />
            </div>

            {/* 시작 */}
            <StatusBarShell />

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
    gridTemplateRows: "1fr token(sizes.taskbar)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",

    "& .windowCover": {
        position: "relative",
        padding: "10px",
    },

    "& .taskBarCover": {
        position: "relative",
        backgroundColor: "shell.bg",
        zIndex: 10000,
    },
});
