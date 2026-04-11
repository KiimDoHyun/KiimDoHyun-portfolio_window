import { css } from "@styled-system/css";

export const docProgramContentStyle = css({
    "& .contentsArea_doc": {
        width: "100%",
        height: "100%",

        display: "flex",
        gap: "20",
        flexWrap: "wrap",
        alignContent: "flex-start",
        boxSizing: "border-box",
        padding: "8",
    },

    "& .doc_imageArea": {
        width: "100%",
        height: "auto",
        minHeight: "200px",
        backgroundColor: "surface.content",
        display: "inline-block",
        overflow: "scroll",

        flexGrow: 1,
        flexBasis: "500px",
    },

    "& .noProjectImage": {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: "surface.textMuted",
        fontSize: "14px",
    },

    "& .projectImageItem": {
        height: "100%",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    "& .projectImageItem img": {
        width: "100%",
        height: "100%",

        objectFit: "contain",
    },

    "& .doc_contentsArea": {
        flex: 1,

        overflow: "scroll",
        height: "100%",
        width: "100%",
        flexGrow: 1,
        flexBasis: "500px",
    },

    "& .doc_card": {
        textAlign: "left",

        boxSizing: "border-box",
        py: "20",
        px: "0",
        borderBottom: "1px solid gray",
    },

    "& .cardTitle": {
        fontWeight: "bold",
        marginBottom: "8",
    },
    "& .cardContent": {
        fontSize: "12px",
        color: "surface.textPrimary",
    },

    "& .doc_stack": {
        display: "flex",
        gap: "8",
        flexWrap: "wrap",
    },
    "& .stackItem": {
        border: "1px solid gray",
        py: "4",
        px: "8",
        borderRadius: "5px",
        width: "fit-content",
        position: "relative",
        cursor: "pointer",
        transition: "fast",
    },

    "& .stackItem:hover": {
        color: "white",
        backgroundColor: "gray",
    },
    "& .stackItem:hover .stackItem_Image": {
        bottom: "-45px",
        opacity: 1,

        boxShadow: "stackItem",
        scale: 1,
    },

    "& .stackItem_Image": {
        position: "absolute",

        left: "calc(50% - 20px)",
        width: "40px",
        height: "40px",
        bottom: "-35px",

        backgroundColor: "white",
        opacity: 0,
        transition: "fast",

        boxSizing: "border-box",
        padding: "4",

        scale: 0.4,
    },

    "& .doc_reulst": {
        display: "flex",
        flexDirection: "column",
        gap: "20",
    },
    "& .stackItem_Image img": {
        width: "100%",
        height: "100%",

        objectFit: "contain",
    },

    "& .resultTitle": {
        marginBottom: "4",
        fontWeight: "bold",
    },
});
