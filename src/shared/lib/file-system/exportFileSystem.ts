import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import type { AuthoringNode, PortfolioSchema } from "@shared/types/portfolio-schema";
import { programMeta } from "@shared/lib/programMeta";

export function exportFileSystem(state: FileSystemState): PortfolioSchema {
    function visit(id: ProgramId): AuthoringNode {
        const node: ProgramNode = state.nodes[id];

        if (node.type === "FOLDER") {
            const childIds = state.childrenByParent[id] ?? [];
            return {
                type: "FOLDER",
                name: node.name,
                icon: node.icon,
                children: childIds.map(visit),
            };
        }

        const base = { type: node.type, name: node.name, icon: node.icon };
        const extra: Record<string, unknown> = {};
        for (const key of programMeta[node.type].extraFields) {
            extra[key] = (node as unknown as Record<string, unknown>)[key];
        }
        return { ...base, ...extra } as AuthoringNode;
    }

    return { version: 1, root: visit(state.rootId) };
}
