import type { ReactNode } from "react";
import close_white from "@images/icons/close_white.png";
import {
    resolveProgramTitle,
    resolveProgramIcon,
} from "@pages/DesktopPage/resolveProgramMeta";
import type { TaskbarEntry } from "../TaskBar.types";
import PreviewWindowFrame from "./PreviewWindowFrame";

interface PreviewPopupProps {
    target: TaskbarEntry | undefined;
    renderContent: (entry: TaskbarEntry) => ReactNode;
}

const PreviewPopup = ({ target, renderContent }: PreviewPopupProps) => {
    return (
        <div className="prevView">
            <div className="prevViewHeader">
                <div className="text">{target ? target.node.name : ""}</div>
                <div className="button">
                    <img src={close_white} alt="close_white" />
                </div>
            </div>
            <div className="cover">
                {target ? (
                    <PreviewWindowFrame
                        key={target.node.id}
                        title={resolveProgramTitle(target.node)}
                        iconSrc={resolveProgramIcon(target.node)}
                    >
                        {renderContent({
                            node: target.node,
                            running: { ...target.running, status: "active" },
                        })}
                    </PreviewWindowFrame>
                ) : null}
            </div>
        </div>
    );
};

export default PreviewPopup;
