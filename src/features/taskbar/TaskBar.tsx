import type { CSSProperties } from "react";
import useGetCurrentTime from "@shared/hooks/useGetCurrentTime";
import { taskBarStyle } from "./TaskBar.style";
import { useTaskbarHover } from "./hooks/useTaskbarHover";
import StartButton from "./ui/StartButton";
import ProgramIcons from "./ui/ProgramIcons";
import SystemTray from "./ui/SystemTray";
import PreviewPopup from "./ui/PreviewPopup";
import type { TaskBarProps, TaskbarEntry } from "./TaskBar.types";

const TaskBar = ({
    entries,
    activeId,
    hiddenIcon,
    onClickStartIcon,
    onClickTime,
    onClickInfo,
    onClickHiddenIcon,
    onClickCloseAll,
    onClickTaskIcon,
    onCloseProgram,
    onPreviewChange,
    renderPreviewContent,
}: TaskBarProps) => {
    const {
        year: cur_year,
        month: cur_month,
        date: cur_date,
        hour: cur_hour,
        min: cur_minute,
        timeLine: cur_timeline,
    } = useGetCurrentTime();

    const {
        hoverTarget,
        iconContainerRef,
        onMouseEnter,
        onMouseLeave,
        highlightActive,
        clearHover,
    } = useTaskbarHover({ activeId, onPreviewChange });

    const handleClickIcon = (entry: TaskbarEntry, idx: number) => {
        // 최소화 → 활성화 전환 시, 클릭 직후 hover 글로우 유지
        if (entry.running.status === "min" || entry.node.id !== activeId) {
            highlightActive(idx);
        }
        onClickTaskIcon(entry);
    };

    const handleCloseShortcut = () => {
        if (!hoverTarget.id) return;
        onCloseProgram(hoverTarget.id);
        clearHover();
    };

    const previewTarget = entries.find(
        (entry) => entry.node.id === hoverTarget.id
    );

    const hovering = hoverTarget.id !== null;
    const shotcutHoverTop = hovering ? "-225px" : "225px";
    const shotcutHoverLeft = hoverTarget.idx === 0 ? "-50px" : "-75px";
    const shotcutHoverPointerEvents = hovering ? "all" : "none";
    const prevviewTop = hovering ? "-225px" : "50px";
    const prevviewOpacity = hovering ? "1" : "0";
    const prevviewLeft = hovering
        ? hoverTarget.idx > 0
            ? `${(hoverTarget.idx - 1) * 50 + 25}px`
            : "0px"
        : "0px";
    const prevviewPointerEvents = hovering ? "all" : "none";

    const cssVars = {
        "--shotcut-hover-top": shotcutHoverTop,
        "--shotcut-hover-left": shotcutHoverLeft,
        "--shotcut-hover-pointer-events": shotcutHoverPointerEvents,
        "--prevview-top": prevviewTop,
        "--prevview-opacity": prevviewOpacity,
        "--prevview-left": prevviewLeft,
        "--prevview-pointer-events": prevviewPointerEvents,
    } as CSSProperties;

    return (
        <div className={taskBarStyle} style={cssVars}>
            <StartButton onClick={onClickStartIcon} />

            <ProgramIcons
                ref={iconContainerRef}
                entries={entries}
                activeId={activeId}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClickIcon={handleClickIcon}
                onClickClose={handleCloseShortcut}
            />

            <SystemTray
                hiddenIcon={hiddenIcon}
                cur_year={cur_year}
                cur_month={cur_month}
                cur_date={cur_date}
                cur_hour={cur_hour}
                cur_minute={cur_minute}
                cur_timeline={cur_timeline}
                onClickHiddenIcon={onClickHiddenIcon}
                onClickTime={onClickTime}
                onClickInfo={onClickInfo}
                onClickCloseAll={onClickCloseAll}
            />

            <PreviewPopup
                target={previewTarget}
                renderContent={renderPreviewContent}
            />
        </div>
    );
};

export default TaskBar;
