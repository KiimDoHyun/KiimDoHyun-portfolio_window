import type { ReactNode } from "react";
import close_white from "@images/icons/close_white.png";
import type { TaskbarProgramItem } from "../TaskBar.types";

interface PreviewPopupProps {
    target: TaskbarProgramItem | undefined;
    hoverName: string;
    renderContent: (item: TaskbarProgramItem) => ReactNode;
}

const PreviewPopup = ({
    target,
    hoverName,
    renderContent,
}: PreviewPopupProps) => {
    return (
        <div className="prevView">
            <div className="prevViewHeader">
                <div className="text">{hoverName}</div>
                <div className="button">
                    <img src={close_white} alt="close_white" />
                </div>
            </div>
            <div className="cover">
                {target ? (
                    <div
                        style={{
                            position: "absolute",
                            width: "500px",
                            height: "500px",
                            left: 0,
                            top: 0,
                            backgroundColor: "white",
                        }}
                    >
                        {renderContent({ ...target, status: "active" })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PreviewPopup;
