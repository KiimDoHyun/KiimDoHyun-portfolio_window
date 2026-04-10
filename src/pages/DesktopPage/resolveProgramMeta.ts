import type { ProgramNode } from "@shared/types/program";

export { resolveProgramIcon } from "@shared/lib";

export const resolveProgramTitle = (node: ProgramNode): string => {
    if (node.type === "IMAGE") return "이미지";
    return node.name;
};
