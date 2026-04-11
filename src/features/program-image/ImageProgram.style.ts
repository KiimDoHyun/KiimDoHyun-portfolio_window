import { css } from "@styled-system/css";

export const headerStyle = css({
    justifyContent: "center !important",
    // 30px → spacing.32 (=32px)로 2px 드리프트 감수 (이미지 갤러리 여백)
    gap: "token(spacing.32) !important",

    "& .image_header_controller_btn": {
        width: "20px",
        height: "20px",
        // 원본 1px padding → 아이콘 크기 예약용이므로 transparent border로 치환
        border: "1px solid transparent",
        boxSizing: "border-box",
        transition: "fast",
    },

    "& .image_header_controller_btn:hover": {
        backgroundColor: "surface.content",
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
        backgroundColor: "surface.dark",
    },

    "& .image_arrow": {
        position: "absolute",
        height: "100%",
        width: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "fast",
    },

    "& .image_arrow img": {
        width: "15px",
        height: "15px",
    },

    "& .image_arrow:hover": {
        opacity: 1,
    },

    "& .image_arrowLeft": {
        background: "linear-gradient(to right, token(colors.overlay.fadeEdge), transparent)",
        left: 0,
    },

    "& .image_arrowRight": {
        background: "linear-gradient(to right, transparent, token(colors.overlay.fadeEdge))",
        right: 0,
    },

    "& .imageContent": {
        width: "96px",
        height: "96px",
    },
});
