import { css } from "@styled-system/css";

export const headerStyle = css({
    "& .arrowBox": {
        display: "flex",
        gap: "8",
    },
    "& .arrowBox img": {
        width: "15px",
        height: "100%",
    },

    "& .routeBox": {
        flex: 1,
        textAlign: "left",
        py: "0",
        px: "8",
        fontSize: "12px",
        cursor: "default",
        display: "flex",
        alignItems: "center",
        border: "1px solid token(colors.surface.border)",
        height: "100%",
    },
    "& .routeBox input": {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        border: "none",
        outline: "none",
    },

    "& .selectDisplayType": {
        height: "100%",
    },
});

export const contentStyle = css({
    "& .contentsArea_folder": {
        width: "100%",
        height: "100%",
        padding: "8",
        boxSizing: "border-box",
        display: "flex",
        gap: "20",
        flexWrap: "wrap",
        alignContent: "flex-start",
    },

    "& .BIG_BIG_ICON .folder": {
        width: "160px",
    },
    "& .BIG_BIG_ICON img": {
        width: "160px",
        height: "160px",
    },

    "& .BIG_ICON .folder": {
        width: "120px",
    },
    "& .BIG_ICON img": {
        width: "120px",
        height: "120px",
    },

    "& .MEDIUM_ICON .folder": {
        width: "80px",
    },
    "& .MEDIUM_ICON img": {
        width: "80px",
        height: "80px",
    },

    "& .SMALL_ICON .folder": {
        width: "40px",
    },
    "& .SMALL_ICON img": {
        width: "40px",
        height: "40px",
    },

    "& .DETAIL": {
        gap: "0",
    },
    "& .DETAIL .folder": {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
    },
    "& .DETAIL .folder div": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    "& .DETAIL img": {
        width: "20px",
        height: "20px",
    },

    "& .folder": {
        boxSizing: "content-box",
        height: "auto",
        py: "4",
        px: "8",
        border: "1px solid transparent",
    },
    "& .folder_selected": {
        backgroundColor: "token(colors.accent.select) !important",
        border: "1px solid token(colors.accent.line)",
    },
    "& .folder:hover": {
        backgroundColor: "accent.soft",
    },
    "& .folder .name": {
        wordBreak: "break-all",
        fontSize: "12px",
        cursor: "default",
    },

    "& .detailHeader": {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        width: "100%",
        py: "4",
        px: "8",
    },
    "& .detailHeader .name": {
        fontSize: "11px",
        cursor: "default",
    },

    "& .noContents": {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "gray",
        fontSize: "14px",
        cursor: "default",
    },
});
