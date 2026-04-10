import { forwardRef } from "react";
import type { ProgramId } from "@shared/types/program";
import type { TaskbarEntry } from "../TaskBar.types";
import { resolveProgramIcon } from "@shared/lib";

interface ProgramIconsProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
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
            onMouseEnter,
            onMouseLeave,
            onClickIcon,
            onClickClose,
        },
        ref
    ) => {
        return (
            <div className="box2" ref={ref}>
                {entries.map((entry, idx) => (
                    <div
                        key={entry.node.id}
                        className={`shortCutIcon ${
                            activeId === entry.node.id ? "activeIcon" : ""
                        }`}
                        title={entry.node.name}
                        onMouseEnter={() => onMouseEnter(entry, idx)}
                        onMouseLeave={() => onMouseLeave(idx)}
                    >
                        <div
                            className="shortCut_Img"
                            onClick={() => onClickIcon(entry, idx)}
                        >
                            {renderIconImage(entry)}
                        </div>
                        <div className="shortCut_BottomLine" />
                        <div className="shotCut_Hover">
                            <div
                                className="buttonCover"
                                onClick={onClickClose}
                            />
                            <div
                                className="bodyCover"
                                onClick={() => onClickIcon(entry, idx)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
);

ProgramIcons.displayName = "ProgramIcons";

export default ProgramIcons;
