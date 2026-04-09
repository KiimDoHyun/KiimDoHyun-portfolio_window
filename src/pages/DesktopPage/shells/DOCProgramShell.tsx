import { useFileSystemStore } from "@store/fileSystemStore";
import { DOCProgram } from "@features/program-doc";
import type { ProgramId } from "@shared/types/program";

interface DOCProgramShellProps {
    id: ProgramId;
}

const DOCProgramShell = ({ id }: DOCProgramShellProps) => {
    const node = useFileSystemStore((s) => s.nodes[id]);

    if (!node || node.type !== "DOC") return null;

    return <DOCProgram contents={node.contents} />;
};

export default DOCProgramShell;
