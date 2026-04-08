import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import type { AuthoringNode, PortfolioSchema } from "@shared/types/portfolio-schema";

let counter = 0;
function nextId(): ProgramId {
    counter += 1;
    return `node_${counter}`;
}

// Exposed for tests that need deterministic ids.
export function _resetIdCounterForTests(): void {
    counter = 0;
}

export function buildFileSystem(schema: PortfolioSchema): FileSystemState {
    const nodes: Record<ProgramId, ProgramNode> = {};
    const childrenByParent: Record<ProgramId, Array<ProgramId>> = {};

    function visit(authoring: AuthoringNode, parentId: ProgramId | null): ProgramId {
        const id = nextId();

        if (authoring.type === "FOLDER") {
            const node: ProgramNode = {
                id,
                parentId,
                type: "FOLDER",
                name: authoring.name,
                icon: authoring.icon,
            };
            nodes[id] = node;
            childrenByParent[id] = authoring.children.map((child) => visit(child, id));
            return id;
        }

        let node: ProgramNode;
        switch (authoring.type) {
            case "DOC":
                node = { id, parentId, type: "DOC", name: authoring.name, icon: authoring.icon, contents: authoring.contents };
                break;
            case "IMAGE":
                node = { id, parentId, type: "IMAGE", name: authoring.name, icon: authoring.icon, src: authoring.src };
                break;
            case "INFO":
                node = { id, parentId, type: "INFO", name: authoring.name, icon: authoring.icon, contents: authoring.contents };
                break;
            case "BROWSER":
                node = { id, parentId, type: "BROWSER", name: authoring.name, icon: authoring.icon, url: authoring.url };
                break;
        }
        nodes[id] = node;
        return id;
    }

    const rootId = visit(schema.root, null);
    return { rootId, nodes, childrenByParent };
}
