import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import monitor from "@images/icons/monitor.png";
import defaultDocumentImage from "@images/icons/document_default.png";
import type { ProgramNode } from "@shared/types/program";
import { resolveAsset } from "@shared/lib/assetManifest";

export const resolveProgramTitle = (node: ProgramNode): string => {
    if (node.type === "IMAGE") return "이미지";
    return node.name;
};

export const resolveProgramIcon = (node: ProgramNode): string => {
    const custom = resolveAsset(node.icon);
    if (custom) return custom;

    switch (node.type) {
        case "IMAGE":
            return defaultImage;
        case "DOC":
            return defaultDocumentImage;
        case "INFO":
            return monitor;
        default:
            return folderEmpty;
    }
};
