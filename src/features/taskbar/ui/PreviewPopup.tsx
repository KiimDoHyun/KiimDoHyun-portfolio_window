import type { CSSProperties, ReactNode } from "react";
import close_white from "@images/icons/close_white.png";
import {
    resolveProgramTitle,
    resolveProgramIcon,
} from "@pages/DesktopPage/resolveProgramMeta";
import type { TaskbarEntry } from "../TaskBar.types";
import PreviewWindowFrame from "./PreviewWindowFrame";
import {
    PreviewPopupRoot,
    PreviewHeader,
    PreviewHeaderText,
    PreviewHeaderButton,
    PreviewCover,
} from "./PreviewPopup.style";

interface PreviewPopupProps {
    target: TaskbarEntry | undefined;
    renderContent: (entry: TaskbarEntry) => ReactNode;
    rootStyle: CSSProperties;
}

const PreviewPopup = ({
    target,
    renderContent,
    rootStyle,
}: PreviewPopupProps) => {
    return (
        <PreviewPopupRoot style={rootStyle}>
            <PreviewHeader>
                <PreviewHeaderText>
                    {target ? target.node.name : ""}
                </PreviewHeaderText>
                <PreviewHeaderButton>
                    <img src={close_white} alt="close_white" />
                </PreviewHeaderButton>
            </PreviewHeader>
            <PreviewCover>
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
            </PreviewCover>
        </PreviewPopupRoot>
    );
};

export default PreviewPopup;
