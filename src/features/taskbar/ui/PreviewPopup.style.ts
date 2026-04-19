import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const PreviewPopupRoot = styled(
    "div",
    cva({
        base: {
            position: "absolute",
            width: "200px",
            height: "225px",
            backgroundColor: "shell.bgAlt",
            zIndex: 1,
            pt: "8",
            px: "16",
            pb: "16",
            boxSizing: "border-box",
            transition: "fast",
        },
    })
);

export const PreviewHeader = styled(
    "div",
    cva({
        base: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
    })
);

export const PreviewHeaderText = styled(
    "div",
    cva({
        base: {
            color: "shell.text",
            fontSize: "14px",
        },
    })
);

export const PreviewHeaderButton = styled(
    "div",
    cva({
        base: {
            width: "20px",
            height: "20px",
            "& img": {
                width: "100%",
                height: "100%",
            },
        },
    })
);

export const PreviewCover = styled(
    "div",
    cva({
        base: {
            position: "relative",
            width: "100%",
            height: "100%",
            "& > div": {
                position: "absolute",
                left: "-165px",
                top: "-150px",
                transform: "scale(0.35)",
                animation: "prevView_coverTransform 0.2s",
            },
        },
    })
);
