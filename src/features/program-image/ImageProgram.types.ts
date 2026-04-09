import type { ProgramId, ProgramNode } from "@shared/types/program";

export interface ImageProgramProps {
    images: Array<ProgramNode>;
    currentId: ProgramId;
}
