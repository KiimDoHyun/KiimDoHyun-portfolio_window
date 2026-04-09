import type { FileSystemState, ProgramNode } from "@shared/types/program";

export function selectDesktopRootIcons(
    fs: FileSystemState,
): Array<ProgramNode> {
    if (!fs.rootId) return [];
    return (fs.childrenByParent[fs.rootId] ?? [])
        .map((id) => fs.nodes[id])
        .filter((n): n is ProgramNode => !!n);
}
