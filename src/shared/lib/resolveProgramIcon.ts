import { resolveAsset } from "./assetManifest";
import folderEmpty from "@images/icons/folder_empty.png";
import defaultImage from "@images/icons/image_default.png";
import defaultDocumentImage from "@images/icons/document_default.png";
import monitor from "@images/icons/monitor.png";
import type { ProgramNode } from "@shared/types/program";

const FALLBACK_ICONS: Record<string, string> = {
    IMAGE: defaultImage,
    DOC: defaultDocumentImage,
    INFO: monitor,
};

const DEFAULT_ICON = folderEmpty;

export const resolveProgramIcon = (node: ProgramNode): string =>
    resolveAsset(node.icon) ?? FALLBACK_ICONS[node.type] ?? DEFAULT_ICON;
