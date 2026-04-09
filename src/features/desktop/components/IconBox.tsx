import React from "react";
import { css } from "@styled-system/css";
import type { ProgramNode } from "@shared/types/program";
import { resolveAsset } from "@shared/lib/assetManifest";
import folderEmpty from "@images/icons/folder_empty.png";
import imageDefault from "@images/icons/image_default.png";
import documentDefault from "@images/icons/document_default.png";
import monitor from "@images/icons/monitor.png";

interface IconBoxProps {
    item: ProgramNode;
    onClick: (item: ProgramNode) => void;
    onDoubleClick: (item: ProgramNode) => void;
}

function fallbackIcon(node: ProgramNode): string {
    switch (node.type) {
        case "IMAGE": return imageDefault;
        case "DOC": return documentDefault;
        case "INFO": return monitor;
        default: return folderEmpty;
    }
}

const IconBox = ({ item, onClick, onDoubleClick }: IconBoxProps) => {
    const { name } = item;
    const icon = resolveAsset(item.icon) ?? fallbackIcon(item);
    return (
        <div
            className={iconBoxStyle}
            onClick={() => onClick(item)}
            onDoubleClick={() => onDoubleClick(item)}
        >
            <div className="iconImgBox">
                <img src={icon} alt="iconImg" />
            </div>
            <div className="name">{name ? name : "Icon"}</div>
        </div>
    );
};

const iconBoxStyle = css({
    width: "100px",
    height: "100px",

    padding: "10px",
    boxSizing: "border-box",
    cursor: "pointer",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    border: "2px solid #ffffff00",

    _hover: {
        backgroundColor: "#bbbbbb47",
        border: "2px solid #ffffff2e",
    },

    _active: {
        backgroundColor: "red",
    },

    "& .iconImgBox": {
        width: "50px",
        height: "50px",
    },
    "& .iconImgBox img": {
        width: "100%",
        height: "100%",
    },

    "& .name": {
        color: "white",
        fontSize: "14px",
        textShadow: "2px 2px 3px black",
    },
});
export default React.memo(IconBox);
