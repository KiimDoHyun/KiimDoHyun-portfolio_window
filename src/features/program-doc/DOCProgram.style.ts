import { css } from "@styled-system/css";

export const docProgramContentStyle = css({
    "&.contentsArea_Cover": {
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
    },

    "& .doc_header": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12",
        borderBottom: "1px solid",
        borderColor: "surface.border",
    },

    "& .doc_projectName": {
        fontWeight: "bold",
        fontSize: "16px",
        color: "surface.textPrimary",
    },

    "& .doc_projectTerm": {
        fontSize: "13px",
        color: "surface.textMuted",
    },

    "& .doc_body": {
        overflow: "auto",
        padding: "16",
        fontSize: "14px",
        lineHeight: "1.7",
        color: "surface.textPrimary",
    },

    "& .doc_body h1": {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "12",
        marginTop: "20",
    },

    "& .doc_body h2": {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "10",
        marginTop: "16",
    },

    "& .doc_body h3": {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "8",
        marginTop: "12",
    },

    "& .doc_body p": {
        marginBottom: "10",
    },

    "& .doc_body ul, & .doc_body ol": {
        paddingLeft: "20",
        marginBottom: "10",
    },

    "& .doc_body li": {
        marginBottom: "4",
    },

    "& .doc_body code": {
        backgroundColor: "surface.content",
        padding: "2",
        borderRadius: "3px",
        fontSize: "13px",
    },

    "& .doc_body pre": {
        backgroundColor: "surface.content",
        padding: "12",
        borderRadius: "6px",
        overflow: "auto",
        marginBottom: "10",
    },

    "& .doc_body pre code": {
        padding: "0",
        backgroundColor: "transparent",
    },

    "& .doc_body strong": {
        fontWeight: "bold",
    },

    "& .doc_body em": {
        fontStyle: "italic",
    },
});
