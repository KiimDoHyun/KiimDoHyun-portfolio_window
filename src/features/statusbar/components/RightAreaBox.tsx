import React from "react";
import { useRecoilValue } from "recoil";
import { css } from "@styled-system/css";
import { rc_global_Directory_List } from "@store/global";

const rightAreaBoxBlockStyle = css({
    flexBasis: "32%",
    height: "100px",
    backgroundColor: "#ffffff14",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #9b9b9b00",

    boxSizing: "border-box",
    padding: "10px",

    position: "relative",

    _hover: {
        border: "2px solid #9b9b9b",
    },

    "& img": {
        width: "50%",
        height: "50%",
    },

    "& .text": {
        position: "absolute",
        bottom: "5px",
        left: "2px",
        fontSize: "11px",
        fontWeight: "lighter",
        color: "#e8e8e8",
        cursor: "default",
    },
});

const RightAreaBox = ({ item, img, name, onClick }) => {
    const directory = useRecoilValue(rc_global_Directory_List);
    return (
        <div
            className={`statusBox ${rightAreaBoxBlockStyle}`}
            onClick={() => {
                if (item) {
                    onClick(
                        directory.find(
                            (findItem) => findItem.name === item.parent
                        )
                    );
                }
            }}
        >
            <img src={img} alt="name" />
            <div className="text">{name}</div>
        </div>
    );
};

export default React.memo(RightAreaBox);
