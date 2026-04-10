import type { ProgramNode } from "@shared/types/program";
import { programMeta } from "@shared/lib";

export { resolveProgramIcon } from "@shared/lib";

export const resolveProgramTitle = (node: ProgramNode): string =>
    programMeta[node.type].resolveTitle?.(node.name) ?? node.name;
