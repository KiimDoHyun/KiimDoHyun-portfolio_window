import { forwardRef } from "react";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";
import defaultDocumentImage from "@images/icons/document_default.png";
import type { TaskbarProgramItem } from "../TaskBar.types";

interface ProgramIconsProps {
    programList: Array<TaskbarProgramItem>;
    activeProgram: string;
    onMouseEnter: (item: TaskbarProgramItem, idx: number) => void;
    onMouseLeave: (idx: number) => void;
    onClickIcon: (item: TaskbarProgramItem, idx: number) => void;
    onClickClose: () => void;
}

const renderIconImage = (item: TaskbarProgramItem) => {
    switch (item.type) {
        case "IMAGE":
            return <img src={defaultImage} alt={item.name} />;
        case "FOLDER":
            return <img src={folderEmpty} alt={item.name} />;
        case "DOC":
            return <img src={defaultDocumentImage} alt={item.name} />;
        case "INFO":
            return <img src={monitor} alt={item.name} />;
        case "BROWSER":
            return <img src={item.icon || folderEmpty} alt={item.name} />;
        default:
            return null;
    }
};

const ProgramIcons = forwardRef<HTMLDivElement, ProgramIconsProps>(
    (
        {
            programList,
            activeProgram,
            onMouseEnter,
            onMouseLeave,
            onClickIcon,
            onClickClose,
        },
        ref
    ) => {
        return (
            <div className="box2" ref={ref}>
                {programList.map((item, idx) => (
                    <div
                        key={idx}
                        className={`shortCutIcon ${
                            activeProgram === item.name ? "activeIcon" : ""
                        }`}
                        title={item.name}
                        onMouseEnter={() => onMouseEnter(item, idx)}
                        onMouseLeave={() => onMouseLeave(idx)}
                    >
                        <div
                            className="shortCut_Img"
                            onClick={() => onClickIcon(item, idx)}
                        >
                            {renderIconImage(item)}
                        </div>
                        <div className="shortCut_BottomLine" />
                        <div className="shotCut_Hover">
                            <div
                                className="buttonCover"
                                onClick={onClickClose}
                            />
                            <div
                                className="bodyCover"
                                onClick={() => onClickIcon(item, idx)}
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
