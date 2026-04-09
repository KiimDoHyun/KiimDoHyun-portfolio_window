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
    projectResult: Array<ProjectResult>;
    role: Array<string>;
    department: string;
    stack: Array<ProjectStack>;
    url: string;
}

export interface ResumeLink {
    label: string;
    url: string;
    icon: string;
}

export interface ResumeInfoItem {
    label: string;
    value: string;
    icon: string;
}

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    photo: string;
    summary: string;
    links: Array<ResumeLink>;
    details: Array<ResumeInfoItem>;
}
