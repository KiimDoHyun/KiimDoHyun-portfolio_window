import { getRoute } from "../getRoute";
import type {
    FileSystemState,
    ProgramId,
    ProgramNode,
    ProgramType,
} from "@shared/types/program";

export interface FolderViewModel {
    nodeType: ProgramType;
    folderContents: Array<ProgramNode>;
    route: string;
    parentId: ProgramId | null;
    hasChildren: (id: ProgramId) => boolean;
}

export function selectFolderViewModel(
    fs: FileSystemState,
    folderId: ProgramId,
): FolderViewModel {
    const node = fs.nodes[folderId];

    const childIds = fs.childrenByParent[folderId] ?? [];
    const folderContents = childIds
        .map((id) => fs.nodes[id])
        .filter((n): n is ProgramNode => !!n);

    const hasChildren = (id: ProgramId): boolean =>
        (fs.childrenByParent[id] ?? []).length > 0;

    return {
        nodeType: node?.type ?? "FOLDER",
        folderContents,
        route: getRoute(fs, folderId),
        parentId: node?.parentId ?? null,
        hasChildren,
    };
}
