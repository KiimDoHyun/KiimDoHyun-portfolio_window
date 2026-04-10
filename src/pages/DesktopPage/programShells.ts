import type { ComponentType } from "react";
import type { ProgramId, ProgramType } from "@shared/types/program";
import DOCProgramShell from "./shells/DOCProgramShell";
import InfoProgramShell from "./shells/InfoProgramShell";
import FolderProgramShell from "./shells/FolderProgramShell";
import ImageProgramShell from "./shells/ImageProgramShell";

export const programShells: Record<ProgramType, ComponentType<{ id: ProgramId }> | null> = {
    FOLDER: FolderProgramShell,
    DOC: DOCProgramShell,
    IMAGE: ImageProgramShell,
    INFO: InfoProgramShell,
    BROWSER: null,
};
