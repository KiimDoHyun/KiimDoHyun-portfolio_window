import { forwardRef } from "react";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";
import defaultDocumentImage from "@images/icons/document_default.png";
import type { ProgramId } from "@shared/types/program";
import type { TaskbarEntry } from "../TaskBar.types";

interface ProgramIconsProps {
    entries: Array<TaskbarEntry>;
    activeId: ProgramId | null;
    onMouseEnter: (entry: TaskbarEntry, idx: number) => void;
    onMouseLeave: (idx: number) => void;
    onClickIcon: (entry: TaskbarEntry, idx: number) => void;
    onClickClose: () => void;
}

const renderIconImage = (entry: TaskbarEntry) => {
    const { node } = entry;
    switch (node.type) {
        case "IMAGE":
            return <img src={defaultImage} alt={node.name} />;
        case "FOLDER":
            return <img src={folderEmpty} alt={node.name} />;
        case "DOC":
            return <img src={defaultDocumentImage} alt={node.name} />;
        case "INFO":
            return <img src={monitor} alt={node.name} />;
        case "BROWSER":
            return <img src={node.icon || folderEmpty} alt={node.name} />;
        default:
            return null;
    }
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
