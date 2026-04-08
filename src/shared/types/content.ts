export interface ProjectResult {
    title: string;
    content: string;
}

export interface ProjectStack {
    name: string;
    img: string;
}

export interface ProjectData {
    projectName: string;
    projectDesc: string;
    projectImages: Array<string>;
    projectTerm: Array<string>;
    projectType: string;
    projectReulst: Array<ProjectResult>;
    role: Array<string>;
    department: string;
    stack: Array<ProjectStack>;
    url: string;
}

// Placeholder — final shape decided in Phase B/C when INFO program is built out.
export type ResumeData = Record<string, unknown>;
