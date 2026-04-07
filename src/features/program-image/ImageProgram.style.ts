import { css } from "@styled-system/css";

export const headerStyle = css({
    justifyContent: "center !important",
    gap: "30px !important",

    "& .image_header_controller_btn": {
        width: "20px",
        height: "20px",
        padding: "1px",
        boxSizing: "border-box",
        transition: "0.2s",
    },

    "& .image_header_controller_btn:hover": {
        backgroundColor: "#e6e6e6",
    },

    "& .image_header_controller_btn img": {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
});

export const contentStyle = css({
    "& .contentsArea_image": {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#20343b",
    },

    "& .image_arrow": {
        position: "absolute",
        height: "100%",
        width: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "0.2s",
    },

    "& .image_arrow img": {
        width: "15px",
        height: "15px",
    },

    "& .image_arrow:hover": {
        opacity: 1,
    },

    "& .image_arrowLeft": {
        background: "linear-gradient(to right, #00000029, #ffffff00)",
        left: 0,
    },

    "& .image_arrowRight": {
        background: "linear-gradient(to right, #ffffff00, #00000029)",
        right: 0,
    },

    "& .imageContent": {
        width: "96px",
        height: "96px",
    },
});
