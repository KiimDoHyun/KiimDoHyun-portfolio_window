import type {
    FileSystemState,
    ProgramId,
    ProgramNode,
    ProgramType,
} from "@shared/types/program";
import { resolveAsset } from "@shared/lib/assetManifest";

export interface StatusBarTreeItem {
    id: ProgramId;
    name: string;
    icon: string;
    type: ProgramType;
    depth: number;
}

export interface StatusBarViewModel {
    projects: Array<StatusBarTreeItem>;
    techStack: Array<StatusBarTreeItem>;
    myComputerId: ProgramId | null;
}

const MY_COMPUTER_NAME = "내컴퓨터";
const TECH_STACK_NAME = "기술스택";
const PROJECT_ROOT_EXCLUDE: ReadonlySet<string> = new Set([
    MY_COMPUTER_NAME,
    TECH_STACK_NAME,
]);

function findChildIdByName(
    fs: FileSystemState,
    parentId: ProgramId,
    name: string,
): ProgramId | null {
    const children = fs.childrenByParent[parentId] ?? [];
    for (const cid of children) {
        if (fs.nodes[cid]?.name === name) return cid;
    }
    return null;
}

function toItem(node: ProgramNode, depth: number): StatusBarTreeItem {
    return {
        id: node.id,
        name: node.name,
        icon: resolveAsset(node.icon) ?? "",
        type: node.type,
        depth,
    };
}

function dfs(
    fs: FileSystemState,
    startId: ProgramId,
    startDepth: number,
    out: Array<StatusBarTreeItem>,
    includeStart: boolean,
): void {
    const node = fs.nodes[startId];
    if (!node) return;
    if (includeStart) {
        out.push(toItem(node, startDepth));
    }
    const childDepth = includeStart ? startDepth + 1 : startDepth;
    const childIds = fs.childrenByParent[startId] ?? [];
    for (const cid of childIds) {
        dfs(fs, cid, childDepth, out, true);
    }
}

export function selectStatusBarViewModel(
    fs: FileSystemState,
): StatusBarViewModel {
    if (!fs.rootId) {
        return { projects: [], techStack: [], myComputerId: null };
    }
    const rootChildren = fs.childrenByParent[fs.rootId] ?? [];

    const projects: Array<StatusBarTreeItem> = [];
    for (const cid of rootChildren) {
        const node = fs.nodes[cid];
        if (!node) continue;
        if (node.type !== "FOLDER") continue;
        if (PROJECT_ROOT_EXCLUDE.has(node.name)) continue;
        dfs(fs, cid, 0, projects, true);
    }

    const techStack: Array<StatusBarTreeItem> = [];
    const techStackId = findChildIdByName(fs, fs.rootId, TECH_STACK_NAME);
    if (techStackId) {
        dfs(fs, techStackId, 0, techStack, false);
    }

    const myComputerId = findChildIdByName(fs, fs.rootId, MY_COMPUTER_NAME);

    return { projects, techStack, myComputerId };
}
