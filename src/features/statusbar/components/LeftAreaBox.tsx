import React from "react";
import { useRecoilValue } from "recoil";
import { css } from "@styled-system/css";
import { rc_global_Directory_List } from "@store/global";

const leftAreaBoxBlockStyle = css({
    width: "100%",
    height: "50px",
    backgroundColor: "transparent",

    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",

    "& .icon": {
        width: "48px",
        height: "50px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    "& .icon img": {
        width: "55%",
        height: "55%",
        borderRadius: "100%",
    },

    "& .text": {
        color: "#e8e8e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontSize: "13px",
        fontWeight: "lighter",
        cursor: "default",
    },
});

const LeftAreaBox = ({ img, name, onClick }) => {
    const directory = useRecoilValue(rc_global_Directory_List);
    return (
        <div
            className={`statusBox ${leftAreaBoxBlockStyle}`}
            onClick={() => {
                onClick(
                    directory.find((findItem) => findItem.name === "내컴퓨터")
                );
            }}
        >
            <div className="icon">
                <img src={img} alt={name} />
            </div>
            <div className="text">{name}</div>
        </div>
    );
};

export default React.memo(LeftAreaBox);
