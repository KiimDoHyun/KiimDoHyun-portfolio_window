import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import type { AuthoringNode, PortfolioSchema } from "@shared/types/portfolio-schema";

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

        switch (node.type) {
            case "DOC":
                return { type: "DOC", name: node.name, icon: node.icon, contents: node.contents };
            case "IMAGE":
                return { type: "IMAGE", name: node.name, icon: node.icon, src: node.src };
            case "INFO":
                return { type: "INFO", name: node.name, icon: node.icon, contents: node.contents };
            case "BROWSER":
                return { type: "BROWSER", name: node.name, icon: node.icon, url: node.url };
        }
    }

    return { version: 1, root: visit(state.rootId) };
}
