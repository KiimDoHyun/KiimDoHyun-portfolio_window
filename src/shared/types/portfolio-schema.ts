import type { ProjectData, ResumeData } from "./content";

export type AuthoringNode =
    | { type: "FOLDER"; name: string; icon: string; children: Array<AuthoringNode> }
    | { type: "DOC"; name: string; icon: string; contents: ProjectData }
    | { type: "IMAGE"; name: string; icon: string; src: string }
    | { type: "INFO"; name: string; icon: string; contents: ResumeData }
    | { type: "BROWSER"; name: string; icon: string; url: string };

export interface PortfolioSchema {
    version: 1;
    root: AuthoringNode;
}
