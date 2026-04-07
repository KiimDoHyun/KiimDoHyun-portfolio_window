import { createContext } from "react";

export interface DirectoryItem {
    name: string;
    type: string;
    icon: string;
    parent: string;
    route?: string;
}

export type DirectoryTree = Record<string, Array<DirectoryItem>>;

export interface DesktopDataValue {
    directory: Array<DirectoryItem>;
    directoryTree: DirectoryTree;
    openProgram: (item: DirectoryItem) => void;
}

export const DesktopDataContext = createContext<DesktopDataValue | null>(null);
