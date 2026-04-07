import close_white from "@images/icons/close_white.png";
import type { TaskbarProgramItem } from "../TaskBar.types";

interface PreviewPopupProps {
    target: TaskbarProgramItem | undefined;
    hoverName: string;
}

const PreviewPopup = ({ target, hoverName }: PreviewPopupProps) => {
    const Component = target?.Component;
    return (
        <div className="prevView">
            <div className="prevViewHeader">
                <div className="text">{hoverName}</div>
                <div className="button">
                    <img src={close_white} alt="close_white" />
                </div>
            </div>
            <div className="cover">
                {Component ? (
                    <Component item={{ ...target!, status: "active" }} />
                ) : null}
            </div>
        </div>
    );
};

export default PreviewPopup;
