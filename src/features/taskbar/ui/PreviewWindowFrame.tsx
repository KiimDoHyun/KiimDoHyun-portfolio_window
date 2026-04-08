import type { ReactNode } from "react";

interface PreviewWindowFrameProps {
    title: string;
    iconSrc: string;
    children: ReactNode;
}

const PreviewWindowFrame = ({
    title,
    iconSrc,
    children,
}: PreviewWindowFrameProps) => {
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "500px",
                height: "500px",
                backgroundColor: "white",
                border: "1px solid black",
                boxSizing: "border-box",
                display: "grid",
                gridTemplateRows: "32px 1fr",
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0 10px",
                    borderBottom: "1px solid #ddd",
                    boxSizing: "border-box",
                }}
            >
                <img
                    src={iconSrc}
                    alt={title}
                    style={{ width: "20px", height: "20px" }}
                />
                <span style={{ fontSize: "14px" }}>{title}</span>
            </div>
            <div style={{ position: "relative", overflow: "hidden" }}>
                {children}
            </div>
        </div>
    );
};

export default PreviewWindowFrame;
