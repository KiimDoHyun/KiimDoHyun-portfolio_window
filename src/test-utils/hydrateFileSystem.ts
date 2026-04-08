import type { PortfolioSchema } from "@shared/types/portfolio-schema";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";

export function hydrateTestFileSystem(schema: PortfolioSchema) {
    useFileSystemStore.getState().hydrate(schema);
    useRunningProgramsStore.setState({
        byId: {},
        order: [],
        activeId: null,
        zIndexCounter: 1,
    });
}

export function findIdByName(name: string): string {
    const { nodes } = useFileSystemStore.getState();
    const node = Object.values(nodes).find((n) => n.name === name);
    if (!node) throw new Error(`test fixture: node '${name}' not found`);
    return node.id;
}
