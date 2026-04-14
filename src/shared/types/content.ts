export type ProjectData = {
    projectName: string;
    projectDesc: string;
    projectTerm: string;
    department: string;
};

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
