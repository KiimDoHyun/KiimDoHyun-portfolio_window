import type { FileSystemState, ProgramId, ProgramNode } from "@shared/types/program";
import { resolveAsset } from "@shared/lib/assetManifest";

export interface StatusBarViewItem {
    name: string;
    icon: string;
    parentName: string;
    parentId: ProgramId;
    type: string;
}

export interface StatusBarViewModel {
    projects: Array<StatusBarViewItem>;
    techStackMain: Array<StatusBarViewItem>;
    techStackSub: Array<StatusBarViewItem>;
    myComputerId: ProgramId | null;
}

/**
 * 이름 → ID 매핑을 이 selector 한 곳에 격리.
 * feature 코드에서는 ID 기반으로만 동작한다.
 */
const PROJECT_PARENT_NAMES = [
    "금오공과대학교 셈틀꾼",
    "금오공과대학교 컴퓨터공학과 학생회",
    "(주)아라온소프트",
] as const;

const TECH_MAIN_NAME = "MAIN_TECH";
const TECH_SUB_NAME = "SUB_TECH";
const MY_COMPUTER_NAME = "내컴퓨터";

function findIdByName(
    nodes: Record<ProgramId, ProgramNode>,
    name: string,
): ProgramId | null {
    for (const id of Object.keys(nodes)) {
        if (nodes[id].name === name) return id;
    }
    return null;
}

function childrenOf(
    fs: FileSystemState,
    parentName: string,
): Array<StatusBarViewItem> {
    const parentId = findIdByName(fs.nodes, parentName);
    if (!parentId) return [];
    return (fs.childrenByParent[parentId] ?? [])
        .map((cid) => fs.nodes[cid])
        .filter((n): n is ProgramNode => !!n)
        .map((n) => ({
            name: n.name,
            icon: resolveAsset(n.icon) ?? "",
            parentName,
            parentId,
            type: n.type,
        }));
}

export function selectStatusBarViewModel(
    fs: FileSystemState,
): StatusBarViewModel {
    const projects: Array<StatusBarViewItem> = [];
    for (const name of PROJECT_PARENT_NAMES) {
        projects.push(...childrenOf(fs, name));
    }

    return {
        projects,
        techStackMain: childrenOf(fs, TECH_MAIN_NAME),
        techStackSub: childrenOf(fs, TECH_SUB_NAME),
        myComputerId: findIdByName(fs.nodes, MY_COMPUTER_NAME),
    };
}
