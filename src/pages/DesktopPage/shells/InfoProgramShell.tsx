import { useFileSystemStore } from "@store/fileSystemStore";
import { InfoProgram } from "@features/program-info";
import type { ProgramId } from "@shared/types/program";

interface InfoProgramShellProps {
    id: ProgramId;
}

const InfoProgramShell = ({ id }: InfoProgramShellProps) => {
    const node = useFileSystemStore((s) => s.nodes[id]);

    if (!node || node.type !== "INFO") return null;

    return <InfoProgram contents={node.contents} />;
};

export default InfoProgramShell;
