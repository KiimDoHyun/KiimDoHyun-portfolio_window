import React from "react";
import { css } from "@styled-system/css";

const errorBoxBlockStyle = css({
    width: "100%",
    height: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    color: "surface.textMuted",
    cursor: "default",
});

const ErrorBox = () => {
    return (
        <div className={errorBoxBlockStyle}>
            <div>Commit 정보를 가져오는데 실패했습니다.</div>
        </div>
    );
};

export default React.memo(ErrorBox);
