import type { ReactNode } from "react";
import close_white from "@images/icons/close_white.png";
import {
    resolveProgramTitle,
    resolveProgramIcon,
} from "@pages/DesktopPage/resolveProgramMeta";
import type { TaskbarProgramItem } from "../TaskBar.types";
import PreviewWindowFrame from "./PreviewWindowFrame";

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
                    <PreviewWindowFrame
                        title={resolveProgramTitle(target)}
                        iconSrc={resolveProgramIcon(target)}
                    >
                        {renderContent({ ...target, status: "active" })}
                    </PreviewWindowFrame>
                ) : null}
            </div>
        </div>
    );
};

export default PreviewPopup;
