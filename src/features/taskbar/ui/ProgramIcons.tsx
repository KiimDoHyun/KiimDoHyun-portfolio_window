import { forwardRef, type CSSProperties } from "react";
import type { ProgramId } from "@shared/types/program";
import type { TaskbarEntry } from "../TaskBar.types";
import { resolveProgramIcon } from "@shared/lib";
import {
    ProgramIconsRoot,
    ShortCutIcon,
    ShortCutImg,
    ShortCutBottomLine,
    ShotCutHover,
    ButtonCover,
    BodyCover,
} from "./ProgramIcons.style";

interface ProgramIconsProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
    hoverIdx: number;
    hoverStyle: CSSProperties;
    onMouseEnter: (entry: TaskbarEntry, idx: number) => void;
    onMouseLeave: (idx: number) => void;
    onClickIcon: (entry: TaskbarEntry, idx: number) => void;
    onClickClose: () => void;
}

const renderIconImage = (entry: TaskbarEntry) => {
    const icon = resolveProgramIcon(entry.node);
    return <img src={icon} alt={entry.node.name} />;
};

const ProgramIcons = forwardRef<HTMLDivElement, ProgramIconsProps>(
    (
        {
            entries,
            activeId,
            hoverIdx,
            hoverStyle,
            onMouseEnter,
            onMouseLeave,
            onClickIcon,
            onClickClose,
        },
        ref
    ) => {
        return (
            <ProgramIconsRoot ref={ref}>
                {entries.map((entry, idx) => {
                    const isActive = activeId === entry.node.id;
                    const isHover = hoverIdx === idx;
                    const bottomLineState =
                        isActive && isHover
                            ? "activeShortCut"
                            : isActive
                              ? "active"
                              : isHover
                                ? "hover"
                                : "idle";
                    return (
                        <ShortCutIcon
                            key={entry.node.id}
                            active={isActive}
                            data-active={isActive ? "true" : undefined}
                            data-testid={`taskbar-icon-${entry.node.id}`}
                            title={entry.node.name}
                            onMouseEnter={() => onMouseEnter(entry, idx)}
                            onMouseLeave={() => onMouseLeave(idx)}
                        >
                            <ShortCutImg
                                onClick={() => onClickIcon(entry, idx)}
                            >
                                {renderIconImage(entry)}
                            </ShortCutImg>
                            <ShortCutBottomLine state={bottomLineState} />
                            <ShotCutHover
                                hovering={isHover}
                                style={isHover ? hoverStyle : undefined}
                            >
                                <ButtonCover
                                    data-testid={`taskbar-close-${entry.node.id}`}
                                    onClick={onClickClose}
                                />
                                <BodyCover
                                    onClick={() => onClickIcon(entry, idx)}
                                />
                            </ShotCutHover>
                        </ShortCutIcon>
                    );
                })}
            </ProgramIconsRoot>
        );
    }
);

ProgramIcons.displayName = "ProgramIcons";

export default ProgramIcons;
