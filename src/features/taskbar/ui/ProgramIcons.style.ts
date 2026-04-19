import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const ProgramIconsRoot = styled(
    "div",
    cva({
        base: {
            display: "flex",
            zIndex: 2,
        },
    })
);

export const ShortCutIcon = styled(
    "div",
    cva({
        base: {
            transition: "fast",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            width: "taskbar",
            position: "relative",
        },
        variants: {
            active: {
                true: { backgroundColor: "overlay.active" },
            },
        },
    })
);

export const ShortCutImg = styled(
    "div",
    cva({
        base: {
            width: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& img": {
                width: "25px",
                height: "25px",
            },
        },
    })
);

export const ShortCutBottomLine = styled(
    "div",
    cva({
        base: {
            transition: "fast",
            height: "3px",
            backgroundColor: "accent.underline",
        },
        variants: {
            state: {
                idle: { width: "80%" },
                hover: { width: "95%" },
                active: { width: "95%" },
                activeShortCut: { width: "70%" },
            },
        },
        defaultVariants: { state: "idle" },
    })
);

export const ShotCutHover = styled(
    "div",
    cva({
        base: {
            position: "absolute",
            width: "200px",
            backgroundColor: "transparent",
        },
        variants: {
            hovering: {
                true: { height: "225px" },
                false: { height: "0px" },
            },
        },
    })
);

export const ButtonCover = styled(
    "div",
    cva({
        base: {
            position: "absolute",
            right: 0,
            width: "40px",
            height: "40px",
            backgroundColor: "transparent",
        },
    })
);

export const BodyCover = styled(
    "div",
    cva({
        base: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "200px",
        },
    })
);
