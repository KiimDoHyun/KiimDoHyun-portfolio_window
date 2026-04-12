import type { ReactNode } from "react";
import { css } from "@styled-system/css";

interface PreviewWindowFrameProps {
    title: string;
    iconSrc: string;
    children: ReactNode;
}

const frameStyle = css({
    position: "absolute",
    left: 0,
    top: 0,
    width: "program.default",
    height: "program.default",
    backgroundColor: "windowChrome.bg",
    border: "1px solid token(colors.windowChrome.border)",
    boxSizing: "border-box",
    display: "grid",
    gridTemplateRows: "token(sizes.windowHeader) 1fr",
    pointerEvents: "none",
    overflow: "hidden",
});

const headerStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0 10px",
    borderBottom: "1px solid token(colors.surface.border)",
    boxSizing: "border-box",
});

const iconStyle = css({ width: "20px", height: "20px" });
const titleStyle = css({ fontSize: "14px" });
const bodyStyle = css({ position: "relative", overflow: "hidden" });

const PreviewWindowFrame = ({
    title,
    iconSrc,
    children,
}: PreviewWindowFrameProps) => {
    return (
        <div className={frameStyle}>
            <div className={headerStyle}>
                <img src={iconSrc} alt={title} className={iconStyle} />
                <span className={titleStyle}>{title}</span>
            </div>
            <div className={bodyStyle}>{children}</div>
        </div>
    );
};

export default PreviewWindowFrame;
