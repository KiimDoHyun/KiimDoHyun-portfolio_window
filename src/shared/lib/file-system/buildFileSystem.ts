import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import type { AuthoringNode, PortfolioSchema } from "@shared/types/portfolio-schema";
import { pickExtraFields } from "@shared/lib/programMeta";

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

        const base = { id, parentId, type: authoring.type, name: authoring.name, icon: authoring.icon };
        const extra = pickExtraFields(authoring.type, authoring as Record<string, unknown>);
        nodes[id] = { ...base, ...extra } as ProgramNode;
        return id;
    }

    const rootId = visit(schema.root, null);
    return { rootId, nodes, childrenByParent };
}
