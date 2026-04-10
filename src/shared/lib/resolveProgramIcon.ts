import { resolveAsset } from "./assetManifest";
import { programMeta } from "./programMeta";
import type { ProgramNode } from "@shared/types/program";

export const resolveProgramIcon = (node: ProgramNode): string =>
    resolveAsset(node.icon) ?? programMeta[node.type].defaultIcon;
