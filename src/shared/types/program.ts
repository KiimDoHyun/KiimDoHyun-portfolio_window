import type { ProjectData, ResumeData } from "./content";

export type ProgramId = string;

export type ProgramStatus = "active" | "min";

interface ProgramBase {
    id: ProgramId;
    parentId: ProgramId | null;
    name: string;
    icon: string;
}

export type ProgramNode =
    | (ProgramBase & { type: "FOLDER" })
    | (ProgramBase & { type: "DOC"; contents: ProjectData })
    | (ProgramBase & { type: "IMAGE"; src: string })
    | (ProgramBase & { type: "INFO"; contents: ResumeData })
    | (ProgramBase & { type: "BROWSER"; url: string });

export type ProgramType = ProgramNode["type"];

export interface RunningProgram {
    id: ProgramId;
    status: ProgramStatus;
    zIndex: number;
}

export interface FileSystemState {
    rootId: ProgramId;
    nodes: Record<ProgramId, ProgramNode>;
    childrenByParent: Record<ProgramId, Array<ProgramId>>;
}
