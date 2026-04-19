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
    color: "shell.text",
    cursor: "default",
  },
});

type CenterAreaBoxProps = {
    parentId?: ProgramId;
    img: string | null;
    name: string;
    showImg?: boolean;
    depth?: number;
    onClick?: (id: ProgramId) => void;
};

const CenterAreaBox = ({
    parentId,
    img,
    name,
    showImg = true,
    depth = 0,
    onClick,
}: CenterAreaBoxProps) => {
    const indentPx = 4 + depth * 12;
    const fontWeight = depth === 0 ? 700 : depth === 1 ? 600 : 300;
    const fontSize = depth === 1 ? 13 : 14;

    return (
        <div
            className={`statusBox ${centerAreaBoxBlockStyle}`}
            style={{ paddingLeft: `${indentPx}px` }}
            onClick={() => {
                if (parentId) {
                    onClick?.(parentId);
                }
            }}
        >
            {showImg && <img src={img ? img : defaultImg} alt="name" />}
            <div className="text" style={{ fontWeight, fontSize }}>
                {name}
            </div>
        </div>
    );
};

export default React.memo(CenterAreaBox);
