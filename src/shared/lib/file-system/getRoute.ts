import type { FileSystemState, ProgramId } from "@shared/types/program";

export function getRoute(state: FileSystemState, id: ProgramId): string {
    if (!state.nodes[id]) return "";
    const chain: Array<string> = [];
    let cursor: ProgramId | null = id;
    while (cursor) {
        const node = state.nodes[cursor];
        if (!node) break;
        chain.unshift(node.name);
        cursor = node.parentId;
    }
    return `/ KDH / ${chain.join(" / ")}`;
}
