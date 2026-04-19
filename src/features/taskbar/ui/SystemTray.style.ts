import { cva } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

export const SystemTrayRoot = styled(
    "div",
    cva({
        base: {
            display: "grid",
            gridTemplateColumns: "1fr 4fr 50px 5px",
            gap: "4",
        },
    })
);

const trayCellBase = {
    transition: "fast",
    _hover: {
        backgroundColor: "overlay.hover",
    },
} as const;

export const ArrowUpCell = styled(
    "div",
    cva({
        base: {
            ...trayCellBase,
            padding: "4",
            display: "flex",
            alignItems: "center",
            "& img": { width: "100%" },
        },
    })
);

export const DateInfoCell = styled(
    "div",
    cva({
        base: {
            ...trayCellBase,
            padding: "4",
            fontSize: "13px",
            color: "shell.text",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "& > div": { cursor: "default" },
        },
    })
);

export const InfoCell = styled(
    "div",
    cva({
        base: {
            ...trayCellBase,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& img": {
                width: "50%",
                objectFit: "cover",
            },
        },
    })
);

export const CloseAllCell = styled(
    "div",
    cva({
        base: {
            ...trayCellBase,
            borderLeft: "1px solid token(colors.shell.border)",
        },
    })
);
