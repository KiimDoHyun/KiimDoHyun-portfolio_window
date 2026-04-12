import React from "react";
import { css } from "@styled-system/css";
import defaultImg from "@images/icons/project_default_1.png";
import type { ProgramId } from "@shared/types/program";

const centerAreaBoxBlockStyle = css({
  width: "100%",
  height: "50px",

  display: "flex",
  alignItems: "center",
  gap: "10px",

  padding: "5px",
  boxSizing: "border-box",

  "& img": {
    width: "25px",
    height: "25px",
  },
  "& .text": {
    fontSize: "14px",
    fontWeight: "lighter",
    color: "shell.text",
    cursor: "default",
  },
});

type CenterAreaBoxProps = {
    parentId?: ProgramId;
    img: string | null;
    name: string;
    showImg?: boolean;
    onClick?: (id: ProgramId) => void;
};

const CenterAreaBox = ({
    parentId,
    img,
    name,
    showImg = true,
    onClick,
}: CenterAreaBoxProps) => {
    return (
        <div
            className={`statusBox ${centerAreaBoxBlockStyle}`}
            onClick={() => {
                if (parentId) {
                    onClick?.(parentId);
                }
            }}
        >
            {showImg && <img src={img ? img : defaultImg} alt="name" />}
            <div className="text">{name}</div>
        </div>
    );
};

export default React.memo(CenterAreaBox);
