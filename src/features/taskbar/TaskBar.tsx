import type { CSSProperties } from "react";
import useGetCurrentTime from "@shared/hooks/useGetCurrentTime";
import { taskBarStyle } from "./TaskBar.style";
import { useTaskbarHover } from "./hooks/useTaskbarHover";
import StartButton from "./ui/StartButton";
import ProgramIcons from "./ui/ProgramIcons";
import SystemTray from "./ui/SystemTray";
import PreviewPopup from "./ui/PreviewPopup";
import type { TaskBarProps, TaskbarProgramItem } from "./TaskBar.types";

const TaskBar = ({
    programList,
    activeProgram,
    hiddenIcon,
    onClickStartIcon,
    onClickTime,
    onClickInfo,
    onClickHiddenIcon,
    onClickCloseAll,
    onClickTaskIcon,
    onCloseProgram,
    onPreviewChange,
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
    } = useTaskbarHover({ activeProgram, onPreviewChange });

    const handleClickIcon = (item: TaskbarProgramItem, idx: number) => {
        // 최소화 → 활성화 전환 시, 클릭 직후 hover 글로우 유지
        if (item.status === "min" || item.name !== activeProgram) {
            highlightActive(idx);
        }
        onClickTaskIcon(item);
    };

    const handleCloseShortcut = () => {
        if (!hoverTarget.name) return;
        onCloseProgram(hoverTarget.name);
        clearHover();
    };

    const previewTarget = programList.find(
        (item) => item.name === hoverTarget.name
    );

    const shotcutHoverTop = hoverTarget.name ? "-225px" : "225px";
    const shotcutHoverLeft = hoverTarget.idx === 0 ? "-50px" : "-75px";
    const shotcutHoverPointerEvents = hoverTarget.name ? "all" : "none";
    const prevviewTop = hoverTarget.name ? "-225px" : "50px";
    const prevviewOpacity = hoverTarget.name ? "1" : "0";
    const prevviewLeft = hoverTarget.name
        ? hoverTarget.idx > 0
            ? `${(hoverTarget.idx - 1) * 50 + 25}px`
            : "0px"
        : "0px";
    const prevviewPointerEvents = hoverTarget.name ? "all" : "none";

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
                programList={programList}
                activeProgram={activeProgram}
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

            <PreviewPopup target={previewTarget} hoverName={hoverTarget.name} />
        </div>
    );
};

export default TaskBar;
