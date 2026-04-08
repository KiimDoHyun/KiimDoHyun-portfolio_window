import { useContext, useMemo, useCallback } from "react";
import { DesktopDataContext } from "./DesktopDataContext";
import type {
    DesktopDataValue,
    DirectoryItem,
    DirectoryTree,
} from "./DesktopDataContext";
import { useFileSystemStore } from "@store/fileSystemStore";
import { useRunningProgramsStore } from "@store/runningProgramsStore";
import { getRoute } from "@shared/lib/file-system/getRoute";
import type { ProgramNode } from "@shared/types/program";

function nodeIcon(node: ProgramNode): string {
    return (node as unknown as { icon?: string }).icon ?? "";
}

export const useDesktopData = (): DesktopDataValue => {
    const ctx = useContext(DesktopDataContext);

    const nodes = useFileSystemStore((s) => s.nodes);
    const childrenByParent = useFileSystemStore((s) => s.childrenByParent);
    const rootId = useFileSystemStore((s) => s.rootId);

    const derived = useMemo(() => {
        if (ctx) return null;
        const directory: Array<DirectoryItem> = [];
        const directoryTree: DirectoryTree = {};
        if (!rootId) return { directory, directoryTree };

        const visit = (id: string) => {
            const node = nodes[id];
            if (!node) return;
            const parentNode = node.parentId ? nodes[node.parentId] : null;
            const parentName = parentNode ? parentNode.name : "KDH";
            const route = getRoute({ rootId, nodes, childrenByParent }, id);
            const item: DirectoryItem = {
                name: node.name,
                type: node.type,
                icon: nodeIcon(node),
                parent: parentName,
                route,
            };
            directory.push(item);
            if (!directoryTree[parentName]) directoryTree[parentName] = [];
            directoryTree[parentName].push({
                name: node.name,
                type: node.type,
                icon: nodeIcon(node),
                parent: parentName,
            });
            (childrenByParent[id] ?? []).forEach(visit);
        };
        visit(rootId);
        return { directory, directoryTree };
    }, [ctx, nodes, childrenByParent, rootId]);

    const openProgram = useCallback(
        (item: DirectoryItem) => {
            if (ctx) {
                ctx.openProgram(item);
                return;
            }
            const node = Object.values(nodes).find((n) => n.name === item.name);
            if (!node) return;
            useRunningProgramsStore.getState().open(node.id);
        },
        [ctx, nodes]
    );

    if (ctx) return ctx;
    return {
        directory: derived!.directory,
        directoryTree: derived!.directoryTree,
        openProgram,
    };
};
