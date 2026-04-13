import { css } from "@styled-system/css";

export const logoutOverlayStyle = css({
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(20px)",
    transition: "opacity var(--logout-fade-duration) ease-in",
    pointerEvents: "none",

    "& .logoutText": {
        color: "white",
        fontSize: "20px",
        fontWeight: 300,
        letterSpacing: "2px",
    },
});
