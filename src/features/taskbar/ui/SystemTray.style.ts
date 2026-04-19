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

// Panda AOT 는 `cva({ base: { ...external } })` 스프레드를 literal object 로 추적한다.
// 현재 Panda 버전에서는 `as const` 단일 depth 스프레드가 안전하게 emit 되지만,
// Phase 2 확산 시 변형이 늘어나면 공통 TrayCell 컴포넌트 + variant 로 재구성하는 쪽을 재검토한다.
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
